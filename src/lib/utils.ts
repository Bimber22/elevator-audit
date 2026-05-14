import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ConformityStatus, ProjectStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("pt-BR");
}

export function conformityLabel(status: ConformityStatus | null): string {
  const map: Record<ConformityStatus, string> = {
    conforme: "Conforme",
    nao_conforme: "Não Conforme",
    na: "N/A",
  };
  return status ? map[status] : "—";
}

export function statusLabel(status: ProjectStatus): string {
  const map: Record<ProjectStatus, string> = {
    em_andamento: "Em Andamento",
    concluido: "Concluído",
    pendente: "Pendente",
  };
  return map[status];
}

export function statusColor(status: ProjectStatus): string {
  const map: Record<ProjectStatus, string> = {
    em_andamento: "bg-yellow-100 text-yellow-800",
    concluido: "bg-green-100 text-green-800",
    pendente: "bg-gray-100 text-gray-700",
  };
  return map[status];
}
