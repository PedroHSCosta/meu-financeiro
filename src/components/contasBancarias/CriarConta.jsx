import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { createTransaction } from "../Transactions/utils/CreateTransaction";
import { UpdateAmountBank } from "../Transactions/utils/UpdateAmountBank";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CriarConta() {
  const [nome, setNome] = useState("");
  const [saldo, setSaldo] = useState("");
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Usuário não autenticado.");
      return;
    }

    if (!nome || saldo === "") {
      toast.error("Preencha todos os campos.");
      return;
    }

    try {
      const bank = await addDoc(collection(db, "contasBancarias"), {
        nome,
        saldo: 0,
        userId: user.uid,
        criadoEm: new Date(),
      });

      await createTransaction({
        descricao: `${nome} saldo inicial`,
        categoria: "Primeira entrada",
        valor: parseFloat(saldo),
        tipo: "Entrada",
        contaId: bank.id,
        userId: user.uid,
        data: new Date(),
      });

      await UpdateAmountBank({
        contaId: bank,
        valorNumerico: parseFloat(saldo),
      });

      setNome("");
      setSaldo("");
      toast.success("Conta criada com sucesso!");
    } catch (error) {
      console.error("Erro ao criar conta:", error.message);
      toast.error("Erro ao criar conta: " + error.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Nova Conta Bancária</h2>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Nome da Conta"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="mb-3">
            <input
              type="number"
              placeholder="Saldo Inicial"
              value={saldo}
              onChange={(e) => setSaldo(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded"
          >
            Criar Conta
          </button>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default CriarConta;
