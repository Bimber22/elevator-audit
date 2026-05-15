"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, X } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getUser } from "@/lib/auth";
import { Project, ProjectStatus } from "@/types";

interface ProjectFormProps {
  initial?: Project;
}

type FormData = Omit<Project, "id" | "createdAt" | "updatedAt" | "auditItems" | "userId">;

const DEFAULT: FormData = {
  name: "",
  address: "",
  cep: "",
  client: "",
  clientLogoUrl: "",
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
          clientLogoUrl: initial.clientLogoUrl ?? "",
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

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new window.Image();
      img.onload = () => {
        const MAX = 400;
        const ratio = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        set("clientLogoUrl", canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (initial) {
      updateProject(initial.id, form);
      router.push(`/projects/${initial.id}`);
    } else {
      const user = await getUser();
      const project = createProject({ ...form, userId: user?.id ?? "" });
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

          {/* Logo da Construtora */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Logo da Construtora
            </label>
            {form.clientLogoUrl ? (
              <div className="flex items-center gap-3 mb-2">
                <div className="w-32 h-14 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.clientLogoUrl}
                    alt="Logo da construtora"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => set("clientLogoUrl", "")}
                  className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <X size={14} />
                  Remover
                </button>
              </div>
            ) : null}
            <label className="flex items-center gap-2 w-full rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 cursor-pointer transition-colors">
              <ImagePlus size={16} />
              {form.clientLogoUrl ? "Trocar logo" : "Selecionar imagem da logo"}
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="sr-only"
              />
            </label>
            <p className="text-xs text-gray-400 mt-1">
              Opcional. Aparecerá no cabeçalho de todas as páginas do PDF.
            </p>
          </div>
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
