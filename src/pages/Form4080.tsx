import { Link, useParams } from "react-router-dom";
import type { ReactNode } from "react";
import { FormSave } from "../components/FormSave";
import { cargoWeight, emptyBellyNarrow, emptyBellyWide, emptyRow, formatSavedAt, withSavedForm } from "../data/loadPlan";
import { useStore } from "../store/Store";
import type { AirliftPacket, BellyNarrowRow, BellyWideRow, LoadSequenceRow } from "../types/loadPlan";

export function Form4080() {
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

  const patch = (partial: Partial<AirliftPacket>) => saveLoadPlan({ ...plan, ...partial });
  const updateRow = (rowId: string, partial: Partial<LoadSequenceRow>) =>
    patch({
      rows: plan.rows.map((row) => (row.id === rowId ? { ...row, ...partial } : row)),
    });
  const updateWide = (rowId: string, partial: Partial<BellyWideRow>) =>
    patch({
      bellyWide: (plan.bellyWide ?? []).map((row) => (row.id === rowId ? { ...row, ...partial } : row)),
    });
  const updateNarrow = (rowId: string, partial: Partial<BellyNarrowRow>) =>
    patch({
      bellyNarrow: (plan.bellyNarrow ?? []).map((row) => (row.id === rowId ? { ...row, ...partial } : row)),
    });
  const total = cargoWeight(plan);
  const specialCount = plan.rows.filter((row) => row.specialHandling).length;
  const acl = Number(plan.aclOffered);
  const bellyWide = plan.bellyWide ?? [];
  const bellyNarrow = plan.bellyNarrow ?? [];

  return (
    <div className="page-wrap">
      <p className="page-kicker">AF Form 4080 Â· Load/Sequence Breakdown Worksheet</p>
      <h1>AF Form 4080{plan.savedAt ? ` · ${formatSavedAt(plan.savedAt)}` : ""}</h1>
      <div className="section-card worksheet-sheet sheet-frame worksheet-grid">
        <h2 className="worksheet-banner">Load/Sequence Breakdown Worksheet</h2>
        <div className="worksheet-row cols-4">
          <HeadField label="Type aircraft and number" value={plan.aircraftType} onChange={(aircraftType) => patch({ aircraftType })} />
          <HeadField label="Mission number" required value={plan.missionNumber} onChange={(missionNumber) => patch({ missionNumber })} />
          <HeadField label="Departure date" type="date" value={plan.departureDate} onChange={(departureDate) => patch({ departureDate })} />
          <HeadField label="Departure time" type="time" value={plan.departureTime} onChange={(departureTime) => patch({ departureTime })} />
        </div>
        <div className="worksheet-row cols-5">
          <HeadField label="Mission routing" value={plan.missionRouting} onChange={(missionRouting) => patch({ missionRouting })} />
          <HeadField label="ACL offered" value={plan.aclOffered} onChange={(aclOffered) => patch({ aclOffered })} />
          <div className="worksheet-cell">
            <span className="worksheet-label">
              Pallet positions available/used
            </span>
            <div className="worksheet-split">
              <input
                className="usa-input"
                aria-label="Pallet positions available"
                placeholder="Available"
                value={plan.positionsAvailable}
                onChange={(event) => patch({ positionsAvailable: event.target.value })}
              />
              <input
                className="usa-input"
                aria-label="Pallet positions used"
                placeholder="Used"
                value={plan.positionsUsed}
                onChange={(event) => patch({ positionsUsed: event.target.value })}
              />
            </div>
          </div>
          <HeadField label="Loose cargo/mail" value={plan.looseCargoMail} onChange={(looseCargoMail) => patch({ looseCargoMail })} />
          <HeadField label="Configuration" value={plan.configuration} onChange={(configuration) => patch({ configuration })} />
        </div>
      </div>

      <div className="section-card worksheet-sheet sheet-frame">
        <h2 className="worksheet-banner">A. Planned load distribution</h2>
        {plan.rows.map((row) => (
          <div className="sheet-block" key={row.id}>
            <div className="cargo-row plan-row-load">
              <PlanField id={`${row.id}-station`} label="Station" value={row.station || ""} onChange={(station) => updateRow(row.id, { station })} />
              <PlanField id={`${row.id}-position`} label="Pallet position" value={row.position} onChange={(position) => updateRow(row.id, { position })} />
              <PlanField id={`${row.id}-id`} label="Identification" value={row.identification} onChange={(identification) => updateRow(row.id, { identification })} />
              <PlanField id={`${row.id}-dest`} label="Destination" value={row.destination} onChange={(destination) => updateRow(row.id, { destination })} />
              <PlanField id={`${row.id}-location`} label="Location" value={row.location || ""} onChange={(location) => updateRow(row.id, { location })} />
            </div>
            <div className="cargo-row plan-row-measures">
              <PlanField id={`${row.id}-weight`} label="Gross weight" type="number" value={row.grossWeight ? String(row.grossWeight) : ""} onChange={(value) => updateRow(row.id, { grossWeight: Number(value) || 0 })} />
              <PlanField id={`${row.id}-moment`} label="Moments" type="number" value={row.moment ? String(row.moment) : ""} onChange={(value) => updateRow(row.id, { moment: Number(value) || 0 })} />
              <PlanField id={`${row.id}-special`} label="Special handling" checked={row.specialHandling} onCheck={(specialHandling) => updateRow(row.id, { specialHandling })} check />
            </div>
          </div>
        ))}
        <RowActions
          addLabel="Add pallet"
          removeLabel="Remove pallet"
          count={plan.rows.length}
          onAdd={() => patch({ rows: [...plan.rows, emptyRow()] })}
          onRemove={() => patch({ rows: plan.rows.slice(0, -1) })}
          note={
            <>
              <span>
                Cargo weight <strong>{total.toLocaleString("en-US")} lb</strong>
                {acl > 0 ? ` of ${acl.toLocaleString("en-US")} lb ACL` : ""}
              </span>
              <span>
                Special handling totals <strong>{specialCount}</strong>
              </span>
            </>
          }
        />
      </div>

      <div className="section-card worksheet-sheet sheet-frame">
        <h2 className="worksheet-banner">B. Belly compartment (747 / DC 10 / MD 11)</h2>
        {bellyWide.map((row) => (
          <div className="sheet-block" key={row.id}>
            <div className="cargo-row plan-row-belly">
              <PlanField id={`${row.id}-position`} label="Position" value={row.position} onChange={(position) => updateWide(row.id, { position })} />
              <PlanField id={`${row.id}-id`} label="Identification" value={row.identification} onChange={(identification) => updateWide(row.id, { identification })} />
              <PlanField id={`${row.id}-dest`} label="Destination" value={row.destination} onChange={(destination) => updateWide(row.id, { destination })} />
              <PlanField id={`${row.id}-location`} label="Location" value={row.location} onChange={(location) => updateWide(row.id, { location })} />
            </div>
            <div className="cargo-row plan-row-measures">
              <PlanField id={`${row.id}-weight`} label="Gross weight" type="number" value={row.grossWeight ? String(row.grossWeight) : ""} onChange={(value) => updateWide(row.id, { grossWeight: Number(value) || 0 })} />
              <PlanField id={`${row.id}-moment`} label="Moments" type="number" value={row.moment ? String(row.moment) : ""} onChange={(value) => updateWide(row.id, { moment: Number(value) || 0 })} />
              <PlanField id={`${row.id}-special`} label="Special handling" checked={row.specialHandling} onCheck={(specialHandling) => updateWide(row.id, { specialHandling })} check />
            </div>
          </div>
        ))}
        <RowActions
          addLabel="Add belly position"
          removeLabel="Remove belly position"
          count={bellyWide.length}
          onAdd={() => patch({ bellyWide: [...bellyWide, emptyBellyWide()] })}
          onRemove={() => patch({ bellyWide: bellyWide.slice(0, -1) })}
        />
      </div>

      <div className="section-card worksheet-sheet sheet-frame">
        <h2 className="worksheet-banner">C. Belly compartment (DC 8 / 707)</h2>
        {bellyNarrow.map((row) => (
          <div className="sheet-block" key={row.id}>
            <div className="cargo-row plan-row-narrow">
              <PlanField id={`${row.id}-location`} label="Location" value={row.location} onChange={(location) => updateNarrow(row.id, { location })} />
              <PlanField id={`${row.id}-dest`} label="Destination" value={row.destination} onChange={(destination) => updateNarrow(row.id, { destination })} />
              <PlanField id={`${row.id}-weight`} label="Weight" type="number" value={row.weight ? String(row.weight) : ""} onChange={(value) => updateNarrow(row.id, { weight: Number(value) || 0 })} />
              <PlanField id={`${row.id}-cube`} label="Cube" type="number" value={row.cube ? String(row.cube) : ""} onChange={(value) => updateNarrow(row.id, { cube: Number(value) || 0 })} />
              <PlanField id={`${row.id}-special`} label="Special handling" checked={row.specialHandling} onCheck={(specialHandling) => updateNarrow(row.id, { specialHandling })} check />
            </div>
          </div>
        ))}
        <RowActions
          addLabel="Add belly item"
          removeLabel="Remove belly item"
          count={bellyNarrow.length}
          onAdd={() => patch({ bellyNarrow: [...bellyNarrow, emptyBellyNarrow()] })}
          onRemove={() => patch({ bellyNarrow: bellyNarrow.slice(0, -1) })}
        />
      </div>

      <div className="section-card worksheet-sheet sheet-frame worksheet-grid">
        <h2 className="worksheet-banner">D. Weight/moment data</h2>
        <div className="worksheet-row cols-3">
          <div className="worksheet-cell">
            <span className="worksheet-label">Identification</span>
            <p className="worksheet-static">Operating</p>
          </div>
          <HeadField id="4080-operating-weight" label="Weight" type="number" value={plan.operatingWeight ? String(plan.operatingWeight) : ""} onChange={(value) => patch({ operatingWeight: Number(value) || 0 })} />
          <HeadField id="4080-operating-moment" label="Moments" type="number" value={plan.operatingMoment ? String(plan.operatingMoment) : ""} onChange={(value) => patch({ operatingMoment: Number(value) || 0 })} />
        </div>
        <div className="worksheet-row cols-3">
          <div className="worksheet-cell">
            <span className="worksheet-label">Identification</span>
            <p className="worksheet-static">Cargo/mail</p>
          </div>
          <HeadField id="4080-cargo-weight" label="Weight" type="number" value={plan.cargoMailWeight ? String(plan.cargoMailWeight) : ""} onChange={(value) => patch({ cargoMailWeight: Number(value) || 0 })} />
          <HeadField id="4080-cargo-moment" label="Moments" type="number" value={plan.cargoMailMoment ? String(plan.cargoMailMoment) : ""} onChange={(value) => patch({ cargoMailMoment: Number(value) || 0 })} />
        </div>
        <div className="worksheet-row cols-3">
          <div className="worksheet-cell">
            <span className="worksheet-label">Identification</span>
            <p className="worksheet-static">Zero fuel</p>
          </div>
          <HeadField id="4080-zero-weight" label="Weight" type="number" value={plan.zeroFuelWeight ? String(plan.zeroFuelWeight) : ""} onChange={(value) => patch({ zeroFuelWeight: Number(value) || 0 })} />
          <HeadField id="4080-zero-moment" label="Moments" type="number" value={plan.zeroFuelMoment ? String(plan.zeroFuelMoment) : ""} onChange={(value) => patch({ zeroFuelMoment: Number(value) || 0 })} />
        </div>
      </div>

      <div className="section-card worksheet-sheet sheet-frame worksheet-grid">
        <h2 className="worksheet-banner">E. Zero fuel data</h2>
        <div className="worksheet-row cols-2">
          <HeadField label="Percent of M.A.C." value={plan.percentMac || ""} onChange={(percentMac) => patch({ percentMac })} />
          <HeadField label="Center of balance station" value={plan.centerOfBalanceStation || ""} onChange={(centerOfBalanceStation) => patch({ centerOfBalanceStation })} />
        </div>
      </div>

      <div className="section-card worksheet-sheet sheet-frame worksheet-grid">
        <div className="worksheet-row cols-2">
          <div className="worksheet-cell">
            <span className="worksheet-label">II. Load planned by</span>
            <label className="worksheet-label" htmlFor="planned-by">Name</label>
            <input id="planned-by" className="usa-input" value={plan.plannedBy} onChange={(event) => patch({ plannedBy: event.target.value })} />
            <label className="worksheet-label" htmlFor="planned-date">Date</label>
            <input id="planned-date" className="usa-input" type="date" value={plan.plannedDate} onChange={(event) => patch({ plannedDate: event.target.value })} />
            <fieldset className="usa-fieldset">
              <legend className="usa-legend">Phase II qualified</legend>
              <div className="usa-radio">
                <input className="usa-radio__input" id="phase-yes" type="radio" name="phase-ii" checked={plan.phaseIIQualified === "yes"} onChange={() => patch({ phaseIIQualified: "yes" })} />
                <label className="usa-radio__label" htmlFor="phase-yes">Yes</label>
              </div>
              <div className="usa-radio">
                <input className="usa-radio__input" id="phase-no" type="radio" name="phase-ii" checked={plan.phaseIIQualified === "no"} onChange={() => patch({ phaseIIQualified: "no" })} />
                <label className="usa-radio__label" htmlFor="phase-no">No</label>
              </div>
            </fieldset>
            <div className="plan-times">
              <div>
                <label className="worksheet-label" htmlFor="time-plan-complete">Time load plan complete</label>
                <input id="time-plan-complete" className="usa-input" type="time" value={plan.timeLoadPlanComplete || ""} onChange={(event) => patch({ timeLoadPlanComplete: event.target.value })} />
              </div>
              <div>
                <label className="worksheet-label" htmlFor="time-info-control">Time received by info control</label>
                <input id="time-info-control" className="usa-input" type="time" value={plan.timeReceivedByInfoControl || ""} onChange={(event) => patch({ timeReceivedByInfoControl: event.target.value })} />
              </div>
            </div>
          </div>
          <div className="worksheet-cell">
            <span className="worksheet-label">III. Loaded by</span>
            <label className="worksheet-label" htmlFor="loaded-by">Name</label>
            <input id="loaded-by" className="usa-input" value={plan.loadedBy} onChange={(event) => patch({ loadedBy: event.target.value })} />
            <label className="worksheet-label" htmlFor="loaded-date">Date</label>
            <input id="loaded-date" className="usa-input" type="date" value={plan.loadedDate} onChange={(event) => patch({ loadedDate: event.target.value })} />
            <div className="plan-times">
              <div>
                <label className="worksheet-label" htmlFor="time-upload-start">Start aircraft upload</label>
                <input id="time-upload-start" className="usa-input" type="time" value={plan.startAircraftUpload || ""} onChange={(event) => patch({ startAircraftUpload: event.target.value })} />
              </div>
              <div>
                <label className="worksheet-label" htmlFor="time-upload-complete">Complete aircraft upload</label>
                <input id="time-upload-complete" className="usa-input" type="time" value={plan.completeAircraftUpload || ""} onChange={(event) => patch({ completeAircraftUpload: event.target.value })} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <FormSave
        disabled={!plan.missionNumber.trim()}
        hint="Complete all required fields to save."
        onSave={() => saveLoadPlan(withSavedForm(plan, "AF Form 4080", ""))}
      />
    </div>
  );
}

function HeadField({
  id,
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  const fieldId = id ?? `4080-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div className="worksheet-cell">
      <label className="worksheet-label" htmlFor={fieldId}>
        {label}
        {required ? (
          <span className="required-mark" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      <input
        id={fieldId}
        className="usa-input"
        type={type}
        min={type === "number" ? 0 : undefined}
        required={required}
        aria-required={required || undefined}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function PlanField({
  id,
  label,
  value = "",
  onChange,
  onCheck,
  type = "text",
  check = false,
  checked = false,
}: {
  id: string;
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  onCheck?: (checked: boolean) => void;
  type?: string;
  check?: boolean;
  checked?: boolean;
}) {
  return (
    <div className="cargo-field">
      <label className="worksheet-label" htmlFor={id}>
        {label}
      </label>
      {check ? (
        <input id={id} type="checkbox" checked={checked} onChange={(event) => onCheck?.(event.target.checked)} />
      ) : (
        <input
          id={id}
          className="usa-input"
          type={type}
          min={type === "number" ? 0 : undefined}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
        />
      )}
    </div>
  );
}

function RowActions({
  addLabel,
  removeLabel,
  count,
  onAdd,
  onRemove,
  note,
}: {
  addLabel: string;
  removeLabel: string;
  count: number;
  onAdd: () => void;
  onRemove: () => void;
  note?: ReactNode;
}) {
  return (
    <div className="actions-row">
      <button type="button" className="usa-button usa-button--outline" onClick={onAdd}>
        {addLabel}
      </button>
      {count > 1 ? (
        <button type="button" className="usa-button usa-button--outline" onClick={onRemove}>
          {removeLabel}
        </button>
      ) : null}
      {note}
    </div>
  );
}
