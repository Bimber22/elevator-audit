"use client";

import Link from "next/link";
import { Building2, Calendar, Trash2, FileText } from "lucide-react";
import { Project } from "@/types";
import { formatDate, statusLabel, statusColor, cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const deleteProject = useAppStore((s) => s.deleteProject);
  const totalItems = project.auditItems.length;
  const answered = project.auditItems.filter((i) => i.conformity !== null).length;
  const progress = totalItems > 0 ? Math.round((answered / totalItems) * 100) : 0;

  function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    if (confirm(`Excluir o projeto "${project.name}"? Esta ação não pode ser desfeita.`)) {
      deleteProject(project.id);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <Link href={`/projects/${project.id}`} className="block p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-lg truncate">{project.name}</h3>
            <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1">
              <Building2 size={14} />
              <span className="truncate">{project.client}</span>
            </div>
            {project.address && (
              <p className="text-gray-400 text-xs mt-0.5 truncate">{project.address}</p>
            )}
          </div>
          <span className={cn("shrink-0 px-2.5 py-1 rounded-full text-xs font-medium", statusColor(project.status))}>
            {statusLabel(project.status)}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-3">
          <Calendar size={14} />
          <span>{formatDate(project.auditDate)}</span>
          {project.auditor && (
            <>
              <span className="text-gray-300">·</span>
              <span className="truncate">{project.auditor}</span>
            </>
          )}
        </div>

        {totalItems > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progresso</span>
              <span>{answered}/{totalItems} itens</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </Link>

      <div className="flex border-t border-gray-100">
        <Link
          href={`/projects/${project.id}`}
          className="flex-1 flex items-center justify-center gap-2 py-3 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-bl-2xl transition-colors"
        >
          <FileText size={16} />
          Abrir Auditoria
        </Link>
        <button
          onClick={handleDelete}
          className="flex items-center justify-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 rounded-br-2xl transition-colors"
          aria-label="Excluir projeto"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
