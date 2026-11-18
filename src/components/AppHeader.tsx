import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import compassLogo from "../assets/compass_logo.jpg";
import { clearDatabase } from "../store/db";

const MENU_ITEMS = [
  {
    id: "clear",
    label: "Clear saved data",
    onSelect: async () => {
      if (!window.confirm("Clear saved data and start fresh?")) return;
      await clearDatabase();
      window.location.assign("/");
    },
  },
];

export function AppHeader() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className="usa-header usa-header--basic site-header">
      <div className="usa-nav-container">
        <div className="usa-navbar" style={{ display: "flex", width: "100%", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div className="usa-logo" id="logo">
            <em className="usa-logo__text">
              <Link to="/" title="Capacity Optimization, Mobility Planning & Allocation Support System">
                <img
                  className="site-logo-img"
                  src={compassLogo}
                  alt="COMPASS, Capacity Optimization, Mobility Planning & Allocation Support System"
                />
              </Link>
            </em>
          </div>
          <div className="header-menu" ref={menuRef}>
            <button
              type="button"
              className="usa-button usa-button--outline header-menu-button"
              aria-expanded={open}
              aria-haspopup="menu"
              onClick={() => setOpen((value) => !value)}
            >
              Menu
            </button>
            {open ? (
              <ul className="header-menu-list" role="menu">
                <li role="none">
                  <NavLink role="menuitem" to="/form-catalog" onClick={() => setOpen(false)}>
                    Form catalog
                  </NavLink>
                </li>
                <li role="none">
                  <NavLink role="menuitem" to="/saved-data" onClick={() => setOpen(false)}>
                    Saved data
                  </NavLink>
                </li>
                {MENU_ITEMS.map((item) => (
                  <li key={item.id} role="none">
                    <button type="button" role="menuitem" onClick={() => void item.onSelect()}>
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
