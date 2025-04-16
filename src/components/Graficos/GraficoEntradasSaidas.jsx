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

      console.log("Transações em tempo real:", transacoes);

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
        <BarChart data={dadosGrafico}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="entradas" fill="#4ade80" name="Entradas" />
          <Bar dataKey="saidas" fill="#f87171" name="Saídas" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoEntradasSaidas;
