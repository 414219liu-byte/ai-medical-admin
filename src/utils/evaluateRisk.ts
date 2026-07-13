import type { RowData } from '../types'

export function evaluateAiClinicRisk(input: string): RowData {
  const text = input.trim()
  const has = (pattern: RegExp) => pattern.test(text)
  const negatedChestPain = /没有胸痛|无胸痛|不胸痛/.test(text)

  if (/不想活|自杀|自伤|结束生命/.test(text)) {
    return { matched: '是', riskLevel: '心理危机', action: '暂停普通问诊，进入心理危机安全确认流程', interrupted: '是', template: '不进入普通身体问诊' }
  }
  if (has(/呕血|吐血/) && has(/晕倒|昏厥|意识不清/)) {
    return { matched: '是', riskLevel: '呼叫120', action: '强制中断普通问诊，提示立即呼叫120', interrupted: '是', template: '呕血问诊模板' }
  }
  if (!negatedChestPain && has(/胸痛|胸口疼|胸闷/) && has(/冷汗|出汗|左臂|呼吸困难|气短/)) {
    return { matched: '是', riskLevel: '呼叫120', action: '强制中断普通问诊，优先急救提示', interrupted: '是', template: '胸痛问诊模板' }
  }
  if (has(/眼痛/) && has(/视力.*降|看不清|骤降/)) {
    return { matched: '是', riskLevel: '立即急诊', action: '推荐眼科急诊，不生成普通结论', interrupted: '是', template: '眼睛干涩问诊模板' }
  }
  if (/桌子不舒服|汽车不舒服|二手车|写文案|加辣椒/.test(text)) {
    return { matched: '否', riskLevel: '非医疗', action: '提示内容与AI诊室无关，不进入问诊模板', interrupted: '是', template: '未匹配' }
  }
  if (negatedChestPain) {
    return { matched: '否', riskLevel: '暂未发现明显风险', action: '胸痛为否定状态，不保存为阳性症状', interrupted: '否', template: '继续当前问诊' }
  }
  return { matched: '否', riskLevel: '暂未发现明显风险', action: '继续模板匹配与槽位追问', interrupted: '否', template: '按主诉路由' }
}
