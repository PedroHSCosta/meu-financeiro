import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";

function ListaContas() {
  const { user } = useAuth();
  const [contas, setContas] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [editNome, setEditNome] = useState("");
  const [editSaldo, setEditSaldo] = useState("");

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "contasBancarias"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dados = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setContas(dados);
    });

    return () => unsubscribe();
  }, [user]);

  const deletarConta = async (id) => {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir esta conta?"
    );
    if (!confirmar) return;

    await deleteDoc(doc(db, "contasBancarias", id));
  };

  const iniciarEdicao = (conta) => {
    setEditandoId(conta.id);
    setEditNome(conta.nome);
    setEditSaldo(conta.saldo);
  };

  const salvarEdicao = async () => {
    await updateDoc(doc(db, "contasBancarias", editandoId), {
      nome: editNome,
      saldo: parseFloat(editSaldo),
    });
    setEditandoId(null);
    setEditNome("");
    setEditSaldo("");
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-4">Minhas Contas</h2>
      <ul className="space-y-3">
        {contas.map((conta) => (
          <li
            key={conta.id}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
          >
            {editandoId === conta.id ? (
              <div className="flex flex-col gap-2 w-full">
                <input
                  value={editNome}
                  onChange={(e) => setEditNome(e.target.value)}
                  className="border p-2 rounded"
                />
                <input
                  type="number"
                  value={editSaldo}
                  onChange={(e) => setEditSaldo(e.target.value)}
                  className="border p-2 rounded"
                />
                <div className="flex gap-2">
                  <button
                    onClick={salvarEdicao}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => setEditandoId(null)}
                    className="bg-gray-400 text-white px-3 py-1 rounded"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <p className="font-bold">{conta.nome}</p>
                  <p className="text-sm text-gray-600">
                    Saldo: R${" "}
                    {conta.saldo.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => deletarConta(conta.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaContas;
