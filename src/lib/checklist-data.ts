import { ChecklistTemplate } from "@/types";

// Checklist baseado exatamente no Laudo Técnico de Recebimento de Elevador

export const ELEVATOR_CHECKLIST: ChecklistTemplate[] = [
  {
    sectionCode: "6.1",
    sectionTitle: "Casa de Máquinas",
    items: [
      { itemCode: "5.1.1", description: "Quadro de comando/força está devidamente limpo, prumado e fixado?" },
      { itemCode: "5.1.2", description: "Quadro de comando/força possui terminais apropriados e suas conexões estão devidamente apertadas?" },
      { itemCode: "5.1.3", description: "Os principais componentes eletrônicos do quadro de comando possuem temperatura normal de utilização?" },
      { itemCode: "5.1.4", description: "Tensão fornecida pela obra apresenta variação máxima de ±10% em relação à tensão especificada no projeto executivo quando o elevador se movimenta em velocidade nominal?" },
      { itemCode: "5.1.5", description: "O sistema de aterramento fornecido pela obra apresenta qualidade satisfatória, com resistência variando entre 0 Ω e 5 Ω?" },
      { itemCode: "5.1.6", description: "A base da máquina do elevador apresenta boa fixação, com todos os seus parafusos, porcas e arruelas devidamente instalados?" },
      { itemCode: "5.1.7", description: "A base da máquina do elevador possui todos os seus amortecedores devidamente fixados com porca, contraporca e cupilhas?" },
      { itemCode: "5.1.8", description: "A base da máquina de tração e máquina de tração apresentam fixação correta e nivelamento?" },
      { itemCode: "5.1.9", description: "Autotransformador está devidamente instalado, prumado e aterrado e sua proteção está corretamente instalada?" },
      { itemCode: "5.1.10", description: "Os elementos de tração (Cabo de aço, cintas ou corrente) estão devidamente instalados, equalizados e destorcidos conforme manual do fabricante?" },
      { itemCode: "5.1.11", description: "O Regulador de velocidade do elevador está corretamente instalado e prumado, conforme manual do fabricante?" },
      { itemCode: "5.1.12", description: "Os tirantes da cabina e contrapeso estão devidamente instalados com porca, contraporca e cupilhas?" },
      { itemCode: "5.1.13", description: "Os ganchos da laje da casa de máquinas apresentam pintura em amarelo e indicação de carga, conforme projeto executivo?" },
      { itemCode: "5.1.14", description: "A janela de inspeção/ventilação está instalada conforme projeto executivo?" },
    ],
  },
  {
    sectionCode: "6.2",
    sectionTitle: "Topo da Cabina",
    items: [
      { itemCode: "6.2.1", description: "Estrutura da cabina possui todos os parafusos instalados?" },
      { itemCode: "6.2.2", description: "Operador de portas da cabina está corretamente instalado, prumado e testado, conforme manual da fabricante?" },
      { itemCode: "6.2.3", description: "A chave eletrônica e sensor de nivelamento estão devidamente instaladas, prumadas e testadas, conforme manual do fabricante?" },
      { itemCode: "6.2.4", description: "As corrediças da cabina estão fixadas e em bom estado de conservação?" },
      { itemCode: "6.2.5", description: "Guarda corpo da cabina está instalada conforme manual do fabricante?" },
      { itemCode: "6.2.6", description: "A rampa dos limites físicos está corretamente instalada e prumada?" },
      { itemCode: "6.2.7", description: "Topo da cabina apresenta limpeza e organização aceitável para entrega do equipamento?" },
    ],
  },
  {
    sectionCode: "6.3",
    sectionTitle: "Caixa de Corrida",
    items: [
      { itemCode: "6.3.1", description: "As portas de pavimento do elevador estão corretamente instaladas, prumadas e não apresentam sinais de riscos ou amassados?" },
      { itemCode: "6.3.2", description: "Os suportes de guia (cabina e contrapeso) estão fixados corretamente com seus parafusos, porcas e arruelas, conforme manual do fabricante?" },
      { itemCode: "6.3.3", description: "Cabo de manobra do elevador está corretamente instalado e não apresenta sinais de avarias?" },
      { itemCode: "6.3.4", description: "As guias de cabina e contrapeso estão instaladas, lubrificadas e não apresentam sinais de avaria?" },
      { itemCode: "6.3.5", description: "As guias de cabina e contrapeso estão com as medidas (entre guias) corretas de acordo com o projeto executivo da fornecedora?" },
      { itemCode: "6.3.6", description: "As placas e ímãs de parada estão corretamente instaladas, sem sinais de avaria?" },
      { itemCode: "6.3.7", description: "As medidas de deslize da cabina e contrapeso estão corretas conforme projeto executivo?" },
      { itemCode: "6.3.8", description: "A iluminação da caixa de corrida apresenta os 50lx mínimos solicitados por norma, a 1m de altura do poço e 1m de altura do topo da cabina." },
      { itemCode: "6.3.9", description: "A caixa de corrida apresenta vãos ou furos que facilitem o acúmulo de poeira ou outros resíduos?" },
    ],
  },
  {
    sectionCode: "6.4",
    sectionTitle: "Pavimento",
    items: [
      { itemCode: "6.4.1", description: "Todas as portas de pavimento foram testadas por meio de abertura manual, verificando-se que o elevador interrompe o movimento e permanece parado quando qualquer porta é aberta?" },
      { itemCode: "6.4.2", description: "Todas as botoeiras e indicadores foram testados e apresentam condições normais de funcionamento (chamas, gongo etc.)?" },
      { itemCode: "6.4.3", description: "Soleiras de pavimento apresentam medidas de vão ≤ 35mm, conforme norma?" },
      { itemCode: "6.4.4", description: "Soleiras de pavimento foram corretamente fixadas e apresentam boas condições de limpeza e sem avarias?" },
      { itemCode: "6.4.5", description: "Intercomunicador foi testado e apresenta condições normais de funcionamento?" },
    ],
  },
  {
    sectionCode: "6.5",
    sectionTitle: "Interior da Cabina",
    items: [
      { itemCode: "6.5.1", description: "Painéis da cabina foram inspecionados e apresentam bom estado de conservação, sem riscos ou amassados?" },
      { itemCode: "6.5.2", description: "Espelho e guarda corpo da cabina apresentam boas condições de conservação?" },
      { itemCode: "6.5.3", description: "Iluminação da cabina apresenta quantidade mínima de 100lx a uma distância de 1m do piso?" },
      { itemCode: "6.5.4", description: "Régua eletrônica da cabina apresenta condições normais de funcionamento?" },
      { itemCode: "6.5.5", description: "Painel de operação apresenta condições normais de funcionamento e conservação?" },
      { itemCode: "6.5.6", description: "Botão de alarme apresenta condições normais de funcionamento e boa conservação?" },
      { itemCode: "6.5.7", description: "Cabina apresenta conforto no percurso de extremo a extremo?" },
    ],
  },
  {
    sectionCode: "6.6",
    sectionTitle: "Poço",
    items: [
      { itemCode: "6.6.1", description: "Escada do poço apresenta boas condições de conservação? Quando móvel, apresenta contato elétrico?" },
      { itemCode: "6.6.2", description: "Botão de emergência do poço apresenta condições normais de funcionamento?" },
      { itemCode: "6.6.3", description: "Poço apresenta pintura e limpeza em boas condições?" },
      { itemCode: "6.6.4", description: "Sistema de amortecimento (mola, buffer ou pistão) apresenta boas condições de funcionamento e conservação? Se for pistão, o contato elétrico apresenta funcionamento regular?" },
      { itemCode: "6.6.5", description: "Polia tensora e contato elétrico foram devidamente testados e apresentam condições normais de funcionamento?" },
      { itemCode: "6.6.6", description: "Suportes e corrente de compensação apresentam instalação correta?" },
      { itemCode: "6.6.7", description: "Botoeira de inspeção do poço foi instalada corretamente e apresenta condições normais de funcionamento?" },
      { itemCode: "6.6.8", description: "Proteção de contrapeso está instalada corretamente e possui no máximo 300mm de altura do piso do poço conforme norma?" },
    ],
  },
  {
    sectionCode: "6.7",
    sectionTitle: "Inferior da Cabina",
    items: [
      { itemCode: "6.7.1", description: "Estrutura da cabina está montada corretamente, com seus travamentos e amortecedores conforme manual da fabricante?" },
      { itemCode: "6.7.2", description: "Aparelho de segurança foi instalado corretamente e possui a placa de identificação?" },
    ],
  },
  {
    sectionCode: "6.8",
    sectionTitle: "Contrapeso",
    items: [
      { itemCode: "6.8.1", description: "Estrutura de contrapeso foi montada corretamente conforme manual do fabricante?" },
      { itemCode: "6.8.2", description: "Corrediças de contrapeso foram corretamente instaladas e apresentam bom estado de conservação?" },
      { itemCode: "6.8.3", description: "Folgas do contrapeso estão de acordo com o manual do fabricante?" },
    ],
  },
  {
    sectionCode: "6.9",
    sectionTitle: "Testes",
    items: [
      { itemCode: "TESTE 1", description: "FREIO DE SEGURANÇA (APARELHO DE SEGURANÇA)" },
      { itemCode: "TESTE 2", description: "ILUMINAÇÃO DE EMERGÊNCIA (QUEDA DE LUZ)" },
      { itemCode: "TESTE 3", description: "RESGATE AUTOMÁTICO (QUEDA DE LUZ)" },
      { itemCode: "TESTE 4", description: "RESGATE MANUAL (QUEDA DE LUZ)" },
      { itemCode: "TESTE 5", description: "MODO INCÊNDIO (BOMBEIRO)" },
      { itemCode: "TESTE 6", description: "PERCURSO VELOCIDADE NOMINAL — 100% CARGA" },
      { itemCode: "TESTE 7", description: "EXCESSO DE CARGA (110% DA CARGA NOMINAL)" },
      { itemCode: "TESTE 8", description: "VELOCIDADE NOMINAL DO ELEVADOR" },
      { itemCode: "TESTE 9", description: "TEMPO MÉDIO DE ABERTURA DE PORTAS DE PAVIMENTO" },
    ],
  },
];

// Static content — copied verbatim from the legacy report
export const STATIC_CONTENT = {
  objetivo: `Este laudo técnico de entrega tem como objetivo verificar e registrar a conformidade do elevador de passageiros com os requisitos de segurança e com as normas técnicas vigentes aplicáveis. Para isso, serão revisados todos os itens normativos e de segurança pertinentes ao equipamento e à instalação, incluindo a conferência dos sistemas, dispositivos e condições operacionais.\n\nAdicionalmente, serão executados e documentados os testes e ensaios exigidos, a fim de validar o funcionamento, a integridade e o desempenho dos dispositivos de segurança e dos modos de operação previstos, emitindo ao final o parecer técnico quanto à aptidão do elevador para entrega e uso.`,

  metodologia: `A vistoria técnica foi realizada por meio de inspeção visual detalhada de todos os componentes e itens relacionados à montagem do elevador, com o objetivo de verificar as condições aparentes de instalação, integridade dos componentes e conformidade com os requisitos técnicos aplicáveis.\n\nDurante a inspeção, foram avaliados os principais elementos do sistema, incluindo componentes mecânicos, estruturais e de segurança, observando-se possíveis sinais de desgaste, desalinhamento, fixações inadequadas ou quaisquer outras irregularidades visíveis que pudessem comprometer o funcionamento adequado do equipamento.\n\nAdicionalmente, foram executados testes operacionais e de segurança em conjunto com um técnico da empresa fornecedora do equipamento. Esses testes tiveram como objetivo verificar o correto funcionamento dos dispositivos de segurança e das funcionalidades operacionais do elevador, bem como confirmar o desempenho esperado dos sistemas instalados.\n\nSempre que necessário, foram realizados testes complementares considerados pertinentes durante a vistoria, de acordo com as condições observadas no local e com os critérios técnicos adotados para a avaliação.\n\nPara a realização das verificações e medições aplicáveis, foram utilizados instrumentos devidamente calibrados e com certificação válida, garantindo a confiabilidade dos resultados obtidos durante o processo de inspeção.\n\nAs pendências eventualmente identificadas durante a vistoria serão registradas e classificadas conforme o seu grau de criticidade, podendo ser enquadradas como baixa, média, alta ou crítica, de acordo com o potencial de impacto na segurança, no funcionamento e na conformidade técnica do equipamento.`,

  conclusao: `Após a realização da vistoria técnica, constatou-se que, na data da inspeção, o elevador apresentava condições adequadas para utilização.\n\nRessalta-se, contudo, que a fornecedora do equipamento deverá disponibilizar todos os laudos pertinentes, bem como o dossiê técnico completo do elevador, de forma a atender às exigências técnicas e documentais aplicáveis.\n\nDestaca-se ainda, que esta conclusão reflete exclusivamente as condições verificadas na data da vistoria, podendo o cenário ser alterado futuramente em função do estado de conservação, uso e manutenção do equipamento.\n\nPermanece sob responsabilidade da fornecedora a execução da manutenção adequada e periódica, de modo a garantir a continuidade das condições seguras e apropriadas de funcionamento do elevador.`,

  referencias: [
    { norma: "ABNT NBR 14364:1999", titulo: "Elevadores e escadas rolantes – Inspetores de elevadores e escadas rolantes – Qualificação" },
    { norma: "ABNT NBR 5410:2004", titulo: "Instalações elétricas de baixa tensão." },
    { norma: "ABNT NBR NM 313:2007", titulo: "Elevadores de passageiros – Requisitos de segurança para construção e instalação – Requisitos particulares para a acessibilidade das pessoas, incluindo pessoas com deficiência" },
    { norma: "ABNT NBR 15597:2010", titulo: "Requisitos de segurança para a construção e instalação de elevadores – Elevadores existentes – Requisitos para melhoria da segurança dos elevadores elétricos de passageiros e cargas." },
    { norma: "ABNT NBR 16042:2012", titulo: "Elevadores elétricos de passageiros – Requisitos de segurança para construção e instalação de elevadores sem casa de máquinas" },
    { norma: "ABNT NBR 16083:2012", titulo: "Manutenção de elevadores, escadas rolantes e esteiras rolantes – Requisitos para instrução de Manutenção." },
    { norma: "ABNT NBR 16858-1:2021", titulo: "Elevadores – Requisitos de segurança para construção e instalação Parte 1: Elevadores de passageiros e elevadores de passageiros e cargas" },
    { norma: "ABNT NBR 16858-3:2022", titulo: "Elevadores – Requisitos de segurança para construção e instalação Parte 3: Acessibilidade em elevadores para pessoas, incluindo pessoas com deficiência." },
    { norma: "ABNT NBR 16858-7:2022", titulo: "Elevadores – Requisitos de segurança para construção e instalação Parte 7: Melhoria da segurança de elevadores de passageiros e elevadores de passageiros e cargas existentes" },
    { norma: "NR-12", titulo: "Segurança na Operação de Máquinas e Equipamentos." },
    { norma: "NR-26", titulo: "Sinalização de Segurança." },
    { norma: "LEI ESTADUAL N° 13.413/2010", titulo: "Altera a Lei n.º 11.369, de 14 de setembro de 1999, que dispõe sobre a fixação de avisos nas portas externas dos elevadores instalados nos prédios públicos e privados." },
  ],

  instrumentos: [
    { nome: "Trena Laser", modelo: "BOSCH 50m GLM50-12", certificado: "ISO 1633-1" },
    { nome: "Termômetro Digital", modelo: "TPA-2000 ALLNEC", certificado: "" },
    { nome: "Multímetro", modelo: "MD-750", certificado: "" },
    { nome: "Luxímetro Digital", modelo: "CB-3000-200.000", certificado: "" },
    { nome: "Decibelímetro", modelo: "AKROM Kr853", certificado: "" },
    { nome: "Termômetro Infravermelho", modelo: "BOM 6701", certificado: "" },
    { nome: "Paquímetro Digital", modelo: "BOM-6502", certificado: "" },
  ],
};
