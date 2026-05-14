export type ConformityStatus = "conforme" | "nao_conforme" | "na";
export type Severity = "baixa" | "media" | "alta" | "critica";
export type DeliveryStatus = "apto" | "inapto" | "pendente";

export interface MediaFile {
  id: string;
  url: string;
  name: string;
  type: "image" | "video";
}

export interface AuditItem {
  id: string;
  projectId: string;
  sectionCode: string;
  sectionTitle: string;
  itemCode: string;
  description: string;
  conformity: ConformityStatus | null;
  responsibility: string;
  observation: string;
  severity: Severity | null;
  mediaFiles: MediaFile[];
}

export type ProjectStatus = "em_andamento" | "concluido" | "pendente";

export interface Project {
  id: string;
  // Dados da obra
  name: string;          // Empreendimento
  address: string;
  cep: string;
  client: string;        // Construtora
  // Dados do equipamento
  equipmentId: string;   // Identificação do equipamento
  elevatorType: string;  // Tipo de elevador
  elevatorModel: string; // Linha/modelo
  capacityKg: string;
  capacityPersons: string;
  elevatorSpeed: string; // m/s
  elevatorFloors: string;// Número de paradas
  // Dados da auditoria
  auditDate: string;
  reportDate: string;    // Elaboração do relatório
  auditor: string;
  crea: string;
  status: ProjectStatus;
  deliveryStatus: DeliveryStatus;
  createdAt: string;
  updatedAt: string;
  auditItems: AuditItem[];
}

export interface ChecklistTemplate {
  sectionCode: string;
  sectionTitle: string;
  items: {
    itemCode: string;
    description: string;
  }[];
}
