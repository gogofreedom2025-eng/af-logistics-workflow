import { useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { FormBanner } from "../components/FormBanner";
import { FormSave } from "../components/FormSave";
import { FormStepper, StepperFooter } from "../components/FormStepper";
import { cargoWeight, emptyBellyNarrow, emptyBellyWide, emptyRow, withSavedForm } from "../data/loadPlan";
import { useStore } from "../store/Store";
import type { AirliftPacket, BellyNarrowRow, BellyWideRow, LoadSequenceRow } from "../types/loadPlan";

const STEPS = [
  { short: "Mission Details", title: "Load/Sequence Breakdown Worksheet" },
  { short: "Planned Load Distribution", title: "A. Planned load distribution" },
  { short: "Belly Compartment (Fwd)", title: "B. Belly compartment (747 / DC 10 / MD 11)" },
  { short: "Belly Compartment (Aft)", title: "C. Belly compartment (DC 8 / 707)" },
  { short: "Weight / Moment Data", title: "D. Weight/moment data" },
  { short: "Zero Fuel", title: "E. Zero fuel data" },
  { short: "Load Planned By / Loaded By", title: "Load planned by and Loaded by" },
];

export function Form4080Stepper() {
  const { id } = useParams();
  const { getLoadPlan, saveLoadPlan } = useStore();
  const plan = id ? getLoadPlan(id) : undefined;
  const [step, setStep] = useState(0);

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
      <FormBanner title="Load/Sequence Breakdown Worksheet" form="AF Form 4080" savedAt={plan.savedAt} />
      <FormStepper steps={STEPS.map((item) => item.short)} step={step} onStep={setStep} />

      {step === 0 ? (
        <StepCard title="Mission Details" text="Enter mission and aircraft information." icon={planeIcon}>
          <div className="mission-grid mission-grid-4">
            <HeadField label="Type Aircraft and Number" value={plan.aircraftType} onChange={(aircraftType) => patch({ aircraftType })} />
            <HeadField label="Mission Number" required value={plan.missionNumber} onChange={(missionNumber) => patch({ missionNumber })} />
            <HeadField label="Departure Date" type="date" value={plan.departureDate} onChange={(departureDate) => patch({ departureDate })} />
            <HeadField label="Departure Time" type="time" value={plan.departureTime} onChange={(departureTime) => patch({ departureTime })} />
          </div>
          <div className="mission-grid mission-grid-5">
            <HeadField label="Mission Routing" value={plan.missionRouting} onChange={(missionRouting) => patch({ missionRouting })} />
            <HeadField label="ACL Offered" value={plan.aclOffered} onChange={(aclOffered) => patch({ aclOffered })} />
            <div className="worksheet-cell">
              <span className="worksheet-label">Pallet Positions Available / Used</span>
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
            <HeadField label="Loose Cargo/Mail" value={plan.looseCargoMail} onChange={(looseCargoMail) => patch({ looseCargoMail })} />
            <HeadField label="Configuration" value={plan.configuration} onChange={(configuration) => patch({ configuration })} />
          </div>
        </StepCard>
      ) : null}

      {step === 1 ? (
        <StepCard title="Planned Load Distribution" text="Enter each planned pallet." icon={palletIcon}>
          {plan.rows.map((row) => (
            <div className="mission-row" key={row.id}>
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
        </StepCard>
      ) : null}

      {step === 2 ? (
        <StepCard title="Belly Compartment" text="747, DC 10, and MD 11 positions." icon={bellyIcon}>
          {bellyWide.map((row) => (
            <div className="mission-row" key={row.id}>
              <div className="cargo-row plan-row-belly">
                <PlanField id={`${row.id}-position`} label="Position" value={row.position} onChange={(position) => updateWide(row.id, { position })} />
                <PlanField id={`${row.id}-id`} label="Identification" value={row.identification} onChange={(identification) => updateWide(row.id, { identification })} />
                <PlanField id={`${row.id}-dest`} label="Destination" value={row.destination} onChange={(destination) => updateWide(row.id, { destination })} />
                <PlanField id={`${row.id}-location`} label="Location" value={row.location} onChange={(location) => updateWide(row.id, { location })} />
              </div>
              <div className="cargo-row plan-row-measures">
                <PlanField id={`${row.id}-weight`} label="Gross weight" type="number" value={row.grossWeight ? String(row.grossWeight) : ""} onChange={(value) => updateWide(row.id, { grossWeight: Number(value) || 0 })} />
                <PlanField id={`${row.id}-moment`} label="Moments" type="number" value={row.moment ? String(row.moment) : ""} onChange={(value) => updateWide(row.id, { moment: Number(value) || 0 })} />
                <PlanField id={`${row.id}-special`} label="Special edition" checked={row.specialHandling} onCheck={(specialHandling) => updateWide(row.id, { specialHandling })} check />
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
        </StepCard>
      ) : null}

      {step === 3 ? (
        <StepCard title="Belly Compartment" text="DC 8 and 707 items." icon={bellyIcon}>
          {bellyNarrow.map((row) => (
            <div className="mission-row" key={row.id}>
              <div className="cargo-row plan-row-narrow">
                <PlanField id={`${row.id}-location`} label="Location" value={row.location} onChange={(location) => updateNarrow(row.id, { location })} />
                <PlanField id={`${row.id}-dest`} label="Destination" value={row.destination} onChange={(destination) => updateNarrow(row.id, { destination })} />
                <PlanField id={`${row.id}-weight`} label="Weight" type="number" value={row.weight ? String(row.weight) : ""} onChange={(value) => updateNarrow(row.id, { weight: Number(value) || 0 })} />
                <PlanField id={`${row.id}-cube`} label="Cube" type="number" value={row.cube ? String(row.cube) : ""} onChange={(value) => updateNarrow(row.id, { cube: Number(value) || 0 })} />
                <PlanField id={`${row.id}-special`} label="Special edition" checked={row.specialHandling} onCheck={(specialHandling) => updateNarrow(row.id, { specialHandling })} check />
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
        </StepCard>
      ) : null}

      {step === 4 ? (
        <StepCard title="Weight/Moment Data" text="Enter operating, cargo, and zero fuel weight." icon={weightIcon}>
          <div className="worksheet-grid mission-fields">
          <div className="worksheet-row cols-3">
            <div className="worksheet-cell">
              <span className="worksheet-label">Identification</span>
              <p className="worksheet-static">Operating</p>
            </div>
            <HeadField id="step-operating-weight" label="Weight" type="number" value={plan.operatingWeight ? String(plan.operatingWeight) : ""} onChange={(value) => patch({ operatingWeight: Number(value) || 0 })} />
            <HeadField id="step-operating-moment" label="Moments" type="number" value={plan.operatingMoment ? String(plan.operatingMoment) : ""} onChange={(value) => patch({ operatingMoment: Number(value) || 0 })} />
          </div>
          <div className="worksheet-row cols-3">
            <div className="worksheet-cell">
              <span className="worksheet-label">Identification</span>
              <p className="worksheet-static">Cargo/mail</p>
            </div>
            <HeadField id="step-cargo-weight" label="Weight" type="number" value={plan.cargoMailWeight ? String(plan.cargoMailWeight) : ""} onChange={(value) => patch({ cargoMailWeight: Number(value) || 0 })} />
            <HeadField id="step-cargo-moment" label="Moments" type="number" value={plan.cargoMailMoment ? String(plan.cargoMailMoment) : ""} onChange={(value) => patch({ cargoMailMoment: Number(value) || 0 })} />
          </div>
          <div className="worksheet-row cols-3">
            <div className="worksheet-cell">
              <span className="worksheet-label">Identification</span>
              <p className="worksheet-static">Zero fuel</p>
            </div>
            <HeadField id="step-zero-weight" label="Weight" type="number" value={plan.zeroFuelWeight ? String(plan.zeroFuelWeight) : ""} onChange={(value) => patch({ zeroFuelWeight: Number(value) || 0 })} />
            <HeadField id="step-zero-moment" label="Moments" type="number" value={plan.zeroFuelMoment ? String(plan.zeroFuelMoment) : ""} onChange={(value) => patch({ zeroFuelMoment: Number(value) || 0 })} />
          </div>
          </div>
        </StepCard>
      ) : null}

      {step === 5 ? (
        <StepCard title="Zero Fuel Data" text="Enter percent of M.A.C. and the center of balance." icon={fuelIcon}>
          <div className="worksheet-grid mission-fields">
          <div className="worksheet-row cols-2">
            <HeadField label="Percent of M.A.C." value={plan.percentMac || ""} onChange={(percentMac) => patch({ percentMac })} />
            <HeadField label="Center of balance station" value={plan.centerOfBalanceStation || ""} onChange={(centerOfBalanceStation) => patch({ centerOfBalanceStation })} />
          </div>
          </div>
        </StepCard>
      ) : null}

      {step === 6 ? (
        <StepCard title="Load Planned By / Loaded By" text="Enter who planned the load and who loaded the aircraft." icon={crewIcon}>
          <div className="worksheet-grid mission-fields">
          <div className="worksheet-row cols-2">
            <div className="worksheet-cell">
              <span className="worksheet-label">II. Load planned by</span>
              <label className="worksheet-label" htmlFor="step-planned-by">Name</label>
              <input id="step-planned-by" className="usa-input" value={plan.plannedBy} onChange={(event) => patch({ plannedBy: event.target.value })} />
              <label className="worksheet-label" htmlFor="step-planned-date">Date</label>
              <input id="step-planned-date" className="usa-input" type="date" value={plan.plannedDate} onChange={(event) => patch({ plannedDate: event.target.value })} />
              <fieldset className="usa-fieldset">
                <legend className="usa-legend">Phase II qualified</legend>
                <div className="usa-radio">
                  <input className="usa-radio__input" id="step-phase-yes" type="radio" name="step-phase-ii" checked={plan.phaseIIQualified === "yes"} onChange={() => patch({ phaseIIQualified: "yes" })} />
                  <label className="usa-radio__label" htmlFor="step-phase-yes">Yes</label>
                </div>
                <div className="usa-radio">
                  <input className="usa-radio__input" id="step-phase-no" type="radio" name="step-phase-ii" checked={plan.phaseIIQualified === "no"} onChange={() => patch({ phaseIIQualified: "no" })} />
                  <label className="usa-radio__label" htmlFor="step-phase-no">No</label>
                </div>
              </fieldset>
              <div className="plan-times">
                <div>
                  <label className="worksheet-label" htmlFor="step-time-plan-complete">Time load plan complete</label>
                  <input id="step-time-plan-complete" className="usa-input" type="time" value={plan.timeLoadPlanComplete || ""} onChange={(event) => patch({ timeLoadPlanComplete: event.target.value })} />
                </div>
                <div>
                  <label className="worksheet-label" htmlFor="step-time-info-control">Time received by info control</label>
                  <input id="step-time-info-control" className="usa-input" type="time" value={plan.timeReceivedByInfoControl || ""} onChange={(event) => patch({ timeReceivedByInfoControl: event.target.value })} />
                </div>
              </div>
            </div>
            <div className="worksheet-cell">
              <span className="worksheet-label">III. Loaded by</span>
              <label className="worksheet-label" htmlFor="step-loaded-by">Name</label>
              <input id="step-loaded-by" className="usa-input" value={plan.loadedBy} onChange={(event) => patch({ loadedBy: event.target.value })} />
              <label className="worksheet-label" htmlFor="step-loaded-date">Date</label>
              <input id="step-loaded-date" className="usa-input" type="date" value={plan.loadedDate} onChange={(event) => patch({ loadedDate: event.target.value })} />
              <div className="plan-times">
                <div>
                  <label className="worksheet-label" htmlFor="step-time-upload-start">Start aircraft upload</label>
                  <input id="step-time-upload-start" className="usa-input" type="time" value={plan.startAircraftUpload || ""} onChange={(event) => patch({ startAircraftUpload: event.target.value })} />
                </div>
                <div>
                  <label className="worksheet-label" htmlFor="step-time-upload-complete">Complete aircraft upload</label>
                  <input id="step-time-upload-complete" className="usa-input" type="time" value={plan.completeAircraftUpload || ""} onChange={(event) => patch({ completeAircraftUpload: event.target.value })} />
                </div>
              </div>
            </div>
          </div>
          </div>
        </StepCard>
      ) : null}

      <StepperFooter step={step} count={STEPS.length} onStep={setStep}>
        <FormSave
          className="stepper-save"
          hint="Complete all required fields to submit."
          submitDisabled={!plan.missionNumber.trim()}
          onSave={() => saveLoadPlan(withSavedForm(plan, "AF Form 4080", ""))}
          onSubmit={
            step === STEPS.length - 1
              ? () => saveLoadPlan(withSavedForm(plan, "AF Form 4080", ""))
              : undefined
          }
        />
      </StepperFooter>
    </div>
  );
}

function StepCard({ title, text, icon, children }: { title: string; text: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="mission-card">
      <div className="mission-head">
        <span className="mission-icon" aria-hidden="true">
          {icon}
        </span>
        <div>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

const planeIcon = (
  <svg viewBox="0 0 24 24">
    <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
  </svg>
);

const palletIcon = (
  <svg viewBox="0 0 24 24">
    <path d="M3 6h18v4H3V6zm0 6h8v6H3v-6zm10 0h8v6h-8v-6z" />
  </svg>
);

const bellyIcon = (
  <svg viewBox="0 0 24 24">
    <path d="M4 9h16v9H4V9zm2-4h12v3H6V5z" />
  </svg>
);

const weightIcon = (
  <svg viewBox="0 0 24 24">
    <path d="M12 3a3.5 3.5 0 0 0-3.5 3.5h7A3.5 3.5 0 0 0 12 3zM5 10h14v9H5v-9z" />
  </svg>
);

const fuelIcon = (
  <svg viewBox="0 0 24 24">
    <path d="M12 2c3.8 4.8 6 7.6 6 11a6 6 0 0 1-12 0c0-3.4 2.2-6.2 6-11z" />
  </svg>
);

const crewIcon = (
  <svg viewBox="0 0 24 24">
    <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm-7 8a7 7 0 0 1 14 0H5z" />
  </svg>
);

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
  const fieldId = id ?? `4080s-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
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
    <div className="stepper-row-actions">
      <div className="actions-row">
        <button type="button" className="usa-button stepper-add" onClick={onAdd}>
          {addLabel}
        </button>
        {count > 1 ? (
          <button type="button" className="usa-button stepper-remove" onClick={onRemove}>
            {removeLabel}
          </button>
        ) : null}
      </div>
      {note ? <div className="stepper-note">{note}</div> : null}
    </div>
  );
}
