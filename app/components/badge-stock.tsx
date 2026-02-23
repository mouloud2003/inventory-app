interface BadgeStockProps {
  stock: number;
  showCount?: boolean;
}

export default function BadgeStock({ stock, showCount = true }: BadgeStockProps) {
  let label: string;
  let bg: string;
  let color: string;
  let dot: string;

  if (stock <= 0) {
    label = "Out of stock";
    bg = "var(--destructive-subtle)";
    color = "var(--destructive)";
    dot = "var(--destructive)";
  } else if (stock <= 5) {
    label = "Low stock";
    bg = "var(--warning-subtle)";
    color = "var(--warning)";
    dot = "var(--warning)";
  } else if (stock <= 20) {
    label = "In stock";
    bg = "var(--success-subtle)";
    color = "var(--success)";
    dot = "var(--success)";
  } else {
    label = "High stock";
    bg = "var(--info-subtle)";
    color = "var(--info)";
    dot = "var(--info)";
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ background: bg, color }}
    >
      <span
        className="rounded-full"
        style={{ width: "6px", height: "6px", background: dot, display: "inline-block" }}
      />
      {showCount ? `${stock} · ` : ""}
      {label}
    </span>
  );
}
