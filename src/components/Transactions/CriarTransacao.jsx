import { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";

function CriarTransacao() {
  const { user } = useAuth();
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("");
  const [contaId, setContaId] = useState("");
  const [contas, setContas] = useState([]);
  const [categoria, setCategoria] = useState("");

  useEffect(() => {
    const fetchContas = async () => {
      if (!user) return;
      const q = query(
        collection(db, "contasBancarias"),
        where("userId", "==", user.uid)
      );
      const snapshot = await getDocs(q);
      const contasData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setContas(contasData);
    };

    fetchContas();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!descricao || !valor || !contaId) {
      alert("Preencha todos os campos.");
      return;
    }

    try {
      const valorNumerico = parseFloat(valor);

      await addDoc(collection(db, "transacoes"), {
        descricao,
        categoria,
        valor: valorNumerico,
        tipo,
        contaId,
        userId: user.uid,
        data: new Date(),
      });

      const contaRef = doc(db, "contasBancarias", contaId);
      const contaAtual = contas.find((conta) => conta.id === contaId);
      const novoSaldo =
        tipo === "Entrada"
          ? contaAtual.saldo + valorNumerico
          : contaAtual.saldo - valorNumerico;

      await updateDoc(contaRef, { saldo: novoSaldo });

      setDescricao("");
      setCategoria("");
      setValor("");
      setTipo("");
      setContaId("");

      alert("Transação adicionada com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar transação:", error);
      alert("Erro ao adicionar transação.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Nova Transação</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nome da transação"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Valor"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="" disabled>
              Selecione uma categoria
            </option>
            <option value="Alimentação">Alimentação</option>
            <option value="Transporte">Transporte</option>
            <option value="Lazer">Lazer</option>
            <option value="Casa">Casa</option>
          </select>

          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="" disabled>
              Selecione o tipo
            </option>
            <option value="Saída">Saída</option>
            <option value="Entrada">Entrada</option>
          </select>
          <select
            value={contaId}
            onChange={(e) => setContaId(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Selecione a conta</option>
            {contas.map((conta) => (
              <option key={conta.id} value={conta.id}>
                {conta.nome} - Saldo: R$ {conta.saldo.toFixed(2)}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded"
          >
            Adicionar Transação
          </button>
        </form>
      </div>

      <div className="flex-1"></div>
    </div>
  );
}

export default CriarTransacao;
