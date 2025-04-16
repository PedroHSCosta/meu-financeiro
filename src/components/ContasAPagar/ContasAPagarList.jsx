import {
  onSnapshot,
  collection,
  doc,
  updateDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import PagarContaModal from "./PagarContaModal";

export default function ContasAPagarList() {
  const { user } = useAuth();
  const [contas, setContas] = useState([]);
  const [contasBancarias, setContasBancarias] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [contaSelecionada, setContaSelecionada] = useState(null);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "contasAPagar"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setContas(lista);
    });

    return () => unsubscribe();
  }, [user]);

  const fetchContasBancarias = async () => {
    if (!user) return;
    const q = query(
      collection(db, "contasBancarias"),
      where("userId", "==", user.uid)
    );
    const snapshot = await getDocs(q);
    const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setContasBancarias(lista);
  };

  useEffect(() => {
    fetchContasBancarias();
  }, [user]);

  const handlePagarClick = (conta) => {
    setContaSelecionada(conta);
    setModalAberto(true);
  };

  const handleConfirmarPagamento = async (idContaBancaria) => {
    const conta = contasBancarias.find((c) => c.id === idContaBancaria);
    if (!conta || !contaSelecionada) return;

    const novoSaldo = conta.saldo - contaSelecionada.valor;
    await updateDoc(doc(db, "contasBancarias", idContaBancaria), {
      saldo: novoSaldo,
    });

    await updateDoc(doc(db, "contasAPagar", contaSelecionada.id), {
      pago: true,
    });

    fetchContasBancarias();
  };

  return (
    <div className="w-full">
      <div className=" ml-0 space-y-4">
        <h2 className="text-2xl font-semibold mb-4">Minhas Contas a Pagar</h2>

        {contas.length === 0 ? (
          <p className="text-gray-600 text-center">
            Nenhuma conta a pagar encontrada.
          </p>
        ) : (
          contas.map((conta) => (
            <div
              key={conta.id}
              className={`bg-white rounded-2xl shadow-md p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                conta.pago
                  ? "border-l-4 border-green-500"
                  : "border-l-4 border-red-500"
              }`}
            >
              <div className="space-y-1">
                <p className="text-lg font-semibold">{conta.descricao}</p>
                <p className="text-gray-700">
                  Valor: R$ {conta.valor.toFixed(2)}
                </p>
                <p className="text-gray-700">
                  Vencimento:{" "}
                  {conta.dataVencimento?.toDate().toLocaleDateString()}
                </p>
                <p
                  className={`font-medium ${
                    conta.pago ? "text-green-600" : "text-red-600"
                  }`}
                >
                  Status: {conta.pago ? "Paga" : "Pendente"}
                </p>
              </div>
              {!conta.pago && (
                <button
                  onClick={() => handlePagarClick(conta)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg self-end sm:self-auto"
                >
                  Pagar
                </button>
              )}
            </div>
          ))
        )}

        {modalAberto && (
          <PagarContaModal
            conta={contaSelecionada}
            contasBancarias={contasBancarias}
            onClose={() => setModalAberto(false)}
            onConfirm={handleConfirmarPagamento}
            useAuth={user.id}
          />
        )}
      </div>
    </div>
  );
}
