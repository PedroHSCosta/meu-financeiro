export function CardAmount({ title, amount, color }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className={`text-2xl ${color} font-bold`}>
        {amount.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </p>
    </div>
  );
}
