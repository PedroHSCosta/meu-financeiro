export function ComprovantePdfTransacao() {
  return (
    <div className="bg-gray-900 text-yellow-400 border border-yellow-400 rounded-lg p-6 max-w-md mx-auto shadow-lg">
      <h1 className="text-2xl font-bold text-center border-b border-yellow-400 pb-4 mb-4">
        Comprovante de Transação
      </h1>
      <div className="space-y-2">
        <p>
          <span className="font-semibold text-white">Nome:</span> João Silva
        </p>
        <p>
          <span className="font-semibold text-white">Data:</span> 01/01/2023
        </p>
        <p>
          <span className="font-semibold text-white">Valor:</span> R$ 100,00
        </p>
        <p>
          <span className="font-semibold text-white">Descrição:</span> Pagamento
          de serviço
        </p>
        <p>
          <span className="font-semibold text-white">Status:</span> Aprovado
        </p>
      </div>
    </div>
  );
}
