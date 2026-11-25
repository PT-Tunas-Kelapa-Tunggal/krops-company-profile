import { contact } from "../content";
import { getLenis } from "./shared";

type Field = {
  input: HTMLInputElement | HTMLTextAreaElement;
  error: HTMLElement;
  empty: string;
  invalid: string;
};

/**
 * Contact modal. Any `a[href="#contact"]` opens it; the liquid submit
 * button submits the form with inline validation.
 *
 * There is no form backend yet: a valid submit opens the visitor's own
 * email app with the message pre-filled to `contact.email` (mailto:), then
 * shows a "one more step" view with the address as a fallback.
 */
export function initContactModal(): void {
  const modal = document.getElementById("contact-modal");
  if (!modal) return;
  let lastFocused: Element | null = null;

  const form = document.getElementById("contact-form") as HTMLFormElement | null;
  const intro = document.getElementById("contact-intro");
  const success = document.getElementById("contact-success");
  const submitCard = document.getElementById("contact-submit-card");

  const fieldDefs = [
    { sel: 'input[name="name"]', err: "cm-name-error", empty: contact.fields.name.empty, invalid: contact.fields.name.empty },
    { sel: 'input[name="email"]', err: "cm-email-error", empty: contact.fields.email.empty, invalid: contact.fields.email.invalid },
    { sel: 'textarea[name="message"]', err: "cm-message-error", empty: contact.fields.message.empty, invalid: contact.fields.message.empty },
  ];
  const fields: Field[] = fieldDefs.flatMap((d) => {
    const input = form?.querySelector<HTMLInputElement | HTMLTextAreaElement>(d.sel);
    const error = document.getElementById(d.err);
    return input && error ? [{ input, error, empty: d.empty, invalid: d.invalid }] : [];
  });

  const validate = (f: Field) => {
    const value = f.input.value.trim();
    const ok = value.length > 0 && f.input.checkValidity();
    f.input.classList.toggle("is-invalid", !ok);
    if (ok) {
      f.input.removeAttribute("aria-invalid");
    } else {
      f.input.setAttribute("aria-invalid", "true");
      f.error.textContent = value.length === 0 ? f.empty : f.invalid;
    }
    f.error.classList.toggle("is-visible", !ok);
    f.error.hidden = ok;
    return ok;
  };

  const resetForm = () => {
    if (!form) return;
    form.reset();
    form.hidden = false;
    if (intro) intro.hidden = false;
    if (success) success.hidden = true;
    if (submitCard) submitCard.hidden = false;
    fields.forEach((f) => {
      f.input.classList.remove("is-invalid");
      f.input.removeAttribute("aria-invalid");
      f.error.classList.remove("is-visible");
      f.error.hidden = true;
    });
  };

  const open = () => {
    lastFocused = document.activeElement;
    resetForm();
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add("is-open"));
    document.body.classList.add("cm-open");
    getLenis()?.stop();
    const first = modal.querySelector<HTMLElement>("input, textarea, button");
    if (first) window.setTimeout(() => first.focus(), 60);
  };

  const close = () => {
    modal.classList.remove("is-open");
    window.setTimeout(() => {
      modal.hidden = true;
      document.body.classList.remove("cm-open");
      getLenis()?.start();
      if (lastFocused instanceof HTMLElement) lastFocused.focus();
    }, 420);
  };

  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (target.closest('a[href="#contact"], [data-open="contact"]')) {
      e.preventDefault();
      open();
      return;
    }
    if (target.closest('a[href="#submit-contact"]')) {
      e.preventDefault();
      form?.requestSubmit();
      return;
    }
    if (target.closest("[data-cm-close]")) {
      e.preventDefault();
      close();
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) close();
  });

  fields.forEach((f) => {
    f.input.addEventListener("input", () => {
      if (f.input.classList.contains("is-invalid")) validate(f);
    });
    f.input.addEventListener("blur", () => {
      if (f.input.value.trim().length > 0) validate(f);
    });
  });

  const submitBtn = submitCard?.querySelector<HTMLElement>('a[href="#submit-contact"]') ?? null;
  const submitLabel = submitBtn?.querySelector<HTMLElement>("[data-liquid-label]") ?? null;
  const submitSizer = submitBtn?.querySelector<HTMLElement>(".liquid-btn__pill-sizer") ?? null;
  const restLabel = submitLabel?.textContent ?? contact.submit;
  const setSubmitting = (on: boolean) => {
    submitBtn?.classList.toggle("is-sending", on);
    submitBtn?.setAttribute("aria-busy", on ? "true" : "false");
    const text = on ? contact.sending : restLabel;
    if (submitLabel) submitLabel.textContent = text;
    if (submitSizer) submitSizer.textContent = text;
  };

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (form.dataset.submitting === "true") return;
    let firstInvalid: HTMLElement | null = null;
    fields.forEach((f) => {
      if (!validate(f) && !firstInvalid) firstInvalid = f.input;
    });
    if (firstInvalid) {
      (firstInvalid as HTMLElement).focus();
      return;
    }
    form.dataset.submitting = "true";
    setSubmitting(true);
    const data = new FormData(form);
    const val = (k: string) => String(data.get(k) ?? "").trim();
    const org = val("company");
    const body = [val("message"), "", "—", `Nama: ${val("name")}`, `Email: ${val("email")}`, org ? `Kebun / instansi: ${org}` : ""]
      .filter((line, i, all) => line !== "" || i < all.length - 1)
      .join("\n");
    // Open via a temporary link click (works the same on desktop and iOS).
    const mail = document.createElement("a");
    mail.href = `mailto:${contact.email}?subject=${encodeURIComponent(contact.mailSubject)}&body=${encodeURIComponent(body)}`;
    mail.click();
    window.setTimeout(() => {
      form.hidden = true;
      if (intro) intro.hidden = true;
      if (success) success.hidden = false;
      if (submitCard) submitCard.hidden = true;
      form.dataset.submitting = "false";
      setSubmitting(false);
    }, 700);
  });

  if (window.location.hash === "#contact") window.setTimeout(open, 100);
}
