"use client";

/* eslint-disable react-hooks/set-state-in-effect */
import React, { useCallback, useEffect, useMemo, useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type User = {
  id: number;
  username: string;
  email?: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
};

type FormState = {
  username: string;
  email?: string | null;
  role: string;
};

const emptyForm: FormState = {
  username: "",
  email: undefined,
  role: "VISUALIZACAO",
};

const inputClass =
  "mt-1.5 w-full rounded-lg border border-[#E2E4E7] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#191A1C] placeholder:text-[#9A9B9E] transition focus:border-[#1A6EE8] focus:outline-none focus:ring-2 focus:ring-[#1A6EE8]/20";

const fields: { key: keyof FormState; label: string; placeholder: string }[] = [
  { key: "username", label: "Usuário", placeholder: "Digite o nome de usuário" },
  { key: "email", label: "E-mail", placeholder: "exemplo@email.com" },
  { key: "role", label: "Função", placeholder: "VISUALIZACAO ou ADMIN" },
];

function authHeaders(): Record<string, string> {
  const token = window.localStorage.getItem("tm_access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(window.localStorage.getItem("tm_role") === "ADMIN");
  }, []);

  const load = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: authHeaders(),
      });
      if (!response.ok) throw new Error();
      const data = (await response.json()) as User[];
      setUsers(data);
      setError(null);
    } catch {
      setError("Não foi possível carregar os usuários.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleFieldChange = (key: keyof FormState, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: key === "email" && value === "" ? undefined : value,
    }));
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({
      username: "",
      email: undefined,
      role: "VISUALIZACAO",
    });
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (user: User) => {
    setEditingId(user.id);
    setForm({
      username: user.username,
      email: user.email ?? undefined,
      role: user.role,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const save = useCallback(async () => {
    if (!isAdmin) {
      setFormError("Apenas administradores podem salvar usuários.");
      return;
    }

    setFormError(null);
    setSaving(true);

    try {
      const body = JSON.stringify({
        username: form.username,
        email: form.email,
        role: form.role,
      });

      const response = editingId
        ? await fetch(`${API_BASE_URL}/users/${editingId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              ...authHeaders(),
            },
            body,
          })
        : await fetch(`${API_BASE_URL}/users`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...authHeaders(),
            },
            body,
          });

      if (!response.ok) throw new Error();

      setModalOpen(false);
      void load();
    } catch {
      setFormError("Não foi possível salvar o usuário.");
    } finally {
      setSaving(false);
    }
  }, [editingId, form, isAdmin, load]);

  const deleteUser = useCallback(
    async (id: number) => {
      if (!isAdmin) return;

      try {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
          method: "DELETE",
          headers: authHeaders(),
        });
        if (!response.ok) throw new Error();
        setFormError(null);
        void load();
      } catch {
        setFormError("Não foi possível excluir o usuário.");
      }
    },
    [isAdmin, load],
  );

  const handleDelete = (id: number) => {
    if (!isAdmin) {
      setFormError("Apenas administradores podem excluir usuários.");
      return;
    }
    setFormError(null);
    void deleteUser(id);
  };

  return {
    users,
    loading,
    error,
    modalOpen,
    setModalOpen,
    editingId,
    form,
    saving,
    formError,
    isAdmin,
    openCreate,
    openEdit,
    save,
    handleDelete,
    handleFieldChange,
    fields,
  };
}

export default function UsuariosPage() {
  const {
    users,
    loading,
    error,
    modalOpen,
    setModalOpen,
    editingId,
    form,
    saving,
    formError,
    isAdmin,
    openCreate,
    openEdit,
    save,
    handleDelete,
    handleFieldChange,
    fields,
  } = useUsers();

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center text-sm font-medium text-[#6B7280]">
        Carregando...
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-6 rounded-lg border border-[#E53E3E]/30 bg-[#E53E3E]/10 p-4 text-sm text-[#E53E3E]">
        {error}
      </div>
    );
  }

  return (
    <section className="p-6 max-w-7xl mx-auto">
      {/* Header da Página */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#191A1C] tracking-tight">
            Usuários
          </h1>
          <p className="text-sm text-[#6B7280] mt-0.5">
            Gerencie os acessos, permissões e contas de usuários do sistema.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={openCreate}
            className="inline-flex items-center justify-center rounded-lg bg-[#1A6EE8] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1656C0] focus:outline-none focus:ring-2 focus:ring-[#1A6EE8]/20"
          >
            + Novo Usuário
          </button>
        )}
      </div>

      {/* Cartão contendo a Tabela */}
      <div className="rounded-xl border border-[#E2E4E7] bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2E4E7] bg-[#F9FAFB]">
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                  Usuário
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                  E-mail
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                  Função
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                  Criado em
                </th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E4E7]">
              {users.map((user) => (
                <tr key={user.id} className="transition hover:bg-[#F9FAFB]/60">
                  <td className="px-5 py-4 text-sm font-medium text-[#191A1C]">
                    {user.username}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#6B7280]">
                    {user.email || "-"}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#6B7280]">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.role === "ADMIN"
                          ? "bg-blue-50 text-[#1A6EE8]"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-[#6B7280]">
                    {user.createdAt}
                  </td>
                  <td className="px-5 py-4 text-right space-x-3">
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => openEdit(user)}
                          className="text-sm font-medium text-[#1A6EE8] hover:underline"
                          title="Editar"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-sm font-medium text-[#E53E3E] hover:underline"
                          title="Excluir"
                        >
                          Excluir
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-sm text-[#6B7280]"
                  >
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Centralizado para Criar/Editar */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#191A1C]/50 backdrop-blur-xs transition-opacity"
            onClick={() => setModalOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-50 w-full max-w-md rounded-xl bg-white shadow-2xl overflow-hidden border border-[#E2E4E7] animate-in fade-in zoom-in-95 duration-150">
            {/* Cabeçalho do Modal */}
            <div className="flex items-center justify-between border-b border-[#E2E4E7] px-6 py-4 bg-[#F9FAFB]">
              <h2 className="text-base font-bold text-[#191A1C]">
                {editingId ? "Editar Usuário" : "Novo Usuário"}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Fechar"
                className="rounded-md p-1.5 text-[#9A9B9E] transition hover:bg-[#E2E4E7]/50 hover:text-[#191A1C]"
              >
                ✕
              </button>
            </div>

            {/* Corpo do Formulário */}
            <div className="space-y-4 px-6 py-5">
              {fields.map((field) => (
                <div key={field.key}>
                  <label
                    htmlFor={`user-${field.key}`}
                    className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280]"
                  >
                    {field.label}
                  </label>
                  <input
                    id={`user-${field.key}`}
                    type="text"
                    required={false}
                    value={(form[field.key] as string) ?? ""}
                    onChange={(e) =>
                      handleFieldChange(field.key, e.target.value)
                    }
                    placeholder={field.placeholder}
                    className={inputClass}
                  />
                </div>
              ))}

              {formError && (
                <div
                  role="alert"
                  className="rounded-lg border border-[#E53E3E]/30 bg-[#E53E3E]/10 px-3.5 py-2.5 text-sm text-[#E53E3E]"
                >
                  {formError}
                </div>
              )}
            </div>

            {/* Rodapé do Modal */}
            <div className="border-t border-[#E2E4E7] px-6 py-4 bg-[#F9FAFB] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg border border-[#E2E4E7] bg-white px-4 py-2.5 text-sm font-medium text-[#191A1C] transition hover:bg-[#F0F4F8]"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={save}
                className="inline-flex items-center justify-center rounded-lg bg-[#1A6EE8] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1656C0] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Salvando..." : editingId ? "Atualizar" : "Cadastrar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}