import type { ConsultationSlot, ProgressResult, SlotInfoState, SlotValue } from '../types/ai-clinic'

const coefficients: Record<SlotInfoState, number> = {
  用户明确输入: 1,
  快捷选项: 1,
  身体部位图: 1,
  报告识别且用户确认: 1,
  报告识别未确认: 0.6,
  AI上下文推断: 0.5,
  模糊信息: 0.3,
  冲突: 0,
  未填写: 0,
  不适用: 0
}

export function calculateConsultationProgress(
  slotValues: SlotValue[],
  templateSlots: ConsultationSlot[],
  sessionState: { patientConfirmed?: boolean; chiefComplaintIdentified?: boolean; riskScreeningDone?: boolean; highRiskTriggered?: boolean } = {}
): ProgressResult {
  const activeSlots = templateSlots.filter(slot => slot.status === '已启用')
  const rows = activeSlots.map(slot => {
    const value = slotValues.find(item => item.slotId === slot.id)
    const status = value?.status ?? '未填写'
    const coefficient = status === '不适用' ? 0 : coefficients[status]
    const score = status === '不适用' ? 0 : Math.round(slot.weight * coefficient * 10) / 10
    return {
      slotId: slot.id,
      slotName: slot.name,
      weight: status === '不适用' ? 0 : slot.weight,
      status,
      source: value?.source ?? '未填写',
      raw: value?.raw ?? '—',
      confidence: value ? value.confidence.toFixed(2) : '—',
      coefficient,
      score,
      core: slot.core,
      value: value?.value ?? '未填写',
      updatedAt: value?.updatedAt ?? '—'
    }
  })

  const total = rows.reduce((sum, row) => sum + row.weight, 0)
  const score = Math.round(rows.reduce((sum, row) => sum + row.score, 0) * 10) / 10
  const percent = total ? Math.round((score / total) * 100) : 0
  const capReasons: string[] = []
  let cap = 100
  let cappedPercent = percent
  let highRiskInterrupted = false

  if (sessionState.highRiskTriggered) {
    highRiskInterrupted = true
    cap = 0
    cappedPercent = percent
    capReasons.push('触发高风险，停止普通进度计算，进入高风险中断')
    return { score, total, percent, cappedPercent, cap, capReasons, highRiskInterrupted, rows }
  }
  if (sessionState.chiefComplaintIdentified === false) {
    cap = Math.min(cap, 0)
    cappedPercent = 0
    capReasons.push('没有明确主诉，进度为0%')
  }
  if (sessionState.patientConfirmed === false) {
    cap = Math.min(cap, 20)
    cappedPercent = Math.min(cappedPercent, 20)
    capReasons.push('问诊人未确认，进度最高20%')
  }
  if (sessionState.riskScreeningDone === false) {
    cap = Math.min(cap, 80)
    cappedPercent = Math.min(cappedPercent, 80)
    capReasons.push('危险症状筛查未完成，进度最高80%')
  }
  if (rows.some(row => row.core && row.score === 0 && row.status !== '不适用')) {
    cap = Math.min(cap, 80)
    cappedPercent = Math.min(cappedPercent, 80)
    capReasons.push('核心槽位缺失，进度最高80%')
  }
  if (rows.some(row => row.status === '冲突')) {
    cap = Math.min(cap, 80)
    cappedPercent = Math.min(cappedPercent, 80)
    capReasons.push('存在未解决的信息冲突，进度最高80%')
  }

  return { score, total, percent, cappedPercent, cap, capReasons, highRiskInterrupted, rows }
}
