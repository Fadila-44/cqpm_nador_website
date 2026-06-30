export default function EmptyState({ icon = "📭", title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[12px] bg-white py-16 shadow-sm">
      <span className="text-5xl">{icon}</span>
      <h3 className="mt-4 text-lg font-semibold text-text">{title}</h3>
      <p className="mt-2 max-w-sm text-center text-sm text-slate-500">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-6 rounded-[8px] bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary/90"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
