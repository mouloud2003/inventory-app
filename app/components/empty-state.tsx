import { ReactNode } from "react";
import { PackageOpen } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export default function EmptyState({
  title = "Nothing here yet",
  description,
  action,
  icon,
}: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center text-center py-16 px-6 rounded-xl"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      <div
        className="mb-4 rounded-xl p-4"
        style={{ background: "var(--surface-raised)", color: "var(--text-subtle)" }}
      >
        {icon ?? <PackageOpen size={32} />}
      </div>
      <h3
        className="text-base font-semibold mb-1"
        style={{ color: "var(--text)" }}
      >
        {title}
      </h3>
      {description && (
        <p className="text-sm mb-6 max-w-xs" style={{ color: "var(--text-muted)" }}>
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
