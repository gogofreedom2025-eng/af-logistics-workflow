import { Link, Navigate, useParams } from "react-router-dom";
import { PacketNav, StepContinue } from "../components/PacketNav";
import { emptyInspectionColumn, withInspection } from "../data/loadPlan";
import { useStore } from "../store/Store";
import type { AirliftPacket, InspectionColumn, InspectionMark, JointInspection } from "../types/loadPlan";

const LINES: { id: string; label: string; note?: string; section?: boolean }[] = [
  { id: "11", label: "11. Documentation", section: true },
  { id: "11a", label: "a. Pre-Load Plan" },
  { id: "11b", label: "b. Manifest/ Load List/Packing List" },
  { id: "11c", label: "c. Shippers Declaration for Dangerous Goods", note: "(SDDG)" },
  { id: "11d", label: "d. DD Form 1387-2" },
  { id: "11e", label: "e. Military Shipping Label/DD Form 1387" },
  { id: "11f", label: "f. ATTLA Certification", note: "(Reference DTR Part III, App O)" },
  { id: "12", label: "12. General requirements", note: "(Applicable to Blocks 13, 14, 15)", section: true },
  { id: "12a", label: "a. Clean" },
  { id: "12b", label: "b. Fluid Leaks", note: "(Reference DTR Part III, App O)" },
  { id: "12c", label: "c. Scale Weight", note: "(GW, Axle Weight, Marked on Both Sides)" },
  { id: "12d", label: "d. Dimensions", note: "(Fits Aircraft Contour)" },
  { id: "12e", label: "e. Center of Balance", note: "(Marked on Both Sides)" },
  { id: "12f", label: "f. Keys/Combinations", note: "(All Locks)" },
  { id: "12g", label: "g. Shoring", note: "(Floor/Roller Limitations)" },
  { id: "12h", label: "h. Hazardous Materials Preparation/Packaging" },
  { id: "13", label: "13. Vehicles/non-powered equipment", section: true },
  { id: "13a", label: "a. Mechanical Condition", note: "(Engine Runs)" },
  { id: "13b", label: "b. Brakes Operational", note: "(Service/Emergency)" },
  { id: "13c", label: "c. Battery", note: "(Secured, Terminals Protected, No Leaks)" },
  { id: "13d", label: "d. Fuel Tank(s), Level, Caps" },
  { id: "13e", label: "e. Jerricans", note: "(Secure, Fuel Level, Seal)" },
  { id: "13e1", label: "(1) DOT 5L (Metal) MUST BE EMPTY" },
  { id: "13e2", label: "(2) UN Specification (Plastic)" },
  { id: "13f", label: "f. Tiedown Points/Clevises", note: "(Serviceable)" },
  { id: "13g", label: "g. Pintle Hooks", note: "(If Used)" },
  { id: "13h", label: "h. Vehicle Equipment Secured" },
  { id: "13i", label: "i. Tire Pressure" },
  { id: "13j", label: "j. Accompanying Load", note: "(w/in Rated Capacity and Secured)" },
  { id: "13k", label: "k. Lox/Nitrogen Cart", note: "(Vent Kit)" },
  { id: "14", label: "14. Pallets/pallet trains/ISU's", section: true },
  { id: "14a", label: "a. Serviceable", note: "(Pallet and Tiedown Rings)" },
  { id: "14b", label: "b. Correctly Built/Items Secured" },
  { id: "14c", label: "c. Dunnage", note: "(3 Pieces Per Pallet or ISU)" },
  { id: "15", label: "15. Helicopters", note: "(Flyaway)", section: true },
  { id: "15a", label: "a. Fuel Quantity", note: "(As Required)" },
  { id: "15b", label: "b. Configuration", note: "(T.O./Cert Letter)" },
  { id: "15c", label: "c. Battery", note: "(Disconnected, Covered/Taped)" },
  { id: "15d", label: "d. Special Loading Equipment", note: "(Tow bars, etc.)" },
  { id: "15e", label: "e. Accompanying Load", note: "(w/in Rated Capacity and Secured)" },
];

export function Form2133() {
  const { id } = useParams();
  const { getLoadPlan, saveLoadPlan } = useStore();
  const plan = id ? getLoadPlan(id) : undefined;

  if (!plan) {
    return (
      <div className="page-wrap">
        <h1>Load plan not found</h1>
        <Link to="/load-plans">Back to load plans</Link>
      </div>
    );
  }

  if (!plan.missionNumber.trim()) {
    return <Navigate to={`/load-plans/${plan.id}`} replace />;
  }

  return <InspectionForm plan={plan} saveLoadPlan={saveLoadPlan} />;
}

function InspectionForm({
  plan,
  saveLoadPlan,
}: {
  plan: AirliftPacket;
  saveLoadPlan: (plan: AirliftPacket) => void;
}) {
  const form = withInspection(plan.inspection);
  const patch = (partial: Partial<JointInspection>) =>
    saveLoadPlan({ ...plan, inspection: { ...form, ...partial } });
  const updateColumn = (columnId: string, partial: Partial<InspectionColumn>) =>
    patch({
      columns: form.columns.map((column) => (column.id === columnId ? { ...column, ...partial } : column)),
    });
  const setMark = (columnId: string, lineId: string, mark: InspectionMark) => {
    const column = form.columns.find((item) => item.id === columnId);
    if (!column) return;
    updateColumn(columnId, { marks: { ...column.marks, [lineId]: mark } });
  };

  return (
    <div className="page-wrap">
      <p className="page-kicker">DD Form 2133 · Joint Airlift Inspection Record/Checklist</p>
      <h1>
        {plan.missionNumber}{" "}
        <span className={`status-tag ${plan.status === "inspected" ? "status-received" : "status-draft"}`}>
          {plan.status === "inspected" ? "Inspected" : "In progress"}
        </span>
      </h1>
      <PacketNav id={plan.id} />

      <div className="section-card worksheet-sheet sheet-frame worksheet-grid">
        <h2 className="worksheet-banner">
          Joint Airlift Inspection Record/Checklist
          <span className="worksheet-unit worksheet-banner-note">
            (Reference DTR Part III Appendix O For Form Completion)
          </span>
        </h2>
        <div className="worksheet-row cols-3">
          <HeadField label="1. Deploying force" value={form.deployingForce} onChange={(deployingForce) => patch({ deployingForce })} />
          <HeadField label="2. Departure airfield" value={form.departureAirfield} onChange={(departureAirfield) => patch({ departureAirfield })} />
          <HeadField label="3. Date" type="date" value={form.date} onChange={(date) => patch({ date })} />
        </div>
        <div className="worksheet-row cols-4">
          <HeadField label="4. Aircraft type and mission number" value={form.aircraftAndMission} onChange={(aircraftAndMission) => patch({ aircraftAndMission })} />
          <HeadField label="5. Load/chalk no." value={form.loadChalk} onChange={(loadChalk) => patch({ loadChalk })} />
          <HeadField label="6. Start time" type="time" value={form.startTime} onChange={(startTime) => patch({ startTime })} />
          <HeadField label="7. Complete time" type="time" value={form.completeTime} onChange={(completeTime) => patch({ completeTime })} />
        </div>
        <div className="worksheet-row cols-2">
          <HeadField label="8. Mobility force" value={form.mobilityForce} onChange={(mobilityForce) => patch({ mobilityForce })} />
          <div className="worksheet-cell">
            <span className="worksheet-label">9. Chapter 3 movement</span>
            <div className="inspect-choice">
              <div className="usa-radio">
                <input className="usa-radio__input" id="chapter3-yes" type="radio" name="chapter3" checked={form.chapter3 === "yes"} onChange={() => patch({ chapter3: "yes" })} />
                <label className="usa-radio__label" htmlFor="chapter3-yes">Yes</label>
              </div>
              <div className="usa-radio">
                <input className="usa-radio__input" id="chapter3-no" type="radio" name="chapter3" checked={form.chapter3 === "no"} onChange={() => patch({ chapter3: "no" })} />
                <label className="usa-radio__label" htmlFor="chapter3-no">No</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-card worksheet-sheet sheet-frame">
        <div className="inspect-scroll">
          <table className="inspect-table">
            <caption className="usa-sr-only">Joint airlift inspection checklist</caption>
            <thead>
              <tr>
                <th scope="col">Checklist</th>
                {form.columns.map((column, index) => (
                  <th key={column.id} scope="col">
                    <label className="worksheet-label" htmlFor={`${column.id}-identity`}>
                      10. Increment/serial/bumper number and type/TCN
                    </label>
                    <input
                      id={`${column.id}-identity`}
                      className="usa-input"
                      value={column.identity}
                      aria-label={`Increment ${index + 1}`}
                      onChange={(event) => updateColumn(column.id, { identity: event.target.value })}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LINES.map((line) =>
                line.section ? (
                  <tr key={line.id} className="inspect-section">
                    <th scope="row" colSpan={form.columns.length + 1}>
                      {line.label}
                      {line.note ? <span className="worksheet-unit"> {line.note}</span> : null}
                    </th>
                  </tr>
                ) : (
                  <tr key={line.id}>
                    <th scope="row">
                      {line.label}
                      {line.note ? <span className="worksheet-unit"> {line.note}</span> : null}
                    </th>
                    {form.columns.map((column) => (
                      <td key={column.id}>
                        <select
                          className="usa-select"
                          aria-label={`${line.label} for ${column.identity || "this increment"}`}
                          value={column.marks[line.id] ?? ""}
                          onChange={(event) => setMark(column.id, line.id, event.target.value as InspectionMark)}
                        >
                          <option value=""> </option>
                          <option value="sat">Satisfactory</option>
                          <option value="unsat">Unsatisfactory</option>
                          <option value="corrected">Corrected</option>
                          <option value="na">Not applicable</option>
                        </select>
                      </td>
                    ))}
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
        <div className="actions-row">
          <button
            type="button"
            className="usa-button usa-button--outline"
            onClick={() => patch({ columns: [...form.columns, emptyInspectionColumn()] })}
          >
            Add increment
          </button>
          {form.columns.length > 1 ? (
            <button
              type="button"
              className="usa-button usa-button--outline"
              onClick={() => patch({ columns: form.columns.slice(0, -1) })}
            >
              Remove increment
            </button>
          ) : null}
        </div>
      </div>

      <div className="section-card worksheet-sheet sheet-frame">
        <p className="worksheet-prose">
          I certify that all items, including hazards, have been declared, properly prepared, and presented for
          airlift in accordance with all applicable directives.
        </p>
        <div className="cargo-block">
          <div className="cargo-row cargo-row-full">
            <CertField
              id="2133-deploying-rep"
              label="16. Deploying force representative"
              note="(Print Name/Rank/Signature)"
              value={form.deployingRep}
              onChange={(deployingRep) => patch({ deployingRep })}
            />
          </div>
        </div>
        <p className="worksheet-prose">
          I certify the above declared items have been inspected and properly prepared for airlift in accordance
          with all applicable directives.
        </p>
        <div className="cargo-block">
          <div className="cargo-row cargo-row-full">
            <CertField
              id="2133-inspector"
              label="17. Mobility force inspector"
              note="(Print Name/Rank/Signature)"
              value={form.mobilityInspector}
              onChange={(mobilityInspector) => patch({ mobilityInspector })}
            />
          </div>
        </div>
        <div className="cargo-block">
          <div className="cargo-row cargo-row-full">
            <CertField
              id="2133-additional"
              label="18. Additional information"
              value={form.additionalInformation}
              onChange={(additionalInformation) => patch({ additionalInformation })}
              multiline
            />
          </div>
        </div>
      </div>

      <StepContinue id={plan.id} slug="joint-airlift-inspection" />
    </div>
  );
}

function HeadField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  const id = `2133-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div className="worksheet-cell">
      <label className="worksheet-label" htmlFor={id}>
        {label}
      </label>
      <input id={id} className="usa-input" type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

function CertField({
  id,
  label,
  note,
  value,
  onChange,
  multiline = false,
}: {
  id: string;
  label: string;
  note?: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <div className="cargo-field">
      <label className="worksheet-label" htmlFor={id}>
        {label}
        {note ? <span className="worksheet-unit"> {note}</span> : null}
      </label>
      {multiline ? (
        <textarea id={id} className="usa-textarea" rows={4} value={value} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input id={id} className="usa-input" value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </div>
  );
}
