import React from "react";
import GraficoEntradasSaidas from "../components/Graficos/GraficoEntradasSaidas";
import GraficoPorCategoria from "../components/Graficos/GraficoPorCategoria";
import GraficoEvolucaoSaldo from "../components/Graficos/GraficoEvolucaoSaldo";
import GraficoPorConta from "../components/Graficos/GraficoPorConta";

function Graficos() {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Gráficos</h2>
      <GraficoEntradasSaidas />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <GraficoPorCategoria />
        <GraficoPorConta />
      </div>
      <GraficoEvolucaoSaldo />
    </div>
  );
}

export default Graficos;
