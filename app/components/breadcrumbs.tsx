import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1 flex-wrap">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1">
              {i > 0 && (
                <ChevronRight
                  size={12}
                  style={{ color: "var(--text-subtle)" }}
                />
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-xs font-medium transition-colors hover:underline"
                  style={{ color: "var(--text-muted)" }}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="text-xs font-medium"
                  style={{ color: isLast ? "var(--text)" : "var(--text-muted)" }}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
