"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type NavItem = { 
  label: string; 
  href: string; 
  icon: React.ReactNode; 
  color: string;       // Cor do ícone quando inativo
  activeColor: string; // Cor do ícone quando ativo
  roles?: string[] 
};

const iconClass = "h-5 w-5 shrink-0 transition-colors duration-200";

// --- Ícones Modernos SVG ---
const HomeIcon = (
  <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
  </svg>
);

const DownloadIcon = (
  <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

const UploadIcon = (
  <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
);

const ValidationIcon = (
  <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const RocketIcon = (
  <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.63 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.24a4.5 4.5 0 0 0 2.24 2.24m0 0A4.5 4.5 0 0 0 15 19.5m-2.25-2.25A4.5 4.5 0 0 1 10.5 15" />
  </svg>
);

const PayIcon = (
  <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5h16.5A2.25 2.25 0 0 1 22.5 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H3.75a2.25 2.25 0 0 1-2.25-2.25V6.75A2.25 2.25 0 0 1 3.75 4.5Zm0 3h16.5M12 12.75a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" />
  </svg>
);

const ReceiveIcon = (
  <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const WalletIcon = (
  <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
  </svg>
);

const ApiIcon = (
  <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
  </svg>
);

const MapIcon = (
  <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
  </svg>
);

const UserIcon = (
  <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
  </svg>
);

const sections: { title: string; items: NavItem[] }[] = [
  {
    title: "Geral",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: HomeIcon, color: "text-[#1A6EE8]", activeColor: "text-[#1A6EE8]" }
    ],
  },
  {
    title: "Pipeline de Migração",
    items: [
      { label: "1. Extração", href: "/pipeline/extracao", icon: DownloadIcon, color: "text-[#09B8C8]", activeColor: "text-[#09B8C8]" },
      { label: "2. Importação", href: "/pipeline/importacao", icon: UploadIcon, color: "text-[#2E4CFF]", activeColor: "text-[#2E4CFF]" },
      { label: "3. Validação & De-Para", href: "/pipeline/validacao", icon: ValidationIcon, color: "text-[#D97706]", activeColor: "text-[#D97706]" },
      { label: "4. Executar Carga", href: "/pipeline/carga", icon: RocketIcon, color: "text-[#16A34A]", activeColor: "text-[#16A34A]" },
    ],
  },
  {
    title: "Módulos de Negócio",
    items: [
      { label: "Contas a Pagar", href: "/modulos/pagar", icon: PayIcon, color: "text-[#E53E3E]", activeColor: "text-[#E53E3E]" },
      { label: "Contas a Receber", href: "/modulos/receber", icon: ReceiveIcon, color: "text-[#02D95F]", activeColor: "text-[#02D95F]" },
      { label: "Carteira & Contratos", href: "/modulos/carteira", icon: WalletIcon, color: "text-[#C261FA]", activeColor: "text-[#C261FA]" },
    ],
  },
  {
    title: "Administrativo",
    items: [
      { label: "Integrações / APIs", href: "/apis", icon: ApiIcon, color: "text-[#1A3EB5]", activeColor: "text-[#1A3EB5]" },
      { label: "Mapeamento De-Para", href: "/admin/depara", icon: MapIcon, color: "text-[#5C5E61]", activeColor: "text-[#1A6EE8]", roles: ["ADMIN"] },
      { label: "Usuários", href: "/usuarios", icon: UserIcon, color: "text-[#5C5E61]", activeColor: "text-[#1A6EE8]", roles: ["ADMIN"] },
    ],
  },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const token = hydrated
    ? window.localStorage.getItem("tm_access_token")
    : null;
  const username = hydrated
    ? (window.localStorage.getItem("tm_username") ?? "")
    : "";
  const role = hydrated ? (window.localStorage.getItem("tm_role") ?? "") : "";
  const ready = hydrated && !!token;

  useEffect(() => {
    if (hydrated && !token) {
      router.replace("/login");
    }
  }, [hydrated, token, router]);

  function handleLogout() {
    window.localStorage.removeItem("tm_access_token");
    window.localStorage.removeItem("tm_username");
    window.localStorage.removeItem("tm_role");
    router.replace("/login");
  }

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F9FAFB]">
        <div className="rounded-2xl border border-[#E2E4E7] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1A6EE8] font-heading text-xs font-bold text-white shadow-sm">
              TM
            </span>
            <span className="font-heading text-sm font-bold text-[#191A1C] tracking-wide uppercase">
              Trinus
            </span>
          </div>
          <p className="mt-3 text-xs text-[#6B7280]">Carregando sistema...</p>
        </div>
      </main>
    );
  }

  const visibleSections = sections.map((section) => ({
    ...section,
    items: section.items.filter((item) => {
      if (!item.roles || item.roles.length === 0) return true;
      return item.roles.includes(role);
    }),
  }));

  const initials = (username || "U").slice(0, 2).toUpperCase();

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] text-[#191A1C]">
      {/* Sidebar / Menu Lateral */}
      <aside
        className={`sticky top-0 flex h-screen shrink-0 flex-col border-r border-[#E2E4E7] bg-[#FFFFFF] transition-all duration-200 ${
          collapsed ? "w-[76px]" : "w-64"
        }`}
      >
        {/* Cabeçalho da Sidebar */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-[#E2E4E7]/60">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1A6EE8] font-heading text-sm font-bold text-white shadow-sm">
              TM
            </span>
            {!collapsed && (
              <span className="font-heading text-lg font-bold text-[#191A1C] tracking-tight">
                Trinus
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            aria-label="Recolher menu"
            className="rounded-md p-1.5 text-[#6B7280] transition hover:bg-[#F0F4F8] hover:text-[#191A1C]"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={collapsed ? "m10 8 4 4-4 4M4 5h16v14H4z" : "m14 8-4 4 4 4M4 5h16v14H4z"}
              />
            </svg>
          </button>
        </div>

        {/* Links de Navegação */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {visibleSections
            .filter((section) => section.items.length > 0)
            .map((section) => (
              <div key={section.title}>
                {!collapsed && (
                  <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-[#9A9B9E]">
                    {section.title}
                  </p>
                )}
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const active = pathname.startsWith(item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          title={item.label}
                          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                            active
                              ? "bg-[#1A6EE8]/10 text-[#1A6EE8]"
                              : "text-[#4B5563] hover:bg-[#F0F4F8] hover:text-[#191A1C]"
                          } ${collapsed ? "justify-center" : ""}`}
                        >
                          <span className={active ? item.activeColor : item.color}>
                            {item.icon}
                          </span>
                          {!collapsed && <span>{item.label}</span>}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
        </nav>

        {/* Perfil e Rodapé da Sidebar */}
        <div className="border-t border-[#E2E4E7] p-3.5 bg-[#F9FAFB]/50">
          <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1A6EE8] text-xs font-bold text-white shadow-sm">
              {initials}
            </span>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#191A1C]">{username}</p>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-xs text-[#6B7280] uppercase tracking-wider">
                    {role}
                  </span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-xs font-medium text-[#E53E3E] hover:underline transition"
                  >
                    Sair
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Conteúdo Principal da Página */}
      <main className="min-w-0 flex-1 p-6 md:p-8">
        <div className="min-h-[calc(100vh-4rem)] rounded-2xl border border-[#E2E4E7] bg-white p-6 shadow-sm">
          {children}
        </div>
      </main>
    </div>
  );
}