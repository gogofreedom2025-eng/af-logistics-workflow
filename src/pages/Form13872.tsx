import { Link, useParams } from "react-router-dom";
import { FormBanner } from "../components/FormBanner";
import { FormSave } from "../components/FormSave";
import { withSavedForm, withSpecialHandling } from "../data/loadPlan";
import { useStore } from "../store/Store";
import type { AirliftPacket, SpecialHandling } from "../types/loadPlan";

export function Form13872() {
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

  return <SpecialHandlingForm plan={plan} saveLoadPlan={saveLoadPlan} />;
}

function SpecialHandlingForm({
  plan,
  saveLoadPlan,
}: {
  plan: AirliftPacket;
  saveLoadPlan: (plan: AirliftPacket) => void;
}) {
  const form = withSpecialHandling(plan.specialHandling);
  const patch = (partial: Partial<SpecialHandling>) => saveLoadPlan({ ...plan, specialHandling: { ...form, ...partial } });

  return (
    <div className="page-wrap soft-form">
      <FormBanner title="Special Handling Data/Certification" form="DD Form 1387-2" savedAt={plan.savedAt} />

      <div className="section-card worksheet-sheet sheet-frame worksheet-grid">
        <div className="worksheet-row label-top">
          <HeadField
            id="13872-nomenclature"
            className="label-consignee"
            label="1. Item nomenclature"
            value={form.nomenclature}
            onChange={(nomenclature) => patch({ nomenclature })}
            multiline
          />
          <div className="label-side">
            <div className="worksheet-row cols-2">
              <HeadField id="13872-quantity" label="2. Net quantity per package" value={form.netQuantity} onChange={(netQuantity) => patch({ netQuantity })} />
              <HeadField id="13872-tcn" label="3. Transportation control no." value={form.tcn} onChange={(tcn) => patch({ tcn })} />
            </div>
            <div className="worksheet-row cols-2">
              <HeadField id="13872-weight" label="4. Consignment gross weight" value={form.grossWeight} onChange={(grossWeight) => patch({ grossWeight })} />
              <HeadField id="13872-destination" label="5. Destination" value={form.destination} onChange={(destination) => patch({ destination })} />
            </div>
          </div>
        </div>
        <div className="worksheet-row">
          <HeadField
            id="13872-supplemental"
            label="6. Supplemental information"
            value={form.supplemental}
            onChange={(supplemental) => patch({ supplemental })}
            multiline
          />
        </div>
        <p className="worksheet-prose">
          This is to certify that the above named materials are properly classified, described, packaged, marked and labeled, and in proper condition for transportation according to the applicable regulations of the Dept of Transportation. <strong>THIS IS A U.S. DEPARTMENT OF WAR SHIPMENT!</strong> <span className="worksheet-unit">(Complete applicable blocks below)</span>
        </p>
        <div className="worksheet-row after-prose">
          <HeadField id="13872-dtr" label="7. DTR reference" value={form.dtrReference} onChange={(dtrReference) => patch({ dtrReference })} />
        </div>
        <div className="worksheet-row">
          <HeadField
            id="13872-handling"
            label="8. Handling instructions"
            value={form.handlingInstructions}
            onChange={(handlingInstructions) => patch({ handlingInstructions })}
            multiline
          />
        </div>
        <div className="worksheet-row label-lower">
          <HeadField
            id="13872-address"
            className="label-consignee"
            label="9. Address of shipper"
            value={form.shipperAddress}
            onChange={(shipperAddress) => patch({ shipperAddress })}
            multiline
          />
          <div className="label-side">
            <div className="worksheet-row">
              <HeadField id="13872-name" label="10. Typed name" value={form.typedName} onChange={(typedName) => patch({ typedName })} />
            </div>
            <div className="worksheet-row cols-2">
              <HeadField id="13872-signature" label="11. Signature" value={form.signature} onChange={(signature) => patch({ signature })} />
              <HeadField id="13872-date" label="12. Date" type="date" value={form.date} onChange={(date) => patch({ date })} />
            </div>
          </div>
        </div>
      </div>

      <FormSave
        onSave={() => saveLoadPlan(withSavedForm({ ...plan, specialHandling: form }, "DD Form 1387-2", "special-services-label"))}
      />
    </div>
  );
}

function HeadField({
  id,
  label,
  value,
  onChange,
  multiline = false,
  type = "text",
  className = "",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  type?: string;
  className?: string;
}) {
  return (
    <div className={className ? `worksheet-cell ${className}` : "worksheet-cell"}>
      <label className="worksheet-label" htmlFor={id}>
        {label}
      </label>
      {multiline ? (
        <textarea id={id} className="usa-textarea" rows={3} value={value} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input id={id} className="usa-input" type={type} value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </div>
  );
}
