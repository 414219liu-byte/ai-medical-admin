import type { ConsultationSlot, ProgressResult, SlotInfoState, SlotValue } from '../types/ai-clinic'

const coefficients: Record<SlotInfoState, number> = {
  用户明确输入: 1,
  用户点击快捷选项: 1,
  用户点击身体部位图: 1,
  报告识别后由用户确认: 1,
  报告识别但未确认: 0.6,
  AI根据上下文推断: 0.5,
  用户表达模糊: 0.3,
  信息冲突: 0,
  未回答: 0,
  不适用: 0
}

export function calculateConsultationProgress(
  slots: ConsultationSlot[],
  values: SlotValue[],
  options: { patientConfirmed?: boolean; chiefComplaintIdentified?: boolean; riskScreeningDone?: boolean } = {}
): ProgressResult {
  if (options.chiefComplaintIdentified === false) {
    return { score: 0, total: 0, percent: 0, cappedPercent: 0, capReasons: ['尚未识别明确主诉'], rows: [] }
  }

  const activeSlots = slots.filter(slot => slot.status === '已启用')
  const rows = activeSlots.map(slot => {
    const value = values.find(item => item.slotId === slot.id)
    const status = value?.status ?? '未回答'
    const coefficient = status === '不适用' ? 0 : coefficients[status]
    const score = status === '不适用' ? 0 : Math.round(slot.weight * coefficient * 10) / 10
    return {
      slotName: slot.name,
      weight: status === '不适用' ? 0 : slot.weight,
      status,
      coefficient,
      score,
      core: slot.core,
      value: value?.value ?? '未收集'
    }
  })

  const total = rows.reduce((sum, row) => sum + row.weight, 0)
  const score = Math.round(rows.reduce((sum, row) => sum + row.score, 0) * 10) / 10
  const percent = total ? Math.round((score / total) * 100) : 0
  const capReasons: string[] = []
  let cappedPercent = percent

  if (options.patientConfirmed === false) {
    cappedPercent = Math.min(cappedPercent, 20)
    capReasons.push('问诊人未确认，进度最高20%')
  }
  if (options.riskScreeningDone === false) {
    cappedPercent = Math.min(cappedPercent, 80)
    capReasons.push('危险症状筛查未完成，进度最高80%')
  }
  if (rows.some(row => row.core && row.score === 0 && row.status !== '不适用')) {
    cappedPercent = Math.min(cappedPercent, 80)
    capReasons.push('核心槽位缺失，进度最高80%')
  }
  if (rows.some(row => row.status === '信息冲突')) {
    cappedPercent = Math.min(cappedPercent, 80)
    capReasons.push('存在未解决的信息冲突，进度最高80%')
  }

  return { score, total, percent, cappedPercent, capReasons, rows }
}
