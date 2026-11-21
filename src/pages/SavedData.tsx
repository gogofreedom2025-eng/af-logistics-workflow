import { useEffect, useState } from "react";
import { DB_NAME, RECORD_KEY, STORE, readRecord } from "../store/db";
import type { AirliftPacket } from "../types/loadPlan";

const FORM_FIELD: Record<string, keyof AirliftPacket> = {
  "cargo-manifests": "cargoManifest",
  "joint-airlift-inspection": "inspection",
  "pallet-identifier": "palletIdentifier",
  "dangerous-cargo-load-list": "dangerousCargo",
  "packing-list": "packingList",
  "air-passenger-cargo-request": "airRequest",
  "military-shipment-label": "shipmentLabel",
  "special-services-label": "specialHandling",
  "c17-load-plan": "c17LoadPlan",
  "c130-load-plan": "c130LoadPlan",
};

const OTHER_FORMS: (keyof AirliftPacket)[] = [
  "dangerousCargo",
  "inspection",
  "packingList",
  "cargoManifest",
  "palletIdentifier",
  "airRequest",
  "shipmentLabel",
  "specialHandling",
  "c17LoadPlan",
  "c130LoadPlan",
];

function savedForm(plan: AirliftPacket) {
  const field = FORM_FIELD[plan.savedSlug];
  if (plan.savedAt && field) {
    return {
      id: plan.id,
      savedTitle: plan.savedTitle,
      savedSlug: plan.savedSlug,
      savedAt: plan.savedAt,
      updatedAt: plan.updatedAt,
      [field]: plan[field],
    };
  }
  if (plan.savedAt) {
    const form = { ...plan };
    for (const key of OTHER_FORMS) delete form[key];
    return form;
  }
  return { id: plan.id, savedAt: "", updatedAt: plan.updatedAt };
}

function savedView(record: unknown) {
  if (!record || typeof record !== "object" || !("loadPlans" in record) || !Array.isArray(record.loadPlans)) {
    return record;
  }
  const loadPlans = [...record.loadPlans].sort((a: AirliftPacket, b: AirliftPacket) =>
    (b.savedAt || "").localeCompare(a.savedAt || ""),
  );
  return { loadPlans: loadPlans.map((plan) => savedForm(plan)) };
}

export function SavedData() {
  const [record, setRecord] = useState<unknown>();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    readRecord(RECORD_KEY)
      .then((value) => {
        if (cancelled) return;
        setRecord(value);
        setReady(true);
      })
      .catch(() => {
        if (cancelled) return;
        setRecord(undefined);
        setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="page-wrap">
      <h1>Saved data</h1>
      <p>
        Database <code>{DB_NAME}</code>, store <code>{STORE}</code>, key <code>{RECORD_KEY}</code>. Each saved entry
        is the one form you saved. The other forms on that record are left out.
      </p>
      {!ready ? <p>Loading saved data.</p> : null}
      {ready && record === undefined ? <p>Nothing is stored yet.</p> : null}
      {ready && record !== undefined ? <pre className="saved-record">{JSON.stringify(savedView(record), null, 2)}</pre> : null}
    </div>
  );
}
