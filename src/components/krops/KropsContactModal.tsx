import { contact } from "./content";
import { LiquidButton } from "./LiquidButton";

// Scoped-style attributes from the ported stylesheet (Astro component ids).
const C = { "data-astro-cid-nxxydibx": "" };
const PILL = { "data-astro-cid-2qeywk4b": "" };

/**
 * Contact modal on the template's dialog (any `a[href="#contact"]` opens
 * it; behaviour in ./behaviors/contactModal.ts). Ids and the
 * `#submit-contact` link are what that script hooks into.
 */
export function KropsContactModal() {
  const f = contact.fields;
  const mail = `mailto:${contact.email}`;
  return (
    <div className="cm" id="contact-modal" role="dialog" aria-modal="true" aria-labelledby="cm-title" hidden data-lenis-prevent="" {...C}>
      <div className="cm__backdrop" data-cm-close="" {...C} />
      <div className="cm__stack" role="document" {...C}>
        <div className="cm__card cm__card--form" {...C}>
          <div className="cm__head" {...C}>
            <span className="pill pill--base" {...PILL}>
              <span className="pill__dot" aria-hidden="true" {...PILL} />
              {contact.pill}
            </span>
            <button type="button" className="cm__close" aria-label="Tutup formulir kontak" data-cm-close="" {...C}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" {...C}>
                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" {...C} />
              </svg>
            </button>
          </div>
          <div className="cm__intro" id="contact-intro" {...C}>
            <h2 className="cm__title" id="cm-title" {...C}>
              {contact.title}
            </h2>
            <p className="cm__lede" {...C}>
              {contact.ledeBefore}
              <a href={mail} className="cm__lede-link" {...C}>
                {contact.email}
              </a>
              {contact.ledeAfter}
            </p>
          </div>
          <form className="cm__form" id="contact-form" noValidate {...C}>
            <label className="cm__field" {...C}>
              <span className="cm__label" {...C}>
                {f.name.label}
              </span>
              <input className="cm__input" type="text" name="name" placeholder={f.name.placeholder} autoComplete="name" required aria-describedby="cm-name-error" {...C} />
              <span className="cm__error" id="cm-name-error" hidden {...C}>
                {f.name.empty}
              </span>
            </label>
            <label className="cm__field" {...C}>
              <span className="cm__label" {...C}>
                {f.email.label}
              </span>
              <input className="cm__input" type="email" name="email" placeholder={f.email.placeholder} autoComplete="email" required aria-describedby="cm-email-error" {...C} />
              <span className="cm__error" id="cm-email-error" hidden {...C}>
                {f.email.invalid}
              </span>
            </label>
            <label className="cm__field" {...C}>
              <span className="cm__label" {...C}>
                {f.org.label}
              </span>
              <input className="cm__input" type="text" name="company" placeholder={f.org.placeholder} autoComplete="organization" {...C} />
            </label>
            <label className="cm__field" {...C}>
              <span className="cm__label" {...C}>
                {f.message.label}
              </span>
              <textarea className="cm__input cm__input--area" name="message" placeholder={f.message.placeholder} rows={3} required aria-describedby="cm-message-error" {...C} />
              <span className="cm__error" id="cm-message-error" hidden {...C}>
                {f.message.empty}
              </span>
            </label>
          </form>
          <div className="cm__success" id="contact-success" hidden role="status" aria-live="polite" {...C}>
            <div className="cm__success-icon" aria-hidden="true" {...C}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" {...C}>
                <path d="M6 14.5L11.5 20L22 8.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...C} />
              </svg>
            </div>
            <h3 className="cm__success-title" {...C}>
              {contact.successTitle}
            </h3>
            <p className="cm__success-text" {...C}>
              {contact.successText}
              <br />
              {contact.successFallback}
              <a href={mail} className="cm__lede-link" {...C}>
                {contact.email}
              </a>
              .
            </p>
          </div>
        </div>
        <div className="cm__card cm__card--submit" id="contact-submit-card" {...C}>
          <LiquidButton label={contact.submit} href="#submit-contact" />
          <p className="cm__legal" {...C}>
            {contact.legal}
          </p>
        </div>
      </div>
    </div>
  );
}
