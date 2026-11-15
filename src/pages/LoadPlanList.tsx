import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../store/Store";
import { cargoWeight } from "../data/loadPlan";

function showDate(value: string): string {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" });
}

export function LoadPlanList() {
  const navigate = useNavigate();
  const { loadPlans, createLoadPlan } = useStore();

  return (
    <div className="page-wrap">
      <p className="page-kicker">Joint airlift packet</p>
      <h1>Load plans</h1>
      <p>
        Start with AF Form 4080. The aircraft, mission, and each item you enter there fill
        the manifest, pallet identifiers, packing list, labels, and the joint inspection.
      </p>
      <div className="actions-row">
        <button
          type="button"
          className="usa-button"
          onClick={() => {
            const plan = createLoadPlan();
            navigate(`/load-plans/${plan.id}`);
          }}
        >
          New load plan
        </button>
      </div>
      <div className="usa-table-container--scrollable" tabIndex={0}>
        <table className="usa-table usa-table--bordered queue-table">
          <caption>Load plans in this demo</caption>
          <thead>
            <tr>
              <th scope="col">Mission</th>
              <th scope="col">Aircraft</th>
              <th scope="col">Route</th>
              <th scope="col">Departure</th>
              <th scope="col">Cargo weight</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {loadPlans.map((plan) => (
              <tr key={plan.id}>
                <th scope="row">
                  <Link to={`/load-plans/${plan.id}`}>{plan.missionNumber || "Untitled load plan"}</Link>
                </th>
                <td>{plan.aircraftType || "—"}</td>
                <td>{plan.missionRouting || "—"}</td>
                <td>{showDate(plan.departureDate)}</td>
                <td>{cargoWeight(plan).toLocaleString("en-US")} lb</td>
                <td>
                  <span className={`status-tag ${plan.status === "inspected" ? "status-received" : "status-draft"}`}>
                    {plan.status === "inspected" ? "Inspected" : "In progress"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
