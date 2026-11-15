import { Link, Navigate, useParams } from "react-router-dom";
import { PacketNav, StepContinue } from "../components/PacketNav";
import { useStore } from "../store/Store";
import { PACKET_STEPS } from "../types/loadPlan";

export function AirliftStep() {
  const { id, step } = useParams();
  const { getLoadPlan } = useStore();
  const plan = id ? getLoadPlan(id) : undefined;
  const current = PACKET_STEPS.find((item) => item.slug === step);

  if (!plan) {
    return (
      <div className="page-wrap">
        <h1>Load plan not found</h1>
        <Link to="/load-plans">Back to load plans</Link>
      </div>
    );
  }

  if (!current || current.slug === "" || !plan.missionNumber.trim()) {
    return <Navigate to={`/load-plans/${plan.id}`} replace />;
  }

  return (
    <div className="page-wrap">
      <p className="page-kicker">{current.title}</p>
      <h1>{current.short}</h1>
      <PacketNav id={plan.id} />
      <div className="section-card">
        <h2>Coming soon</h2>
        {current.slug === "cargo-manifests" && (
          <p>
            DD 1385 is controlled, so an official blank copy must be requested from its issuing office.
          </p>
        )}
      </div>
      <StepContinue id={plan.id} slug={current.slug} />
    </div>
  );
}
