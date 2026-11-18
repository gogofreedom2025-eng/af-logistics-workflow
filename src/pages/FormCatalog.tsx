import { Link } from "react-router-dom";
import { useStore } from "../store/Store";
import { PACKET_STEPS, stepPath } from "../types/loadPlan";

const BUILT_FORMS = PACKET_STEPS.filter((step) => step.built);

export function FormCatalog() {
  const { loadPlans } = useStore();

  return (
    <div className="page-wrap">
      <p className="page-kicker">Forms in this packet</p>
      <h1>Form catalog</h1>
      <p>Each link opens that form on a saved load plan.</p>
      {loadPlans.length === 0 ? (
        <p>
          No load plans yet. <Link to="/load-plans">Back to load plans</Link>
        </p>
      ) : (
        loadPlans.map((plan) => (
          <section className="section-card" key={plan.id}>
            <h2>{plan.missionNumber || "Untitled load plan"}</h2>
            <div className="actions-row">
              {BUILT_FORMS.map((form) => (
                <Link key={form.title} className="usa-button usa-button--outline" to={stepPath(plan.id, form.slug)}>
                  {form.title}
                </Link>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
