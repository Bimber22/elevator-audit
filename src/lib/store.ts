"use client";

import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { createBrowserClient } from "@supabase/ssr";
import { Project, AuditItem } from "@/types";
import { ELEVATOR_CHECKLIST } from "@/lib/checklist-data";

// ── Supabase client ────────────────────────────────────────
function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createBrowserClient(url, key);
}

// ── Row ↔ Project mapping ──────────────────────────────────
type ProjectRow = Record<string, unknown> & { audit_items: AuditItem[] };

function rowToProject(row: ProjectRow): Project {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    name: row.name as string,
    address: (row.address as string) ?? "",
    cep: (row.cep as string) ?? "",
    client: row.client as string,
    clientLogoUrl: (row.client_logo_url as string) || undefined,
    equipmentId: (row.equipment_id as string) ?? "",
    elevatorType: (row.elevator_type as string) ?? "Passageiros",
    elevatorModel: (row.elevator_model as string) ?? "",
    capacityKg: (row.capacity_kg as string) ?? "",
    capacityPersons: (row.capacity_persons as string) ?? "",
    elevatorSpeed: (row.elevator_speed as string) ?? "",
    elevatorFloors: (row.elevator_floors as string) ?? "",
    auditDate: row.audit_date as string,
    reportDate: (row.report_date as string) ?? (row.audit_date as string),
    auditor: (row.auditor as string) ?? "",
    crea: (row.crea as string) ?? "",
    status: (row.status as Project["status"]) ?? "pendente",
    deliveryStatus: (row.delivery_status as Project["deliveryStatus"]) ?? "pendente",
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    auditItems: (row.audit_items as AuditItem[]) ?? [],
  };
}

function projectToRow(p: Project) {
  return {
    id: p.id,
    user_id: p.userId,
    name: p.name,
    address: p.address,
    cep: p.cep,
    client: p.client,
    client_logo_url: p.clientLogoUrl ?? null,
    equipment_id: p.equipmentId,
    elevator_type: p.elevatorType,
    elevator_model: p.elevatorModel,
    capacity_kg: p.capacityKg,
    capacity_persons: p.capacityPersons,
    elevator_speed: p.elevatorSpeed,
    elevator_floors: p.elevatorFloors,
    audit_date: p.auditDate,
    report_date: p.reportDate,
    auditor: p.auditor,
    crea: p.crea,
    status: p.status,
    delivery_status: p.deliveryStatus,
    audit_items: p.auditItems,
    updated_at: new Date().toISOString(),
  };
}

// Fire-and-forget sync — UI doesn't wait for this
function syncProject(project: Project) {
  const supabase = db();
  if (!supabase) return;
  supabase.from("projects").upsert(projectToRow(project)).then(() => {});
}

function makeItems(projectId: string): AuditItem[] {
  return ELEVATOR_CHECKLIST.flatMap((section) =>
    section.items.map((item) => ({
      id: uuidv4(),
      projectId,
      sectionCode: section.sectionCode,
      sectionTitle: section.sectionTitle,
      itemCode: item.itemCode,
      description: item.description,
      conformity: null,
      responsibility: "",
      observation: "",
      severity: null,
      mediaFiles: [],
    }))
  );
}

// ── Store ──────────────────────────────────────────────────
interface AppStore {
  projects: Project[];
  loading: boolean;

  loadProjects: () => Promise<void>;
  createProject: (data: Omit<Project, "id" | "createdAt" | "updatedAt" | "auditItems">) => Project;
  updateProject: (id: string, data: Partial<Omit<Project, "id" | "createdAt" | "updatedAt" | "auditItems">>) => void;
  deleteProject: (id: string) => void;

  initializeProjectItems: (projectId: string) => void;
  updateAuditItem: (
    projectId: string,
    itemId: string,
    data: Partial<Pick<AuditItem, "conformity" | "responsibility" | "observation" | "severity">>
  ) => void;
  addMediaToItem: (projectId: string, itemId: string, media: AuditItem["mediaFiles"][number]) => void;
  removeMediaFromItem: (projectId: string, itemId: string, mediaId: string) => void;
}

export const useAppStore = create<AppStore>()((set, get) => ({
  projects: [],
  loading: false,

  // ── Load from Supabase ───────────────────────────────────
  loadProjects: async () => {
    if (get().loading) return;
    const supabase = db();
    if (!supabase) return;

    set({ loading: true });
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("updated_at", { ascending: false });

    if (!error && data) {
      set({ projects: (data as ProjectRow[]).map(rowToProject) });
    }
    set({ loading: false });
  },

  // ── Create ───────────────────────────────────────────────
  createProject: (data) => {
    const id = uuidv4();
    const now = new Date().toISOString();
    const items = makeItems(id);
    const project: Project = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
      auditItems: items,
    };

    set((state) => ({ projects: [project, ...state.projects] }));
    syncProject(project);
    return project;
  },

  // ── Update project metadata ──────────────────────────────
  updateProject: (id, data) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
      ),
    }));
    const updated = get().projects.find((p) => p.id === id);
    if (updated) syncProject(updated);
  },

  // ── Delete ───────────────────────────────────────────────
  deleteProject: (id) => {
    set((state) => ({ projects: state.projects.filter((p) => p.id !== id) }));
    db()?.from("projects").delete().eq("id", id).then(() => {});
  },

  // ── Initialize checklist (only if empty) ────────────────
  initializeProjectItems: (projectId) => {
    const project = get().projects.find((p) => p.id === projectId);
    if (!project || project.auditItems.length > 0) return;

    const items = makeItems(projectId);
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId ? { ...p, auditItems: items } : p
      ),
    }));
    const updated = get().projects.find((p) => p.id === projectId);
    if (updated) syncProject(updated);
  },

  // ── Update single audit item ─────────────────────────────
  updateAuditItem: (projectId, itemId, data) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              updatedAt: new Date().toISOString(),
              auditItems: p.auditItems.map((item) =>
                item.id === itemId ? { ...item, ...data } : item
              ),
            }
          : p
      ),
    }));
    const updated = get().projects.find((p) => p.id === projectId);
    if (updated) syncProject(updated);
  },

  // ── Media ────────────────────────────────────────────────
  addMediaToItem: (projectId, itemId, media) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              auditItems: p.auditItems.map((item) =>
                item.id === itemId
                  ? { ...item, mediaFiles: [...item.mediaFiles, media] }
                  : item
              ),
            }
          : p
      ),
    }));
    const updated = get().projects.find((p) => p.id === projectId);
    if (updated) syncProject(updated);
  },

  removeMediaFromItem: (projectId, itemId, mediaId) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              auditItems: p.auditItems.map((item) =>
                item.id === itemId
                  ? { ...item, mediaFiles: item.mediaFiles.filter((m) => m.id !== mediaId) }
                  : item
              ),
            }
          : p
      ),
    }));
    const updated = get().projects.find((p) => p.id === projectId);
    if (updated) syncProject(updated);
  },
}));
