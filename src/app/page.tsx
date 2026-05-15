"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Activity, LogOut, Search, X } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { ProjectCard } from "@/components/ProjectCard";
import { signOut } from "@/lib/auth";
import { DeliveryStatus } from "@/types";
import { cn } from "@/lib/utils";

type FilterOption = DeliveryStatus | "todos";

const FILTERS: { value: FilterOption; label: string; active: string; inactive: string }[] = [
  {
    value: "todos",
    label: "Todos",
    active: "bg-gray-900 text-white border-gray-900",
    inactive: "bg-white text-gray-600 border-gray-300 hover:border-gray-400",
  },
  {
    value: "apto",
    label: "Apto",
    active: "bg-green-600 text-white border-green-600",
    inactive: "bg-green-50 text-green-700 border-green-200 hover:border-green-400",
  },
  {
    value: "inapto",
    label: "Inapto",
    active: "bg-red-600 text-white border-red-600",
    inactive: "bg-red-50 text-red-700 border-red-200 hover:border-red-400",
  },
  {
    value: "pendente",
    label: "Pendente",
    active: "bg-yellow-500 text-white border-yellow-500",
    inactive: "bg-yellow-50 text-yellow-700 border-yellow-200 hover:border-yellow-400",
  },
];

export default function HomePage() {
  const router = useRouter();
  const projects = useAppStore((s) => s.projects);
  const loading = useAppStore((s) => s.loading);
  const loadProjects = useAppStore((s) => s.loadProjects);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterOption>("todos");

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  async function handleLogout() {
    await signOut();
    router.push("/login");
    router.refresh();
  }

  const filtered = projects
    .filter((p) => {
      const q = search.toLowerCase();
      return (
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q)
      );
    })
    .filter((p) => filter === "todos" || p.deliveryStatus === filter);

  const hasActiveFilter = search || filter !== "todos";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Nav */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity size={22} className="text-blue-600" />
            <span className="font-bold text-gray-900 text-lg">Auditoria</span>
            <span className="text-blue-600 font-bold text-lg">Elevadores</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/projects/new"
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              <Plus size={16} />
              Novo Projeto
            </Link>
            <button
              onClick={handleLogout}
              title="Sair"
              className="p-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* ── Search + Filters ── */}
            <div className="space-y-3 mb-5">
              {/* Search input */}
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Pesquisar por empreendimento ou construtora…"
                  className="w-full rounded-xl border border-gray-200 pl-10 pr-9 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* Filter pills */}
              <div className="flex gap-2">
                {FILTERS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFilter(f.value)}
                    className={cn(
                      "flex-1 py-1.5 rounded-xl border text-sm font-medium transition-colors",
                      filter === f.value ? f.active : f.inactive
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Results ── */}
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
                  <Search size={22} className="text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium mb-1">Nenhum resultado</p>
                <p className="text-gray-400 text-sm">
                  {search
                    ? `Nenhum projeto corresponde a "${search}"`
                    : "Nenhum projeto com esse parecer"}
                </p>
                {hasActiveFilter && (
                  <button
                    onClick={() => { setSearch(""); setFilter("todos"); }}
                    className="mt-4 text-sm text-blue-600 hover:underline"
                  >
                    Limpar filtros
                  </button>
                )}
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-400 mb-4">
                  {filtered.length === projects.length
                    ? `${projects.length} ${projects.length === 1 ? "projeto" : "projetos"}`
                    : `${filtered.length} de ${projects.length} projetos`}
                </p>
                <div className="space-y-4">
                  {filtered.map((p) => (
                    <ProjectCard key={p.id} project={p} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
        <Activity size={32} className="text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum projeto ainda</h3>
      <p className="text-gray-500 text-sm mb-6 max-w-xs">
        Crie seu primeiro projeto de auditoria para começar a registrar vistorias de elevadores.
      </p>
      <Link
        href="/projects/new"
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
      >
        <Plus size={18} />
        Criar Primeiro Projeto
      </Link>
    </div>
  );
}
