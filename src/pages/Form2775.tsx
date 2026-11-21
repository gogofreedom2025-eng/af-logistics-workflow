import { Link, useParams } from "react-router-dom";
import { FormSave } from "../components/FormSave";
import { formatSavedAt, withPalletIdentifier, withSavedForm } from "../data/loadPlan";
import { useStore } from "../store/Store";
import type { AirliftPacket, PalletIdentifier } from "../types/loadPlan";

export function Form2775() {
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

  return <PalletIdentifierForm plan={plan} saveLoadPlan={saveLoadPlan} />;
}

function PalletIdentifierForm({
  plan,
  saveLoadPlan,
}: {
  plan: AirliftPacket;
  saveLoadPlan: (plan: AirliftPacket) => void;
}) {
  const card = withPalletIdentifier(plan.palletIdentifier);
  const patch = (partial: Partial<PalletIdentifier>) =>
    saveLoadPlan({ ...plan, palletIdentifier: { ...card, ...partial } });

  return (
    <div className="page-wrap">
      <p className="page-kicker">DD Form 2775, SEP 1998 · Pallet Identifier</p>
      <h1>DD Form 2775{plan.savedAt ? ` · ${formatSavedAt(plan.savedAt)}` : ""}</h1>

      <div className="section-card worksheet-sheet sheet-frame worksheet-grid">
        <h2 className="worksheet-banner">
          Pallet Identifier
          <span className="worksheet-unit worksheet-banner-note">Prescribed by DTR 4500.9-R</span>
        </h2>
        <div className="worksheet-row cols-2">
          <HeadField
            id="2775-pallet-id"
            label="1. Pallet identification number"
            value={card.palletId}
            onChange={(palletId) => patch({ palletId })}
          />
          <HeadField
            id="2775-configuration"
            label="2. Aircraft configuration"
            value={card.aircraftConfiguration}
            onChange={(aircraftConfiguration) => patch({ aircraftConfiguration })}
          />
        </div>
        <div className="worksheet-row cols-2">
          <HeadField
            id="2775-origin"
            label="3. Originating station"
            multiline
            value={card.originatingStation}
            onChange={(originatingStation) => patch({ originatingStation })}
          />
          <HeadField
            id="2775-destination"
            label="4. Destination station"
            multiline
            value={card.destinationStation}
            onChange={(destinationStation) => patch({ destinationStation })}
          />
        </div>
        <div className="worksheet-row cols-even-5">
          <HeadField id="2775-net" label="5. Net weight" note="(LBS.)" value={card.netWeight} onChange={(netWeight) => patch({ netWeight })} />
          <HeadField id="2775-straps" label="6a. Straps" value={card.straps} onChange={(straps) => patch({ straps })} />
          <HeadField id="2775-chains" label="6b. Chains" value={card.chains} onChange={(chains) => patch({ chains })} />
          <HeadField id="2775-devices" label="6c. Devices" value={card.devices} onChange={(devices) => patch({ devices })} />
          <HeadField id="2775-nets" label="6d. Net sets" value={card.netSets} onChange={(netSets) => patch({ netSets })} />
        </div>
        <div className="worksheet-row pallet-lower">
          <div className="worksheet-cell pallet-contents">
            <label className="worksheet-label" htmlFor="2775-contents">
              7. Miscellaneous information/This pallet contains
            </label>
            <textarea
              id="2775-contents"
              className="usa-textarea"
              rows={4}
              value={card.contents}
              onChange={(event) => patch({ contents: event.target.value })}
            />
          </div>
          <div className="pallet-side">
            <HeadField id="2775-gross" label="8. Gross weight" note="(LBS.)" value={card.grossWeight} onChange={(grossWeight) => patch({ grossWeight })} />
            <div className="worksheet-cell">
              <span className="worksheet-label">9. Scale weight certification</span>
              <div className="cert-fields">
                <HeadField id="2775-name" label="a. Name" value={card.scaleName} onChange={(scaleName) => patch({ scaleName })} />
                <HeadField id="2775-grade" label="b. Grade" value={card.scaleGrade} onChange={(scaleGrade) => patch({ scaleGrade })} />
                <HeadField
                  id="2775-date"
                  label="c. Date"
                  type="date"
                  value={dateValue(card.scaleDate)}
                  onChange={(scaleDate) => patch({ scaleDate })}
                />
              </div>
            </div>
            <HeadField id="2775-cube" label="10. Cube this pallet" value={card.cube} onChange={(cube) => patch({ cube })} />
          </div>
        </div>
      </div>

      <FormSave
        onSave={() => saveLoadPlan(withSavedForm({ ...plan, palletIdentifier: card }, "DD Form 2775", "pallet-identifier"))}
      />
    </div>
  );
}

function dateValue(value: string) {
  return /^\d{8}$/.test(value) ? `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}` : value;
}

function HeadField({
  id,
  label,
  note,
  value,
  onChange,
  type = "text",
  multiline = false,
}: {
  id: string;
  label: string;
  note?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  multiline?: boolean;
}) {
  return (
    <div className="worksheet-cell">
      <label className="worksheet-label" htmlFor={id}>
        {label}
        {note ? <span className="worksheet-unit"> {note}</span> : null}
      </label>
      {multiline ? (
        <textarea id={id} className="usa-textarea" rows={3} value={value} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input id={id} className="usa-input" type={type} value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </div>
  );
}
