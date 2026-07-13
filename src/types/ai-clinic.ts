import type { RowData } from '../types'

export type SlotInfoState =
  | '用户明确输入'
  | '用户点击快捷选项'
  | '用户点击身体部位图'
  | '报告识别后由用户确认'
  | '报告识别但未确认'
  | 'AI根据上下文推断'
  | '用户表达模糊'
  | '信息冲突'
  | '未回答'
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

export interface SlotValue {
  slotId: string
  sessionId: string
  value: string
  raw: string
  source: SlotInfoState
  status: SlotInfoState
  confidence: number
  updatedAt: string
}

export interface ConsultationTemplate extends RowData {
  id: string
  name: string
  department: string
  system: string
  audience: string
  slotCount: number
  coreSlotCount: number
  autoConclusionScore: string
  bodyMap: string
  directConclusion: string
  version: string
  status: string
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
  templateId: string
  templateName: string
  templateVersion: string
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
}

export interface ProgressResult {
  score: number
  total: number
  percent: number
  cappedPercent: number
  capReasons: string[]
  rows: Array<{
    slotName: string
    weight: number
    status: SlotInfoState
    coefficient: number
    score: number
    core: boolean
    value: string
  }>
}
