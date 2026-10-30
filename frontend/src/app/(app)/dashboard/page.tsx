export default function DashboardPage() {
  return (
    <section>
      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#E2E4E7] pb-5">
        <div>
          <h1 className="text-xl font-bold text-[#191A1C] tracking-tight">
            Painel de migração
          </h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Bem-vindo. As telas gerenciais e métricas em tempo real serão disponibilizadas em breve.
          </p>
        </div>
      </div>

      {/* Grid de Estatísticas / Cards */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { 
            title: "Jobs de migração", 
            value: "—", 
            description: "Processos em execução ou fila" 
          },
          { 
            title: "Registros migrados", 
            value: "—", 
            description: "Total de dados integrados (Sienge/UAU)" 
          },
          { 
            title: "Pendências", 
            value: "—", 
            description: "Erros ou alertas de de-para" 
          },
        ].map((card) => (
          <div
            key={card.title}
            className="group rounded-xl border border-[#E2E4E7] bg-white p-6 shadow-sm transition hover:border-[#1A6EE8]/40 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                {card.title}
              </p>
              <span className="h-2 w-2 rounded-full bg-gray-300 transition group-hover:bg-[#1A6EE8]" />
            </div>
            <p className="mt-3 font-heading text-3xl font-bold text-[#191A1C] tracking-tight">
              {card.value}
            </p>
            <p className="mt-1 text-xs text-[#9A9B9E]">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}