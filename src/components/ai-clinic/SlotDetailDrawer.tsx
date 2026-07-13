import { X } from 'lucide-react'
import { useState } from 'react'
import StatusTag from '../StatusTag'
import type { TemplateSlotConfig } from '../../types/ai-clinic'

export default function SlotDetailDrawer({ slot, onClose }: { slot: TemplateSlotConfig | null; onClose: () => void }) {
  const tabs = ['基础配置', '提问与展示', '取值与标准化', '计分规则', '依赖与跳转', '关联模板', '版本记录', '操作日志']
  const [active, setActive] = useState('基础配置')
  if (!slot) return null
  return <div className="drawer-wrap" onMouseDown={e => e.target === e.currentTarget && onClose()}>
    <aside className="drawer business-drawer">
      <header className="business-drawer-head">
        <div className="business-title"><small>模板槽位配置</small><h2>{slot.name}</h2><p>槽位编号：{slot.id} · 所属模板：{slot.templateId} · 模板版本：{slot.templateVersion}</p></div>
        <StatusTag value={slot.status} />
        <button className="drawer-close" onClick={onClose}><X /></button>
      </header>
      <div className="drawer-tabs business-tabs">{tabs.map(tab => <button key={tab} className={active === tab ? 'active' : ''} onClick={() => setActive(tab)}>{tab}</button>)}</div>
      <div className="drawer-body business-body"><section className="info-section"><h3>{active}</h3><div className="business-info-grid">{itemsFor(active, slot).map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></section></div>
      <footer className="drawer-foot business-actions"><button className="btn" onClick={onClose}>关闭</button><button className="btn primary">编辑槽位配置</button></footer>
    </aside>
  </div>
}

function itemsFor(tab: string, slot: TemplateSlotConfig): string[][] {
  if (tab === '基础配置') return [
    ['槽位编号', slot.id], ['标准槽位编号', slot.standardSlotId], ['槽位名称', slot.name], ['所属模板', `${slot.templateId} 腹痛问诊模板`],
    ['模板版本', slot.templateVersion], ['业务分类', slot.category], ['数据类型', slot.component], ['是否必填', slot.required ? '是' : '否'], ['是否核心', slot.core ? '是' : '否'], ['当前状态', slot.status]
  ]
  if (tab === '提问与展示') return [
    ['默认问题文案', slot.question], ['展示组件', slot.component], ['快捷选项组', slot.quickOptionGroup], ['是否允许自由输入', slot.freeInput],
    ['是否允许多选', slot.multiSelect], ['是否需要用户确认', slot.needConfirm ? '是' : '否'], ['最大追问次数', `${slot.maxAsk}次`]
  ]
  if (tab === '取值与标准化') return [
    ['标准化字段', slot.code], ['支持标准化', '是'], ['允许不清楚', slot.unknownAllowed], ['不清楚是否继续追问', slot.continueAskWhenUnknown], ['有效完成最低系数', String(slot.effectiveMinCoefficient)]
  ]
  if (tab === '计分规则') return [
    ['模板权重', `${slot.weight}分`], ['明确回答系数', '1.0'], ['快捷选项系数', '1.0'], ['AI推断系数', '0.5'], ['模糊回答系数', '0.3'],
    ['否定回答是否完成', slot.negativeCompletionRule], ['不清楚信息系数', String(slot.unknownCoefficient)], ['核心有效完成最低系数', String(slot.effectiveMinCoefficient)]
  ]
  if (tab === '依赖与跳转') return [
    ['前置槽位', slot.preSlot], ['显示条件', slot.displayCondition], ['跳过条件', slot.skipCondition], ['完成后下一节点', slot.nextNode],
    ['否定回答路由', slot.negativeRoute], ['冲突回答路由', slot.conflictRoute], ['是否触发模板退出', slot.triggerTemplateExit], ['是否触发重新匹配', slot.triggerRematch], ['是否执行风险判断', slot.riskCheck]
  ]
  if (tab === '关联模板') return [['当前模板', slot.templateId], ['同标准槽位可复用', '可被腹痛、眼部、通用模板引用'], ['本模板权重', `${slot.weight}分`], ['本模板是否核心', slot.core ? '是' : '否']]
  if (tab === '版本记录') return [['当前版本', slot.templateVersion], ['最近变更', '否定回答规则与不清楚规则已按模板独立配置'], ['变更时间', '2026-07-13 10:20']]
  return [['操作人', '医学运营管理员'], ['操作内容', `查看槽位 ${slot.id} 的${tab}`], ['操作结果', '成功'], ['操作时间', '2026-07-13 现在']]
}
