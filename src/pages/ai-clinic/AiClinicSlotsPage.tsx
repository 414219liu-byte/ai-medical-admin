import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import StatusTag from '../../components/StatusTag'
import SlotDetailDrawer from '../../components/ai-clinic/SlotDetailDrawer'
import { aiClinicTemplates, globalSlotLibrary, templateSlotConfigs } from '../../mock/aiClinicAdminData'
import type { TemplateSlotConfig } from '../../types/ai-clinic'

export default function AiClinicSlotsPage() {
  const [slot, setSlot] = useState<TemplateSlotConfig | null>(null)
  const template = aiClinicTemplates.find(item => item.id === 'TMP001')!
  const slots = useMemo(() => templateSlotConfigs.filter(item => item.templateId === 'TMP001'), [])
  const totalWeight = slots.reduce((sum, item) => sum + item.weight, 0)
  const coreWeight = slots.filter(item => item.core).reduce((sum, item) => sum + item.weight, 0)
  return <div>
    <div className="page-title"><div><h1>AI诊室 · 槽位配置</h1><p>区分全局槽位库与模板槽位配置，同一标准槽位可在不同模板中采用不同权重和跳转规则</p></div></div>
    <section className="panel slot-template-head">
      <div><span>当前模板</span><b>{template.id} · {template.name} · {template.version}</b></div>
      {[
        ['当前模板总权重', `${totalWeight}分`], ['核心槽位总权重', `${coreWeight}分`], ['自动结论阈值', template.autoConclusionScore],
        ['直接结论最低分', template.directConclusionMinScore], ['风险筛查未完成时进度上限', '80%'], ['已启用槽位数', `${slots.length}个`]
      ].map(item => <div key={item[0]}><span>{item[0]}</span><b>{item[1]}</b></div>)}
    </section>
    <section className="panel clinic-live">
      <div className="panel-head"><div><h2>全局槽位库</h2><span>定义标准字段，可被多个问诊模板复用</span></div></div>
      <SimpleTable columns={['槽位编号', '标准名称', '槽位编码', '业务分类', '数据类型', '可用展示组件', '支持标准化', '被引用模板', '状态', '更新时间']} rows={globalSlotLibrary.map(item => [item.id, item.standardName, item.code, item.category, item.dataType, item.components, item.standardizable, `${item.referencedTemplates}个`, item.status, item.updatedAt])} />
    </section>
    <section className="panel clinic-live">
      <div className="panel-head"><div><h2>模板槽位配置</h2><span>当前模板：TMP001 · 腹痛问诊模板 · V1.6</span></div></div>
      <SimpleTable columns={['顺序', '模板编号', '槽位编号', '槽位名称', '业务分类', '展示组件', '必填', '核心', '权重', '否定回答规则', '不清楚规则', '有效完成最低系数', '需要确认', '最大追问', '状态', '操作']} rows={slots.map(item => [item.order, item.templateId, item.id, item.name, item.category, item.component, item.required ? '是' : '否', item.core ? '是' : '否', `${item.weight}分`, item.negativeCompletionRule, `${item.unknownAllowed} / 系数${item.unknownCoefficient}`, item.effectiveMinCoefficient, item.needConfirm ? '是' : '否', `${item.maxAsk}次`, item.status, <button className="link-op" onClick={() => setSlot(item)}>查看详情</button>])} />
    </section>
    <SlotDetailDrawer slot={slot} onClose={() => setSlot(null)} />
  </div>
}

function SimpleTable({ columns, rows }: { columns: string[]; rows: Array<Array<ReactNode>> }) {
  return <div className="mini-table wide"><table><thead><tr>{columns.map(col => <th key={col}>{col}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{typeof cell === 'string' && /启用|停用|草稿/.test(cell) ? <StatusTag value={cell} /> : cell}</td>)}</tr>)}</tbody></table></div>
}
