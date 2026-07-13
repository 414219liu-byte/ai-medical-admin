import type { RowData } from '../types'

export type SlotInfoState =
  | '用户明确输入'
  | '快捷选项'
  | '身体部位图'
  | '报告识别且用户确认'
  | '报告识别未确认'
  | 'AI上下文推断'
  | '模糊信息'
  | '冲突'
  | '未填写'
  | '不适用'

export interface ConsultationSlot {
  id: string
  templateId: string
  order: number
  name: string
  code: string
  category: string
  component: string
  required: boolean
  core: boolean
  weight: number
  noCounts: boolean
  allowUnknown: boolean
  needConfirm: boolean
  status: string
}

export interface GlobalSlotDefinition extends RowData {
  id: string
  standardName: string
  code: string
  category: string
  dataType: string
  components: string
  standardizable: string
  referencedTemplates: number
  status: string
  updatedAt: string
}

export interface TemplateSlotConfig extends ConsultationSlot {
  standardSlotId: string
  templateVersion: string
  question: string
  quickOptionGroup: string
  freeInput: string
  multiSelect: string
  negativeCompletionRule: string
  unknownAllowed: string
  unknownCoefficient: number
  unknownCompletesCore: string
  effectiveMinCoefficient: number
  continueAskWhenUnknown: string
  maxAsk: number
  preSlot: string
  displayCondition: string
  skipCondition: string
  nextNode: string
  negativeRoute: string
  conflictRoute: string
  triggerTemplateExit: string
  triggerRematch: string
  riskCheck: string
}

export interface SlotValue {
  slotId: string
  sessionId: string
  value: string
  raw: string
  source: string
  status: SlotInfoState
  confidence: number
  updatedAt: string
}

export interface ConsultationTemplate extends RowData {
  id: string
  name: string
  code: string
  templateType: string
  standardSymptom: string
  department: string
  system: string
  audience: string
  priority: number
  slotCount: number
  coreSlotCount: number
  autoConclusionScore: string
  directConclusionMinScore: string
  maxRounds: number
  riskScreeningRequired: string
  templateSwitchPolicy: string
  multiSymptomParallel: string
  otherSymptomPolicy: string
  fallbackTemplateId: string
  promptRef: string
  bodyMap: string
  directConclusion: string
  version: string
  publishStatus: string
  status: string
  lastPublishedAt: string
  updatedAt: string
}

export interface ConsultationTopic extends RowData {
  topicId: string
  sessionId: string
  symptomName: string
  normalizedSymptom: string
  bodySystem: string
  currentTemplateId: string
  currentTemplateVersion: string
  topicStatus: string
  isPrimary: boolean
  sourceMessageId: string
  matchConfidence: string
  progress: string
  riskStatus: string
  createdAt: string
  updatedAt: string
}

export interface AiClinicSession extends RowData {
  id: string
  userId: string
  userName: string
  patientId: string
  patientName: string
  relation: string
  age: number
  gender: string
  chiefComplaint: string
  normalizedSymptoms: string
  initialTemplateId: string
  currentTemplateId: string
  finalTemplateId: string
  templateId: string
  templateName: string
  templateVersion: string
  templateSnapshotId: string
  templateMatchConfidence: number
  modelVersion: string
  riskLevel: string
  status: string
  conclusionType: string
  rounds: number
  multisymptom: string
  hasUpload: string
  startAt: string
  endAt: string
  department: string
  conclusion: string
  clickedDirectConclusion: string
  endReason: string
  currentTopicId: string
  primaryTopicId: string
  topicIds: string
  pendingTopicIds: string
}

export interface ProgressResult {
  score: number
  total: number
  percent: number
  cappedPercent: number
  cap: number
  capReasons: string[]
  highRiskInterrupted: boolean
  rows: Array<{
    slotId: string
    slotName: string
    weight: number
    status: SlotInfoState
    source: string
    raw: string
    confidence: string
    coefficient: number
    score: number
    core: boolean
    value: string
    updatedAt: string
  }>
}
