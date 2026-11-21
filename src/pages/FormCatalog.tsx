import { useNavigate } from "react-router-dom";
import { useStore } from "../store/Store";
import { PACKET_STEPS, stepPath } from "../types/loadPlan";

const BUILT_FORMS = PACKET_STEPS.filter((step) => step.built).sort((a, b) => a.title.localeCompare(b.title));

export function FormCatalog() {
  const navigate = useNavigate();
  const { createLoadPlan } = useStore();

  return (
    <div className="page-wrap">
      <p className="page-kicker">Forms</p>
      <h1>Form catalog</h1>
      <p>Choose a form. Save stores it under the form title and the time you saved.</p>
      <div className="form-catalog">
        {BUILT_FORMS.map((form) => (
          <button
            key={form.title}
            type="button"
            className="usa-button usa-button--outline catalog-form"
            onClick={() => {
              const plan = createLoadPlan();
              navigate(stepPath(plan.id, form.slug));
            }}
          >
            {form.title}
          </button>
        ))}
      </div>
    </div>
  );
}
