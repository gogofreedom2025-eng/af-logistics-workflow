import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FormBanner } from "../components/FormBanner";
import { FormSave } from "../components/FormSave";
import { FormStepper, StepperFooter } from "../components/FormStepper";
import { PageOfPages } from "../components/PageOfPages";
import { boxIcon, listIcon, signIcon, StepHead } from "../components/StepHead";
import { digitsOnly, emptyPackingListRow, packingRowTotal, withPackingList, withSavedForm } from "../data/loadPlan";
import { useStore } from "../store/Store";
import type { AirliftPacket, PackingList, PackingListRow } from "../types/loadPlan";

const STEPS = ["Packing details", "Contents", "Signature"];

export function Form1750() {
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

  return <PackingListForm plan={plan} saveLoadPlan={saveLoadPlan} />;
}

function PackingListForm({
  plan,
  saveLoadPlan,
}: {
  plan: AirliftPacket;
  saveLoadPlan: (plan: AirliftPacket) => void;
}) {
  const list = withPackingList(plan.packingList);
  const [step, setStep] = useState(0);
  const patch = (partial: Partial<PackingList>) => saveLoadPlan({ ...plan, packingList: { ...list, ...partial } });
  const updateRow = (rowId: string, partial: Partial<PackingListRow>) =>
    patch({
      rows: list.rows.map((row) => (row.id === rowId ? { ...row, ...partial } : row)),
    });

  return (
    <div className="page-wrap soft-form">
      <FormBanner title="Packing List" form="DD Form 1750" savedAt={plan.savedAt} />
      <FormStepper steps={STEPS} step={step} onStep={setStep} />

      {step === 0 ? (
      <div className="section-card worksheet-sheet sheet-frame worksheet-grid">
        <StepHead title="Packing details" text="Enter who packed the shipment and items 1 through 4." icon={boxIcon} />
        <div className="worksheet-row cols-4">
          <HeadField label="Packed by" value={list.packedBy} onChange={(packedBy) => patch({ packedBy })} />
          <HeadField label="1. No. boxes" numeric value={list.boxCount} onChange={(boxCount) => patch({ boxCount })} />
          <HeadField label="2a. Requisition no." numeric value={list.requisitionNo} onChange={(requisitionNo) => patch({ requisitionNo })} />
          <HeadField label="2b. Order no." numeric value={list.orderNo} onChange={(orderNo) => patch({ orderNo })} />
        </div>
        <div className="worksheet-row cols-3">
          <HeadField label="3. End item" value={list.endItem} onChange={(endItem) => patch({ endItem })} />
          <HeadField label="4. Date" type="date" value={list.date} onChange={(date) => patch({ date })} />
          <PageOfPages
            id="1750-page"
            label="5. Page of pages"
            page={list.page}
            pages={list.pages}
            onChange={(partial) => patch(partial)}
          />
        </div>
      </div>
      ) : null}

      {step === 1 ? (
      <div className="section-card worksheet-sheet sheet-frame">
        <StepHead title="Contents" text="Enter each box and the quantities required." icon={listIcon} />
        {list.rows.map((row) => (
          <div className="sheet-block" key={row.id}>
            <div className="cargo-row pack-row-item">
              <PackField id={`${row.id}-box`} label="(a) Box no." numeric value={row.boxNo} onChange={(boxNo) => updateRow(row.id, { boxNo })} />
              <PackField
                id={`${row.id}-contents`}
                label="(b) Contents"
                note="(stock number and nomenclature)"
                value={row.contents}
                onChange={(contents) => updateRow(row.id, { contents })}
              />
              <PackField
                id={`${row.id}-unit`}
                label="(c) Unit of issue"
                value={row.unitOfIssue}
                onChange={(unitOfIssue) => updateRow(row.id, { unitOfIssue })}
              />
            </div>
            <div className="pack-qty-label">Quantities required</div>
            <div className="cargo-row pack-row-qty">
              <PackField
                id={`${row.id}-initial`}
                label="(d) Initial operation"
                value={row.initial}
                onChange={(initial) => updateRow(row.id, { initial, total: packingRowTotal(initial, row.spares) })}
              />
              <PackField
                id={`${row.id}-spares`}
                label="(e) Running spares"
                value={row.spares}
                onChange={(spares) => updateRow(row.id, { spares, total: packingRowTotal(row.initial, spares) })}
              />
              <PackField id={`${row.id}-total`} label="(f) Total" value={row.total} readOnly />
            </div>
          </div>
        ))}
        <div className="actions-row">
          <button type="button" className="usa-button stepper-add" onClick={() => patch({ rows: [...list.rows, emptyPackingListRow()] })}>
            Add row
          </button>
          {list.rows.length > 1 ? (
            <button type="button" className="usa-button stepper-remove" onClick={() => patch({ rows: list.rows.slice(0, -1) })}>
              Remove row
            </button>
          ) : null}
        </div>
      </div>
      ) : null}

      {step === 2 ? (
      <div className="section-card worksheet-sheet sheet-frame">
        <StepHead title="Signature" text="Certify the items and sign the packing list." icon={signIcon} />
        <div className="sheet-block">
          <div className="cargo-row pack-row-cert">
            <PackField id="1750-name" label="6. Typed name and title" value={list.typedName} onChange={(typedName) => patch({ typedName })} />
            <PackField id="1750-signature" label="Signature" value={list.signature} onChange={(signature) => patch({ signature })} />
          </div>
        </div>
      </div>
      ) : null}

      <div className="section-card worksheet-sheet sheet-frame">
        <h2 className="worksheet-banner">Notes to consignee</h2>
        <div className="worksheet-prose packing-notes">
          <p>
            The listing shown on the reverse side, together with pertinent notations relative to each item included, is
            furnished for your information and guidance only. In the case of lists covering equipment sets, one copy may
            be retained for reference and used as a supporting document to property books and the other copy retained
            with the equipment as a component parts listing. For the purpose of clarification, explanations of the
            various entries on this Packing List are furnished.
          </p>
          <p>
            <strong>Item 1.</strong> The number of boxes in a set.
          </p>
          <p>
            <strong>Items 2a. &amp; b.</strong> The requisition number appearing on the DD Form 1348-1 or order number
            will be indicated in this entry. The number so referenced should be cited in any correspondence regarding
            this shipment.
          </p>
          <p>
            <strong>Item 3.</strong> The stock number, nomenclature, type number (when available), and the directive
            under which the end item was assembled. Not applicable to shipments consisting only of miscellaneous repair
            parts and accessories for the assembly, set or unit in which case this entry will contain such a notation in
            lieu of the information cited above (See 5.3.1.1).
          </p>
          <p>
            <strong>Item 4.</strong> Date of preparation.
          </p>
          <p>
            <strong>Item 5.</strong> Self-explanatory.
          </p>
          <div className="packing-columns">
          <p>
            <em>Column a.</em> This column will be used when two or more boxes are required for the equipment.
            It will indicate the number of the container in which the items are packed.
          </p>
          <p>
            <em>Column b.</em> This space contains a listing of items contained within the box, which are
            identified by stock number and nomenclature. When an FSN is not applicable, the manufacturer&apos;s code
            (See 5.2.2.10) and part number shall be used.
          </p>
          <p className="packing-note packing-subnote">
            Note: As required, due to out of stock position within the DOD supply system, a component parts shortage
            which will not hinder operational functions may be waived by higher authority and will be so indicated to
            the right of the nomenclature. Waivers noted thereon should be requisitioned through normal supply
            channels.
          </p>
          <p>
            <em>Column c.</em> Self-explanatory.
          </p>
          <p>
            <em>Column d.</em> &quot;Initial Operation&quot; - Items which are required for operation of the
            equipment.
          </p>
          <p>
            <em>Column e.</em> &quot;Running Spares&quot; - Those items shipped concurrently with the equipment
            as spare parts and accessories.
          </p>
          <p className="packing-note packing-subnote">Note: Columns d and e will be used on an optional basis.</p>
          <p>
            <em>Column f.</em> Auto-calculated. The sum of Column d and Column e on the same line.
          </p>
          </div>
          <p>
            <strong>Item 6.</strong> Self-explanatory.
          </p>
        </div>
      </div>

      <StepperFooter step={step} count={STEPS.length} onStep={setStep}>
        <FormSave
          className="stepper-save"
          onSave={() => saveLoadPlan(withSavedForm({ ...plan, packingList: list }, "DD Form 1750", "packing-list"))}
        />
      </StepperFooter>
    </div>
  );
}

function HeadField({
  label,
  value,
  onChange,
  type = "text",
  numeric = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  numeric?: boolean;
}) {
  const id = `1750-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div className="worksheet-cell">
      <label className="worksheet-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="usa-input"
        type={type}
        inputMode={numeric ? "numeric" : undefined}
        pattern={numeric ? "[0-9]*" : undefined}
        value={value}
        onChange={(event) => onChange(numeric ? digitsOnly(event.target.value) : event.target.value)}
      />
    </div>
  );
}

function PackField({
  id,
  label,
  note,
  value,
  onChange,
  readOnly = false,
  numeric = false,
}: {
  id: string;
  label: string;
  note?: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  numeric?: boolean;
}) {
  return (
    <div className={`cargo-field${readOnly ? " pack-total" : ""}`}>
      <label className="worksheet-label" htmlFor={id}>
        {label}
        {note ? <span className="worksheet-unit"> {note}</span> : null}
      </label>
      <input
        id={id}
        className="usa-input"
        aria-label={note ? `${label} ${note}` : label}
        inputMode={numeric ? "numeric" : undefined}
        pattern={numeric ? "[0-9]*" : undefined}
        value={value}
        readOnly={readOnly}
        onChange={readOnly ? undefined : (event) => onChange?.(numeric ? digitsOnly(event.target.value) : event.target.value)}
      />
    </div>
  );
}
