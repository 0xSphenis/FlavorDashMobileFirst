import "./App.css";
import { useTheme } from "./hooks/useTheme";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";

const App = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="app">
      <Header isDark={isDark} onToggleTheme={toggleTheme} />
      <Dashboard />
    </div>
  );
};

export default App;
