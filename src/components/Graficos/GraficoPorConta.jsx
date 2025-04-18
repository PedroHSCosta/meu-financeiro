import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 rounded shadow text-sm border border-gray-300">
        <p className="font-semibold">{label}</p>
        <p>
          Valor:{" "}
          {payload[0].value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>
      </div>
    );
  }

  return null;
};

const GraficoPorConta = () => {
  const { user } = useAuth();
  const [dados, setDados] = useState([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "transacoes"),
      where("userId", "==", user.uid),
      where("tipo", "==", "Saída")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const transacoes = snapshot.docs.map((doc) => doc.data());

      const agrupado = transacoes.reduce((acc, curr) => {
        const contaId = curr.contaId || "desconhecida";
        acc[contaId] = (acc[contaId] || 0) + curr.valor;
        return acc;
      }, {});

      const contasSnap = await getDocs(
        query(
          collection(db, "contasBancarias"),
          where("userId", "==", user.uid)
        )
      );

      const contasMap = {};
      contasSnap.forEach((doc) => {
        contasMap[doc.id] = doc.data().nome;
      });

      const dadosFormatados = Object.entries(agrupado).map(
        ([contaId, valor]) => ({
          nome: contasMap[contaId] || "Conta desconhecida",
          valor,
        })
      );

      setDados(dadosFormatados);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold mb-4">Gastos por Conta</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dados} margin={{ left: 30 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="nome" />
          <YAxis
            tickFormatter={(value) =>
              value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
                maximumFractionDigits: 0,
              })
            }
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="valor" fill="#f59e0b" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoPorConta;
