"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, pass: password }),
      });

      if (!response.ok) {
        setError("Não foi possível conectar ao servidor. Tente novamente.");
        return;
      }

      const data = (await response.json()) as {
        autorizado: boolean;
        accessToken?: string;
        usuario?: { username: string; role: string };
      };

      if (!data.autorizado || !data.accessToken) {
        setError("Usuário ou senha inválidos.");
        return;
      }

      window.localStorage.setItem("tm_access_token", data.accessToken);
      if (data.usuario?.username) {
        window.localStorage.setItem("tm_username", data.usuario.username);
      }
      if (data.usuario?.role) {
        window.localStorage.setItem("tm_role", data.usuario.role);
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Não foi possível conectar ao servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-[#191A1C]">
          Bem-vindo
        </h1>
        <p className="mt-2 text-sm text-[#5C5E61]">
          Acesse o sistema de migração com suas credenciais.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-[#191A1C]"
          >
            Usuário
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="seu.usuario@trinusco.com.br"
            className="mt-1.5 w-full rounded-lg border border-[#E2E4E7] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#191A1C] placeholder:text-[#9A9B9E] transition focus:border-[#1A6EE8] focus:outline-none focus:ring-2 focus:ring-[#1A6EE8]/20"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-[#191A1C]"
          >
            Senha
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            className="mt-1.5 w-full rounded-lg border border-[#E2E4E7] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#191A1C] placeholder:text-[#9A9B9E] transition focus:border-[#1A6EE8] focus:outline-none focus:ring-2 focus:ring-[#1A6EE8]/20"
          />
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-[#E53E3E]/30 bg-[#E53E3E]/10 px-3.5 py-2.5 text-sm text-[#E53E3E]"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !username || !password}
          className="w-full rounded-lg bg-[#1A6EE8] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1656C0] focus:outline-none focus:ring-2 focus:ring-[#1A6EE8]/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-[#9A9B9E]">
        Autenticação com senha do banco de dados.
      </p>
    </div>
  );
}
