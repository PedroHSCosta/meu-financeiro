import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  List,
  Banknote,
  Calendar,
  PieChart,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const links = [
    { to: "/", label: "Inicio", icon: <Home size={18} /> },
    {
      to: "/contas-bancarias",
      label: "Contas Bancárias",
      icon: <Banknote size={18} />,
    },
    { to: "/transacoes", label: "Transações", icon: <List size={18} /> },

    {
      to: "/contas-a-pagar",
      label: "Contas a Pagar",
      icon: <Calendar size={18} />,
    },
    {
      to: "/graficos",
      label: "Gráficos",
      icon: <PieChart size={18} />,
    },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-2 z-50 p-2 bg-yellow-400 text-black rounded"
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen bg-gray-800 text-white w-64 p-4 z-50 transform transition-transform duration-300 ease-in-out 
        ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:flex lg:flex-col`}
      >
        <h1 className="text-xl font-bold mb-6">Meu Financeiro</h1>

        <ul className="space-y-2 flex-grow">
          {links.map(({ to, label, icon }) => (
            <li key={to}>
              <Link
                to={to}
                className={`flex items-center gap-2 p-2 rounded hover:bg-yellow-500 hover:text-black transition-all ${
                  location.pathname === to ? "bg-yellow-400 text-black" : ""
                }`}
                onClick={() => setIsOpen(false)}
              >
                {icon}
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="border-t border-gray-600 pt-4 mt-4">
          {user && (
            <>
              <p className="text-sm text-gray-300 mb-2 truncate">
                {user.email}
              </p>
              <button
                onClick={logout}
                className="flex items-center gap-2 p-2 w-full rounded bg-red-500 text-white hover:bg-red-600 transition-all"
              >
                <LogOut size={18} />
                Sair
              </button>
            </>
          )}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
