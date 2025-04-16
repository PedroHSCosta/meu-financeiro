import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-600">Meu Financeiro</h1>
      <ul className="flex gap-4">
        <li>
          <Link to="/" className="text-gray-700 hover:text-blue-600 transition">
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/contas"
            className="text-gray-700 hover:text-blue-600 transition"
          >
            Contas
          </Link>
        </li>
        <li>
          <Link
            to="/gastos"
            className="text-gray-700 hover:text-blue-600 transition"
          >
            Gastos
          </Link>
        </li>
        <li>
          <Link
            to="/grafico"
            className="text-gray-700 hover:text-blue-600 transition"
          >
            Gráficos
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
