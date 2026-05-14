"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { AuditItem } from "@/types";
import { ChecklistItemCard } from "@/components/ChecklistItem";

interface ChecklistSectionProps {
  sectionCode: string;
  sectionTitle: string;
  items: AuditItem[];
}

export function ChecklistSection({ sectionCode, sectionTitle, items }: ChecklistSectionProps) {
  const [open, setOpen] = useState(true);
  const answered = items.filter((i) => i.conformity !== null).length;
  const allDone = answered === items.length;

  return (
    <div className="rounded-2xl border border-gray-200 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2.5 py-1 rounded-lg">
          {sectionCode}
        </span>
        <span className="flex-1 font-semibold text-gray-800 text-sm">{sectionTitle}</span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${allDone ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>
          {answered}/{items.length}
        </span>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>

      {open && (
        <div className="p-4 space-y-3">
          {items.map((item) => (
            <ChecklistItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
