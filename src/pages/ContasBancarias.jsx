import CriarConta from "../components/contasBancarias/CriarConta";
import ListaContas from "../components/contasBancarias/ListaContas";

function ContasBancarias() {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Contas Bancárias</h2>
      <CriarConta />
      <ListaContas />
    </div>
  );
}

export default ContasBancarias;
