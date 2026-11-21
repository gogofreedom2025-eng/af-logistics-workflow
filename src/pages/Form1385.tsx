import { Link, useParams } from "react-router-dom";
import { FormSave } from "../components/FormSave";
import { emptyCargoManifestRow, formatSavedAt, withCargoManifest, withSavedForm } from "../data/loadPlan";
import { useStore } from "../store/Store";
import type { AirliftPacket, CargoManifest, CargoManifestRow } from "../types/loadPlan";

export function Form1385() {
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

  return <CargoManifestForm plan={plan} saveLoadPlan={saveLoadPlan} />;
}

function CargoManifestForm({
  plan,
  saveLoadPlan,
}: {
  plan: AirliftPacket;
  saveLoadPlan: (plan: AirliftPacket) => void;
}) {
  const manifest = withCargoManifest(plan.cargoManifest);
  const patch = (partial: Partial<CargoManifest>) =>
    saveLoadPlan({ ...plan, cargoManifest: { ...manifest, ...partial } });
  const updateRow = (rowId: string, partial: Partial<CargoManifestRow>) =>
    patch({
      rows: manifest.rows.map((row) => (row.id === rowId ? { ...row, ...partial } : row)),
    });

  return (
    <div className="page-wrap">
      <p className="page-kicker">DD Form 1385, NOV 78 · Cargo Manifest</p>
      <h1>DD Form 1385{plan.savedAt ? ` · ${formatSavedAt(plan.savedAt)}` : ""}</h1>

      <div className="section-card worksheet-sheet sheet-frame worksheet-grid">
        <h2 className="worksheet-banner">
          Cargo Manifest
          <span className="worksheet-unit worksheet-banner-note">Replaces edition of 1 Apr 66 which may be used</span>
        </h2>
        <p className="sheet-band">Air</p>
        <div className="worksheet-row cols-3">
          <HeadField id="1385-carrier" label="Carrier" value={manifest.carrier} onChange={(carrier) => patch({ carrier })} />
          <HeadField id="1385-ac-no" label="A/C no." value={manifest.acNo} onChange={(acNo) => patch({ acNo })} />
          <HeadField id="1385-ac-model" label="A/C model" value={manifest.acModel} onChange={(acModel) => patch({ acModel })} />
        </div>
        <div className="worksheet-row cols-3">
          <HeadField id="1385-dest-code" label="Dest code" value={manifest.destCode} onChange={(destCode) => patch({ destCode })} />
          <HeadField id="1385-air-ref" label="Ref" value={manifest.airRef} onChange={(airRef) => patch({ airRef })} />
          <HeadField id="1385-destination" label="Destination" value={manifest.destination} onChange={(destination) => patch({ destination })} />
        </div>
        <div className="worksheet-row cols-3">
          <HeadField id="1385-mission-no" label="Mission data no." value={manifest.missionNo} onChange={(missionNo) => patch({ missionNo })} />
          <HeadField id="1385-mission-su" label="Mission data SU" value={manifest.missionSu} onChange={(missionSu) => patch({ missionSu })} />
          <HeadField
            id="1385-mission-date"
            label="Mission data date"
            type="date"
            value={manifest.missionDate}
            onChange={(missionDate) => patch({ missionDate })}
          />
        </div>
        <div className="worksheet-row cols-3">
          <HeadField id="1385-alw-wt" label="Alw wt" value={manifest.alwWt} onChange={(alwWt) => patch({ alwWt })} />
          <HeadField id="1385-alw-cu" label="Alw cu" value={manifest.alwCu} onChange={(alwCu) => patch({ alwCu })} />
          <HeadField id="1385-air-page" label="Page no." value={manifest.airPageNo} onChange={(airPageNo) => patch({ airPageNo })} />
        </div>
        <div className="worksheet-row cols-4">
          <HeadField id="1385-sta" label="Manifest ID STA" value={manifest.manifestSta} onChange={(manifestSta) => patch({ manifestSta })} />
          <HeadField id="1385-fy" label="Manifest ID FY" value={manifest.manifestFy} onChange={(manifestFy) => patch({ manifestFy })} />
          <HeadField id="1385-ty" label="Manifest ID TY" value={manifest.manifestTy} onChange={(manifestTy) => patch({ manifestTy })} />
          <HeadField id="1385-manifest-no" label="Manifest ID no." value={manifest.manifestNo} onChange={(manifestNo) => patch({ manifestNo })} />
        </div>
      </div>

      <div className="section-card worksheet-sheet sheet-frame worksheet-grid">
        <p className="sheet-band">Surface</p>
        <div className="worksheet-row cols-4">
          <HeadField id="1385-poe" label="POE" value={manifest.poe} onChange={(poe) => patch({ poe })} />
          <HeadField
            id="1385-sailed"
            label="Date sailed"
            type="date"
            value={manifest.dateSailed}
            onChange={(dateSailed) => patch({ dateSailed })}
          />
          <HeadField
            id="1385-voyage"
            label="Voyage document no."
            value={manifest.voyageDocumentNo}
            onChange={(voyageDocumentNo) => patch({ voyageDocumentNo })}
          />
          <HeadField id="1385-pod" label="POD" value={manifest.pod} onChange={(pod) => patch({ pod })} />
        </div>
        <div className="worksheet-row cols-4">
          <HeadField id="1385-surface-ref" label="Ref" value={manifest.surfaceRef} onChange={(surfaceRef) => patch({ surfaceRef })} />
          <HeadField id="1385-vessel" label="Vessel name" value={manifest.vesselName} onChange={(vesselName) => patch({ vesselName })} />
          <HeadField id="1385-status" label="Status" value={manifest.status} onChange={(status) => patch({ status })} />
          <HeadField id="1385-sust" label="Sust" value={manifest.sust} onChange={(sust) => patch({ sust })} />
        </div>
        <div className="worksheet-row cols-3">
          <HeadField id="1385-truck" label="Truck no." value={manifest.truckNo} onChange={(truckNo) => patch({ truckNo })} />
          <HeadField id="1385-remarks" label="Remarks" value={manifest.remarks} onChange={(remarks) => patch({ remarks })} />
          <HeadField
            id="1385-surface-page"
            label="Page no."
            value={manifest.surfacePageNo}
            onChange={(surfacePageNo) => patch({ surfacePageNo })}
          />
        </div>
      </div>

      <div className="section-card worksheet-sheet sheet-frame">
        {manifest.rows.map((row) => (
          <div className="sheet-block worksheet-grid" key={row.id}>
            <div className="worksheet-row cols-4">
              <LineField id={`${row.id}-doc`} label="Doc ID" value={row.docId} onChange={(docId) => updateRow(row.id, { docId })} />
              <LineField
                id={`${row.id}-vehicle`}
                label="Vehicle trailer or container number"
                value={row.vehicleNumber}
                onChange={(vehicleNumber) => updateRow(row.id, { vehicleNumber })}
              />
              <LineField id={`${row.id}-year`} label="Yr" value={row.year} onChange={(year) => updateRow(row.id, { year })} />
              <LineField id={`${row.id}-make`} label="Make" value={row.make} onChange={(make) => updateRow(row.id, { make })} />
            </div>
            <div className="worksheet-row cols-4">
              <LineField
                id={`${row.id}-container`}
                label="Container number"
                value={row.containerNumber}
                onChange={(containerNumber) => updateRow(row.id, { containerNumber })}
              />
              <LineField
                id={`${row.id}-commodity`}
                label="Commodity description"
                value={row.commodity}
                onChange={(commodity) => updateRow(row.id, { commodity })}
              />
              <LineField id={`${row.id}-com`} label="Com code" value={row.comCode} onChange={(comCode) => updateRow(row.id, { comCode })} />
              <LineField id={`${row.id}-exc`} label="Cargo exc" value={row.cargoExc} onChange={(cargoExc) => updateRow(row.id, { cargoExc })} />
            </div>
            <div className="worksheet-row cols-4">
              <LineField
                id={`${row.id}-voyage`}
                label="Voyage doc no."
                value={row.voyageDocNo}
                onChange={(voyageDocNo) => updateRow(row.id, { voyageDocNo })}
              />
              <LineField id={`${row.id}-airdm`} label="Air DM" value={row.airDm} onChange={(airDm) => updateRow(row.id, { airDm })} />
              <LineField id={`${row.id}-trns`} label="Trns pt" value={row.trnsPt} onChange={(trnsPt) => updateRow(row.id, { trnsPt })} />
              <LineField
                id={`${row.id}-port`}
                label="Port of disch"
                value={row.portOfDisch}
                onChange={(portOfDisch) => updateRow(row.id, { portOfDisch })}
              />
            </div>
            <div className="worksheet-row cols-2">
              <LineField id={`${row.id}-pack`} label="Type pack" value={row.typePack} onChange={(typePack) => updateRow(row.id, { typePack })} />
              <LineField
                id={`${row.id}-tcn`}
                label="Transportation control number"
                value={row.tcn}
                onChange={(tcn) => updateRow(row.id, { tcn })}
              />
            </div>
            <div className="worksheet-row cols-4">
              <LineField id={`${row.id}-consignee`} label="Consignee" value={row.consignee} onChange={(consignee) => updateRow(row.id, { consignee })} />
              <LineField id={`${row.id}-serv`} label="Serv" value={row.serv} onChange={(serv) => updateRow(row.id, { serv })} />
              <LineField
                id={`${row.id}-address`}
                label="Activity address"
                value={row.activityAddress}
                onChange={(activityAddress) => updateRow(row.id, { activityAddress })}
              />
              <LineField id={`${row.id}-priority`} label="Priority" value={row.priority} onChange={(priority) => updateRow(row.id, { priority })} />
            </div>
            <div className="worksheet-row cols-3">
              <LineField id={`${row.id}-name`} label="Name" value={row.name} onChange={(name) => updateRow(row.id, { name })} />
              <LineField
                id={`${row.id}-ammo`}
                label="Ammo lot no./nomen"
                value={row.ammoLot}
                onChange={(ammoLot) => updateRow(row.id, { ammoLot })}
              />
              <LineField
                id={`${row.id}-dimensions`}
                label="Dimensions"
                value={row.dimensions}
                onChange={(dimensions) => updateRow(row.id, { dimensions })}
              />
            </div>
            <div className="worksheet-row cols-4">
              <LineField id={`${row.id}-rdd`} label="RDD" value={row.rdd} onChange={(rdd) => updateRow(row.id, { rdd })} />
              <LineField id={`${row.id}-proj`} label="Proj" value={row.proj} onChange={(proj) => updateRow(row.id, { proj })} />
              <LineField id={`${row.id}-stow`} label="Stow loc" value={row.stowLoc} onChange={(stowLoc) => updateRow(row.id, { stowLoc })} />
              <LineField id={`${row.id}-acct`} label="Trans acct" value={row.transAcct} onChange={(transAcct) => updateRow(row.id, { transAcct })} />
            </div>
            <div className="worksheet-row cols-4">
              <LineField
                id={`${row.id}-id`}
                label="Identification no. or remarks"
                value={row.identification}
                onChange={(identification) => updateRow(row.id, { identification })}
              />
              <LineField id={`${row.id}-pieces`} label="Pieces" value={row.pieces} onChange={(pieces) => updateRow(row.id, { pieces })} />
              <LineField id={`${row.id}-weight`} label="Weight" value={row.weight} onChange={(weight) => updateRow(row.id, { weight })} />
              <LineField id={`${row.id}-cube`} label="Cube" value={row.cube} onChange={(cube) => updateRow(row.id, { cube })} />
            </div>
          </div>
        ))}
        <div className="actions-row">
          <button
            type="button"
            className="usa-button usa-button--outline"
            onClick={() => patch({ rows: [...manifest.rows, emptyCargoManifestRow()] })}
          >
            Add row
          </button>
          {manifest.rows.length > 1 ? (
            <button type="button" className="usa-button usa-button--outline" onClick={() => patch({ rows: manifest.rows.slice(0, -1) })}>
              Remove row
            </button>
          ) : null}
        </div>
      </div>

      <div className="section-card worksheet-sheet sheet-frame worksheet-grid">
        <p className="worksheet-prose">Items have been loaded:</p>
        <p className="worksheet-prose">Items have been received except as circled. Noted on reverse side.</p>
        <div className="worksheet-row cols-3">
          <HeadField id="1385-total-pieces" label="Totals pieces" value={manifest.totalPieces} onChange={(totalPieces) => patch({ totalPieces })} />
          <HeadField id="1385-total-weight" label="Totals weight" value={manifest.totalWeight} onChange={(totalWeight) => patch({ totalWeight })} />
          <HeadField id="1385-total-cube" label="Totals cube" value={manifest.totalCube} onChange={(totalCube) => patch({ totalCube })} />
        </div>
        <div className="worksheet-row cols-4">
          <HeadField
            id="1385-loaded-date"
            label="Date"
            type="date"
            value={manifest.loadedDate}
            onChange={(loadedDate) => patch({ loadedDate })}
          />
          <HeadField
            id="1385-loading-agent"
            label="Signature of loading agent"
            value={manifest.loadingAgent}
            onChange={(loadingAgent) => patch({ loadingAgent })}
          />
          <HeadField
            id="1385-received-date"
            label="Date"
            type="date"
            value={manifest.receivedDate}
            onChange={(receivedDate) => patch({ receivedDate })}
          />
          <HeadField
            id="1385-unloading-agent"
            label="Signature of unloading agent"
            value={manifest.unloadingAgent}
            onChange={(unloadingAgent) => patch({ unloadingAgent })}
          />
        </div>
        <div className="worksheet-row cols-2">
          <HeadField
            id="1385-receiving-date"
            label="Date"
            type="date"
            value={manifest.receivingDate}
            onChange={(receivingDate) => patch({ receivingDate })}
          />
          <HeadField
            id="1385-receiving-agent"
            label="Signature of receiving agent"
            value={manifest.receivingAgent}
            onChange={(receivingAgent) => patch({ receivingAgent })}
          />
        </div>
        <p className="worksheet-prose">Page 1 of 1</p>
      </div>

      <FormSave onSave={() => saveLoadPlan(withSavedForm({ ...plan, cargoManifest: manifest }, "DD Form 1385", "cargo-manifests"))} />
    </div>
  );
}

function HeadField({
  id,
  label,
  value,
  onChange,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div className="worksheet-cell">
      <label className="worksheet-label" htmlFor={id}>
        {label}
      </label>
      <input id={id} className="usa-input" type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

function LineField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="worksheet-cell">
      <label className="worksheet-label" htmlFor={id}>
        {label}
      </label>
      <input id={id} className="usa-input" value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}
