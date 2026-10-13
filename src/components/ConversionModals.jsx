/**
 * ConversionModals.jsx
 * --------------------
 * Renders either the Quote Request modal or the Job Application modal
 * based on the `modalType` prop supplied by App.jsx.
 *
 * Props:
 *   modalType   — 'quote' | 'apply' | null
 *   modalData   — { product } for quote, { job } for apply
 *   onClose     — callback to close and clear modal state
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';

/* ─── Shared helpers ─── */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE   = /^https?:\/\/.+/;

function validate(fields, rules) {
  const errors = [];
  rules.forEach(({ key, label, required, type }) => {
    const val = (fields[key] || '').trim();
    if (required && !val) { errors.push(`${label} is required.`); return; }
    if (val && type === 'email' && !EMAIL_RE.test(val)) errors.push(`${label}: enter a valid email address.`);
    if (val && type === 'url'   && !URL_RE.test(val))   errors.push(`${label}: must start with http:// or https://.`);
    if (val && type === 'qty'   && (isNaN(val) || +val < 1 || !Number.isInteger(+val)))
      errors.push(`${label}: must be a positive whole number.`);
  });
  return errors;
}

/* ─── Focus Trap ─── */
function useFocusTrap(ref, active) {
  useEffect(() => {
    if (!active || !ref.current) return;
    const focusable = ref.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    // Move focus into modal
    if (first) first.focus();

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first?.focus(); }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [active, ref]);
}

/* ─── Field components for reuse ─── */
function FormGroup({ id, label, required, children }) {
  return (
    <div className="cm-form-group">
      <label htmlFor={id} className="cm-form-label">
        {label}{required && <span className="cm-required" aria-hidden="true"> *</span>}
      </label>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════
   QUOTE REQUEST MODAL
═══════════════════════════════════ */

const PRODUCT_OPTIONS = [
  'MCC Panel',
  'PCC Panel',
  'VFD Panel',
  'APFC Panel',
  'Distribution Board',
  'Control Panel',
  'Other / Custom Requirement',
];

const QUOTE_BLANK = {
  name: '', company: '', phone: '', email: '',
  product: '', productId: null,
  quantity: '', location: '', specs: '',
};

function QuoteModal({ initialProduct, onClose }) {
  const [form, setForm]       = useState(() => ({
    ...QUOTE_BLANK,
    product:   initialProduct?.name  || '',
    productId: initialProduct?.id    ?? null,
  }));
  const [errors, setErrors]   = useState([]);
  const [status, setStatus]   = useState(null);   // { type, text, inquiryId? }
  const [submitting, setSubmitting] = useState(false);

  // If the parent gives a new product after open (shouldn't happen, but guard)
  useEffect(() => {
    if (initialProduct) {
      setForm(f => ({
        ...f,
        product:   initialProduct.name || '',
        productId: initialProduct.id   ?? null,
      }));
    }
  }, [initialProduct]);

  const set = (key) => (e) => {
    const val = e.target.value;
    setForm(f => ({ ...f, [key]: val, ...(key === 'product' ? { productId: null } : {}) }));
  };

  const rules = [
    { key: 'name',     label: 'Full name',  required: true },
    { key: 'phone',    label: 'Phone',      required: true },
    { key: 'product',  label: 'Product',    required: true },
    { key: 'quantity', label: 'Quantity',   required: true, type: 'qty' },
    { key: 'specs',    label: 'Additional requirements', required: true },
    { key: 'email',    label: 'Email',      required: false, type: 'email' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form, rules);
    setErrors(errs);
    if (errs.length > 0) return;

    setSubmitting(true);
    setStatus(null);

    // Build a structured message for the inquiries table
    const lines = [];
    if (form.company)  lines.push(`Company: ${form.company}`);
    if (form.location) lines.push(`Delivery Location: ${form.location}`);
    lines.push(`Specifications / Requirements: ${form.specs}`);
    const message = lines.join('\n');

    // Only send a numeric product_id when we have a real DB id
    const payload = {
      name:    form.name.trim(),
      phone:   form.phone.trim(),
      email:   form.email.trim(),
      product_id: (form.productId && Number.isInteger(+form.productId)) ? +form.productId : null,
      quantity:   +form.quantity,
      message,
    };
    // If no product_id, embed the name in message so admin sees it
    if (!payload.product_id && form.product) {
      payload.message = `Product of Interest: ${form.product}\n` + payload.message;
    }

    try {
      const res  = await fetch('/api/index.php?route=quote', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: 'success', text: 'Your quote request has been submitted successfully.', inquiryId: data.inquiry_id });
        setForm(QUOTE_BLANK);
        setErrors([]);
      } else {
        setStatus({ type: 'error', text: data.error || 'Submission failed. Please try again.' });
      }
    } catch {
      setStatus({ type: 'error', text: 'A network error occurred. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="cm-modal-header">
        <div>
          <h2 className="cm-modal-title" id="cm-quote-title">Request a Quote</h2>
          <p className="cm-modal-subtitle">
            Tell us about your requirements and our team will be in touch.
          </p>
        </div>
        <button className="cm-close-btn" onClick={onClose} aria-label="Close quote modal">
          <X size={20} />
        </button>
      </div>

      <div className="cm-modal-body">
        {status?.type === 'success' ? (
          <div className="cm-success-panel" role="status" aria-live="polite">
            <div className="cm-success-icon" aria-hidden="true">✓</div>
            <p className="cm-success-text">{status.text}</p>
            {status.inquiryId && (
              <p className="cm-success-ref">Reference: <strong>{status.inquiryId}</strong></p>
            )}
            <button className="cm-btn-secondary" onClick={onClose}>Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate aria-labelledby="cm-quote-title">
            {errors.length > 0 && (
              <div className="cm-errors" role="alert" aria-live="assertive">
                {errors.map((err, i) => <p key={i}>{err}</p>)}
              </div>
            )}
            {status?.type === 'error' && (
              <div className="cm-errors" role="alert" aria-live="assertive">
                <p>{status.text}</p>
              </div>
            )}

            <div className="cm-form-row">
              <FormGroup id="cm-q-name"    label="Full Name"     required>
                <input id="cm-q-name"    className="cm-input" type="text"  value={form.name}    onChange={set('name')}    autoComplete="name" />
              </FormGroup>
              <FormGroup id="cm-q-company" label="Company / Org" required={false}>
                <input id="cm-q-company" className="cm-input" type="text"  value={form.company} onChange={set('company')} autoComplete="organization" />
              </FormGroup>
            </div>

            <div className="cm-form-row">
              <FormGroup id="cm-q-phone" label="Phone" required>
                <input id="cm-q-phone" className="cm-input" type="tel"   value={form.phone} onChange={set('phone')} autoComplete="tel" />
              </FormGroup>
              <FormGroup id="cm-q-email" label="Email" required={false}>
                <input id="cm-q-email" className="cm-input" type="email" value={form.email} onChange={set('email')} autoComplete="email" />
              </FormGroup>
            </div>

            <div className="cm-form-row">
              <FormGroup id="cm-q-product" label="Product of Interest" required>
                <select
                  id="cm-q-product"
                  className="cm-input"
                  value={form.product}
                  onChange={(e) => {
                    // When user manually selects, clear any prefilled product_id
                    setForm(f => ({ ...f, product: e.target.value, productId: null }));
                  }}
                >
                  <option value="">— Select a product —</option>
                  {PRODUCT_OPTIONS.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                  {/* If prefilled product is not in the static list, show it */}
                  {form.product && !PRODUCT_OPTIONS.includes(form.product) && (
                    <option value={form.product}>{form.product}</option>
                  )}
                </select>
              </FormGroup>
              <FormGroup id="cm-q-qty" label="Quantity Required" required>
                <input id="cm-q-qty" className="cm-input" type="number" min="1" step="1" value={form.quantity} onChange={set('quantity')} />
              </FormGroup>
            </div>

            <FormGroup id="cm-q-location" label="Delivery City / Location" required={false}>
              <input id="cm-q-location" className="cm-input" type="text" value={form.location} onChange={set('location')} autoComplete="address-level2" />
            </FormGroup>

            <FormGroup id="cm-q-specs" label="Additional Specifications / Requirements" required>
              <textarea id="cm-q-specs" className="cm-textarea" rows={4} value={form.specs} onChange={set('specs')} />
            </FormGroup>

            <button
              type="submit"
              className="cm-btn-primary"
              disabled={submitting}
              aria-busy={submitting}
            >
              {submitting ? 'Submitting…' : 'Submit Quote Request'}
            </button>
          </form>
        )}
      </div>
    </>
  );
}

/* ═══════════════════════════════════
   JOB APPLICATION MODAL
═══════════════════════════════════ */

const POSITIONS = [
  'Designer',
  'Sales Handler',
  'Panel Machine Operator',
  'Accountant',
  'Sales & Marketing Executive',
  'Other',
];

const EXPERIENCE_OPTIONS = [
  'Fresher',
  '1–3 years',
  '3–5 years',
  '5+ years',
];

const APPLY_BLANK = {
  name: '', email: '', phone: '', location: '',
  position: '', experience: '', resumeUrl: '', message: '',
};

function ApplyModal({ initialJob, onClose }) {
  const [form, setForm]       = useState(() => ({
    ...APPLY_BLANK,
    position: initialJob?.title || '',
  }));
  const [errors, setErrors]   = useState([]);
  const [status, setStatus]   = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialJob?.title) {
      setForm(f => ({ ...f, position: initialJob.title }));
    }
  }, [initialJob]);

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const rules = [
    { key: 'name',       label: 'Full name',    required: true },
    { key: 'email',      label: 'Email',         required: true, type: 'email' },
    { key: 'phone',      label: 'Phone',          required: true },
    { key: 'position',   label: 'Position',       required: true },
    { key: 'experience', label: 'Experience',     required: true },
    { key: 'message',    label: 'Introduction',   required: true },
    { key: 'resumeUrl',  label: 'Resume/Portfolio URL', required: false, type: 'url' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form, rules);
    setErrors(errs);
    if (errs.length > 0) return;

    setSubmitting(true);
    setStatus(null);

    const payload = {
      name:        form.name.trim(),
      email:       form.email.trim(),
      phone:       form.phone.trim(),
      location:    form.location.trim(),
      position:    form.position,
      experience:  form.experience,
      resume_url:  form.resumeUrl.trim(),
      message:     form.message.trim(),
    };

    try {
      const res  = await fetch('/api/index.php?route=job-application', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({
          type: 'success',
          text: 'Your application has been submitted successfully.',
          ref: data.application_ref,
        });
        setForm(APPLY_BLANK);
        setErrors([]);
      } else {
        setStatus({ type: 'error', text: data.error || 'Submission failed. Please try again.' });
      }
    } catch {
      setStatus({ type: 'error', text: 'A network error occurred. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="cm-modal-header cm-modal-header--apply">
        <div>
          <h2 className="cm-modal-title" id="cm-apply-title">Apply for a Position</h2>
          <p className="cm-modal-subtitle">
            {initialJob ? `Applying for: ${initialJob.title}` : 'Submit a general application.'}
          </p>
        </div>
        <button className="cm-close-btn" onClick={onClose} aria-label="Close application modal">
          <X size={20} />
        </button>
      </div>

      <div className="cm-modal-body">
        {status?.type === 'success' ? (
          <div className="cm-success-panel" role="status" aria-live="polite">
            <div className="cm-success-icon" aria-hidden="true">✓</div>
            <p className="cm-success-text">{status.text}</p>
            {status.ref && (
              <p className="cm-success-ref">Application reference: <strong>{status.ref}</strong></p>
            )}
            <p className="cm-success-email">
              Want to attach your CV?{' '}
              <a href="mailto:yashindustries@rediffmail.com" className="cm-link">
                Email us at yashindustries@rediffmail.com
              </a>
            </p>
            <button className="cm-btn-secondary" onClick={onClose}>Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate aria-labelledby="cm-apply-title">
            {errors.length > 0 && (
              <div className="cm-errors" role="alert" aria-live="assertive">
                {errors.map((err, i) => <p key={i}>{err}</p>)}
              </div>
            )}
            {status?.type === 'error' && (
              <div className="cm-errors" role="alert" aria-live="assertive">
                <p>{status.text}</p>
              </div>
            )}

            <div className="cm-form-row">
              <FormGroup id="cm-a-name"  label="Full Name"     required>
                <input id="cm-a-name"  className="cm-input" type="text"  value={form.name}  onChange={set('name')}  autoComplete="name" />
              </FormGroup>
              <FormGroup id="cm-a-phone" label="Phone"          required>
                <input id="cm-a-phone" className="cm-input" type="tel"   value={form.phone} onChange={set('phone')} autoComplete="tel" />
              </FormGroup>
            </div>

            <div className="cm-form-row">
              <FormGroup id="cm-a-email" label="Email" required>
                <input id="cm-a-email" className="cm-input" type="email" value={form.email} onChange={set('email')} autoComplete="email" />
              </FormGroup>
              <FormGroup id="cm-a-location" label="Current City / Location" required={false}>
                <input id="cm-a-location" className="cm-input" type="text" value={form.location} onChange={set('location')} autoComplete="address-level2" />
              </FormGroup>
            </div>

            <div className="cm-form-row">
              <FormGroup id="cm-a-position" label="Position / Area of Interest" required>
                <select id="cm-a-position" className="cm-input" value={form.position} onChange={set('position')}>
                  <option value="">— Select a position —</option>
                  {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </FormGroup>
              <FormGroup id="cm-a-experience" label="Experience Level" required>
                <select id="cm-a-experience" className="cm-input" value={form.experience} onChange={set('experience')}>
                  <option value="">— Select experience —</option>
                  {EXPERIENCE_OPTIONS.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </FormGroup>
            </div>

            <FormGroup id="cm-a-resume" label="Resume / Portfolio URL" required={false}>
              <input
                id="cm-a-resume"
                className="cm-input"
                type="url"
                placeholder="https://linkedin.com/in/yourprofile"
                value={form.resumeUrl}
                onChange={set('resumeUrl')}
              />
            </FormGroup>
            <p className="cm-field-hint">
              Prefer to attach a file? Email your CV to{' '}
              <a href="mailto:yashindustries@rediffmail.com" className="cm-link">
                yashindustries@rediffmail.com
              </a>
            </p>

            <FormGroup id="cm-a-message" label="Short Introduction / Cover Note" required>
              <textarea
                id="cm-a-message"
                className="cm-textarea"
                rows={4}
                placeholder="Briefly introduce yourself and explain your interest in this position."
                value={form.message}
                onChange={set('message')}
              />
            </FormGroup>

            <button
              type="submit"
              className="cm-btn-primary cm-btn-primary--apply"
              disabled={submitting}
              aria-busy={submitting}
            >
              {submitting ? 'Submitting…' : 'Submit Application'}
            </button>
          </form>
        )}
      </div>
    </>
  );
}

/* ═══════════════════════════════════
   MODAL WRAPPER (shared backdrop/chrome)
═══════════════════════════════════ */

export default function ConversionModals({ modalType, modalData, onClose }) {
  const dialogRef   = useRef(null);
  const triggerRef  = useRef(null);
  const isOpen      = !!modalType;

  // Capture the opener's ref so we can restore focus on close
  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement;
    } else if (triggerRef.current) {
      triggerRef.current.focus();
      triggerRef.current = null;
    }
  }, [isOpen]);

  // Prevent body scroll
  useEffect(() => {
    document.body.classList.toggle('cm-body-locked', isOpen);
    return () => document.body.classList.remove('cm-body-locked');
  }, [isOpen]);

  // Escape key
  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, handleEscape]);

  // Focus trap
  useFocusTrap(dialogRef, isOpen);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className={`cm-backdrop cm-backdrop--${modalType}`}
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className="cm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={modalType === 'quote' ? 'cm-quote-title' : 'cm-apply-title'}
      >
        {modalType === 'quote' && (
          <QuoteModal
            initialProduct={modalData?.product ?? null}
            onClose={onClose}
          />
        )}
        {modalType === 'apply' && (
          <ApplyModal
            initialJob={modalData?.job ?? null}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
}
