const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.33 8H12.67M8 12.67L12.67 8L8 3.33" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

type Props = {
  label: string;
  href: string;
  /** Orange accent variant (the source's `liquid-btn--lime`, recoloured by the Krops palette). */
  accent?: boolean;
  external?: boolean;
  className?: string;
};

/**
 * The template's gooey pill + circle button. The blob layer is filtered
 * (SVG goo) and sized by an invisible copy of the label; the overlay holds
 * the crisp visible label and arrow.
 */
export function LiquidButton({ label, href, accent, external, className }: Props) {
  return (
    <span className="liquid-btn-wrap">
      <a
        href={href}
        className={["liquid-btn", accent && "liquid-btn--lime", className].filter(Boolean).join(" ")}
        aria-label={label}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        <span className="liquid-btn__blob" aria-hidden="true">
          <span className="liquid-btn__pill">
            <span className="liquid-btn__pill-sizer">{label}</span>
          </span>{" "}
          <span className="liquid-btn__circle">
            <span className="liquid-btn__circle-icon" aria-hidden="true">
              <Arrow />
            </span>
          </span>
        </span>{" "}
        <span className="liquid-btn__overlay">
          <span className="liquid-btn__label" data-liquid-label="">
            {label}
          </span>{" "}
          <span className="liquid-btn__arrow-icon" aria-hidden="true">
            <Arrow />
          </span>
        </span>
      </a>
    </span>
  );
}
