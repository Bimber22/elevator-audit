"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Project, ProjectStatus } from "@/types";

interface ProjectFormProps {
  initial?: Project;
}

type FormData = Omit<Project, "id" | "createdAt" | "updatedAt" | "auditItems">;

const DEFAULT: FormData = {
  name: "",
  address: "",
  cep: "",
  client: "",
  equipmentId: "",
  elevatorType: "Passageiros",
  elevatorModel: "",
  capacityKg: "",
  capacityPersons: "",
  elevatorSpeed: "",
  elevatorFloors: "",
  auditDate: new Date().toISOString().slice(0, 10),
  reportDate: new Date().toISOString().slice(0, 10),
  auditor: "",
  crea: "",
  status: "pendente",
  deliveryStatus: "pendente",
};

export function ProjectForm({ initial }: ProjectFormProps) {
  const router = useRouter();
  const createProject = useAppStore((s) => s.createProject);
  const updateProject = useAppStore((s) => s.updateProject);

  const [form, setForm] = useState<FormData>(
    initial
      ? {
          name: initial.name,
          address: initial.address,
          cep: initial.cep ?? "",
          client: initial.client,
          equipmentId: initial.equipmentId ?? "",
          elevatorType: initial.elevatorType ?? "Passageiros",
          elevatorModel: initial.elevatorModel ?? "",
          capacityKg: initial.capacityKg ?? "",
          capacityPersons: initial.capacityPersons ?? "",
          elevatorSpeed: initial.elevatorSpeed ?? "",
          elevatorFloors: initial.elevatorFloors ?? "",
          auditDate: initial.auditDate,
          reportDate: initial.reportDate ?? initial.auditDate,
          auditor: initial.auditor ?? "",
          crea: initial.crea ?? "",
          status: initial.status,
          deliveryStatus: initial.deliveryStatus ?? "pendente",
        }
      : DEFAULT
  );

  function set(name: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (initial) {
      updateProject(initial.id, form);
      router.push(`/projects/${initial.id}`);
    } else {
      const project = createProject(form);
      router.push(`/projects/${project.id}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ── 1. Dados da Obra ── */}
      <section>
        <SectionLabel number="1" title="Dados da Obra" />
        <div className="space-y-4">
          <Field label="Empreendimento *" value={form.name} onChange={(v) => set("name", v)} required placeholder="Ex: CASA MOINHOS" />
          <Field label="Construtora / Cliente *" value={form.client} onChange={(v) => set("client", v)} required placeholder="Ex: Melnick" />
          <Field label="Endereço" value={form.address} onChange={(v) => set("address", v)} placeholder="Ex: Rua Hilário Ribeiro, 150" />
          <Field label="CEP" value={form.cep} onChange={(v) => set("cep", v)} placeholder="Ex: 90510-040" />
        </div>
      </section>

      {/* ── 2. Dados do Equipamento ── */}
      <section>
        <SectionLabel number="2" title="Dados do Equipamento" />
        <div className="space-y-4">
          <Field label="Identificação do Equipamento" value={form.equipmentId} onChange={(v) => set("equipmentId", v)} placeholder="Ex: 11852785 – SERVIÇO" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipo de Elevador</label>
            <select
              value={form.elevatorType}
              onChange={(e) => set("elevatorType", e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Passageiros</option>
              <option>Carga</option>
              <option>Passageiros e Cargas</option>
              <option>Monta-carga</option>
            </select>
          </div>
          <Field label="Linha / Modelo" value={form.elevatorModel} onChange={(v) => set("elevatorModel", v)} placeholder="Ex: Schindler 5000" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Capacidade (kg)" value={form.capacityKg} onChange={(v) => set("capacityKg", v)} placeholder="Ex: 825" />
            <Field label="Capacidade (pessoas)" value={form.capacityPersons} onChange={(v) => set("capacityPersons", v)} placeholder="Ex: 11" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Velocidade (m/s)" value={form.elevatorSpeed} onChange={(v) => set("elevatorSpeed", v)} placeholder="Ex: 1.75" />
            <Field label="Nº de Paradas" value={form.elevatorFloors} onChange={(v) => set("elevatorFloors", v)} placeholder="Ex: 18" />
          </div>
        </div>
      </section>

      {/* ── 3. Dados da Auditoria ── */}
      <section>
        <SectionLabel number="3" title="Dados da Auditoria" />
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Data da Vistoria *" type="date" value={form.auditDate} onChange={(v) => set("auditDate", v)} required />
            <Field label="Data do Relatório" type="date" value={form.reportDate} onChange={(v) => set("reportDate", v)} />
          </div>
          <Field label="Auditor Responsável" value={form.auditor} onChange={(v) => set("auditor", v)} placeholder="Ex: Pedro Luis Guimarães Rodrigues" />
          <Field label="CREA / Registro" value={form.crea} onChange={(v) => set("crea", v)} placeholder="Ex: 264185 – Engenheiro Mecânico" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Status do Projeto</label>
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value as ProjectStatus)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pendente">Pendente</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="concluido">Concluído</option>
            </select>
          </div>
        </div>
      </section>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-4 text-base transition-colors"
      >
        {initial ? "Salvar Alterações" : "Criar Projeto e Iniciar Auditoria"}
      </button>
    </form>
  );
}

function SectionLabel({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
        {number}
      </span>
      <h3 className="font-semibold text-gray-800">{title}</h3>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
  type?: string;
}

function Field({ label, value, onChange, required, placeholder, type = "text" }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
