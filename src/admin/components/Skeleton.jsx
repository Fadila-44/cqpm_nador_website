export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="rounded-[12px] bg-white p-4 shadow-sm">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 py-3">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="skeleton h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-[12px] bg-white p-5 shadow-sm">
          <div className="skeleton h-10 w-10 rounded-full" />
          <div className="skeleton mt-4 h-8 w-16" />
          <div className="skeleton mt-2 h-4 w-24" />
        </div>
      ))}
    </div>
  );
}

export function GridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton aspect-square rounded-[12px]" />
      ))}
    </div>
  );
}
