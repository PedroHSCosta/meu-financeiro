import { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";

export default function ContasAPagarForm() {
  const { user } = useAuth();
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [dataVencimento, setDataVencimento] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      console.error("Usuário não autenticado");
      return;
    }

    if (!descricao || !valor || !dataVencimento) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const [ano, mes, dia] = dataVencimento.split("-").map(Number);
      const dataVenc = new Date(ano, mes - 1, dia, 12);

      await addDoc(collection(db, "contasAPagar"), {
        userId: user.uid,
        descricao,
        categoria,
        valor: parseFloat(valor),
        dataVencimento: dataVenc,
        pago: false,
        criadoEm: new Date(),
      });

      setDescricao("");
      setCategoria("");
      setValor("");
      setDataVencimento("");

      alert("Conta a pagar adicionada com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar conta a pagar:", error);
      alert("Erro ao adicionar conta.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Nova Conta a Pagar</h2>
        <form onSubmit={handleSubmit} className="mb-6 space-y-4 max-w-md">
          <input
            type="text"
            placeholder="Descrição"
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
          <input
            type="date"
            value={dataVencimento}
            onChange={(e) => setDataVencimento(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded"
          >
            Adicionar
          </button>
        </form>
      </div>
    </div>
  );
}
