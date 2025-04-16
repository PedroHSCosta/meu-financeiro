import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import GraficoEvolucaoSaldo from "../components/Graficos/GraficoEvolucaoSaldo";
import { CardAmount } from "../components/comprovante/CardAmount";

const Dashboard = () => {
  const { user } = useAuth();
  const [saldoTotal, setSaldoTotal] = useState(0);
  const [entradas, setEntradas] = useState(0);
  const [saidas, setSaidas] = useState(0);
  const [totalContasAPagar, setTotalContasAPagar] = useState(0);

  useEffect(() => {
    if (!user) return;

    const contasQuery = query(
      collection(db, "contasBancarias"),
      where("userId", "==", user.uid)
    );

    const unsubscribeContas = onSnapshot(contasQuery, (snapshot) => {
      const total = snapshot.docs.reduce(
        (acc, doc) => acc + doc.data().saldo,
        0
      );
      setSaldoTotal(total);
    });

    const transacoesQuery = query(
      collection(db, "transacoes"),
      where("userId", "==", user.uid)
    );

    const unsubscribeTransacoes = onSnapshot(transacoesQuery, (snapshot) => {
      let totalEntradas = 0;
      let totalSaidas = 0;

      snapshot.docs.forEach((doc) => {
        const t = doc.data();
        if (t.tipo === "Entrada") {
          totalEntradas += t.valor;
        } else if (t.tipo === "Saída") {
          totalSaidas += t.valor;
        }
      });

      setEntradas(totalEntradas);
      setSaidas(totalSaidas);
    });

    const contasAPagarQuery = query(
      collection(db, "contasAPagar"),
      where("userId", "==", user.uid),
      where("pago", "==", false)
    );

    const unsubscribeContasAPagar = onSnapshot(
      contasAPagarQuery,
      (snapshot) => {
        const totalContas = snapshot.docs.reduce(
          (acc, doc) => acc + doc.data().valor,
          0
        );
        setTotalContasAPagar(totalContas);
      }
    );

    return () => {
      unsubscribeContas();
      unsubscribeTransacoes();
      unsubscribeContasAPagar();
    };
  }, [user]);

  return (
    <div className="ml-25 p-6">
      <h1 className="text-3xl font-bold mb-6">Inicio</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <CardAmount
          amount={saldoTotal}
          title={"Saldo total"}
          color={"text-green-600"}
        />

        <CardAmount
          amount={totalContasAPagar}
          title={"Total contas a pagar"}
          color={"text-yellow-600"}
        />

        <CardAmount
          amount={entradas}
          title={"entradas"}
          color={"text-blue-600"}
        />
        <CardAmount amount={saidas} title={"saidas"} color={"text-red-600"} />
      </div>

      <div>
        <GraficoEvolucaoSaldo />
      </div>
    </div>
  );
};

export default Dashboard;
