import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FormBanner } from "../components/FormBanner";
import { FormSave } from "../components/FormSave";
import { FormStepper, StepperFooter } from "../components/FormStepper";
import { PageOfPages } from "../components/PageOfPages";
import { boxIcon, clipboardIcon, signIcon, StepHead } from "../components/StepHead";
import { emptyDangerousCargoRow, withDangerousCargo, withSavedForm } from "../data/loadPlan";
import { useStore } from "../store/Store";
import type { AirliftPacket, DangerousCargo, DangerousCargoCert, DangerousCargoRow } from "../types/loadPlan";

const STEPS = ["Shipment details", "Cargo", "Signature"];

export function Form2776() {
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

  return <DangerousCargoForm plan={plan} saveLoadPlan={saveLoadPlan} />;
}

function DangerousCargoForm({
  plan,
  saveLoadPlan,
}: {
  plan: AirliftPacket;
  saveLoadPlan: (plan: AirliftPacket) => void;
}) {
  const cargo = useMemo(() => withDangerousCargo(plan.dangerousCargo), [plan.dangerousCargo]);
  const patchCargo = (partial: Partial<DangerousCargo>) =>
    saveLoadPlan({ ...plan, dangerousCargo: { ...cargo, ...partial } });
  const updateRow = (rowId: string, partial: Partial<DangerousCargoRow>) =>
    patchCargo({
      rows: cargo.rows.map((row) => (row.id === rowId ? { ...row, ...partial } : row)),
    });
  const patchCert = (key: "declaration" | "packed", partial: Partial<DangerousCargoCert>) =>
    patchCargo({ [key]: { ...cargo[key], ...partial } });
  const [step, setStep] = useState(0);

  return (
    <div className="page-wrap soft-form">
      <FormBanner
        title="Dangerous Cargo Load List"
        form="DD Form 2776"
        note="(Prescribed by DoD Reg. 4500.9-R)"
        savedAt={plan.savedAt}
      />
      <FormStepper steps={STEPS} step={step} onStep={setStep} />

      {step === 0 ? (
      <div className="section-card worksheet-sheet sheet-frame worksheet-grid">
        <StepHead title="Shipment details" text="Enter the agency, vessel, and ports." icon={clipboardIcon} />
        <div className="worksheet-row cols-2">
          <div className="worksheet-cell">
            <span className="worksheet-label">1. Emergency response numbers</span>
            <p className="worksheet-static">DLA - GEN HAZMAT 1-800-851-8061</p>
            <p className="worksheet-static">AOC - AMMO/EXPLOSIVES (703)697-0218/0219</p>
          </div>
          <PageOfPages
            id="2776-page"
            label="2. Page of pages"
            page={cargo.page}
            pages={cargo.pages}
            onChange={(partial) => patchCargo(partial)}
          />
        </div>
        <div className="worksheet-row cols-2">
          <HeadField label="3a. Agency name" value={cargo.agencyName} onChange={(agencyName) => patchCargo({ agencyName })} />
          <HeadField
            label="3b. Agency address"
            note="(include ZIP code)"
            value={cargo.agencyAddress}
            onChange={(agencyAddress) => patchCargo({ agencyAddress })}
            multiline
          />
        </div>
        <div className="worksheet-row cols-4">
          <HeadField label="4a. Vessel name" value={cargo.vesselName} onChange={(vesselName) => patchCargo({ vesselName })} />
          <HeadField label="4b. Vessel number" value={cargo.vesselNumber} onChange={(vesselNumber) => patchCargo({ vesselNumber })} />
          <HeadField label="4c. Vessel registry" value={cargo.registry} onChange={(registry) => patchCargo({ registry })} />
          <HeadField label="4d. Vessel IRCS" value={cargo.ircs} onChange={(ircs) => patchCargo({ ircs })} />
        </div>
        <div className="worksheet-row cols-3">
          <HeadField label="5. Voyage number" value={cargo.voyageNumber} onChange={(voyageNumber) => patchCargo({ voyageNumber })} />
          <HeadField label="6. Van number" value={cargo.vanNumber} onChange={(vanNumber) => patchCargo({ vanNumber })} />
          <HeadField
            label="7. Total net explosive weight: kgs"
            note="(lbs)"
            value={cargo.totalNetExplosiveWeight}
            onChange={(totalNetExplosiveWeight) => patchCargo({ totalNetExplosiveWeight })}
          />
        </div>
        <div className="worksheet-row cols-3">
          <HeadField label="8. Port of entry" value={cargo.portOfEntry} onChange={(portOfEntry) => patchCargo({ portOfEntry })} />
          <HeadField
            label="9. Port of destination"
            value={cargo.portOfDestination}
            onChange={(portOfDestination) => patchCargo({ portOfDestination })}
          />
          <div className="worksheet-cell">
            <span className="worksheet-label">10. Prepared in accordance with</span>
            <div className="usa-checkbox">
              <input
                className="usa-checkbox__input"
                id="prepared-49-cfr"
                type="checkbox"
                checked={cargo.prepared49Cfr}
                onChange={(event) => patchCargo({ prepared49Cfr: event.target.checked })}
              />
              <label className="usa-checkbox__label" htmlFor="prepared-49-cfr">
                49 CFR
              </label>
            </div>
            <div className="usa-checkbox">
              <input
                className="usa-checkbox__input"
                id="prepared-imdg"
                type="checkbox"
                checked={cargo.preparedImdg}
                onChange={(event) => patchCargo({ preparedImdg: event.target.checked })}
              />
              <label className="usa-checkbox__label" htmlFor="prepared-imdg">
                IMDG
              </label>
            </div>
          </div>
        </div>
      </div>
      ) : null}

      {step === 1 ? (
      <div className="section-card worksheet-sheet sheet-frame">
        <StepHead title="Cargo" text="Enter each dangerous cargo line." icon={boxIcon} />
        {cargo.rows.map((row) => (
          <div className="sheet-block" key={row.id}>
            <div className="cargo-row cargo-row-id">
              <CargoField
                id={`${row.id}-tcn`}
                label="11. Transportation control number"
                value={row.tcn}
                onChange={(tcn) => updateRow(row.id, { tcn })}
              />
              <CargoField
                id={`${row.id}-stow`}
                label="12. Stow location"
                value={row.stowLocation}
                onChange={(stowLocation) => updateRow(row.id, { stowLocation })}
              />
              <CargoField
                id={`${row.id}-name`}
                label="13. Proper shipping name"
                note="(RQ, waste, marine pollutant if applicable)"
                value={row.shippingName}
                onChange={(shippingName) => updateRow(row.id, { shippingName })}
              />
            </div>
            <div className="cargo-detail-scroll">
              <div className="cargo-row cargo-row-detail">
                <CargoField id={`${row.id}-class`} label="14. Hazard class" value={row.hazardClass} onChange={(hazardClass) => updateRow(row.id, { hazardClass })} />
                <CargoField id={`${row.id}-un`} label="15. UN number" value={row.unNumber} onChange={(unNumber) => updateRow(row.id, { unNumber })} />
                <CargoField id={`${row.id}-group`} label="16. Packing group" value={row.packingGroup} onChange={(packingGroup) => updateRow(row.id, { packingGroup })} />
                <CargoField id={`${row.id}-pack`} label="17. Type pack" value={row.typePack} onChange={(typePack) => updateRow(row.id, { typePack })} />
                <CargoField id={`${row.id}-pieces`} label="18. Pieces" value={row.pieces} onChange={(pieces) => updateRow(row.id, { pieces })} />
                <CargoField id={`${row.id}-weight`} label="19. Weight: kgs" note="(lbs)" value={row.weight} onChange={(weight) => updateRow(row.id, { weight })} />
                <CargoField id={`${row.id}-cube`} label="20. Cube: m3" note="(ft3)" value={row.cube} onChange={(cube) => updateRow(row.id, { cube })} />
              </div>
            </div>
            <div className="cargo-row cargo-row-notes">
              <CargoField
                id={`${row.id}-new`}
                label="21. Net explosive weight, kgs"
                note="(lbs)"
                value={row.netExplosiveWeight}
                onChange={(netExplosiveWeight) => updateRow(row.id, { netExplosiveWeight })}
              />
              <CargoField
                id={`${row.id}-remarks`}
                label="22. Remarks"
                note="(flash point, Ex number, dangerous when wet, poison inhalation hazard)"
                value={row.remarks}
                onChange={(remarks) => updateRow(row.id, { remarks })}
                multiline
              />
            </div>
          </div>
        ))}
        <div className="actions-row">
          <button type="button" className="usa-button stepper-add" onClick={() => patchCargo({ rows: [...cargo.rows, emptyDangerousCargoRow()] })}>
            Add row
          </button>
          {cargo.rows.length > 1 ? (
            <button type="button" className="usa-button stepper-remove" onClick={() => patchCargo({ rows: cargo.rows.slice(0, -1) })}>
              Remove row
            </button>
          ) : null}
        </div>
      </div>
      ) : null}

      {step === 2 ? (
      <>
      <div className="section-card worksheet-sheet sheet-frame">
        <StepHead title="Signature" text="Certify the consignment and how it was packed." icon={signIcon} />
        <p className="worksheet-prose">
          23. I hereby declare the contents of this consignment are fully and accurately described above by proper shipping name, are classified, packed, marked/labeled, and are in all respects in proper condition for transport by water according to applicable international and national government regulations.
        </p>
        <CertFields item="23" idPrefix="declaration" cert={cargo.declaration} onChange={(partial) => patchCert("declaration", partial)} />
      </div>

      <div className="section-card worksheet-sheet sheet-frame">
        <p className="worksheet-prose">
          24. This is to certify that the cargo inside this unit (Vehicle or Container{" "}
          <input
            className="usa-input inline-blank"
            aria-label="Vehicle or container"
            value={cargo.unitKind}
            onChange={(event) => patchCargo({ unitKind: event.target.value })}
          />
          ) has been properly packed and secured, and that all applicable transport requirements have been met in accordance with the provisions of 12.3.7 (Container) or 17.7.7 (Vehicle), as applicable, of the General Introduction to the IMDG Code.
        </p>
        <CertFields item="24" idPrefix="packed" cert={cargo.packed} onChange={(partial) => patchCert("packed", partial)} />
      </div>
      </>
      ) : null}

      <StepperFooter step={step} count={STEPS.length} onStep={setStep}>
        <FormSave
          className="stepper-save"
          onSave={() =>
            saveLoadPlan(withSavedForm({ ...plan, dangerousCargo: cargo }, "DD Form 2776", "dangerous-cargo-load-list"))
          }
        />
      </StepperFooter>
    </div>
  );
}

function CertFields({
  item,
  idPrefix,
  cert,
  onChange,
}: {
  item: string;
  idPrefix: string;
  cert: DangerousCargoCert;
  onChange: (partial: Partial<DangerousCargoCert>) => void;
}) {
  return (
    <div className="sheet-block">
      <div className="cargo-row cargo-row-cert">
        <CargoField
          id={`${idPrefix}-name`}
          label={`${item}a. Typed name`}
          note="(Last, First, Middle Initial)"
          value={cert.name}
          onChange={(name) => onChange({ name })}
        />
        <CargoField id={`${idPrefix}-title`} label={`${item}b. Title`} value={cert.title} onChange={(title) => onChange({ title })} />
        <CargoField id={`${idPrefix}-signature`} label={`${item}c. Signature`} value={cert.signature} onChange={(signature) => onChange({ signature })} />
        <CargoField id={`${idPrefix}-date`} label={`${item}d. Date`} type="date" value={cert.date} onChange={(date) => onChange({ date })} />
      </div>
      <div className="cargo-row cargo-row-full">
        <CargoField id={`${idPrefix}-remarks`} label={`${item}e. Remarks`} value={cert.remarks} onChange={(remarks) => onChange({ remarks })} multiline />
      </div>
    </div>
  );
}

function CargoField({
  id,
  label,
  note,
  value,
  onChange,
  multiline = false,
  type = "text",
}: {
  id: string;
  label: string;
  note?: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  type?: string;
}) {
  return (
    <div className="cargo-field">
      <label className="worksheet-label" htmlFor={id}>
        {label}
        {note ? <span className="worksheet-unit"> {note}</span> : null}
      </label>
      {multiline ? (
        <textarea id={id} className="usa-textarea" aria-label={note ? `${label} ${note}` : label} value={value} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input id={id} className="usa-input" type={type} aria-label={note ? `${label} ${note}` : label} value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </div>
  );
}

function HeadField({
  label,
  note,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  note?: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  const id = `2776-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div className="worksheet-cell">
      <label className="worksheet-label" htmlFor={id}>
        {label}
        {note ? <span className="worksheet-unit"> {note}</span> : null}
      </label>
      {multiline ? (
        <textarea id={id} className="usa-textarea" rows={3} value={value} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input id={id} className="usa-input" value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </div>
  );
}
