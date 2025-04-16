import React from "react";
import ListaTransacoes from "../components/Transactions/ListaTransacoes";
import CriarTransacao from "../components/Transactions/CriarTransacao";

const Transactions = () => {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Transações</h2>
      <CriarTransacao />
      <ListaTransacoes />
    </div>
  );
};

export default Transactions;
