import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen lg:grid lg:grid-cols-2">
      <section className="hidden flex-col justify-between bg-gradient-to-br from-[#2E4CFF] via-[#1A3EB5] to-[#000D5C] p-12 text-white lg:flex">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15 font-heading text-lg font-bold backdrop-blur">
              TM
            </span>
            <span className="font-heading text-xl font-semibold tracking-tight">
              Trinus Migração
            </span>
          </div>
        </div>

        <div className="max-w-md">
          <h2 className="font-heading text-4xl font-bold leading-tight">
            Migração de dados com segurança e rastreabilidade.
          </h2>
          <p className="mt-4 text-base text-white/80">
            Acesse o painel gerencial para acompanhar jobs, validar registros e
            auditar o processo de migração.
          </p>
        </div>

        <p className="text-xs text-white/60">
          © {new Date().getFullYear()} Trinus. Todos os direitos reservados.
        </p>
      </section>

      <section className="flex items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-md rounded-2xl border border-[#E2E4E7] bg-[#FFFFFF] p-8 shadow-sm">
          <LoginForm />
        </div>
      </section>
    </main>
  );
}

