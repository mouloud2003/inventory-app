import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: "primary" | "success" | "warning" | "destructive" | "info";
}

const colorMap = {
  primary: { icon: "var(--primary)", bg: "var(--primary-subtle)" },
  success: { icon: "var(--success)", bg: "var(--success-subtle)" },
  warning: { icon: "var(--warning)", bg: "var(--warning-subtle)" },
  destructive: { icon: "var(--destructive)", bg: "var(--destructive-subtle)" },
  info: { icon: "var(--info)", bg: "var(--info-subtle)" },
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  trendUp,
  color = "primary",
}: StatCardProps) {
  const colors = colorMap[color];

  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-3"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-sm font-medium"
          style={{ color: "var(--text-muted)" }}
        >
          {label}
        </span>
        {Icon && (
          <div
            className="flex items-center justify-center rounded-lg"
            style={{
              width: "2.25rem",
              height: "2.25rem",
              background: colors.bg,
              color: colors.icon,
            }}
          >
            <Icon size={18} />
          </div>
        )}
      </div>
      <div>
        <div
          className="text-3xl font-bold tracking-tight"
          style={{ color: "var(--text)" }}
        >
          {value}
        </div>
        {trend && (
          <p
            className="mt-1 text-xs font-medium"
            style={{ color: trendUp ? "var(--success)" : "var(--text-muted)" }}
          >
            {trend}
          </p>
        )}
      </div>
    </div>
  );
}
