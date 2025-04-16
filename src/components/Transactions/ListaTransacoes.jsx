import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { format } from "date-fns";

const ListaTransacoes = () => {
  const { user } = useAuth();
  const [transacoes, setTransacoes] = useState([]);
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth());
  const [termoBusca, setTermoBusca] = useState("");

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "transacoes"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const transacoesComConta = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const contaRef = doc(db, "contasBancarias", data.contaId);
          const contaSnap = await getDoc(contaRef);
          return {
            id: docSnap.id,
            ...data,
            data: data.data?.toDate ? data.data.toDate() : new Date(data.data),
            contaNome: contaSnap.exists()
              ? contaSnap.data().nome
              : "Conta desconhecida",
          };
        })
      );

      setTransacoes(transacoesComConta);
    });

    return () => unsubscribe();
  }, [user]);

  const transacoesFiltradas = transacoes.filter((transacao) => {
    const data = transacao.data;
    const dentroDoMes = data.getMonth() === Number(mesSelecionado);

    const descricaoOuValor =
      transacao.descricao?.toLowerCase().includes(termoBusca.toLowerCase()) ||
      String(transacao.valor).includes(termoBusca);

    return dentroDoMes && descricaoOuValor;
  });

  return (
    <div className="mt-4">
      <h2 className="text-lg font-bold mb-2">Transações</h2>
      <div className="gap-2">
        <select
          className="border p-2 rounded mb-4"
          value={mesSelecionado}
          onChange={(e) => setMesSelecionado(e.target.value)}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i}>
              {new Date(0, i).toLocaleString("pt-BR", { month: "long" })}
            </option>
          ))}
        </select>

        <input
          type={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          placeholder="Pesquisar"
          className="w-60 p-2 border rounded ml-2"
        />
      </div>

      <ul className="space-y-2">
        {transacoesFiltradas.map((t) => (
          <li
            key={t.id}
            className="p-3 bg-white rounded shadow flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{t.descricao}</p>
              <p className="text-sm text-gray-500">
                Conta: {t.contaNome} | Data: {format(t.data, "dd/MM/yyyy")}
              </p>
            </div>
            <span
              className={`font-bold ${
                t.tipo.toLowerCase() === "entrada"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {t.tipo.toLowerCase() === "entrada" ? "+" : "-"} R${" "}
              {parseFloat(t.valor).toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaTransacoes;
