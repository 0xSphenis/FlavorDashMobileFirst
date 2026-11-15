import { useState, useEffect, useRef } from "react";
import "./Navbar.css";

const NAV_ITEMS = [
  { label: "Início", href: "#" },
  {
    label: "Restaurantes",
    href: "#",
    children: [
      { label: "Ver Todos", href: "#" },
      { label: "Mais Bem Avaliados", href: "#" },
      { label: "Abertos Agora", href: "#" },
      { label: "Novidades", href: "#" },
    ],
  },
  {
    label: "Cozinhas",
    href: "#",
    children: [
      { label: "Brasileira", href: "#" },
      { label: "Italiana", href: "#" },
      { label: "Japonesa", href: "#" },
      { label: "Mediterrânea", href: "#" },
      { label: "Asiática", href: "#" },
      { label: "Fast Food", href: "#" },
    ],
  },
  { label: "Favoritos", href: "#" },
  { label: "Sobre", href: "#" },
];

// ─── Dropdown item (menu desktop) ────────────────────────────────────────────
const DropdownItem = ({ item }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Fecha o dropdown ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!item.children) {
    return (
      <li className="nav-item">
        <a href={item.href} className="nav-link">
          {item.label}
        </a>
      </li>
    );
  }

  return (
    <li
      className={`nav-item nav-item--dropdown ${open ? "open" : ""}`}
      ref={ref}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="nav-link nav-link--dropdown"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {item.label}
        <span className={`dropdown-chevron ${open ? "rotated" : ""}`} aria-hidden="true">
          ▾
        </span>
      </button>

      <ul className={`dropdown-menu ${open ? "dropdown-menu--open" : ""}`} role="menu">
        {item.children.map((child) => (
          <li key={child.label} role="menuitem">
            <a href={child.href} className="dropdown-link">
              {child.label}
            </a>
          </li>
        ))}
      </ul>
    </li>
  );
};

// ─── Item no menu mobile (drawer) ────────────────────────────────────────────
const MobileAccordionItem = ({ item }) => {
  const [open, setOpen] = useState(false);

  if (!item.children) {
    return (
      <li className="mobile-nav-item">
        <a href={item.href} className="mobile-nav-link">
          {item.label}
        </a>
      </li>
    );
  }

  return (
    <li className="mobile-nav-item">
      <button
        className="mobile-nav-link mobile-nav-link--accordion"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        {item.label}
        <span className={`mobile-chevron ${open ? "rotated" : ""}`} aria-hidden="true">
          ▾
        </span>
      </button>

      {open && (
        <ul className="mobile-submenu">
          {item.children.map((child) => (
            <li key={child.label}>
              <a href={child.href} className="mobile-submenu-link">
                {child.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

// ─── Navbar principal ─────────────────────────────────────────────────────────
const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Bloqueia scroll do body enquanto o drawer está aberto
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  // Fecha o drawer ao pressionar Esc
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <nav className="navbar" aria-label="Navegação principal">
      <div className="navbar-container">

        {/* ── Desktop: links em linha ─────────────────────────── */}
        <ul className="navbar-desktop" role="menubar">
          {NAV_ITEMS.map((item) => (
            <DropdownItem key={item.label} item={item} />
          ))}
        </ul>

        {/* ── Botão Hambúrguer (mobile) ───────────────────────── */}
        <button
          className={`hamburger ${drawerOpen ? "hamburger--open" : ""}`}
          onClick={() => setDrawerOpen((prev) => !prev)}
          aria-label={drawerOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={drawerOpen}
          aria-controls="mobile-drawer"
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </div>

      {/* ── Overlay escurecido ──────────────────────────────────── */}
      <div
        className={`drawer-overlay ${drawerOpen ? "drawer-overlay--visible" : ""}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* ── Drawer lateral (mobile) ─────────────────────────────── */}
      <div
        id="mobile-drawer"
        className={`mobile-drawer ${drawerOpen ? "mobile-drawer--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
      >
        <div className="mobile-drawer-header">
          <span className="mobile-drawer-title">Menu</span>
          <button
            className="mobile-drawer-close"
            onClick={() => setDrawerOpen(false)}
            aria-label="Fechar menu"
          >
            ✕
          </button>
        </div>

        <ul className="mobile-nav-list">
          {NAV_ITEMS.map((item) => (
            <MobileAccordionItem key={item.label} item={item} />
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
