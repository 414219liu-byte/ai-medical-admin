import { useState } from 'react'
import type { ReactNode } from 'react'
import StatusTag from '../../components/StatusTag'
import GlobalSlotDetailDrawer from '../../components/ai-clinic/GlobalSlotDetailDrawer'
import { globalSlotDefinitions } from '../../mock/aiClinicAdminData'
import type { GlobalSlotDefinition } from '../../types/ai-clinic'

export default function AiClinicSlotsPage() {
  const [slot, setSlot] = useState<GlobalSlotDefinition | null>(null)

  return <div>
    <div className="page-title">
      <div>
        <h1>AI诊室 · 全局槽位库</h1>
        <p>定义可被多个问诊模板复用的标准槽位，具体权重、问法和跳转规则由各模板单独配置。</p>
      </div>
    </div>
    <section className="panel clinic-live">
      <div className="panel-head"><div><h2>全局标准槽位定义</h2><span>仅维护标准字段，模板内权重和流程规则请在问诊模板详情中配置</span></div></div>
      <SimpleTable
        columns={['槽位编号', '标准名称', '槽位编码', '业务分类', '数据类型', '可用展示组件', '是否支持标准化', '被引用模板数量', '状态', '更新时间', '操作']}
        rows={globalSlotDefinitions.map(item => [
          item.id,
          item.name,
          item.code,
          item.category,
          item.dataType,
          item.allowedComponents,
          item.supportsNormalization,
          `${item.referencedTemplates}个`,
          item.status,
          item.updatedAt,
          <button className="link-op" onClick={() => setSlot(item)}>查看详情</button>
        ])}
      />
    </section>
    <GlobalSlotDetailDrawer slot={slot} onClose={() => setSlot(null)} />
  </div>
}

function SimpleTable({ columns, rows }: { columns: string[]; rows: Array<Array<ReactNode>> }) {
  return <div className="mini-table wide"><table><thead><tr>{columns.map(col => <th key={col}>{col}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{typeof cell === 'string' && /启用|停用|草稿/.test(cell) ? <StatusTag value={cell} /> : cell}</td>)}</tr>)}</tbody></table></div>
}
