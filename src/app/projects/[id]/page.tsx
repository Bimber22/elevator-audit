"use client";

import { use, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Building2, Calendar, User, Pencil, CheckCircle2, XCircle, Clock } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { ChecklistSection } from "@/components/ChecklistSection";
import { PdfExportButton } from "@/components/PdfExport";
import { formatDate, statusLabel, statusColor, cn } from "@/lib/utils";
import { ELEVATOR_CHECKLIST } from "@/lib/checklist-data";
import { DeliveryStatus } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

const DELIVERY_OPTIONS: {
  value: DeliveryStatus;
  label: string;
  icon: React.ReactNode;
  active: string;
  desc: string;
}[] = [
  {
    value: "apto",
    label: "Apto para Entrega",
    icon: <CheckCircle2 size={22} />,
    active: "bg-green-600 text-white border-green-600",
    desc: "Elevador aprovado na vistoria",
  },
  {
    value: "inapto",
    label: "Inapto para Entrega",
    icon: <XCircle size={22} />,
    active: "bg-red-600 text-white border-red-600",
    desc: "Pendências impedem a entrega",
  },
  {
    value: "pendente",
    label: "Parecer Pendente",
    icon: <Clock size={22} />,
    active: "bg-yellow-500 text-white border-yellow-500",
    desc: "Aguardando avaliação final",
  },
];

export default function ProjectPage({ params }: PageProps) {
  const { id } = use(params);
  const project = useAppStore((s) => s.projects.find((p) => p.id === id));
  const loading = useAppStore((s) => s.loading);
  const loadProjects = useAppStore((s) => s.loadProjects);
  const initializeProjectItems = useAppStore((s) => s.initializeProjectItems);
  const updateProject = useAppStore((s) => s.updateProject);

  // Load from Supabase if accessed directly via URL (store is empty)
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  if (loading && !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Projeto não encontrado.</p>
        <Link href="/" className="text-blue-600 hover:underline text-sm">Voltar à lista</Link>
      </div>
    );
  }

  if (project.auditItems.length === 0) {
    initializeProjectItems(project.id);
  }

  const answered = project.auditItems.filter((i) => i.conformity !== null).length;
  const total = project.auditItems.length;
  const progress = total > 0 ? Math.round((answered / total) * 100) : 0;
  const conforme = project.auditItems.filter((i) => i.conformity === "conforme").length;
  const naoConforme = project.auditItems.filter((i) => i.conformity === "nao_conforme").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Link
              href="/"
              className="p-2 -ml-2 text-gray-500 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors shrink-0"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="font-semibold text-gray-900 truncate">{project.name}</h1>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={`/projects/${id}/edit`}
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
              title="Editar informações do projeto"
            >
              <Pencil size={15} />
              <span className="hidden sm:inline">Editar</span>
            </Link>
            <PdfExportButton project={project} />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-5 space-y-5">
        {/* Project info card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h2 className="font-bold text-gray-900 text-xl">{project.name}</h2>
              <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1">
                <Building2 size={14} />
                <span>{project.client}</span>
              </div>
            </div>
            <span className={cn("shrink-0 px-2.5 py-1 rounded-full text-xs font-medium", statusColor(project.status))}>
              {statusLabel(project.status)}
            </span>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-1.5">
              <Calendar size={13} className="text-gray-400" />
              <span>{formatDate(project.auditDate)}</span>
            </div>
            {project.auditor && (
              <div className="flex items-center gap-1.5">
                <User size={13} className="text-gray-400" />
                <span>{project.auditor}</span>
              </div>
            )}
            {project.elevatorModel && (
              <span className="text-gray-400 text-xs">{project.elevatorModel}</span>
            )}
          </div>

          {/* Progress */}
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1.5">
              <span>Progresso da auditoria</span>
              <span className="font-medium">{answered}/{total} ({progress}%)</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex gap-4 mt-2 text-xs">
              <span className="text-green-600 font-medium">{conforme} conformes</span>
              <span className="text-red-600 font-medium">{naoConforme} não conformes</span>
              <span className="text-gray-400">{total - answered} sem resposta</span>
            </div>
          </div>
        </div>

        {/* Checklist sections */}
        <div className="space-y-4">
          {ELEVATOR_CHECKLIST.map((section) => {
            const items = project.auditItems.filter((i) => i.sectionCode === section.sectionCode);
            if (!items.length) return null;
            return (
              <ChecklistSection
                key={section.sectionCode}
                sectionCode={section.sectionCode}
                sectionTitle={section.sectionTitle}
                items={items}
              />
            );
          })}
        </div>

        {/* ── Parecer Final ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 text-base mb-1">Parecer Final de Entrega</h3>
          <p className="text-sm text-gray-500 mb-4">
            Registre o resultado final da vistoria. Este parecer aparecerá na conclusão do relatório PDF.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            {DELIVERY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => updateProject(project.id, { deliveryStatus: opt.value })}
                className={cn(
                  "flex-1 flex flex-col items-center gap-1.5 py-4 px-3 rounded-xl border-2 transition-all",
                  project.deliveryStatus === opt.value
                    ? opt.active
                    : "border-gray-200 text-gray-600 bg-white hover:border-gray-400"
                )}
              >
                {opt.icon}
                <span className="font-semibold text-sm">{opt.label}</span>
                <span className={cn(
                  "text-xs",
                  project.deliveryStatus === opt.value ? "opacity-80" : "text-gray-400"
                )}>
                  {opt.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom export */}
        <div className="pb-8 flex justify-center">
          <PdfExportButton project={project} />
        </div>
      </main>
    </div>
  );
}
