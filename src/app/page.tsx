"use client";

import Link from "next/link";
import { Plus, Activity } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { ProjectCard } from "@/components/ProjectCard";

export default function HomePage() {
  const projects = useAppStore((s) => s.projects);

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
          <Link
            href="/projects/new"
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            <Plus size={16} />
            Novo Projeto
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        {projects.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                {projects.length} {projects.length === 1 ? "projeto" : "projetos"}
              </h2>
            </div>
            <div className="space-y-4">
              {[...projects]
                .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                .map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
            </div>
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
