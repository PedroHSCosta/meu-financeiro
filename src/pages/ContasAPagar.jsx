import ContasAPagarForm from "../components/ContasAPagar/ContasAPagarForm";
import ContasAPagarList from "../components/ContasAPagar/ContasAPagarList";

export default function ContasAPagar() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Contas a Pagar</h1>
      <ContasAPagarForm />
      <ContasAPagarList />
    </div>
  );
}
