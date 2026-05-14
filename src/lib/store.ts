"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { Project, AuditItem, ConformityStatus, Severity } from "@/types";
import { ELEVATOR_CHECKLIST } from "@/lib/checklist-data";

interface AppStore {
  projects: Project[];

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

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      projects: [],

      createProject: (data) => {
        const project: Project = {
          ...data,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          auditItems: [],
        };
        set((state) => ({ projects: [...state.projects, project] }));
        get().initializeProjectItems(project.id);
        return project;
      },

      updateProject: (id, data) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
          ),
        }));
      },

      deleteProject: (id) => {
        set((state) => ({ projects: state.projects.filter((p) => p.id !== id) }));
      },

      initializeProjectItems: (projectId) => {
        const items: AuditItem[] = ELEVATOR_CHECKLIST.flatMap((section) =>
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
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId ? { ...p, auditItems: items } : p
          ),
        }));
      },

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
      },

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
      },
    }),
    { name: "elevator-audit-v2" }
  )
);
