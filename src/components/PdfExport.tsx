"use client";

import { useState } from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import { FileDown, Loader2 } from "lucide-react";
import { Project, AuditItem, ConformityStatus, Severity } from "@/types";
import { formatDate } from "@/lib/utils";
import { STATIC_CONTENT } from "@/lib/checklist-data";

// ─────────────────────────────────────────────────────────
// PALETTE
// ─────────────────────────────────────────────────────────
const C = {
  black: "#000000",
  white: "#FFFFFF",
  offWhite: "#FAFAFA",
  lightGray: "#F2F2F2",
  midGray: "#CCCCCC",
  darkGray: "#333333",
  navy: "#1A1A2E",
  green: "#1B5E20",
  greenBg: "#E8F5E9",
  red: "#B71C1C",
  redBg: "#FFEBEE",
};

const PAD = 30; // horizontal page padding

// ─────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────
const S = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 8.5,
    color: C.darkGray,
    backgroundColor: C.white,
    paddingBottom: 40,
  },

  // ── Running header (all pages after cover) ──────────
  runningHeader: {
    backgroundColor: C.navy,
    paddingVertical: 8,
    paddingHorizontal: PAD,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  runningLogo: {
    width: 70,
    height: 32,
    backgroundColor: C.white,
    borderRadius: 3,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  runningLogoImg: { width: "100%", height: "100%", objectFit: "contain" },
  runningCenter: { flex: 1, alignItems: "center", paddingHorizontal: 8 },
  runningTitle: { fontSize: 8, fontFamily: "Helvetica-Bold", color: C.white, textAlign: "center", letterSpacing: 0.5 },
  runningSubtitle: { fontSize: 6.5, color: "#9AB", textAlign: "center", marginTop: 2 },

  // ── Cover page ──────────────────────────────────────
  // Top navy band (full-width, no horizontal padding override)
  coverTopBand: {
    backgroundColor: C.navy,
    paddingVertical: 14,
    paddingHorizontal: PAD,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  coverLogo: {
    width: 100,
    height: 44,
    backgroundColor: C.white,
    borderRadius: 4,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  coverLogoImg: { width: "100%", height: "100%", objectFit: "contain" },
  coverBandCenter: { flex: 1 },

  // Title area
  coverBody: {
    flex: 1,
    paddingHorizontal: PAD,
    paddingTop: 40,
  },
  coverEyebrow: {
    fontSize: 8,
    color: "#888",
    letterSpacing: 1.5,
    marginBottom: 10,
    fontFamily: "Helvetica-Bold",
  },
  coverTitle: {
    fontSize: 26,
    fontFamily: "Helvetica-Bold",
    color: C.navy,
    lineHeight: 1.2,
    marginBottom: 6,
  },
  coverAccentLine: {
    height: 4,
    width: 60,
    backgroundColor: C.navy,
    marginBottom: 32,
  },

  // Info table on cover
  coverInfoTable: {
    border: `1px solid ${C.midGray}`,
    marginBottom: 0,
  },
  coverInfoRow: {
    flexDirection: "row",
    borderBottom: `0.5px solid ${C.midGray}`,
  },
  coverInfoRowLast: { flexDirection: "row" },
  coverInfoLabel: {
    width: 130,
    padding: "6 8",
    backgroundColor: C.lightGray,
    borderRight: `0.5px solid ${C.midGray}`,
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: C.darkGray,
    justifyContent: "center",
  },
  coverInfoValue: {
    flex: 1,
    padding: "6 8",
    fontSize: 8.5,
    color: C.black,
    justifyContent: "center",
  },

  // Bottom navy band
  coverBottomBand: {
    backgroundColor: C.navy,
    paddingVertical: 12,
    paddingHorizontal: PAD,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  coverBottomText: { fontSize: 7.5, color: "#9AB" },
  coverBottomBold: { fontSize: 8, color: C.white, fontFamily: "Helvetica-Bold" },

  // ── Section title ────────────────────────────────────
  sectionBanner: {
    backgroundColor: C.navy,
    paddingVertical: 5,
    paddingHorizontal: PAD,
    marginBottom: 6,
  },
  sectionBannerText: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: C.white,
    letterSpacing: 0.6,
  },

  // ── Sumário ──────────────────────────────────────────
  tocRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingVertical: 5,
    paddingHorizontal: PAD,
    borderBottom: `0.5px solid ${C.midGray}`,
  },
  tocNum: { width: 24, fontSize: 8.5, fontFamily: "Helvetica-Bold", color: C.navy },
  tocTitle: { flex: 1, fontSize: 8.5, color: C.darkGray },
  tocSub: { paddingLeft: 32 },
  tocSubTitle: { fontSize: 8, color: "#666" },

  // ── Info Gerais table ────────────────────────────────
  infoTable: {
    marginHorizontal: PAD,
    border: `1px solid ${C.black}`,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    borderBottom: `0.5px solid ${C.midGray}`,
  },
  infoRowLast: { flexDirection: "row" },
  infoLabel: {
    width: 150,
    padding: "5 7",
    backgroundColor: C.lightGray,
    borderRight: `0.5px solid ${C.midGray}`,
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    justifyContent: "center",
  },
  infoValue: {
    flex: 1,
    padding: "5 7",
    fontSize: 8,
    justifyContent: "center",
  },
  infoLabelTxt: { fontFamily: "Helvetica-Bold", fontSize: 7.5, color: C.darkGray },
  infoValueTxt: { fontSize: 8, color: C.black },

  // ── Body text ────────────────────────────────────────
  bodyText: {
    fontSize: 8.5,
    lineHeight: 1.6,
    color: C.darkGray,
    marginHorizontal: PAD,
    marginBottom: 8,
  },

  // ── Instruments table ────────────────────────────────
  instrTable: {
    marginHorizontal: PAD,
    border: `1px solid ${C.black}`,
    marginBottom: 10,
  },
  instrHeader: {
    flexDirection: "row",
    backgroundColor: C.navy,
  },
  instrHeaderCell: {
    flex: 1,
    padding: "4 6",
    borderRight: `0.5px solid #445`,
  },
  instrHeaderText: { fontSize: 7.5, fontFamily: "Helvetica-Bold", color: C.white },
  instrRow: { flexDirection: "row", borderBottom: `0.5px solid ${C.midGray}` },
  instrRowLast: { flexDirection: "row" },
  instrCell: { flex: 1, padding: "5 6", borderRight: `0.5px solid ${C.midGray}`, fontSize: 8, justifyContent: "center" },
  instrCellLast: { flex: 1, padding: "5 6", fontSize: 8, justifyContent: "center" },

  // ── Referências table ────────────────────────────────
  refTable: {
    marginHorizontal: PAD,
    border: `1px solid ${C.black}`,
    marginBottom: 10,
  },
  refHeader: { flexDirection: "row", backgroundColor: C.navy },
  refHeaderCell: { padding: "4 6", borderRight: `0.5px solid #445` },
  refRow: { flexDirection: "row", borderBottom: `0.5px solid ${C.midGray}` },
  refRowLast: { flexDirection: "row" },
  refNormaCell: { width: 130, padding: "4 6", borderRight: `0.5px solid ${C.midGray}`, justifyContent: "center" },
  refTituloCell: { flex: 1, padding: "4 6", justifyContent: "center" },

  // ── Checklist item ───────────────────────────────────
  itemTable: {
    border: `1px solid ${C.black}`,
    marginBottom: 5,
    marginHorizontal: PAD,
  },
  tRow: { flexDirection: "row", borderBottom: `0.5px solid ${C.black}` },
  tRowLast: { flexDirection: "row" },
  tCodeBox: {
    width: 50,
    backgroundColor: C.navy,
    justifyContent: "center",
    alignItems: "center",
    padding: "4 3",
  },
  tCodeText: { fontSize: 7, fontFamily: "Helvetica-Bold", color: C.white, textAlign: "center" },
  tDescCell: { flex: 1, padding: "4 6", backgroundColor: C.offWhite, justifyContent: "center" },
  tDescText: { fontSize: 8, fontFamily: "Helvetica-Bold", color: C.black },
  tLabelCell: {
    width: 90,
    backgroundColor: C.lightGray,
    borderRight: `0.5px solid ${C.black}`,
    padding: "4 6",
    justifyContent: "center",
  },
  tLabelText: { fontSize: 7.5, fontFamily: "Helvetica-Bold", color: C.black },
  tValueCell: { flex: 1, padding: "4 6", justifyContent: "center" },
  tValueText: { fontSize: 7.5, color: C.darkGray },

  conformBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 3, alignSelf: "flex-start" },
  conformText: { fontSize: 7.5, fontFamily: "Helvetica-Bold" },

  // ── Media grid ───────────────────────────────────────
  mediaSection: { marginHorizontal: PAD, marginTop: 4, marginBottom: 8 },
  mediaRow: { flexDirection: "row", gap: 6, marginBottom: 6 },
  mediaBox: {
    flex: 1,
    height: 130,
    border: `3px solid ${C.white}`,
    backgroundColor: C.lightGray,
    overflow: "hidden",
  },
  mediaShadow: { border: `1px solid ${C.midGray}`, flex: 1, overflow: "hidden" },
  mediaImg: { width: "100%", height: "100%", objectFit: "cover" },

  // ── Inconformidades table ─────────────────────────────
  incTable: {
    marginHorizontal: PAD,
    border: `1px solid ${C.black}`,
    marginBottom: 10,
  },
  incGroupHeader: {
    backgroundColor: "#2C3E50",
    padding: "5 8",
  },
  incGroupText: { fontSize: 8.5, fontFamily: "Helvetica-Bold", color: C.white },
  incColHeader: { flexDirection: "row", backgroundColor: C.lightGray, borderBottom: `0.5px solid ${C.black}` },
  incColNum: { width: 32, padding: "4 6", borderRight: `0.5px solid ${C.midGray}`, alignItems: "center" },
  incColResumo: { flex: 1, padding: "4 6", borderRight: `0.5px solid ${C.midGray}` },
  incColClass: { width: 60, padding: "4 6" },
  incDataRow: { flexDirection: "row", borderBottom: `0.5px solid ${C.midGray}` },
  incDataRowLast: { flexDirection: "row" },

  // ── Conclusão ─────────────────────────────────────────
  deliveryBox: {
    marginHorizontal: PAD,
    marginTop: 12,
    borderRadius: 8,
    padding: "10 16",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  deliveryText: { fontSize: 14, fontFamily: "Helvetica-Bold" },
  deliveryLabel: { fontSize: 8 },

  // ── Signature ─────────────────────────────────────────
  signRow: {
    flexDirection: "row",
    marginHorizontal: PAD,
    marginTop: 28,
    gap: 20,
  },
  signBox: {
    flex: 1,
    borderTop: `1px solid ${C.black}`,
    paddingTop: 5,
    alignItems: "center",
  },
  signName: { fontSize: 8, fontFamily: "Helvetica-Bold", color: C.black, textAlign: "center" },
  signRole: { fontSize: 7, color: "#666", textAlign: "center", marginTop: 2 },

  // ── Footer ───────────────────────────────────────────
  footer: {
    position: "absolute",
    bottom: 14,
    left: PAD,
    right: PAD,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTop: `0.5px solid ${C.midGray}`,
    paddingTop: 4,
  },
  footerText: { fontSize: 6.5, color: "#999" },
  footerPage: { fontSize: 6.5, color: "#999" },
});

// ─────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────
function conformityDisplay(c: ConformityStatus | null) {
  if (c === "conforme")     return { label: "✓  CONFORME",     bg: C.greenBg, color: C.green };
  if (c === "nao_conforme") return { label: "✗  NÃO CONFORME", bg: C.redBg,   color: C.red };
  if (c === "na")           return { label: "—  N/A",           bg: C.lightGray, color: "#666" };
  return                           { label: "Não avaliado",     bg: "#FFF8E1", color: "#E65100" };
}

function severityLabel(s: Severity | null) {
  if (!s) return "—";
  return { baixa: "Baixa", media: "Média", alta: "Alta", critica: "Crítica" }[s];
}

function groupBy<T>(arr: T[], key: (i: T) => string): Record<string, T[]> {
  return arr.reduce((acc, i) => { const k = key(i); (acc[k] = acc[k] ?? []).push(i); return acc; }, {} as Record<string, T[]>);
}

function chunk<T>(arr: T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

// ─────────────────────────────────────────────────────────
// SHARED COMPONENTS
// ─────────────────────────────────────────────────────────
function RunningHeader({ project }: { project: Project }) {
  return (
    <View style={S.runningHeader} fixed>
      <View style={S.runningLogo}>
        <Image src="/logos/logo-quali.png" style={S.runningLogoImg} />
      </View>
      <View style={S.runningCenter}>
        <Text style={S.runningTitle}>LAUDO TÉCNICO DE RECEBIMENTO DE ELEVADOR</Text>
        <Text style={S.runningSubtitle}>{project.name}  ·  {project.client}</Text>
      </View>
      <View style={S.runningLogo}>
        <Image src="/logos/logo-melnick.png" style={S.runningLogoImg} />
      </View>
    </View>
  );
}

function Footer({ project }: { project: Project }) {
  return (
    <View style={S.footer} fixed>
      <Text style={S.footerText}>{project.name} — {project.client} — Vistoria: {formatDate(project.auditDate)}</Text>
      <Text style={S.footerPage} render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} fixed />
    </View>
  );
}

// ─────────────────────────────────────────────────────────
// PAGE COMPONENTS
// ─────────────────────────────────────────────────────────

function CoverPage({ project }: { project: Project }) {
  // Rows for the info table — only include filled fields
  const infoRows: [string, string][] = [
    ["Empreendimento", project.name],
    ["Construtora", project.client],
    ...(project.address ? [["Endereço", project.address] as [string, string]] : []),
    ...(project.cep ? [["CEP", project.cep] as [string, string]] : []),
    ...(project.equipmentId ? [["Identificação", project.equipmentId] as [string, string]] : []),
    ...(project.elevatorModel ? [["Linha / Modelo", `${project.elevatorType || "Passageiros"} — ${project.elevatorModel}`] as [string, string]] : []),
    ...(project.capacityKg ? [["Capacidade", `${project.capacityKg} kg — ${project.capacityPersons} pessoas`] as [string, string]] : []),
    ...(project.elevatorSpeed ? [["Velocidade", `${project.elevatorSpeed} m/s`] as [string, string]] : []),
    ...(project.elevatorFloors ? [["Nº de Paradas", `${project.elevatorFloors} paradas`] as [string, string]] : []),
    ["Data da Vistoria", formatDate(project.auditDate)],
    ["Elaboração", formatDate(project.reportDate || project.auditDate)],
    ...(project.auditor ? [["Auditor", project.auditor] as [string, string]] : []),
    ...(project.crea ? [["CREA", project.crea] as [string, string]] : []),
  ];

  return (
    <Page size="A4" style={[S.page, { paddingBottom: 0 }]}>
      {/* ── Top navy band with logos ── */}
      <View style={S.coverTopBand}>
        <View style={S.coverLogo}>
          <Image src="/logos/logo-quali.png" style={S.coverLogoImg} />
        </View>
        <View style={S.coverBandCenter} />
        <View style={S.coverLogo}>
          <Image src="/logos/logo-melnick.png" style={S.coverLogoImg} />
        </View>
      </View>

      {/* ── Title area ── */}
      <View style={S.coverBody}>
        <Text style={S.coverEyebrow}>LAUDO TÉCNICO</Text>
        <Text style={S.coverTitle}>Recebimento{"\n"}de Elevador</Text>
        <View style={S.coverAccentLine} />

        {/* ── Info table ── */}
        <View style={S.coverInfoTable}>
          {infoRows.map(([label, value], i) => (
            <View key={label} style={i < infoRows.length - 1 ? S.coverInfoRow : S.coverInfoRowLast}>
              <View style={S.coverInfoLabel}>
                <Text>{label}</Text>
              </View>
              <View style={S.coverInfoValue}>
                <Text>{value}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* ── Bottom navy band ── */}
      <View style={S.coverBottomBand}>
        <Text style={S.coverBottomText}>VISTORIA TÉCNICA DE ELEVADORES</Text>
        <Text style={S.coverBottomBold}>{formatDate(project.auditDate)}</Text>
      </View>
    </Page>
  );
}

function SumarioPage({ project }: { project: Project }) {
  const sections = [
    { num: "1", title: "INFORMAÇÕES GERAIS" },
    { num: "2", title: "OBJETIVO" },
    { num: "3", title: "METODOLOGIA" },
    { num: "4", title: "INSTRUMENTOS" },
    { num: "5", title: "REFERÊNCIA TÉCNICA" },
    { num: "6", title: "INSPEÇÃO", subs: [
      "6.1  Casa de Máquinas",
      "6.2  Topo da Cabina",
      "6.3  Caixa de Corrida",
      "6.4  Pavimento",
      "6.5  Interior da Cabina",
      "6.6  Poço",
      "6.7  Inferior da Cabina",
      "6.8  Contrapeso",
      "6.9  Testes",
    ]},
    { num: "7", title: "INCONFORMIDADES" },
    { num: "8", title: "CONCLUSÃO" },
    { num: "9", title: "ART" },
  ];

  return (
    <Page size="A4" style={S.page}>
      <RunningHeader project={project} />
      <View style={[S.sectionBanner, { marginBottom: 12 }]}>
        <Text style={S.sectionBannerText}>SUMÁRIO</Text>
      </View>
      {sections.map((s) => (
        <View key={s.num}>
          <View style={S.tocRow}>
            <Text style={S.tocNum}>{s.num}</Text>
            <Text style={S.tocTitle}>{s.title}</Text>
          </View>
          {s.subs?.map((sub) => (
            <View key={sub} style={[S.tocRow, { paddingLeft: PAD + 24 }]}>
              <Text style={{ fontSize: 8, color: "#666" }}>{sub}</Text>
            </View>
          ))}
        </View>
      ))}
      <Footer project={project} />
    </Page>
  );
}

function InfoGeraPage({ project }: { project: Project }) {
  const rows: [string, string][] = [
    ["Empreendimento", project.name],
    ["Endereço", project.address || "—"],
    ["CEP", project.cep || "—"],
    ["Construtora", project.client],
    ["Identificação do Equipamento", project.equipmentId || "—"],
    ["Data da Auditoria", formatDate(project.auditDate)],
    ["Elaboração do Relatório", formatDate(project.reportDate || project.auditDate)],
    ["Auditor", project.auditor || "—"],
    ["CREA", project.crea || "—"],
    ["Tipo de Elevador", project.elevatorType || "Passageiros"],
    ["Linha / Modelo", project.elevatorModel || "—"],
    ["Capacidade", project.capacityKg ? `${project.capacityKg} kg — ${project.capacityPersons} pessoas` : "—"],
    ["Velocidade", project.elevatorSpeed ? `${project.elevatorSpeed} m/s` : "—"],
    ["Número de Paradas", project.elevatorFloors ? `${project.elevatorFloors} paradas` : "—"],
  ];

  return (
    <Page size="A4" style={S.page}>
      <RunningHeader project={project} />
      <View style={[S.sectionBanner, { marginBottom: 10 }]}>
        <Text style={S.sectionBannerText}>1  INFORMAÇÕES GERAIS</Text>
      </View>

      <View style={S.infoTable}>
        {rows.map(([label, value], i) => (
          <View key={label} style={i < rows.length - 1 ? S.infoRow : S.infoRowLast}>
            <View style={S.infoLabel}>
              <Text style={S.infoLabelTxt}>{label}</Text>
            </View>
            <View style={S.infoValue}>
              <Text style={S.infoValueTxt}>{value}</Text>
            </View>
          </View>
        ))}
      </View>
      <Footer project={project} />
    </Page>
  );
}

function ObjetivoMetodologiaPage({ project }: { project: Project }) {
  return (
    <Page size="A4" style={S.page}>
      <RunningHeader project={project} />
      <View style={[S.sectionBanner, { marginBottom: 8 }]}>
        <Text style={S.sectionBannerText}>2  OBJETIVO</Text>
      </View>
      <Text style={S.bodyText}>{STATIC_CONTENT.objetivo}</Text>

      <View style={[S.sectionBanner, { marginBottom: 8 }]}>
        <Text style={S.sectionBannerText}>3  METODOLOGIA</Text>
      </View>
      <Text style={S.bodyText}>{STATIC_CONTENT.metodologia}</Text>
      <Footer project={project} />
    </Page>
  );
}

function InstrumentosPage({ project }: { project: Project }) {
  const { instrumentos } = STATIC_CONTENT;
  return (
    <Page size="A4" style={S.page}>
      <RunningHeader project={project} />
      <View style={[S.sectionBanner, { marginBottom: 8 }]}>
        <Text style={S.sectionBannerText}>4  INSTRUMENTOS</Text>
      </View>

      <View style={S.instrTable}>
        <View style={S.instrHeader}>
          <View style={[S.instrHeaderCell, { width: 110 }]}>
            <Text style={S.instrHeaderText}>INSTRUMENTO</Text>
          </View>
          <View style={S.instrHeaderCell}>
            <Text style={S.instrHeaderText}>MODELO</Text>
          </View>
          <View style={[S.instrHeaderCell, { borderRight: undefined }]}>
            <Text style={S.instrHeaderText}>CERTIFICADO</Text>
          </View>
        </View>
        {instrumentos.map((inst, i) => (
          <View key={inst.nome} style={i < instrumentos.length - 1 ? S.instrRow : S.instrRowLast}>
            <View style={[S.instrCell, { width: 110 }]}>
              <Text style={{ fontSize: 8 }}>{inst.nome}</Text>
            </View>
            <View style={S.instrCell}>
              <Text style={{ fontSize: 8 }}>{inst.modelo}</Text>
            </View>
            <View style={S.instrCellLast}>
              <Text style={{ fontSize: 8 }}>{inst.certificado || "—"}</Text>
            </View>
          </View>
        ))}
      </View>
      <Footer project={project} />
    </Page>
  );
}

function ReferenciasPage({ project }: { project: Project }) {
  const { referencias } = STATIC_CONTENT;
  return (
    <Page size="A4" style={S.page}>
      <RunningHeader project={project} />
      <View style={[S.sectionBanner, { marginBottom: 8 }]}>
        <Text style={S.sectionBannerText}>5  REFERÊNCIA TÉCNICA</Text>
      </View>
      <Text style={[S.bodyText, { marginBottom: 6 }]}>
        A inspeção foi pautada pelas diretrizes da Associação Brasileira de Normas Técnicas (ABNT) e pela legislação federal aplicável, com destaque para as seguintes normas:
      </Text>

      <View style={S.refTable}>
        <View style={S.refHeader}>
          <View style={[S.refHeaderCell, { width: 130 }]}>
            <Text style={{ fontSize: 7.5, fontFamily: "Helvetica-Bold", color: C.white }}>DECRETO / NORMA / LEI</Text>
          </View>
          <View style={[S.refHeaderCell, { flex: 1, borderRight: undefined }]}>
            <Text style={{ fontSize: 7.5, fontFamily: "Helvetica-Bold", color: C.white }}>TÍTULO</Text>
          </View>
        </View>
        {referencias.map((ref, i) => (
          <View key={ref.norma} style={i < referencias.length - 1 ? S.refRow : S.refRowLast}>
            <View style={S.refNormaCell}>
              <Text style={{ fontSize: 7.5, fontFamily: "Helvetica-Bold" }}>{ref.norma}</Text>
            </View>
            <View style={S.refTituloCell}>
              <Text style={{ fontSize: 7.5 }}>{ref.titulo}</Text>
            </View>
          </View>
        ))}
      </View>
      <Footer project={project} />
    </Page>
  );
}

function InspectionIntroPage({ project }: { project: Project }) {
  return (
    <Page size="A4" style={S.page}>
      <RunningHeader project={project} />
      <View style={[S.sectionBanner, { marginBottom: 10 }]}>
        <Text style={S.sectionBannerText}>6  INSPEÇÃO</Text>
      </View>
      {/* Diagrama de inspeção — coloque a imagem em public/images/diagrama-inspecao.jpg */}
      <Image
        src="/images/diagrama-inspecao.jpg"
        style={{ marginHorizontal: PAD, height: 340, objectFit: "contain" }}
      />
      <Footer project={project} />
    </Page>
  );
}

function ItemRow({ item }: { item: AuditItem }) {
  const conf = conformityDisplay(item.conformity);
  return (
    <View style={S.itemTable} wrap={false}>
      <View style={S.tRow}>
        <View style={S.tCodeBox}>
          <Text style={S.tCodeText}>{item.itemCode}</Text>
        </View>
        <View style={S.tDescCell}>
          <Text style={S.tDescText}>{item.description}</Text>
        </View>
      </View>
      <View style={S.tRow}>
        <View style={S.tLabelCell}><Text style={S.tLabelText}>Conformidade</Text></View>
        <View style={S.tValueCell}>
          <View style={[S.conformBadge, { backgroundColor: conf.bg }]}>
            <Text style={[S.conformText, { color: conf.color }]}>{conf.label}</Text>
          </View>
        </View>
      </View>
      <View style={S.tRow}>
        <View style={S.tLabelCell}><Text style={S.tLabelText}>Responsabilidade</Text></View>
        <View style={S.tValueCell}><Text style={S.tValueText}>{item.responsibility || "—"}</Text></View>
      </View>
      <View style={S.tRowLast}>
        <View style={S.tLabelCell}><Text style={S.tLabelText}>Observação</Text></View>
        <View style={S.tValueCell}><Text style={S.tValueText}>{item.observation || "—"}</Text></View>
      </View>
    </View>
  );
}

function MediaGrid({ files }: { files: AuditItem["mediaFiles"] }) {
  const images = files.filter((m) => m.type === "image");
  if (!images.length) return null;
  return (
    <View style={S.mediaSection}>
      {chunk(images, 2).map((pair, pi) => (
        <View key={pi} style={S.mediaRow}>
          {pair.map((m) => (
            <View key={m.id} style={S.mediaBox}>
              <View style={S.mediaShadow}>
                <Image src={m.url} style={S.mediaImg} />
              </View>
            </View>
          ))}
          {pair.length === 1 && <View style={[S.mediaBox, { opacity: 0 }]} />}
        </View>
      ))}
    </View>
  );
}

function ChecklistSectionPage({
  project,
  sectionCode,
  sectionTitle,
  items,
}: {
  project: Project;
  sectionCode: string;
  sectionTitle: string;
  items: AuditItem[];
}) {
  return (
    <Page size="A4" style={S.page}>
      <RunningHeader project={project} />
      <View style={[S.sectionBanner, { marginBottom: 6 }]}>
        <Text style={S.sectionBannerText}>{sectionCode}  {sectionTitle.toUpperCase()}</Text>
      </View>
      {items.map((item) => (
        <View key={item.id}>
          <ItemRow item={item} />
          {item.mediaFiles.filter((m) => m.type === "image").length > 0 && (
            <MediaGrid files={item.mediaFiles} />
          )}
        </View>
      ))}
      <Footer project={project} />
    </Page>
  );
}

function InconformidadesPage({ project }: { project: Project }) {
  const ncItems = project.auditItems.filter((i) => i.conformity === "nao_conforme");

  // Group by responsibility: items with "OBRA" in responsibility go to OBRA, rest to FORNECEDORA
  const obra = ncItems.filter((i) => i.responsibility.toUpperCase().includes("OBRA"));
  const fornecedora = ncItems.filter((i) => !i.responsibility.toUpperCase().includes("OBRA"));

  let obrasCounter = 1;
  let fornCounter = 1;

  const deliveryApto = project.deliveryStatus === "apto";

  return (
    <Page size="A4" style={S.page}>
      <RunningHeader project={project} />
      <View style={[S.sectionBanner, { marginBottom: 8 }]}>
        <Text style={S.sectionBannerText}>7  INCONFORMIDADES</Text>
      </View>

      {ncItems.length === 0 ? (
        <View style={{ marginHorizontal: PAD, padding: 16, backgroundColor: C.greenBg, borderRadius: 6 }}>
          <Text style={{ fontSize: 9, color: C.green, fontFamily: "Helvetica-Bold" }}>
            ✓  Nenhuma inconformidade identificada durante a vistoria.
          </Text>
        </View>
      ) : (
        <>
          {fornecedora.length > 0 && (
            <View style={S.incTable}>
              <View style={S.incGroupHeader}><Text style={S.incGroupText}>FORNECEDORA</Text></View>
              <View style={S.incColHeader}>
                <View style={S.incColNum}><Text style={[S.tLabelText, { textAlign: "center" }]}>Nº</Text></View>
                <View style={S.incColResumo}><Text style={S.tLabelText}>Resumo</Text></View>
                <View style={[S.incColResumo, { width: 80, flex: undefined }]}><Text style={S.tLabelText}>Responsável</Text></View>
                <View style={S.incColClass}><Text style={S.tLabelText}>Classif.</Text></View>
              </View>
              {fornecedora.map((item, idx) => (
                <View key={item.id} style={idx < fornecedora.length - 1 ? S.incDataRow : S.incDataRowLast}>
                  <View style={S.incColNum}><Text style={{ fontSize: 8, textAlign: "center" }}>{fornCounter++}</Text></View>
                  <View style={S.incColResumo}><Text style={{ fontSize: 8 }}>{item.observation || item.description}</Text></View>
                  <View style={[S.incColResumo, { width: 80, flex: undefined }]}><Text style={{ fontSize: 8 }}>{item.responsibility || "—"}</Text></View>
                  <View style={S.incColClass}><Text style={{ fontSize: 8 }}>{severityLabel(item.severity)}</Text></View>
                </View>
              ))}
            </View>
          )}

          {obra.length > 0 && (
            <View style={S.incTable}>
              <View style={S.incGroupHeader}><Text style={S.incGroupText}>OBRA</Text></View>
              <View style={S.incColHeader}>
                <View style={S.incColNum}><Text style={[S.tLabelText, { textAlign: "center" }]}>Nº</Text></View>
                <View style={S.incColResumo}><Text style={S.tLabelText}>Resumo</Text></View>
                <View style={[S.incColResumo, { width: 80, flex: undefined }]}><Text style={S.tLabelText}>Responsável</Text></View>
                <View style={S.incColClass}><Text style={S.tLabelText}>Classif.</Text></View>
              </View>
              {obra.map((item, idx) => (
                <View key={item.id} style={idx < obra.length - 1 ? S.incDataRow : S.incDataRowLast}>
                  <View style={S.incColNum}><Text style={{ fontSize: 8, textAlign: "center" }}>{obrasCounter++}</Text></View>
                  <View style={S.incColResumo}><Text style={{ fontSize: 8 }}>{item.observation || item.description}</Text></View>
                  <View style={[S.incColResumo, { width: 80, flex: undefined }]}><Text style={{ fontSize: 8 }}>{item.responsibility || "—"}</Text></View>
                  <View style={S.incColClass}><Text style={{ fontSize: 8 }}>{severityLabel(item.severity)}</Text></View>
                </View>
              ))}
            </View>
          )}
        </>
      )}

      {/* Delivery status badge */}
      <View style={[
        S.deliveryBox,
        { backgroundColor: deliveryApto ? C.greenBg : project.deliveryStatus === "inapto" ? C.redBg : "#FFF8E1" }
      ]}>
        <Text style={[S.deliveryText, { color: deliveryApto ? C.green : project.deliveryStatus === "inapto" ? C.red : "#E65100" }]}>
          {deliveryApto ? "✅" : project.deliveryStatus === "inapto" ? "❌" : "⏳"}
        </Text>
        <View>
          <Text style={[S.deliveryText, { color: deliveryApto ? C.green : project.deliveryStatus === "inapto" ? C.red : "#E65100" }]}>
            {deliveryApto ? "ENTREGA APTO" : project.deliveryStatus === "inapto" ? "ENTREGA INAPTA" : "PARECER PENDENTE"}
          </Text>
          <Text style={[S.deliveryLabel, { color: "#666" }]}>
            Vistoria realizada em {formatDate(project.auditDate)}
          </Text>
        </View>
      </View>

      <Footer project={project} />
    </Page>
  );
}

function ConclusaoPage({ project }: { project: Project }) {
  const naoConformes = project.auditItems.filter((i) => i.conformity === "nao_conforme").length;

  return (
    <Page size="A4" style={S.page}>
      <RunningHeader project={project} />
      <View style={[S.sectionBanner, { marginBottom: 10 }]}>
        <Text style={S.sectionBannerText}>8  CONCLUSÃO</Text>
      </View>

      <Text style={S.bodyText}>{STATIC_CONTENT.conclusao}</Text>

      {naoConformes > 0 && (
        <Text style={[S.bodyText, { marginTop: 6 }]}>
          Foram identificadas {naoConformes} inconformidade{naoConformes > 1 ? "s" : ""} durante a vistoria, conforme detalhado na seção 7 deste relatório, as quais deverão ser sanadas pelos responsáveis indicados nos respectivos registros.
        </Text>
      )}

      {/* Signature block */}
      <View style={S.signRow}>
        <View style={S.signBox}>
          <Text style={S.signName}>{project.auditor || "RESPONSÁVEL TÉCNICO"}</Text>
          <Text style={S.signRole}>{project.crea || "Engenheiro / Técnico"}</Text>
          <Text style={[S.signRole, { marginTop: 2 }]}>Responsável pela Vistoria</Text>
        </View>
        <View style={S.signBox}>
          <Text style={S.signName}>REPRESENTANTE DO CLIENTE</Text>
          <Text style={S.signRole}>{project.client}</Text>
        </View>
        <View style={S.signBox}>
          <Text style={S.signName}>DATA DE EMISSÃO</Text>
          <Text style={S.signRole}>{formatDate(project.reportDate || project.auditDate)}</Text>
        </View>
      </View>

      <Footer project={project} />
    </Page>
  );
}

// ─────────────────────────────────────────────────────────
// MAIN DOCUMENT
// ─────────────────────────────────────────────────────────
function AuditPdfDocument({ project }: { project: Project }) {
  const bySection = groupBy(project.auditItems, (i) => i.sectionCode);
  const sectionOrder = [...new Set(project.auditItems.map((i) => i.sectionCode))];

  return (
    <Document
      title={`Laudo Técnico — ${project.name}`}
      author={project.auditor || "Sistema de Auditoria"}
      creator="Auditoria de Elevadores"
    >
      <CoverPage project={project} />
      <SumarioPage project={project} />
      <InfoGeraPage project={project} />
      <ObjetivoMetodologiaPage project={project} />
      <InstrumentosPage project={project} />
      <ReferenciasPage project={project} />
      <InspectionIntroPage project={project} />

      {sectionOrder.map((code) => (
        <ChecklistSectionPage
          key={code}
          project={project}
          sectionCode={code}
          sectionTitle={bySection[code][0].sectionTitle}
          items={bySection[code]}
        />
      ))}

      <InconformidadesPage project={project} />
      <ConclusaoPage project={project} />
    </Document>
  );
}

// ─────────────────────────────────────────────────────────
// EXPORT BUTTON
// ─────────────────────────────────────────────────────────
export function PdfExportButton({ project }: { project: Project }) {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const blob = await pdf(<AuditPdfDocument project={project} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Laudo_${project.name.replace(/\s+/g, "_")}_${project.auditDate}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white font-semibold px-5 py-3 rounded-xl transition-colors"
    >
      {loading ? <Loader2 size={18} className="animate-spin" /> : <FileDown size={18} />}
      {loading ? "Gerando PDF..." : "Exportar PDF"}
    </button>
  );
}
