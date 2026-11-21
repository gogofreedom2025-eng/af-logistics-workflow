import { Link, useParams } from "react-router-dom";
import { C130LoadDiagram } from "../components/C130LoadDiagram";
import { C17LoadDiagram } from "../components/C17LoadDiagram";
import { FormSave } from "../components/FormSave";
import { emptyAircraftLoadLine, formatSavedAt, withAircraftLoadPlan, withSavedForm } from "../data/loadPlan";
import { useStore } from "../store/Store";
import type { AircraftLoadLine, AircraftLoadPlan, AirliftPacket } from "../types/loadPlan";

type AircraftVariant = "c17" | "c130";

const CONFIG = {
  c17: {
    field: "c17LoadPlan" as const,
    formNumber: "DD Form 2130-13",
    edition: "JUN 2026",
    title: "C-17 Load Plan",
    slug: "c17-load-plan",
    momentNote: "(10,000)",
    approverLabel: "Typed/printed name, grade, organization of loadplan validator",
    hazardousNote: "(Shippers Declaration for Dangerous Goods)",
    Diagram: C17LoadDiagram,
  },
  c130: {
    field: "c130LoadPlan" as const,
    formNumber: "DD Form 2130-2",
    edition: "JUN 2016",
    title: "C-130 E/H/J Load Plan",
    slug: "c130-load-plan",
    momentNote: "(1,000)",
    approverLabel: "Typed/printed name, grade, organization of loadplanner",
    hazardousNote: "",
    Diagram: C130LoadDiagram,
  },
};

const REMARKS = [
  "1. Off center",
  "1A. Right",
  "1B. Left",
  "2. Center line load",
  "3. Shoring required:",
  "3A. Parking",
  "3B. Rolling",
  "3C. Sleeper",
  "3D. Special",
  "4. Must be positioned in direction of arrow",
  "5. Special handling (DD Form 1387-2)",
  "6. Hazardous material certification",
  "7. Maximum fuel:",
  "7A. 3/4 tank",
  "7B. 1/2 tank",
  "8. Equipment drained/purged:",
  "8A. Drained not purged",
  "8B. Purged",
  "9. Vent kit required",
];

export function AircraftLoadPlanForm({ variant }: { variant: AircraftVariant }) {
  const { id } = useParams();
  const { getLoadPlan, saveLoadPlan } = useStore();
  const plan = id ? getLoadPlan(id) : undefined;
  const config = CONFIG[variant];

  if (!plan) {
    return (
      <div className="page-wrap">
        <h1>Load plan not found</h1>
        <Link to="/load-plans">Back to load plans</Link>
      </div>
    );
  }

  return <LoadPlanSheet plan={plan} saveLoadPlan={saveLoadPlan} config={config} />;
}

function LoadPlanSheet({
  plan,
  saveLoadPlan,
  config,
}: {
  plan: AirliftPacket;
  saveLoadPlan: (plan: AirliftPacket) => void;
  config: (typeof CONFIG)[AircraftVariant];
}) {
  const form = withAircraftLoadPlan(plan[config.field]);
  const Diagram = config.Diagram;
  const patch = (partial: Partial<AircraftLoadPlan>) =>
    saveLoadPlan({ ...plan, [config.field]: { ...form, ...partial } });
  const updateLine = (lineId: string, partial: Partial<AircraftLoadLine>) =>
    patch({ lines: form.lines.map((line) => (line.id === lineId ? { ...line, ...partial } : line)) });

  return (
    <div className="page-wrap">
      <p className="page-kicker">
        {config.formNumber}, {config.edition} · {config.title}
      </p>
      <h1>
        {config.formNumber}
        {plan.savedAt ? ` · ${formatSavedAt(plan.savedAt)}` : ""}
      </h1>

      <div className="section-card worksheet-sheet sheet-frame worksheet-grid">
        <h2 className="worksheet-banner">
          {config.title}
          <span className="worksheet-unit worksheet-banner-note">{config.edition}</span>
        </h2>
        <div className="worksheet-row cols-even-5">
          <HeadField id={`${config.slug}-unit`} label="1. Unit being airlifted" note="(Name or number)" value={form.unit} onChange={(unit) => patch({ unit })} />
          <HeadField id={`${config.slug}-uic`} label="2. Unit identification code" value={form.uic} onChange={(uic) => patch({ uic })} />
          <HeadField id={`${config.slug}-movement`} label="3. Type movement plan" value={form.movementPlan} onChange={(movementPlan) => patch({ movementPlan })} />
          <HeadField id={`${config.slug}-movement-date`} label="4. Movement date" type="date" value={form.movementDate} onChange={(movementDate) => patch({ movementDate })} />
          <HeadField id={`${config.slug}-load-no`} label="5. Unit aircraft load no." value={form.loadNumber} onChange={(loadNumber) => patch({ loadNumber })} />
        </div>
        <div className="worksheet-row cols-even-5">
          <HeadField id={`${config.slug}-mission`} label="6. Mission number" value={form.missionNumber} onChange={(missionNumber) => patch({ missionNumber })} />
          <HeadField id={`${config.slug}-serial`} label="7. Aircraft serial number" value={form.aircraftSerial} onChange={(aircraftSerial) => patch({ aircraftSerial })} />
          <HeadField id={`${config.slug}-config`} label="8. Configuration" value={form.configuration} onChange={(configuration) => patch({ configuration })} />
          <HeadField id={`${config.slug}-departure`} label="9. Departure airfield" value={form.departureAirfield} onChange={(departureAirfield) => patch({ departureAirfield })} />
          <HeadField id={`${config.slug}-destination`} label="10. Destination airfield" value={form.destinationAirfield} onChange={(destinationAirfield) => patch({ destinationAirfield })} />
        </div>
      </div>

      <div className="section-card worksheet-sheet sheet-frame worksheet-grid">
        <div className="worksheet-row">
          <div className="worksheet-cell">
            <span className="worksheet-label">11. Actual loadout</span>
          </div>
        </div>
        <Diagram />
        {form.lines.map((line) => (
          <div className="sheet-block worksheet-grid loadout-line" key={line.id}>
            <div className="worksheet-row loadout-ab">
              <HeadField id={`${line.id}-sequence`} label="a. Load sequence" value={line.sequence} onChange={(sequence) => updateLine(line.id, { sequence })} />
              <HeadField id={`${line.id}-name`} label="b. Item model and nomenclature/description" value={line.nomenclature} onChange={(nomenclature) => updateLine(line.id, { nomenclature })} />
            </div>
            <div className="worksheet-row cols-even-3">
              <HeadField id={`${line.id}-tcn`} label="c. Transportation control no." value={line.tcn} onChange={(tcn) => updateLine(line.id, { tcn })} />
              <HeadField id={`${line.id}-package`} label="Vehicle package/serial no." value={line.vehiclePackage} onChange={(vehiclePackage) => updateLine(line.id, { vehiclePackage })} />
              <HeadField id={`${line.id}-increment`} label="Increment no." value={line.increment} onChange={(increment) => updateLine(line.id, { increment })} />
            </div>
            <div className="worksheet-row cols-quarter">
              <HeadField
                id={`${line.id}-code`}
                label="d. Remarks code"
                note="(See section h below)"
                value={line.remarksCode}
                onChange={(remarksCode) => updateLine(line.id, { remarksCode })}
              />
              <HeadField id={`${line.id}-other`} label="Other remarks" value={line.otherRemarks} onChange={(otherRemarks) => updateLine(line.id, { otherRemarks })} />
            </div>
            <div className="worksheet-row">
              <div className="worksheet-cell">
                <span className="worksheet-label">
                  e. Dimensional data
                  <span className="worksheet-unit"> (Total, in inches)</span>
                </span>
              </div>
            </div>
            <div className="worksheet-row cols-even-3">
              <HeadField id={`${line.id}-length`} label="Length" value={line.length} onChange={(length) => updateLine(line.id, { length })} />
              <HeadField id={`${line.id}-width`} label="Width" value={line.width} onChange={(width) => updateLine(line.id, { width })} />
              <HeadField id={`${line.id}-height`} label="Height" value={line.height} onChange={(height) => updateLine(line.id, { height })} />
            </div>
            <div className="worksheet-row">
              <div className="worksheet-cell">
                <span className="worksheet-label">f. Planned load data</span>
              </div>
            </div>
            <div className="worksheet-row cols-even-3">
              <HeadField id={`${line.id}-p-weight`} label="Gross weight" note="(Total pounds)" value={line.plannedWeight} onChange={(plannedWeight) => updateLine(line.id, { plannedWeight })} />
              <HeadField id={`${line.id}-p-station`} label="Fuselage station" value={line.plannedStation} onChange={(plannedStation) => updateLine(line.id, { plannedStation })} />
              <HeadField id={`${line.id}-p-moment`} label="Moment" note={config.momentNote} value={line.plannedMoment} onChange={(plannedMoment) => updateLine(line.id, { plannedMoment })} />
            </div>
            <div className="worksheet-row">
              <div className="worksheet-cell">
                <span className="worksheet-label">g. Actual load data</span>
              </div>
            </div>
            <div className="worksheet-row cols-even-3">
              <HeadField id={`${line.id}-a-weight`} label="Gross weight" note="(Total pounds)" value={line.actualWeight} onChange={(actualWeight) => updateLine(line.id, { actualWeight })} />
              <HeadField id={`${line.id}-a-station`} label="Fuselage station" value={line.actualStation} onChange={(actualStation) => updateLine(line.id, { actualStation })} />
              <HeadField id={`${line.id}-a-moment`} label="Moment" note={config.momentNote} value={line.actualMoment} onChange={(actualMoment) => updateLine(line.id, { actualMoment })} />
            </div>
          </div>
        ))}
        <div className="worksheet-row">
          <div className="worksheet-cell actions-row">
            <button type="button" className="usa-button usa-button--outline" onClick={() => patch({ lines: [...form.lines, emptyAircraftLoadLine()] })}>
              Add row
            </button>
            {form.lines.length > 1 ? (
              <button type="button" className="usa-button usa-button--outline" onClick={() => patch({ lines: form.lines.slice(0, -1) })}>
                Remove row
              </button>
            ) : null}
          </div>
        </div>
        <div className="worksheet-prose aircraft-remarks">
          <p className="worksheet-label">
            h. Remarks codes
            <span className="worksheet-unit"> (For use in column d)</span>
          </p>
          {REMARKS.map((item) => (
            <p key={item} className={/^\d+[A-Za-z]/.test(item) ? "aircraft-remark-sub" : undefined}>
              {item}
              {item.startsWith("6.") && config.hazardousNote ? <span className="worksheet-unit"> {config.hazardousNote}</span> : null}
            </p>
          ))}
        </div>
      </div>

      <div className="section-card worksheet-sheet sheet-frame worksheet-grid">
        <div className="load-summary">
          <div className="load-seats">
            <div className="worksheet-row">
              <div className="worksheet-cell">
                <span className="worksheet-label">12. Passenger seats planning data</span>
              </div>
            </div>
            <div className="worksheet-row cols-even-3">
              <HeadField id={`${config.slug}-seats`} label="Number of seats" value={form.seatCount} onChange={(seatCount) => patch({ seatCount })} />
              <HeadField id={`${config.slug}-seat-weight`} label="Avg. weight" note="(Pounds each)" value={form.seatAverageWeight} onChange={(seatAverageWeight) => patch({ seatAverageWeight })} />
              <HeadField id={`${config.slug}-seat-total`} label="Total planned wt." value={form.seatPlannedWeight} onChange={(seatPlannedWeight) => patch({ seatPlannedWeight })} />
            </div>
          </div>
          <div className="load-side">
            <div className="load-back">
              <div className="worksheet-row">
                <div className="worksheet-cell">
                  <span className="worksheet-label">13. Total weight/moment from back</span>
                </div>
              </div>
              <div className="worksheet-row cols-2">
                <HeadField id={`${config.slug}-back-weight`} label="Total weight" value={form.weightFromBack} onChange={(weightFromBack) => patch({ weightFromBack })} />
                <HeadField id={`${config.slug}-back-moment`} label="Total moment" note={config.momentNote} value={form.momentFromBack} onChange={(momentFromBack) => patch({ momentFromBack })} />
              </div>
              <div className="worksheet-row cols-2">
                <HeadField id={`${config.slug}-planned-cb`} label="Load CB station" note="(Planned)" value={form.plannedCbStation} onChange={(plannedCbStation) => patch({ plannedCbStation })} />
                <HeadField id={`${config.slug}-actual-cb`} label="Load CB station" note="(Actual)" value={form.actualCbStation} onChange={(actualCbStation) => patch({ actualCbStation })} />
              </div>
            </div>
            <div className="load-totals">
              <div className="worksheet-row">
                <div className="worksheet-cell">
                  <span className="worksheet-label">14. Totals</span>
                </div>
              </div>
              <div className="worksheet-row cols-2">
                <HeadField id={`${config.slug}-total-p-weight`} label="Planned gross weight" value={form.totalPlannedWeight} onChange={(totalPlannedWeight) => patch({ totalPlannedWeight })} />
                <HeadField id={`${config.slug}-total-a-weight`} label="Actual gross weight" value={form.totalActualWeight} onChange={(totalActualWeight) => patch({ totalActualWeight })} />
              </div>
              <div className="worksheet-row cols-2">
                <HeadField id={`${config.slug}-total-p-moment`} label="Planned moment" note={config.momentNote} value={form.totalPlannedMoment} onChange={(totalPlannedMoment) => patch({ totalPlannedMoment })} />
                <HeadField id={`${config.slug}-total-a-moment`} label="Actual moment" note={config.momentNote} value={form.totalActualMoment} onChange={(totalActualMoment) => patch({ totalActualMoment })} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-card worksheet-sheet sheet-frame worksheet-grid">
        <div className="worksheet-row cols-2">
          <HeadField id={`${config.slug}-planned-date`} label="15a. Load planned by date certified" type="date" value={form.plannedDate} onChange={(plannedDate) => patch({ plannedDate })} />
          <HeadField id={`${config.slug}-planned-name`} label="Typed/printed name, grade, organization of loadplanner" value={form.plannedName} onChange={(plannedName) => patch({ plannedName })} />
        </div>
        <div className="worksheet-row">
          <HeadField id={`${config.slug}-planned-signature`} label="Signature" value={form.plannedSignature} onChange={(plannedSignature) => patch({ plannedSignature })} />
        </div>
        <div className="worksheet-row cols-2">
          <HeadField id={`${config.slug}-approved-date`} label="15b. Load approved by date certified" type="date" value={form.approvedDate} onChange={(approvedDate) => patch({ approvedDate })} />
          <HeadField id={`${config.slug}-approved-name`} label={config.approverLabel} value={form.approvedName} onChange={(approvedName) => patch({ approvedName })} />
        </div>
        <div className="worksheet-row">
          <HeadField id={`${config.slug}-approved-signature`} label="Signature" value={form.approvedSignature} onChange={(approvedSignature) => patch({ approvedSignature })} />
        </div>
      </div>

      <FormSave
        onSave={() =>
          saveLoadPlan(withSavedForm({ ...plan, [config.field]: form }, config.formNumber, config.slug))
        }
      />
    </div>
  );
}

function HeadField({
  id,
  label,
  note,
  value,
  onChange,
  type = "text",
}: {
  id: string;
  label: string;
  note?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div className="worksheet-cell">
      <label className="worksheet-label" htmlFor={id}>
        {label}
        {note ? <span className="worksheet-unit"> {note}</span> : null}
      </label>
      <input id={id} className="usa-input" type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}
