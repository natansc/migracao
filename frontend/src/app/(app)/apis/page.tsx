"use client";

/* eslint-disable react-hooks/set-state-in-effect */
import React, { useCallback, useEffect, useMemo, useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type ApiItem = {
  id: number;
  name: string;
  description: string;
  host: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  lastModifiedBy: string;
};

type FormState = {
  name: string;
  description: string;
  host: string;
  username: string;
  password: string;
  token: string;
};

const emptyForm: FormState = {
  name: "",
  description: "",
  host: "",
  username: "",
  password: "",
  token: "",
};

const inputClass =
  "mt-1.5 w-full rounded-lg border border-[#E2E4E7] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#191A1C] placeholder:text-[#9A9B9E] transition focus:border-[#1A6EE8] focus:outline-none focus:ring-2 focus:ring-[#1A6EE8]/20";

const fields: { key: keyof FormState; label: string; placeholder: string }[] = [
  { key: "name", label: "Nome", placeholder: "Ex: API Sienge" },
  { key: "description", label: "Descrição", placeholder: "Breve descrição da integração" },
  { key: "host", label: "Host", placeholder: "https://api.exemplo.com" },
  { key: "username", label: "Usuário", placeholder: "Usuário de acesso à API" },
  { key: "password", label: "Senha", placeholder: "Senha de acesso" },
  { key: "token", label: "Token", placeholder: "Token Bearer ou API Key" },
];

function authHeaders(): Record<string, string> {
  const token = window.localStorage.getItem("tm_access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function useApis() {
  const [items, setItems] = useState<ApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
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
      const response = await fetch(`${API_BASE_URL}/api/api-list`, {
        headers: authHeaders(),
      });
      if (!response.ok) throw new Error();
      const data = (await response.json()) as ApiItem[];
      setItems(data);
      setError(null);
    } catch {
      setError("Não foi possível carregar as APIs cadastradas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter((item) =>
      [item.name, item.description, item.host, item.username]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [items, search]);

  const handleFieldChange = (key: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (item: ApiItem) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: item.description,
      host: item.host,
      username: item.username,
      password: "",
      token: "",
    });
    setFormError(null);
    setModalOpen(true);
  };

  const save = useCallback(async () => {
    if (!isAdmin) {
      setFormError("Apenas administradores podem gerenciar APIs.");
      return;
    }

    setFormError(null);
    setSaving(true);

    try {
      const isEdit = editingId !== null;
      const payload: Record<string, string> = {
        name: form.name,
        description: form.description,
        host: form.host,
        username: form.username,
        lastModifiedBy: window.localStorage.getItem("tm_username") ?? "",
      };
      if (!isEdit || form.password) payload.password = form.password;
      if (!isEdit || form.token) payload.token = form.token;

      const response = await fetch(
        isEdit
          ? `${API_BASE_URL}/api/api-update/${editingId}`
          : `${API_BASE_URL}/api/api-create`,
        {
          method: isEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders(),
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) throw new Error();

      setModalOpen(false);
      void load();
    } catch {
      setFormError("Não foi possível salvar a API. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }, [editingId, form, isAdmin, load]);

  const deleteApi = useCallback(
    async (item: ApiItem) => {
      if (!isAdmin) return;
      if (!window.confirm(`Deseja realmente excluir a API "${item.name}"?`)) return;

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/api-delete/${item.id}`,
          { method: "DELETE", headers: authHeaders() },
        );
        if (!response.ok) throw new Error();
        setFormError(null);
        void load();
      } catch {
        setFormError("Não foi possível excluir a API.");
      }
    },
    [isAdmin, load],
  );

  const handleDelete = (item: ApiItem) => {
    if (!isAdmin) {
      setFormError("Apenas administradores podem excluir APIs.");
      return;
    }
    setFormError(null);
    void deleteApi(item);
  };

  return {
    items,
    filtered,
    loading,
    error,
    search,
    setSearch,
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

export default function ApisPage() {
  const {
    filtered,
    loading,
    error,
    search,
    setSearch,
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
  } = useApis();

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

  const isEdit = editingId !== null;

  return (
    <section className="p-6 max-w-7xl mx-auto">
      {/* Header da Página */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#191A1C] tracking-tight">
            APIs
          </h1>
          <p className="text-sm text-[#6B7280] mt-0.5">
            Cadastro e manutenção das integrações de API.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={openCreate}
            className="inline-flex items-center justify-center rounded-lg bg-[#1A6EE8] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1656C0] focus:outline-none focus:ring-2 focus:ring-[#1A6EE8]/20"
          >
            + Nova API
          </button>
        )}
      </div>

      {/* Barra de Pesquisa */}
      <div className="mb-6">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por nome, descrição, host ou usuário..."
          className="w-full max-w-md rounded-lg border border-[#E2E4E7] bg-white px-3.5 py-2.5 text-sm text-[#191A1C] placeholder:text-[#9A9B9E] transition focus:border-[#1A6EE8] focus:outline-none focus:ring-2 focus:ring-[#1A6EE8]/20 shadow-xs"
        />
      </div>

      {/* Cartão contendo a Tabela */}
      <div className="rounded-xl border border-[#E2E4E7] bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2E4E7] bg-[#F9FAFB]">
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                  Nome
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                  Host
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                  Usuário
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                  Última alteração
                </th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E4E7]">
              {filtered.map((item) => (
                <tr key={item.id} className="transition hover:bg-[#F9FAFB]/60">
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-[#191A1C]">{item.name}</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">{item.description}</p>
                  </td>
                  <td className="px-5 py-4 text-xs font-mono text-[#6B7280]">
                    {item.host}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#6B7280]">
                    {item.username || "-"}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#6B7280]">
                    <p className="font-medium text-[#191A1C]">{item.lastModifiedBy || "-"}</p>
                    <p className="text-xs text-[#9A9B9E]">
                      {new Date(item.updatedAt).toLocaleString("pt-BR")}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-right space-x-3">
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => openEdit(item)}
                          className="text-sm font-medium text-[#1A6EE8] hover:underline"
                          title="Editar"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
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

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-sm text-[#6B7280]"
                  >
                    Nenhuma API encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Centralizado idêntico ao de usuários */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#191A1C]/50 backdrop-blur-xs transition-opacity"
            onClick={() => setModalOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-50 w-full max-w-lg rounded-xl bg-white shadow-2xl overflow-hidden border border-[#E2E4E7] animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            {/* Cabeçalho do Modal */}
            <div className="flex items-center justify-between border-b border-[#E2E4E7] px-6 py-4 bg-[#F9FAFB]">
              <h2 className="text-base font-bold text-[#191A1C]">
                {isEdit ? "Editar API" : "Nova API"}
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
            <div className="space-y-4 px-6 py-5 overflow-y-auto flex-1">
              {fields.map((field) => {
                const secret = field.key === "password" || field.key === "token";
                return (
                  <div key={field.key}>
                    <label
                      htmlFor={`api-${field.key}`}
                      className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280]"
                    >
                      {field.label}
                    </label>
                    <input
                      id={`api-${field.key}`}
                      type={secret ? "password" : "text"}
                      required={false}
                      value={form[field.key]}
                      onChange={(e) =>
                        handleFieldChange(field.key, e.target.value)
                      }
                      placeholder={
                        secret && isEdit
                          ? "Deixe em branco para manter"
                          : field.placeholder
                      }
                      className={inputClass}
                    />
                  </div>
                );
              })}

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
                {saving ? "Salvando..." : isEdit ? "Atualizar" : "Cadastrar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}