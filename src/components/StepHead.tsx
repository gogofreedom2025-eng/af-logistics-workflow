import type { ReactNode } from "react";

export function StepHead({ title, text, icon }: { title: string; text: string; icon: ReactNode }) {
  return (
    <div className="mission-head packing-step-head">
      <span className="mission-icon" aria-hidden="true">
        {icon}
      </span>
      <div>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
    </div>
  );
}

export const planeIcon = (
  <svg viewBox="0 0 24 24">
    <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
  </svg>
);

export const boxIcon = (
  <svg viewBox="0 0 24 24">
    <path d="M4 8h16v11H4V8zm1.5-3h13L21 8H3l2.5-3z" />
  </svg>
);

export const listIcon = (
  <svg viewBox="0 0 24 24">
    <path d="M4 6h2.2v2.2H4V6zm4 0H20v2.2H8V6zM4 11h2.2v2.2H4V11zm4 0H20v2.2H8V11zM4 16h2.2v2.2H4V16zm4 0H20v2.2H8V16z" />
  </svg>
);

export const palletIcon = (
  <svg viewBox="0 0 24 24">
    <path d="M3 6h18v4H3V6zm0 6h8v6H3v-6zm10 0h8v6h-8v-6z" />
  </svg>
);

export const weightIcon = (
  <svg viewBox="0 0 24 24">
    <path d="M12 3a3.5 3.5 0 0 0-3.5 3.5h7A3.5 3.5 0 0 0 12 3zM5 10h14v9H5v-9z" />
  </svg>
);

export const clipboardIcon = (
  <svg viewBox="0 0 24 24">
    <path d="M8 3h8v3H8V3zM6 5H4v16h16V5h-2v2H6V5z" />
  </svg>
);

export const shipIcon = (
  <svg viewBox="0 0 24 24">
    <path d="M4 14.5 6.2 8h11.6L20 14.5H4zM6 16.5h12v2H6v-2zM9 5h6v2H9V5z" />
  </svg>
);

export const signIcon = (
  <svg viewBox="0 0 24 24">
    <path d="M3 17.25V21h3.75L18.8 8.95l-3.75-3.75L3 17.25zM20.7 7.05a1 1 0 0 0 0-1.4l-2.35-2.35a1 1 0 0 0-1.4 0l-1.55 1.55 3.75 3.75 1.55-1.55z" />
  </svg>
);
