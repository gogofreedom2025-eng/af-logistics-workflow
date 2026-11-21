import { useState } from "react";

export function FormSave({ onSave, disabled = false, hint }: { onSave: () => void; disabled?: boolean; hint?: string }) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="actions-row">
      <button
        type="button"
        className="usa-button"
        disabled={disabled}
        onClick={() => {
          onSave();
          setSaved(true);
        }}
      >
        Save
      </button>
      {saved && !disabled ? <span className="saved-note">Saved.</span> : null}
      {disabled && hint ? <span className="save-hint">{hint}</span> : null}
    </div>
  );
}
