import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { FormSave } from "../components/FormSave";
import { emptyAirRequestPassenger, formatSavedAt, withAirRequest, withSavedForm } from "../data/loadPlan";
import { useStore } from "../store/Store";
import type {
  AirliftPacket,
  AirRequest,
  AirRequestContact,
  AirRequestLeg,
  AirRequestPassenger,
  AirRequestSigner,
} from "../types/loadPlan";

const PRIORITIES = [
  {
    value: "1" as const,
    title: "Priority 1",
    text: "Direct support of operational forces engaged in combat or contingency peace-keeping operations directed NCA, or for emergency lifesaving purposes.",
  },
  {
    value: "2" as const,
    title: "Priority 2",
    text: '"Required use" travel or compelling operational considerations making commercial transportation unacceptable (within 24 hours). Mission cannot be satisfied by any other mode of travel. Requester should provide a 2-hour window for departure and arrival times to allow consolidation of missions per DoD Directive 4500.43.',
  },
  {
    value: "3" as const,
    title: "Priority 3",
    text: "Official business travel which when consolidated by JOSAC with other travelers, is more cost effective than commercial air travel or official business travel on previously scheduled missions. Requester must provide at least a 2-hour window for departure and arrival times to allow consolidation of missions per DoD Directive 4500.43.",
  },
];

const WHEN_NOTE = "(+/- 2 hrs) Example: 25/1200 DEC 98 (1400)";

export function Form2768() {
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

  return <AirRequestForm plan={plan} saveLoadPlan={saveLoadPlan} />;
}

function AirRequestForm({
  plan,
  saveLoadPlan,
}: {
  plan: AirliftPacket;
  saveLoadPlan: (plan: AirliftPacket) => void;
}) {
  const form = withAirRequest(plan.airRequest);
  const patch = (partial: Partial<AirRequest>) => saveLoadPlan({ ...plan, airRequest: { ...form, ...partial } });
  const patchPassengers = (key: "passengers" | "nonDvPassengers", rows: AirRequestPassenger[]) => patch({ [key]: rows });

  return (
    <div className="page-wrap">
      <p className="page-kicker">DD Form 2768, MAR 1998 · Military Air Passenger/Cargo Request</p>
      <h1>DD Form 2768{plan.savedAt ? ` · ${formatSavedAt(plan.savedAt)}` : ""}</h1>

      <div className="section-card worksheet-sheet sheet-frame worksheet-grid">
        <h2 className="worksheet-banner">
          Military Air Passenger/Cargo Request
          <span className="worksheet-unit worksheet-banner-note">Prescribed by DoDD 4500.56</span>
          <span className="worksheet-unit worksheet-banner-note">Keep this data on file for two years after submission date.</span>
        </h2>

        <div className="worksheet-row">
          <div className="worksheet-cell travel-priority">
            <span className="worksheet-label">1. Select applicable travel statement</span>
            {PRIORITIES.map((choice) => (
              <div className="usa-radio" key={choice.value}>
                <input
                  className="usa-radio__input"
                  id={`2768-priority-${choice.value}`}
                  type="radio"
                  name="2768-priority"
                  checked={form.priority === choice.value}
                  onChange={() => patch({ priority: choice.value })}
                />
                <label className="usa-radio__label" htmlFor={`2768-priority-${choice.value}`}>
                  <strong>{choice.title}:</strong> {choice.text}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-card worksheet-sheet sheet-frame worksheet-grid">
        <SectionTitle>2. Purpose of travel</SectionTitle>
        <div className="worksheet-row cols-quarter">
          <HeadField id="2768-pujc" label="2a. PUJC code" value={form.pujcCode} onChange={(pujcCode) => patch({ pujcCode })} />
          <HeadField
            id="2768-mission"
            label="2b. Complete mission description"
            value={form.missionDescription}
            onChange={(missionDescription) => patch({ missionDescription })}
            multiline
          />
        </div>
        <div className="worksheet-row cols-quarter">
          <HeadField id="2768-pax" label="3. Total number of pax" value={form.totalPax} onChange={(totalPax) => patch({ totalPax })} />
          <HeadField
            id="2768-compelling"
            label="2c. Priority 2 compelling considerations and reason commercial travel unacceptable"
            value={form.compellingConsiderations}
            onChange={(compellingConsiderations) => patch({ compellingConsiderations })}
            multiline
          />
        </div>
      </div>

      <div className="section-card worksheet-sheet sheet-frame worksheet-grid">
        <SectionTitle>4. Senior traveler</SectionTitle>
        <div className="worksheet-row cols-4">
          <HeadField id="2768-senior-name" label="a. Name" note="(Last, First, Middle Initial)" value={form.seniorName} onChange={(seniorName) => patch({ seniorName })} />
          <HeadField id="2768-senior-grade" label="b. Grade/DV code" value={form.seniorGrade} onChange={(seniorGrade) => patch({ seniorGrade })} />
          <HeadField id="2768-senior-title" label="c. Duty title" value={form.seniorDutyTitle} onChange={(seniorDutyTitle) => patch({ seniorDutyTitle })} />
          <HeadField id="2768-senior-branch" label="d. Branch of service" value={form.seniorBranch} onChange={(seniorBranch) => patch({ seniorBranch })} />
        </div>

        <SectionTitle note="(Required only for DV 7 or higher)">5. Additional passengers</SectionTitle>
        <PassengerRows
          rows={form.passengers}
          gradeLabel="b. Grade/DV code"
          onChange={(passengers) => patchPassengers("passengers", passengers)}
          actions={false}
        />
      </div>

      <div className="section-card worksheet-sheet sheet-frame worksheet-grid">
        <SectionTitle>6. Desired flight itinerary</SectionTitle>
        {form.legs.map((leg, index) => (
          <LegRow key={index} index={index} leg={leg} onChange={(next) => patch({ legs: form.legs.map((item, itemIndex) => (itemIndex === index ? next : item)) })} />
        ))}
      </div>

      <div className="section-card worksheet-sheet sheet-frame worksheet-grid">
        <SectionTitle note="(Transportation, additional per diem, lost time, etc.)">7. Cost of commercial travel</SectionTitle>
        <div className="worksheet-row cols-even-5">
          <HeadField id="2768-cost-1" label="a. Leg 1" value={form.costLeg1} onChange={(costLeg1) => patch({ costLeg1 })} />
          <HeadField id="2768-cost-2" label="b. Leg 2" value={form.costLeg2} onChange={(costLeg2) => patch({ costLeg2 })} />
          <HeadField id="2768-cost-3" label="c. Leg 3" value={form.costLeg3} onChange={(costLeg3) => patch({ costLeg3 })} />
          <HeadField id="2768-cost-times" label="d. Times no. of passengers" value={form.costTimesPassengers} onChange={(costTimesPassengers) => patch({ costTimesPassengers })} />
          <HeadField id="2768-cost-total" label="e. Equals total cost" value={form.costTotal} onChange={(costTotal) => patch({ costTotal })} />
        </div>
      </div>

      <div className="section-card worksheet-sheet sheet-frame worksheet-grid">
        <SectionTitle note="(Cargo acceptors and handlers are required at destination airfield.)">8. Cargo transportation</SectionTitle>
        <div className="worksheet-row">
          <HeadField id="2768-cargo" label="a. Cargo description" value={form.cargoDescription} onChange={(cargoDescription) => patch({ cargoDescription })} multiline />
        </div>
        <div className="worksheet-row cols-4">
          <HeadField id="2768-largest" label="b. Largest item dimensions" value={form.largestDimensions} onChange={(largestDimensions) => patch({ largestDimensions })} />
          <HeadField id="2768-heaviest" label="c. Heaviest item dimensions/weight" value={form.heaviestItem} onChange={(heaviestItem) => patch({ heaviestItem })} />
          <HeadField id="2768-weight" label="c. Total weight" value={form.totalWeight} onChange={(totalWeight) => patch({ totalWeight })} />
          <HeadField id="2768-cube" label="d. Total cubic feet" value={form.totalCubicFeet} onChange={(totalCubicFeet) => patch({ totalCubicFeet })} />
        </div>
        <div className="worksheet-row">
          <HeadField
            id="2768-handling"
            label="e. Special handling requirements"
            note="(Explain)"
            value={form.specialHandling}
            onChange={(specialHandling) => patch({ specialHandling })}
            multiline
          />
        </div>
      </div>

      <div className="section-card worksheet-sheet sheet-frame worksheet-grid">
        <SectionTitle note="(Must be able to contact traveler(s) before departure and after arrival in case of delay(s) or cancellation(s))">
          9. Point of contact
        </SectionTitle>
        <ContactRow
          item="(1) Departure"
          idPrefix="2768-depart"
          contact={form.departureContact}
          onChange={(departureContact) => patch({ departureContact })}
        />
        <ContactRow
          item="(2) Arrival"
          idPrefix="2768-arrive"
          contact={form.arrivalContact}
          onChange={(arrivalContact) => patch({ arrivalContact })}
        />
      </div>

      <div className="section-card worksheet-sheet sheet-frame worksheet-grid">
        <SectionTitle>10. Non-DV passengers</SectionTitle>
        <PassengerRows
          rows={form.nonDvPassengers}
          gradeLabel="b. Grade"
          onChange={(nonDvPassengers) => patchPassengers("nonDvPassengers", nonDvPassengers)}
          actions={false}
        />
      </div>

      <div className="section-card worksheet-sheet sheet-frame worksheet-grid">
        <div className="worksheet-row">
          <HeadField id="2768-remarks" label="11. Remarks/additional comments" value={form.remarks} onChange={(remarks) => patch({ remarks })} multiline />
        </div>
      </div>

      <div className="section-card worksheet-sheet sheet-frame worksheet-grid">
        <SignerBlock
          item="12"
          title="Requester"
          signer={form.requester}
          showPlad
          onChange={(requester) => patch({ requester })}
        />
      </div>

      <div className="section-card worksheet-sheet sheet-frame worksheet-grid">
        <SignerBlock
          item="13"
          title="Travel authorizing official"
          note="(As appointed by Service)"
          signer={form.authorizer}
          onChange={(authorizer) => patch({ authorizer })}
        />
      </div>

      <div className="section-card worksheet-sheet sheet-frame worksheet-grid">
        <SignerBlock
          item="14"
          title="Senior traveling passenger"
          note="(Signature may not be delegated)"
          signer={form.seniorPassenger}
          onChange={(seniorPassenger) => patch({ seniorPassenger })}
        />
      </div>

      <FormSave
        onSave={() => saveLoadPlan(withSavedForm({ ...plan, airRequest: form }, "DD Form 2768", "air-passenger-cargo-request"))}
      />
    </div>
  );
}

function SectionTitle({ note, children }: { note?: string; children: ReactNode }) {
  return (
    <div className="worksheet-row">
      <div className="worksheet-cell">
        <span className="worksheet-label">
          {children}
          {note ? <span className="worksheet-unit"> {note}</span> : null}
        </span>
      </div>
    </div>
  );
}

function PassengerRows({
  rows,
  gradeLabel,
  onChange,
  actions = true,
}: {
  rows: AirRequestPassenger[];
  gradeLabel: string;
  onChange: (rows: AirRequestPassenger[]) => void;
  actions?: boolean;
}) {
  const update = (id: string, partial: Partial<AirRequestPassenger>) =>
    onChange(rows.map((row) => (row.id === id ? { ...row, ...partial } : row)));

  return (
    <>
      {rows.map((row) => (
        <div className="worksheet-row cols-4" key={row.id}>
          <HeadField id={`${row.id}-name`} label="a. Name" note="(Last, First, Middle Initial)" value={row.name} onChange={(name) => update(row.id, { name })} />
          <HeadField id={`${row.id}-grade`} label={gradeLabel} value={row.grade} onChange={(grade) => update(row.id, { grade })} />
          <HeadField id={`${row.id}-title`} label="c. Duty title" value={row.dutyTitle} onChange={(dutyTitle) => update(row.id, { dutyTitle })} />
          <HeadField id={`${row.id}-branch`} label="d. Branch of service" value={row.branch} onChange={(branch) => update(row.id, { branch })} />
        </div>
      ))}
      {actions ? (
        <div className="worksheet-row">
          <div className="worksheet-cell actions-row">
            <button type="button" className="usa-button usa-button--outline" onClick={() => onChange([...rows, emptyAirRequestPassenger()])}>
              Add passenger
            </button>
            {rows.length > 1 ? (
              <button type="button" className="usa-button usa-button--outline" onClick={() => onChange(rows.slice(0, -1))}>
                Remove passenger
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}

function LegRow({ index, leg, onChange }: { index: number; leg: AirRequestLeg; onChange: (leg: AirRequestLeg) => void }) {
  const id = `2768-leg-${index + 1}`;
  return (
    <div className="worksheet-row cols-even-5">
      <div className="worksheet-cell">
        <span className="worksheet-label">({index + 1}) Leg {index + 1}</span>
      </div>
      <HeadField id={`${id}-depart`} label="a. Departure ICAO" value={leg.departureIcao} onChange={(departureIcao) => onChange({ ...leg, departureIcao })} />
      <HeadField id={`${id}-depart-when`} label="b. Depart date/time (Z)/mo/yr" note={WHEN_NOTE} value={leg.departWhen} onChange={(departWhen) => onChange({ ...leg, departWhen })} />
      <HeadField id={`${id}-arrive`} label="c. Arrival ICAO" value={leg.arrivalIcao} onChange={(arrivalIcao) => onChange({ ...leg, arrivalIcao })} />
      <HeadField id={`${id}-arrive-when`} label="d. Arrive date/time (Z)/mo/yr" note={WHEN_NOTE} value={leg.arriveWhen} onChange={(arriveWhen) => onChange({ ...leg, arriveWhen })} />
    </div>
  );
}

function ContactRow({
  item,
  idPrefix,
  contact,
  onChange,
}: {
  item: string;
  idPrefix: string;
  contact: AirRequestContact;
  onChange: (contact: AirRequestContact) => void;
}) {
  return (
    <div className="worksheet-row cols-even-5">
      <div className="worksheet-cell">
        <span className="worksheet-label">{item}</span>
      </div>
      <HeadField id={`${idPrefix}-name`} label="a. Name" note="(Last, First, Middle Initial)" value={contact.name} onChange={(name) => onChange({ ...contact, name })} />
      <HeadField id={`${idPrefix}-grade`} label="b. Grade" value={contact.grade} onChange={(grade) => onChange({ ...contact, grade })} />
      <HeadField id={`${idPrefix}-duty`} label="c. Duty phone" note="(DSN/Commercial)" value={contact.dutyPhone} onChange={(dutyPhone) => onChange({ ...contact, dutyPhone })} />
      <HeadField id={`${idPrefix}-after`} label="d. After hours" note="(DSN/Commercial)" value={contact.afterHours} onChange={(afterHours) => onChange({ ...contact, afterHours })} />
    </div>
  );
}

function SignerBlock({
  item,
  title,
  note,
  signer,
  showPlad = false,
  onChange,
}: {
  item: string;
  title: string;
  note?: string;
  signer: AirRequestSigner;
  showPlad?: boolean;
  onChange: (signer: AirRequestSigner) => void;
}) {
  return (
    <>
      <SectionTitle note={note}>
        {item}. {title}
      </SectionTitle>
      <div className="worksheet-row cols-4">
        <HeadField id={`${item}-name`} label="a. Name" note="(Last, First, Middle Initial)" value={signer.name} onChange={(name) => onChange({ ...signer, name })} />
        <HeadField id={`${item}-grade`} label="b. Grade" value={signer.grade} onChange={(grade) => onChange({ ...signer, grade })} />
        <HeadField id={`${item}-title`} label="c. Duty title" value={signer.dutyTitle} onChange={(dutyTitle) => onChange({ ...signer, dutyTitle })} />
        <HeadField id={`${item}-office`} label="d. Office symbol" value={signer.officeSymbol} onChange={(officeSymbol) => onChange({ ...signer, officeSymbol })} />
      </div>
      <div className="worksheet-row cols-3">
        <HeadField id={`${item}-phone`} label="e. Duty telephone" note="(DSN/Commercial)" value={signer.phone} onChange={(phone) => onChange({ ...signer, phone })} />
        <HeadField id={`${item}-signature`} label="f. Signature" value={signer.signature} onChange={(signature) => onChange({ ...signer, signature })} />
        <HeadField id={`${item}-date`} label="g. Date" type="date" value={signer.date} onChange={(date) => onChange({ ...signer, date })} />
      </div>
      {showPlad ? (
        <div className="worksheet-row">
          <HeadField id={`${item}-plad`} label="h. Plain language address (PLAD)" value={signer.plad} onChange={(plad) => onChange({ ...signer, plad })} />
        </div>
      ) : null}
    </>
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
