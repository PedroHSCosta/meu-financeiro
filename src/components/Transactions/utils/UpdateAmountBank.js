import { updateDoc } from "firebase/firestore";

export async function UpdateAmountBank({ contaId, valorNumerico }) {
  await updateDoc(contaId, { saldo: valorNumerico });
}
