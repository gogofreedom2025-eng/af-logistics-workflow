import { Link } from "react-router-dom";
import { formatSavedAt } from "../data/loadPlan";
import { useStore } from "../store/Store";
import { stepPath } from "../types/loadPlan";

export function LoadPlanList() {
  const { loadPlans } = useStore();
  const saved = loadPlans.filter((plan) => plan.savedAt).sort((a, b) => b.savedAt.localeCompare(a.savedAt));

  return (
    <div className="page-wrap">
      <p className="page-kicker">Saved forms</p>
      <h1>Saved forms</h1>
      <p>
        A saved form is stored under its title and the time you saved it. Start one from the{" "}
        <Link to="/form-catalog">form catalog</Link>.
      </p>
      {saved.length === 0 ? (
        <p>Nothing saved yet.</p>
      ) : (
        <div className="usa-table-container--scrollable" tabIndex={0}>
          <table className="usa-table usa-table--bordered queue-table">
            <caption>Saved forms</caption>
            <thead>
              <tr>
                <th scope="col">Form</th>
                <th scope="col">Saved</th>
              </tr>
            </thead>
            <tbody>
              {saved.map((plan) => (
                <tr key={plan.id}>
                  <th scope="row">
                    <Link to={stepPath(plan.id, plan.savedSlug)}>{plan.savedTitle}</Link>
                  </th>
                  <td>{formatSavedAt(plan.savedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
