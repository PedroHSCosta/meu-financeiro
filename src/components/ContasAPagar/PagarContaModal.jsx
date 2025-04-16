import { useState } from "react";
import { createTransaction } from "../Transactions/utils/CreateTransaction";
import { useAuth } from "../../contexts/AuthContext";

export default function PagarContaModal({
  conta,
  contasBancarias,
  onClose,
  onConfirm,
}) {
  const [contaSelecionada, setContaSelecionada] = useState("");
  const { user } = useAuth();
  const handleConfirmar = async () => {
    if (!contaSelecionada) return;
    onConfirm(contaSelecionada);
    onClose();

    await createTransaction({
      descricao: conta.descricao,
      categoria: conta.categoria,
      valor: conta.valor,
      tipo: "Saída",
      contaId: contaSelecionada,
      userId: user.uid,
      data: new Date(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h2 className="text-lg font-bold mb-4">Detalhes da Conta</h2>
        <p>Descrição: {conta.descricao}</p>
        <p>Valor: R$ {conta.valor.toFixed(2)}</p>
        <p className="text-gray-700">
          Vencimento: {conta.dataVencimento?.toDate().toLocaleDateString()}
        </p>
        <h2 className="text-lg font-bold mb-4 mt-4">
          Escolha a conta para pagamento
        </h2>

        <select
          value={contaSelecionada}
          onChange={(e) => setContaSelecionada(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="">Selecione uma conta</option>
          {contasBancarias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome} - Saldo: R$ {c.saldo.toFixed(2)}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancelar
          </button>
          <button
            onClick={handleConfirmar}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
