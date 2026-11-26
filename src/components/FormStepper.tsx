import type { CSSProperties, ReactNode } from "react";

export function FormStepper({
  steps,
  step,
  onStep,
}: {
  steps: readonly string[];
  step: number;
  onStep: (index: number) => void;
}) {
  return (
    <div className="stepper-section no-print">
      <ol className="stepper-track" style={{ "--step-count": steps.length } as CSSProperties}>
        {steps.map((label, index) => (
          <li key={`${index}-${label}`}>
            <button
              type="button"
              className={`stepper-step${index < step ? " is-done" : ""}${index === step ? " is-current" : ""}`}
              aria-current={index === step ? "step" : undefined}
              onClick={() => onStep(index)}
            >
              <span className="stepper-dot">
                {index < step ? (
                  <svg className="stepper-check" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M3.2 8.2 6.3 11.3 12.8 4.6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  index + 1
                )}
              </span>
              <span className="stepper-name">{label}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function StepperFooter({
  step,
  count,
  onStep,
  children,
}: {
  step: number;
  count: number;
  onStep: (index: number) => void;
  children: ReactNode;
}) {
  return (
    <div className="stepper-footer">
      {children}
      <div className="stepper-nav">
        <button type="button" className="usa-button stepper-nav-button stepper-previous" disabled={step === 0} onClick={() => onStep(step - 1)}>
          ← Previous
        </button>
        <button type="button" className="usa-button stepper-nav-button stepper-next" disabled={step === count - 1} onClick={() => onStep(step + 1)}>
          Next →
        </button>
      </div>
    </div>
  );
}
