export function PageHeader({ title, description, actions }) {
  return (
    <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:flex-wrap">
      <div className="min-w-0">
        <h1 className="break-words font-display text-2xl font-bold text-ink">{title}</h1>
        {description && <p className="mt-1 text-sm text-ink/55">{description}</p>}
      </div>
      {actions && <div className="flex w-full items-center gap-3 md:w-auto">{actions}</div>}
    </div>
  );
}
