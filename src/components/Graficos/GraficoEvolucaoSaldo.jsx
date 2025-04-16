import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { format } from "date-fns";

const GraficoEvolucaoSaldo = () => {
  const { user } = useAuth();
  const [dadosGrafico, setDadosGrafico] = useState([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "transacoes"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const transacoes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        data: doc.data().data.toDate(),
      }));

      const dadosPorMes = {};

      transacoes.forEach((transacao) => {
        const mes = format(transacao.data, "MMM");
        const ano = format(transacao.data, "yyyy");
        const chave = `${mes}/${ano}`;

        if (!dadosPorMes[chave]) {
          dadosPorMes[chave] = 0;
        }

        const valor = Number(transacao.valor || 0);
        dadosPorMes[chave] += transacao.tipo === "Entrada" ? valor : -valor;
      });

      const mesesOrdenados = Object.entries(dadosPorMes)
        .sort((a, b) => {
          const [mesA, anoA] = a[0].split("/");
          const [mesB, anoB] = b[0].split("/");
          return (
            new Date(`${mesA} 1, ${anoA}`) - new Date(`${mesB} 1, ${anoB}`)
          );
        })
        .map(([mes, valor]) => ({ mes, saldo: valor }));

      let saldoAcumulado = 0;
      const dadosComAcumulado = mesesOrdenados.map(({ mes, saldo }) => {
        saldoAcumulado += saldo;
        return { mes, saldo: saldoAcumulado };
      });

      setDadosGrafico(dadosComAcumulado);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold mb-4">Evolução do Saldo</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={dadosGrafico}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="saldo"
            stroke="#3b82f6"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoEvolucaoSaldo;
