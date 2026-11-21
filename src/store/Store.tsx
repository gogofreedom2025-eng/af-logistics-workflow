import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import { readRecord, writeRecord } from "./db";
import { createBlankLoadPlan, withLoadPlan, withStoredPlan } from "../data/loadPlan";
import type { AirliftPacket } from "../types/loadPlan";

const STORAGE_KEY = "af-lwe-demo-v1";

interface AppState {
  loadPlans: AirliftPacket[];
}

type Action =
  | { type: "upsertPlan"; plan: AirliftPacket }
  | { type: "hydrate"; state: AppState }
  | { type: "reset" };

interface StoreValue extends AppState {
  createLoadPlan: () => AirliftPacket;
  saveLoadPlan: (plan: AirliftPacket) => void;
  getLoadPlan: (id: string) => AirliftPacket | undefined;
}

const StoreContext = createContext<StoreValue | null>(null);

function seedState(): AppState {
  return { loadPlans: [] };
}

function storedPlans(plans: AirliftPacket[] | undefined): AirliftPacket[] {
  return (plans ?? []).filter((plan) => plan.id !== "lp-c17-sample").map(withStoredPlan);
}

function readLegacyState(): AppState | undefined {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed.loadPlans?.length) return undefined;
    return { loadPlans: parsed.loadPlans };
  } catch {
    return undefined;
  }
}

function reducer(state: AppState, action: Action): AppState {
  if (action.type === "hydrate") return action.state;
  if (action.type === "reset") return seedState();
  if (action.type === "upsertPlan") {
    const plans = state.loadPlans ?? [];
    const exists = plans.some((item) => item.id === action.plan.id);
    return {
      loadPlans: exists
        ? plans.map((item) => (item.id === action.plan.id ? action.plan : item))
        : [action.plan, ...plans],
    };
  }
  return state;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, seedState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stored = await readRecord<AppState>(STORAGE_KEY);
        const legacy = stored ? undefined : readLegacyState();
        const base = stored ?? legacy ?? seedState();
        const next = { loadPlans: storedPlans(base.loadPlans) };
        if (!stored) await writeRecord(STORAGE_KEY, next);
        if (!stored && legacy) localStorage.removeItem(STORAGE_KEY);
        if (cancelled) return;
        dispatch({ type: "hydrate", state: next });
        setReady(true);
      } catch {
        if (cancelled) return;
        const fallback = readLegacyState() ?? seedState();
        dispatch({
          type: "hydrate",
          state: { loadPlans: storedPlans(fallback.loadPlans) },
        });
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    void writeRecord(STORAGE_KEY, state);
  }, [ready, state]);

  const getLoadPlan = useCallback(
    (id: string) => (state.loadPlans ?? []).find((item) => item.id === id),
    [state.loadPlans],
  );

  const saveLoadPlan = useCallback((plan: AirliftPacket) => {
    dispatch({ type: "upsertPlan", plan: withLoadPlan(plan) });
  }, []);

  const createLoadPlan = useCallback(() => {
    const plan = withLoadPlan(createBlankLoadPlan());
    dispatch({ type: "upsertPlan", plan });
    return plan;
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      loadPlans: state.loadPlans ?? [],
      createLoadPlan,
      saveLoadPlan,
      getLoadPlan,
    }),
    [state.loadPlans, createLoadPlan, saveLoadPlan, getLoadPlan],
  );

  if (!ready) return null;
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
