import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";

const cores = [
  "#60a5fa",
  "#fbbf24",
  "#34d399",
  "#f472b6",
  "#a78bfa",
  "#fb7185",
];

// Tooltip customizado em formato brasileiro
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 rounded shadow text-sm border border-gray-300">
        <p className="font-semibold">{payload[0].name}</p>
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

// Label customizado para o gráfico em formato de moeda brasileira
const renderCustomLabel = ({ value }) => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

const GraficoPorCategoria = () => {
  const { user } = useAuth();
  const [dados, setDados] = useState([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "transacoes"),
      where("userId", "==", user.uid),
      where("tipo", "==", "Saída")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const transacoes = snapshot.docs.map((doc) => doc.data());

      const agrupado = transacoes.reduce((acc, curr) => {
        const categoria = curr.categoria || "Outros";
        acc[categoria] = (acc[categoria] || 0) + curr.valor;
        return acc;
      }, {});

      const dadosFormatados = Object.keys(agrupado).map((categoria) => ({
        categoria,
        valor: agrupado[categoria],
      }));

      setDados(dadosFormatados);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold mb-4">Gastos por Categoria</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={dados}
            dataKey="valor"
            nameKey="categoria"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label={renderCustomLabel}
          >
            {dados.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoPorCategoria;
