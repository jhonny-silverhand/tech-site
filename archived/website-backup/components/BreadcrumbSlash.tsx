/**
 * Breadcrumb separator — deliberately a single "/" rendered larger than
 * the surrounding mono text, in the display font (Fraunces). Distinct
 * from the "tech//site" wordmark's own bold double-slash, which stays
 * exactly as-is wherever it appears — this is only the separator between
 * breadcrumb segments.
 */
export function BreadcrumbSlash() {
  return <span className="font-display text-[17px] leading-none align-middle mx-1 text-muted/80">/</span>;
}
