import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Timestamp } from "firebase/firestore";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const entradas = payload.find((item) => item.name === "Entradas");
    const saidas = payload.find((item) => item.name === "Saídas");

    return (
      <div className="bg-white p-2 rounded shadow text-sm border border-gray-300">
        <p className="font-semibold capitalize">{label}</p>
        <p className="text-green-600">
          Entradas:{" "}
          {entradas?.value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>
        <p className="text-red-500">
          Saídas:{" "}
          {saidas?.value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>
      </div>
    );
  }

  return null;
};

const GraficoEntradasSaidas = () => {
  const { user } = useAuth();
  const [dadosGrafico, setDadosGrafico] = useState([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "transacoes"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const transacoes = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          data:
            data.data instanceof Timestamp
              ? data.data.toDate()
              : new Date(data.data),
        };
      });

      const dadosPorMes = {};

      transacoes.forEach((transacao) => {
        const mes = format(transacao.data, "MMM", {
          locale: ptBR,
        }).toLowerCase();

        if (!dadosPorMes[mes]) {
          dadosPorMes[mes] = { mes, entradas: 0, saidas: 0 };
        }

        if (transacao.tipo === "Entrada") {
          dadosPorMes[mes].entradas += transacao.valor;
        } else if (transacao.tipo === "Saída") {
          dadosPorMes[mes].saidas += transacao.valor;
        }
      });

      const mesesOrdem = [
        "jan",
        "fev",
        "mar",
        "abr",
        "mai",
        "jun",
        "jul",
        "ago",
        "set",
        "out",
        "nov",
        "dez",
      ];

      const dadosFinal = mesesOrdem
        .filter((mes) => dadosPorMes[mes])
        .map((mes) => dadosPorMes[mes]);

      setDadosGrafico(dadosFinal);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="w-full h-[400px] bg-white rounded-2xl shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4">Entradas vs Saídas por Mês</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dadosGrafico} margin={{ left: 30 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis
            tickFormatter={(value) =>
              value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })
            }
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="entradas" fill="#4ade80" name="Entradas" />
          <Bar dataKey="saidas" fill="#f87171" name="Saídas" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoEntradasSaidas;
