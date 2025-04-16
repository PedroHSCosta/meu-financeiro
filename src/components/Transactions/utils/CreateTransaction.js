import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../firebase";

export async function createTransaction({
  descricao,
  categoria,
  valor,
  tipo,
  contaId,
  userId,
}) {
  await addDoc(collection(db, "transacoes"), {
    descricao,
    categoria,
    valor,
    tipo,
    contaId,
    userId,
    data: new Date(),
  });
}
