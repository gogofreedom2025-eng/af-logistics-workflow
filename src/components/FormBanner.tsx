import { formatSavedAt } from "../data/loadPlan";

export function FormBanner({
  title,
  form,
  note,
  savedAt,
}: {
  title: string;
  form: string;
  note?: string;
  savedAt?: string;
}) {
  return (
    <div className="form-banner">
      <div className="form-header">
        <div className="form-header-title">
          <h1>{title}</h1>
          {note ? <p className="form-header-note">{note}</p> : null}
        </div>
        <svg className="form-header-plane" viewBox="0 0 128 48" aria-hidden="true">
          <path d="M4 28h34l16-14h8l6 14h36c6 0 12 2 16 6l4 4H2l8-6 6-4z" />
        </svg>
        <span className="form-header-badge">{form}</span>
      </div>
      {savedAt ? <p className="form-saved">Saved {formatSavedAt(savedAt)}</p> : null}
    </div>
  );
}
