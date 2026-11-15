import menuIcon from "../assets/icon-cardapio.png";
import Navbar from "./Navbar";
import ThemeToggle from "./ThemeToggle";
import "./Header.css";

const Header = ({ isDark, onToggleTheme }) => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-brand">
          <div className="header-icon-wrapper">
            <img src={menuIcon} alt="Ícone de Cardápio" className="header-logo" />
          </div>
          <div className="titulo header-title">FlavorDash</div>
        </div>

        <div className="header-right">
          <p className="header-tagline">Seu guia gastronômico inteligente</p>
          <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
        </div>
      </div>

      <Navbar />
    </header>
  );
};

export default Header;
