import { useState } from "react";

export function FormSave({
  onSave,
  onSubmit,
  disabled = false,
  submitDisabled = false,
  hint,
  className,
}: {
  onSave: () => void;
  onSubmit?: () => void;
  disabled?: boolean;
  submitDisabled?: boolean;
  hint?: string;
  className?: string;
}) {
  const [saved, setSaved] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className={className ? `actions-row ${className}` : "actions-row"}>
      <button
        type="button"
        className="usa-button save-button"
        disabled={disabled}
        onClick={() => {
          onSave();
          setSaved(true);
        }}
      >
        Save
      </button>
      {saved && !disabled ? <span className="saved-note">Saved.</span> : null}
      {onSubmit ? (
        <button
          type="button"
          className="usa-button submit-button"
          disabled={submitDisabled}
          onClick={() => {
            onSubmit();
            setSubmitted(true);
          }}
        >
          Submit
        </button>
      ) : null}
      {submitted && !submitDisabled ? <span className="saved-note">Submitted.</span> : null}
      {onSubmit && submitDisabled && hint ? <span className="save-hint">{hint}</span> : null}
      {!onSubmit && disabled && hint ? <span className="save-hint">{hint}</span> : null}
    </div>
  );
}
