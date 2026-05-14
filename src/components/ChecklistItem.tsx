"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle2, XCircle, MinusCircle } from "lucide-react";
import { AuditItem, ConformityStatus, Severity } from "@/types";
import { useAppStore } from "@/lib/store";
import { MediaUpload } from "@/components/MediaUpload";
import { cn } from "@/lib/utils";

interface ChecklistItemProps {
  item: AuditItem;
}

const CONFORMITY_OPTIONS: {
  value: ConformityStatus;
  label: string;
  icon: React.ReactNode;
  active: string;
}[] = [
  {
    value: "conforme",
    label: "Conforme",
    icon: <CheckCircle2 size={18} />,
    active: "bg-green-500 text-white border-green-500",
  },
  {
    value: "nao_conforme",
    label: "Não Conforme",
    icon: <XCircle size={18} />,
    active: "bg-red-500 text-white border-red-500",
  },
  {
    value: "na",
    label: "N/A",
    icon: <MinusCircle size={18} />,
    active: "bg-gray-400 text-white border-gray-400",
  },
];

const BORDER_COLOR: Record<ConformityStatus, string> = {
  conforme: "border-l-green-500 bg-green-50",
  nao_conforme: "border-l-red-500 bg-red-50",
  na: "border-l-gray-400 bg-gray-50",
};

export function ChecklistItemCard({ item }: ChecklistItemProps) {
  const updateItem = useAppStore((s) => s.updateAuditItem);
  const [expanded, setExpanded] = useState(false);

  // Local state for text fields — prevents cursor jump caused by parent re-renders
  const [responsibility, setResponsibility] = useState(item.responsibility);
  const [observation, setObservation] = useState(item.observation);

  // Sync local text state when navigating to a different item
  const prevItemId = useRef(item.id);
  useEffect(() => {
    if (prevItemId.current !== item.id) {
      prevItemId.current = item.id;
      setResponsibility(item.responsibility);
      setObservation(item.observation);
    }
  }, [item.id, item.responsibility, item.observation]);

  const borderColor = item.conformity
    ? BORDER_COLOR[item.conformity]
    : "border-l-gray-200 bg-white";

  function toggleConformity(value: ConformityStatus) {
    updateItem(item.projectId, item.id, {
      conformity: item.conformity === value ? null : value,
    });
  }

  return (
    <div className={cn("rounded-xl border border-gray-200 border-l-4 transition-colors", borderColor)}>
      {/* Collapsible header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left p-4 flex items-start gap-3"
      >
        <span className="shrink-0 mt-0.5 text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
          {item.itemCode}
        </span>
        <p className="flex-1 text-sm text-gray-800 leading-snug">{item.description}</p>
        <span className="shrink-0 text-gray-400 mt-0.5">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>

      {/* Conformity quick-select — always visible */}
      <div className="px-4 pb-3 flex gap-2">
        {CONFORMITY_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggleConformity(opt.value)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 text-xs font-semibold transition-all",
              item.conformity === opt.value
                ? opt.active
                : "border-gray-200 text-gray-500 bg-white hover:border-gray-400"
            )}
          >
            {opt.icon}
            <span className="hidden sm:inline">{opt.label}</span>
          </button>
        ))}
      </div>

      {/* Expandable detail */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
          <LocalTextarea
            label="Responsabilidade"
            value={responsibility}
            onChange={setResponsibility}
            onBlur={() => updateItem(item.projectId, item.id, { responsibility })}
            placeholder="Nome do responsável pela ação"
          />
          <LocalTextarea
            label="Observação"
            value={observation}
            onChange={setObservation}
            onBlur={() => updateItem(item.projectId, item.id, { observation })}
            placeholder="Detalhes adicionais, prazo, etc."
          />
          {/* Severity — only when non-conforming */}
          {item.conformity === "nao_conforme" && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Classificação da Inconformidade</label>
              <div className="flex gap-2">
                {(["baixa", "media", "alta", "critica"] as Severity[]).map((s) => {
                  const colors: Record<Severity, string> = {
                    baixa: "border-yellow-400 bg-yellow-50 text-yellow-800",
                    media: "border-orange-400 bg-orange-50 text-orange-800",
                    alta: "border-red-400 bg-red-50 text-red-800",
                    critica: "border-red-700 bg-red-100 text-red-900 font-bold",
                  };
                  const labels: Record<Severity, string> = { baixa: "Baixa", media: "Média", alta: "Alta", critica: "Crítica" };
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => updateItem(item.projectId, item.id, { severity: item.severity === s ? null : s })}
                      className={cn(
                        "flex-1 py-2 rounded-lg border-2 text-xs transition-all",
                        item.severity === s ? colors[s] : "border-gray-200 text-gray-500 bg-white"
                      )}
                    >
                      {labels[s]}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Anexos
              {item.mediaFiles.length > 0 && (
                <span className="ml-1.5 text-xs text-gray-400 font-normal">
                  ({item.mediaFiles.length})
                </span>
              )}
            </p>
            <MediaUpload
              projectId={item.projectId}
              itemId={item.id}
              mediaFiles={item.mediaFiles}
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface LocalTextareaProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  placeholder?: string;
}

function LocalTextarea({ label, value, onChange, onBlur, placeholder }: LocalTextareaProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        rows={2}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}
