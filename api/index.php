<?php
require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // In production, replace * with actual domain
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$route = isset($_GET['route']) ? rtrim($_GET['route'], '/') : '';
$method = $_SERVER['REQUEST_METHOD'];

// Helper for JSON responses
function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit;
}

// Authentication Check Helper
function requireAuth() {
    if (!isset($_SESSION['admin_id'])) {
        sendResponse(['error' => 'Unauthorized'], 401);
    }
}

// Parse incoming JSON body
$input = json_decode(file_get_contents('php://input'), true) ?? [];

try {
    // ROUTING
    if ($route === 'login' && $method === 'POST') {
        global $pdo;
        $username = $input['username'] ?? '';
        $password = $input['password'] ?? '';
        
        $stmt = $pdo->prepare("SELECT * FROM admins WHERE username = ?");
        $stmt->execute([$username]);
        $admin = $stmt->fetch();
        
        if ($admin && password_verify($password, $admin['password_hash'])) {
            session_regenerate_id(true);
            $_SESSION['admin_id'] = $admin['id'];
            $_SESSION['username'] = $admin['username'];
            sendResponse(['message' => 'Login successful', 'username' => $admin['username']]);
        } else {
            sendResponse(['error' => 'Invalid credentials'], 401);
        }
    } 
    
    elseif ($route === 'logout' && $method === 'POST') {
        session_destroy();
        sendResponse(['message' => 'Logged out successfully']);
    } 
    
    elseif ($route === 'check-auth' && $method === 'GET') {
        if (isset($_SESSION['admin_id'])) {
            sendResponse(['authenticated' => true, 'username' => $_SESSION['username']]);
        } else {
            sendResponse(['authenticated' => false], 401);
        }
    }

    elseif ($route === 'dashboard' && $method === 'GET') {
        requireAuth();
        global $pdo;

        // Check if job_applications table exists (graceful for pre-migration deploys)
        $appTable = $pdo->query("SHOW TABLES LIKE 'job_applications'")->fetchColumn();

        $stats = [
            'total_products'      => $pdo->query("SELECT COUNT(*) FROM products")->fetchColumn(),
            'total_inquiries'     => $pdo->query("SELECT COUNT(*) FROM inquiries")->fetchColumn(),
            'new_inquiries'       => $pdo->query("SELECT COUNT(*) FROM inquiries WHERE status = 'New'")->fetchColumn(),
            'inquiries_by_status' => $pdo->query("SELECT status, COUNT(*) as count FROM inquiries GROUP BY status")->fetchAll(),
            'recent_inquiries'    => $pdo->query("SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 5")->fetchAll(),
            'total_applications'  => $appTable ? (int)$pdo->query("SELECT COUNT(*) FROM job_applications")->fetchColumn() : 0,
            'new_applications'    => $appTable ? (int)$pdo->query("SELECT COUNT(*) FROM job_applications WHERE status = 'New'")->fetchColumn() : 0,
        ];
        sendResponse($stats);
    }

    elseif ($route === 'products') {
        global $pdo;
        if ($method === 'GET') {
            $is_admin = isset($_SESSION['admin_id']) && isset($_GET['all']);
            $sql = $is_admin ? "SELECT * FROM products ORDER BY created_at DESC" : "SELECT * FROM products WHERE is_published = 1 ORDER BY created_at DESC";
            $stmt = $pdo->query($sql);
            sendResponse($stmt->fetchAll());
        } 
        elseif ($method === 'POST') {
            requireAuth();
            $slug = $input['slug'];
            $name = $input['name'];
            $desc = $input['description'] ?? '';
            $cat = $input['category'] ?? '';
            $img = $input['image_path'] ?? '';
            $pub = isset($input['is_published']) ? (int)$input['is_published'] : 1;
            
            $stmt = $pdo->prepare("INSERT INTO products (slug, name, description, category, image_path, is_published) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$slug, $name, $desc, $cat, $img, $pub]);
            sendResponse(['message' => 'Product created', 'id' => $pdo->lastInsertId()]);
        }
        elseif ($method === 'PUT') {
            requireAuth();
            $id = $input['id'];
            $name = $input['name'];
            $desc = $input['description'] ?? '';
            $cat = $input['category'] ?? '';
            $img = $input['image_path'] ?? '';
            $pub = isset($input['is_published']) ? (int)$input['is_published'] : 1;
            
            $stmt = $pdo->prepare("UPDATE products SET name=?, description=?, category=?, image_path=?, is_published=? WHERE id=?");
            $stmt->execute([$name, $desc, $cat, $img, $pub, $id]);
            sendResponse(['message' => 'Product updated']);
        }
        elseif ($method === 'DELETE') {
            requireAuth();
            $id = $_GET['id'] ?? null;
            if ($id) {
                $stmt = $pdo->prepare("DELETE FROM products WHERE id=?");
                $stmt->execute([$id]);
                sendResponse(['message' => 'Product deleted']);
            }
        }
    }

    elseif ($route === 'quote' && $method === 'POST') {
        global $pdo;
        // Basic CSRF/Spam prevention in a real app should be added here
        
        $name = trim($input['name'] ?? '');
        $phone = trim($input['phone'] ?? '');
        $email = trim($input['email'] ?? '');
        $product_id = !empty($input['product_id']) ? (int)$input['product_id'] : null;
        $quantity = !empty($input['quantity']) ? (int)$input['quantity'] : null;
        $message = trim($input['message'] ?? '');
        
        if (empty($name) || empty($phone) || empty($message)) {
            sendResponse(['error' => 'Name, phone, and message are required fields.'], 400);
        }
        
        // Generate Unique Inquiry ID (e.g. INQ-123456)
        $unique_id = 'INQ-' . strtoupper(substr(uniqid(), -6));
        
        $stmt = $pdo->prepare("INSERT INTO inquiries (unique_id, name, phone, email, product_id, quantity, message) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$unique_id, $name, $phone, $email, $product_id, $quantity, $message]);
        
        // In a complete production setup, use PHPMailer or built-in mail() to notify admin here.
        // mail(SMTP_USER, "New Quote: $unique_id", $message, "From: $email");

        sendResponse(['message' => 'Your inquiry has been submitted successfully.', 'inquiry_id' => $unique_id]);
    }

    elseif ($route === 'inquiries') {
        requireAuth();
        global $pdo;
        
        if ($method === 'GET') {
            $stmt = $pdo->query("SELECT inquiries.*, products.name as product_name FROM inquiries LEFT JOIN products ON inquiries.product_id = products.id ORDER BY inquiries.created_at DESC");
            sendResponse($stmt->fetchAll());
        }
        elseif ($method === 'PUT') {
            $id = $input['id'];
            $status = $input['status'] ?? 'New';
            $internal_notes = $input['internal_notes'] ?? '';
            
            $stmt = $pdo->prepare("UPDATE inquiries SET status=?, internal_notes=? WHERE id=?");
            $stmt->execute([$status, $internal_notes, $id]);
            sendResponse(['message' => 'Inquiry updated']);
        }
    }

    elseif ($route === 'job-application' && $method === 'POST') {
        global $pdo;

        $name        = trim($input['name']       ?? '');
        $email       = trim($input['email']      ?? '');
        $phone       = trim($input['phone']       ?? '');
        $location    = trim($input['location']    ?? '');
        $position    = trim($input['position']    ?? '');
        $experience  = trim($input['experience']  ?? '');
        $resume_url  = trim($input['resume_url']  ?? '');
        $message     = trim($input['message']     ?? '');

        // Server-side validation
        $errors = [];
        if (empty($name))       $errors[] = 'Full name is required.';
        if (empty($email))      $errors[] = 'Email is required.';
        elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Invalid email address.';
        if (empty($phone))      $errors[] = 'Phone is required.';
        if (empty($position))   $errors[] = 'Position is required.';
        if (empty($experience)) $errors[] = 'Experience level is required.';
        if (empty($message))    $errors[] = 'Introduction/cover note is required.';

        $allowed_exp = ['Fresher', '1–3 years', '3–5 years', '5+ years'];
        if (!empty($experience) && !in_array($experience, $allowed_exp))
            $errors[] = 'Invalid experience level.';

        if (!empty($resume_url) && !preg_match('/^https?:\/\/.+/', $resume_url))
            $errors[] = 'Resume URL must start with http:// or https://.';

        // Length caps
        if (strlen($name)       > 150) $errors[] = 'Name is too long.';
        if (strlen($email)      > 150) $errors[] = 'Email is too long.';
        if (strlen($phone)      > 30)  $errors[] = 'Phone is too long.';
        if (strlen($position)   > 100) $errors[] = 'Position is too long.';
        if (strlen($resume_url) > 500) $errors[] = 'Resume URL is too long.';

        if (!empty($errors)) {
            sendResponse(['error' => implode(' ', $errors)], 400);
        }

        // Unique application reference
        $app_ref = 'APP-' . strtoupper(substr(uniqid(), -8));

        $stmt = $pdo->prepare(
            "INSERT INTO job_applications
             (app_ref, name, email, phone, location, position, experience, resume_url, message)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );
        $stmt->execute([
            $app_ref, $name, $email, $phone,
            $location, $position, $experience, $resume_url, $message
        ]);

        sendResponse([
            'message'         => 'Application submitted successfully.',
            'application_ref' => $app_ref,
        ]);
    }

    elseif ($route === 'applications') {
        requireAuth();
        global $pdo;

        if ($method === 'GET') {
            $stmt = $pdo->query(
                "SELECT id, app_ref, name, email, phone, location, position,
                        experience, resume_url, message, status, created_at
                 FROM job_applications
                 ORDER BY created_at DESC"
            );
            sendResponse($stmt->fetchAll());
        }
        elseif ($method === 'PUT') {
            $id     = (int)($input['id']     ?? 0);
            $status = trim($input['status']  ?? '');

            $allowed = ['New', 'Reviewing', 'Shortlisted', 'Rejected'];
            if (!$id || !in_array($status, $allowed)) {
                sendResponse(['error' => 'Invalid id or status.'], 400);
            }

            $stmt = $pdo->prepare("UPDATE job_applications SET status=? WHERE id=?");
            $stmt->execute([$status, $id]);
            sendResponse(['message' => 'Application status updated.']);
        }
    }

    else {
        sendResponse(['error' => 'Endpoint not found'], 404);
    }
} catch (Exception $e) {
    sendResponse(['error' => 'An internal error occurred: ' . $e->getMessage()], 500);
}
