import { Link, NavLink } from "react-router-dom";
import { nextStep, PACKET_STEPS, stepPath } from "../types/loadPlan";

export function PacketNav({ id, locked = false }: { id: string; locked?: boolean }) {
  return (
    <nav className="shipment-nav" aria-label="Airlift forms">
      {PACKET_STEPS.filter((step) => !step.hidden).map((step) => {
        const blocked = locked && step.slug !== "";
        if (blocked) {
          return (
            <span key={step.title} className="shipment-nav-disabled" aria-disabled="true">
              {step.short}
            </span>
          );
        }
        return (
          <NavLink key={step.title} to={stepPath(id, step.slug)} end={step.slug === ""}>
            {step.short}
          </NavLink>
        );
      })}
    </nav>
  );
}

export function StepContinue({ id, slug, blocked = false }: { id: string; slug: string; blocked?: boolean }) {
  const next = nextStep(slug);
  if (!next) return null;
  if (blocked) {
    return (
      <div className="actions-row">
        <button type="button" className="usa-button" disabled>
          Continue to {next.title}
        </button>
        <span>Complete the required fields to continue.</span>
      </div>
    );
  }
  return (
    <div className="actions-row">
      <Link className="usa-button" to={stepPath(id, next.slug)}>
        Continue to {next.title}
      </Link>
    </div>
  );
}
