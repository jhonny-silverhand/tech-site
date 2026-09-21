import Link from 'next/link';
import { Fragment } from 'react';

export function BreadcrumbSlash({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 flex-wrap items-center gap-1.5 font-mono text-[12px] text-muted">
      {items.map((item, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <span className="text-accent" aria-hidden>
              /
            </span>
          )}
          {item.href ? (
            <Link href={item.href} className="rounded-sm hover:text-ink hover:underline hover:underline-offset-4">
              {item.label}
            </Link>
          ) : (
            <span aria-current="page" className="max-w-[420px] truncate text-ink">
              {item.label}
            </span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
