import { useEffect, useState } from "react";
import { DB_NAME, RECORD_KEY, STORE, readRecord } from "../store/db";

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
        Database <code>{DB_NAME}</code>, store <code>{STORE}</code>, key <code>{RECORD_KEY}</code>.
      </p>
      {!ready ? <p>Loading saved data.</p> : null}
      {ready && record === undefined ? <p>Nothing is stored yet.</p> : null}
      {ready && record !== undefined ? <pre className="saved-record">{JSON.stringify(record, null, 2)}</pre> : null}
    </div>
  );
}
