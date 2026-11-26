import { Link, useParams } from "react-router-dom";
import { FormBanner } from "../components/FormBanner";
import { FormSave } from "../components/FormSave";
import { withSavedForm, withShipmentLabel } from "../data/loadPlan";
import { useStore } from "../store/Store";
import type { AirliftPacket, ShipmentLabel } from "../types/loadPlan";

export function Form1387() {
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

  return <ShipmentLabelForm plan={plan} saveLoadPlan={saveLoadPlan} />;
}

function ShipmentLabelForm({
  plan,
  saveLoadPlan,
}: {
  plan: AirliftPacket;
  saveLoadPlan: (plan: AirliftPacket) => void;
}) {
  const label = withShipmentLabel(plan.shipmentLabel);
  const patch = (partial: Partial<ShipmentLabel>) => saveLoadPlan({ ...plan, shipmentLabel: { ...label, ...partial } });

  return (
    <div className="page-wrap soft-form">
      <FormBanner title="Military Shipment Label" form="DD Form 1387" savedAt={plan.savedAt} />

      <div className="section-card worksheet-sheet sheet-frame worksheet-grid">
        <div className="worksheet-row cols-quarter-end">
          <HeadField id="1387-tcn" label="1. Transportation control number" value={label.tcn} onChange={(tcn) => patch({ tcn })} multiline />
          <HeadField id="1387-postage" label="2. Postage data" value={label.postageData} onChange={(postageData) => patch({ postageData })} multiline />
        </div>
        <div className="worksheet-row cols-quarter-end">
          <HeadField id="1387-from" label="3. From" value={label.from} onChange={(from) => patch({ from })} />
          <HeadField id="1387-service" label="4. Type service" value={label.typeService} onChange={(typeService) => patch({ typeService })} />
        </div>
        <div className="worksheet-row cols-quarter-end">
          <HeadField id="1387-ship" label="5. Ship to/POE" value={label.shipTo} onChange={(shipTo) => patch({ shipTo })} multiline />
          <HeadField id="1387-priority" label="6. Trans priority" value={label.transPriority} onChange={(transPriority) => patch({ transPriority })} />
        </div>
        <div className="worksheet-row cols-quarter-end">
          <HeadField id="1387-pod" label="7. POD" value={label.pod} onChange={(pod) => patch({ pod })} />
          <HeadField id="1387-project" label="8. Project" value={label.project} onChange={(project) => patch({ project })} />
        </div>
        <div className="worksheet-row label-lower">
          <HeadField
            id="1387-consignee"
            className="label-consignee"
            label="9. Ultimate consignee or mark for"
            value={label.ultimateConsignee}
            onChange={(ultimateConsignee) => patch({ ultimateConsignee })}
            multiline
          />
          <div className="label-side">
            <div className="worksheet-row cols-2">
              <HeadField id="1387-weight" label="10. WT." note="(this piece)" value={label.weight} onChange={(weight) => patch({ weight })} />
              <HeadField id="1387-rdd" label="11. RDD" value={label.rdd} onChange={(rdd) => patch({ rdd })} />
            </div>
            <div className="worksheet-row cols-2">
              <HeadField id="1387-cube" label="12. Cube" note="(this piece)" value={label.cube} onChange={(cube) => patch({ cube })} />
              <HeadField id="1387-charges" label="13. Charges" value={label.charges} onChange={(charges) => patch({ charges })} />
            </div>
            <div className="worksheet-row cols-2">
              <HeadField id="1387-date" label="14. Date shipped" type="date" value={label.dateShipped} onChange={(dateShipped) => patch({ dateShipped })} />
              <HeadField id="1387-fms" label="15. FMS case number" value={label.fmsCase} onChange={(fmsCase) => patch({ fmsCase })} />
            </div>
            <div className="worksheet-row">
              <HeadField id="1387-piece" label="16. Piece number" value={label.pieceNumber} onChange={(pieceNumber) => patch({ pieceNumber })} multiline />
            </div>
            <div className="worksheet-row">
              <HeadField id="1387-total" label="17. Total pieces" value={label.totalPieces} onChange={(totalPieces) => patch({ totalPieces })} />
            </div>
          </div>
        </div>
      </div>

      <FormSave
        onSave={() => saveLoadPlan(withSavedForm({ ...plan, shipmentLabel: label }, "DD Form 1387", "military-shipment-label"))}
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
  multiline = false,
  type = "text",
  className = "",
}: {
  id: string;
  label: string;
  note?: string;
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
