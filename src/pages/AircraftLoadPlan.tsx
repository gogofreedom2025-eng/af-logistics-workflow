import { Link, useParams } from "react-router-dom";
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
    seatDetail: true,
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
    seatDetail: false,
  },
};

const REMARKS = [
  "1. Off center",
  "1A Right",
  "1B Left",
  "2. Center line load",
  "3. Shoring required:",
  "3A Parking",
  "3B Rolling",
  "3C Sleeper",
  "3D Special",
  "4. Must be positioned in direction of arrow",
  "5. Special handling (DD Form 1387-2)",
  "6. Hazardous material certification",
  "7. Maximum fuel:",
  "7A 3/4 tank",
  "7B 1/2 tank",
  "8. Equipment drained/purged:",
  "8A Drained not purged",
  "8B Purged",
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
        <div className="worksheet-row cols-2">
          <HeadField id={`${config.slug}-page`} label="Page" value={form.page} onChange={(page) => patch({ page })} />
          <HeadField id={`${config.slug}-pages`} label="of pages" value={form.pages} onChange={(pages) => patch({ pages })} />
        </div>
        <div className="worksheet-row cols-even-5">
          <HeadField id={`${config.slug}-mission`} label="6. Mission number" value={form.missionNumber} onChange={(missionNumber) => patch({ missionNumber })} />
          <HeadField id={`${config.slug}-serial`} label="7. Aircraft serial number" value={form.aircraftSerial} onChange={(aircraftSerial) => patch({ aircraftSerial })} />
          <HeadField id={`${config.slug}-config`} label="8. Configuration" value={form.configuration} onChange={(configuration) => patch({ configuration })} />
          <HeadField id={`${config.slug}-departure`} label="9. Departure airfield" value={form.departureAirfield} onChange={(departureAirfield) => patch({ departureAirfield })} />
          <HeadField id={`${config.slug}-destination`} label="10. Destination airfield" value={form.destinationAirfield} onChange={(destinationAirfield) => patch({ destinationAirfield })} />
        </div>

        <div className="aircraft-scroll">
          <div className="aircraft-line aircraft-line-head">
            <span className="worksheet-label">a. Load sequence</span>
            <span className="worksheet-label">b. Item model and nomenclature/description</span>
            <span className="worksheet-label">c. Transportation control no.</span>
            <span className="worksheet-label">Remarks code</span>
            <span className="worksheet-label">Other remarks</span>
            <span className="worksheet-label">Length</span>
            <span className="worksheet-label">Width</span>
            <span className="worksheet-label">Height</span>
            <span className="worksheet-label">Planned gross weight</span>
            <span className="worksheet-label">Planned fuselage station</span>
            <span className="worksheet-label">
              Planned moment <span className="worksheet-unit">{config.momentNote}</span>
            </span>
            <span className="worksheet-label">Actual gross weight</span>
            <span className="worksheet-label">Actual fuselage station</span>
            <span className="worksheet-label">
              Actual moment <span className="worksheet-unit">{config.momentNote}</span>
            </span>
          </div>
          {form.lines.map((line) => (
            <div className="aircraft-line" key={line.id}>
              <LineField id={`${line.id}-sequence`} label="Load sequence" value={line.sequence} onChange={(sequence) => updateLine(line.id, { sequence })} />
              <LineField id={`${line.id}-name`} label="Item model and nomenclature" value={line.nomenclature} onChange={(nomenclature) => updateLine(line.id, { nomenclature })} />
              <LineField id={`${line.id}-tcn`} label="Transportation control number" value={line.tcn} onChange={(tcn) => updateLine(line.id, { tcn })} />
              <LineField id={`${line.id}-code`} label="Remarks code" value={line.remarksCode} onChange={(remarksCode) => updateLine(line.id, { remarksCode })} />
              <LineField id={`${line.id}-remarks`} label="Other remarks" value={line.otherRemarks} onChange={(otherRemarks) => updateLine(line.id, { otherRemarks })} />
              <LineField id={`${line.id}-length`} label="Length" value={line.length} onChange={(length) => updateLine(line.id, { length })} />
              <LineField id={`${line.id}-width`} label="Width" value={line.width} onChange={(width) => updateLine(line.id, { width })} />
              <LineField id={`${line.id}-height`} label="Height" value={line.height} onChange={(height) => updateLine(line.id, { height })} />
              <LineField id={`${line.id}-p-weight`} label="Planned gross weight" value={line.plannedWeight} onChange={(plannedWeight) => updateLine(line.id, { plannedWeight })} />
              <LineField id={`${line.id}-p-station`} label="Planned fuselage station" value={line.plannedStation} onChange={(plannedStation) => updateLine(line.id, { plannedStation })} />
              <LineField id={`${line.id}-p-moment`} label="Planned moment" value={line.plannedMoment} onChange={(plannedMoment) => updateLine(line.id, { plannedMoment })} />
              <LineField id={`${line.id}-a-weight`} label="Actual gross weight" value={line.actualWeight} onChange={(actualWeight) => updateLine(line.id, { actualWeight })} />
              <LineField id={`${line.id}-a-station`} label="Actual fuselage station" value={line.actualStation} onChange={(actualStation) => updateLine(line.id, { actualStation })} />
              <LineField id={`${line.id}-a-moment`} label="Actual moment" value={line.actualMoment} onChange={(actualMoment) => updateLine(line.id, { actualMoment })} />
            </div>
          ))}
        </div>
        <div className="worksheet-row">
          <div className="worksheet-cell actions-row">
            <button type="button" className="usa-button usa-button--outline" onClick={() => patch({ lines: [...form.lines, emptyAircraftLoadLine()] })}>
              Add line
            </button>
            {form.lines.length > 1 ? (
              <button type="button" className="usa-button usa-button--outline" onClick={() => patch({ lines: form.lines.slice(0, -1) })}>
                Remove line
              </button>
            ) : null}
          </div>
        </div>

        {config.seatDetail ? (
          <div className="worksheet-row cols-3">
            <HeadField id={`${config.slug}-seats`} label="12. Number of seats" value={form.seatCount} onChange={(seatCount) => patch({ seatCount })} />
            <HeadField id={`${config.slug}-seat-weight`} label="Seats avg. weight" note="(Pounds each)" value={form.seatAverageWeight} onChange={(seatAverageWeight) => patch({ seatAverageWeight })} />
            <HeadField id={`${config.slug}-seat-total`} label="Total planned wt." value={form.seatPlannedWeight} onChange={(seatPlannedWeight) => patch({ seatPlannedWeight })} />
          </div>
        ) : (
          <div className="worksheet-row">
            <HeadField id={`${config.slug}-seats`} label="12. Passenger seats planning data" value={form.seatNotes} onChange={(seatNotes) => patch({ seatNotes })} />
          </div>
        )}
        <div className="worksheet-row cols-2">
          <HeadField id={`${config.slug}-back-weight`} label="13. Total weight from back" value={form.weightFromBack} onChange={(weightFromBack) => patch({ weightFromBack })} />
          <HeadField id={`${config.slug}-back-moment`} label="Total moment from back" note={config.momentNote} value={form.momentFromBack} onChange={(momentFromBack) => patch({ momentFromBack })} />
        </div>
        <div className="worksheet-row cols-2">
          <HeadField id={`${config.slug}-planned-cb`} label="Planned load CB station" value={form.plannedCbStation} onChange={(plannedCbStation) => patch({ plannedCbStation })} />
          <HeadField id={`${config.slug}-actual-cb`} label="Actual load CB station" value={form.actualCbStation} onChange={(actualCbStation) => patch({ actualCbStation })} />
        </div>
        <div className="worksheet-row cols-4">
          <HeadField id={`${config.slug}-total-p-weight`} label="14. Total planned weight" value={form.totalPlannedWeight} onChange={(totalPlannedWeight) => patch({ totalPlannedWeight })} />
          <HeadField id={`${config.slug}-total-p-moment`} label="Total planned moment" note={config.momentNote} value={form.totalPlannedMoment} onChange={(totalPlannedMoment) => patch({ totalPlannedMoment })} />
          <HeadField id={`${config.slug}-total-a-weight`} label="Total actual weight" value={form.totalActualWeight} onChange={(totalActualWeight) => patch({ totalActualWeight })} />
          <HeadField id={`${config.slug}-total-a-moment`} label="Total actual moment" note={config.momentNote} value={form.totalActualMoment} onChange={(totalActualMoment) => patch({ totalActualMoment })} />
        </div>
        <div className="worksheet-row cols-3">
          <HeadField id={`${config.slug}-planned-date`} label="15a. Load planned by date certified" type="date" value={form.plannedDate} onChange={(plannedDate) => patch({ plannedDate })} />
          <HeadField id={`${config.slug}-planned-name`} label="Typed/printed name, grade, organization of loadplanner" value={form.plannedName} onChange={(plannedName) => patch({ plannedName })} />
          <HeadField id={`${config.slug}-planned-signature`} label="Signature" value={form.plannedSignature} onChange={(plannedSignature) => patch({ plannedSignature })} />
        </div>
        <div className="worksheet-row cols-3">
          <HeadField id={`${config.slug}-approved-date`} label="15b. Load approved by date certified" type="date" value={form.approvedDate} onChange={(approvedDate) => patch({ approvedDate })} />
          <HeadField id={`${config.slug}-approved-name`} label={config.approverLabel} value={form.approvedName} onChange={(approvedName) => patch({ approvedName })} />
          <HeadField id={`${config.slug}-approved-signature`} label="Signature" value={form.approvedSignature} onChange={(approvedSignature) => patch({ approvedSignature })} />
        </div>
        <div className="worksheet-prose aircraft-remarks">
          <p className="worksheet-label">h. Remarks codes (For use in the remarks code column)</p>
          {REMARKS.map((item) => (
            <p key={item}>
              {item}
              {item.startsWith("6.") && config.hazardousNote ? <span className="worksheet-unit"> {config.hazardousNote}</span> : null}
            </p>
          ))}
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

function LineField({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (value: string) => void }) {
  return <input id={id} className="usa-input" aria-label={label} value={value} onChange={(event) => onChange(event.target.value)} />;
}
