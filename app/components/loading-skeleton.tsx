interface LoadingSkeletonProps {
  rows?: number;
  className?: string;
}

function SkeletonBox({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded ${className}`}
      style={{ background: "var(--surface-raised)" }}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-3"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-center justify-between">
        <SkeletonBox className="h-4 w-24" />
        <SkeletonBox className="h-9 w-9 rounded-lg" />
      </div>
      <SkeletonBox className="h-8 w-20" />
    </div>
  );
}

export function TableRowSkeleton({ rows = 5 }: LoadingSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i}>
          {Array.from({ length: 5 }).map((_, j) => (
            <td key={j} className="px-4 py-3">
              <SkeletonBox className={`h-4 ${j === 1 ? "w-32" : "w-16"}`} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export default function LoadingSkeleton({ rows = 5 }: LoadingSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl p-4 flex gap-4 items-center"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <SkeletonBox className="h-10 w-10 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <SkeletonBox className="h-4 w-3/4" />
            <SkeletonBox className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
