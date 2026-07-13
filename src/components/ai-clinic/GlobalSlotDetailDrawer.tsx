import { X } from 'lucide-react'
import { useState } from 'react'
import StatusTag from '../StatusTag'
import type { GlobalSlotDefinition } from '../../types/ai-clinic'

export default function GlobalSlotDetailDrawer({ slot, onClose }: { slot: GlobalSlotDefinition | null; onClose: () => void }) {
  const tabs = ['基础定义', '展示能力', '标准化', '引用情况', '版本记录']
  const [active, setActive] = useState('基础定义')
  if (!slot) return null

  return <div className="drawer-wrap" onMouseDown={event => event.target === event.currentTarget && onClose()}>
    <aside className="drawer business-drawer">
      <header className="business-drawer-head">
        <div className="business-title">
          <small>全局标准槽位</small>
          <h2>{slot.name}</h2>
          <p>槽位编号：{slot.id} · 槽位编码：{slot.code}</p>
        </div>
        <StatusTag value={slot.status} />
        <button className="drawer-close" onClick={onClose}><X /></button>
      </header>
      <div className="drawer-tabs business-tabs">{tabs.map(tab => <button key={tab} className={active === tab ? 'active' : ''} onClick={() => setActive(tab)}>{tab}</button>)}</div>
      <div className="drawer-body business-body">
        <section className="info-section">
          <h3>{active}</h3>
          <div className="business-info-grid">{itemsFor(active, slot).map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
        </section>
      </div>
      <footer className="drawer-foot business-actions"><button className="btn" onClick={onClose}>关闭</button><button className="btn primary">编辑标准槽位</button></footer>
    </aside>
  </div>
}

function itemsFor(tab: string, slot: GlobalSlotDefinition): string[][] {
  if (tab === '基础定义') return [
    ['槽位编号', slot.id],
    ['标准名称', slot.name],
    ['槽位编码', slot.code],
    ['业务分类', slot.category],
    ['数据类型', slot.dataType],
    ['当前状态', slot.status]
  ]
  if (tab === '展示能力') return [
    ['可用展示组件', slot.allowedComponents],
    ['模板内可重命名', '是'],
    ['模板内可配置权重', '是'],
    ['模板内可配置追问规则', '是']
  ]
  if (tab === '标准化') return [
    ['是否支持标准化', slot.supportsNormalization],
    ['标准化字段', slot.code],
    ['原始表达保留', '是'],
    ['冲突处理', '交由模板槽位规则决定']
  ]
  if (tab === '引用情况') return [
    ['被引用模板数量', `${slot.referencedTemplates}个`],
    ['权重来源', '模板槽位绑定'],
    ['问法来源', '模板槽位绑定'],
    ['跳转规则来源', '模板槽位绑定']
  ]
  return [
    ['当前版本', '标准槽位定义 V1.0'],
    ['更新时间', slot.updatedAt],
    ['操作人', '医学运营管理员'],
    ['变更说明', '维护全局标准槽位定义，不影响模板内权重配置']
  ]
}
