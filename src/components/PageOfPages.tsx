import { digitsOnly } from "../data/loadPlan";

export function PageOfPages({
  id,
  label,
  page,
  pages,
  onChange,
}: {
  id: string;
  label: string;
  page: string;
  pages: string;
  onChange: (partial: { page?: string; pages?: string }) => void;
}) {
  return (
    <div className="worksheet-cell">
      <span className="worksheet-label">{label}</span>
      <div className="page-of-pages">
        <input
          id={`${id}-page`}
          className="usa-input"
          inputMode="numeric"
          aria-label="Page"
          value={page}
          onChange={(event) => onChange({ page: digitsOnly(event.target.value) })}
        />
        <span className="page-of-pages-of">of</span>
        <input
          id={`${id}-pages`}
          className="usa-input"
          inputMode="numeric"
          aria-label="Pages"
          value={pages}
          onChange={(event) => onChange({ pages: digitsOnly(event.target.value) })}
        />
      </div>
    </div>
  );
}
