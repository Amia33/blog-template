export default function PageHeader({
  title,
  description,
  count,
}: {
  title: string;
  description?: string;
  count?: string;
}) {
  return (
    <header className="mb-4 flex flex-wrap items-end justify-between gap-2">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm opacity-80">{description}</p>
        ) : null}
      </div>
      {count ? <span className="badge badge-ghost">{count}</span> : null}
    </header>
  );
}
