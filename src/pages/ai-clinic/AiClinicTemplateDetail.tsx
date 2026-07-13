import { ArrowLeft } from 'lucide-react'
import StatusTag from '../../components/StatusTag'
import { abdominalSlots, aiClinicTemplates } from '../../mock/aiClinicAdminData'

export default function AiClinicTemplateDetail({ templateId, onNavigate }: { templateId: string; onNavigate: (key: string) => void }) {
  const template = aiClinicTemplates.find(item => item.id === templateId) ?? aiClinicTemplates[0]
  const isAbdominal = template.id === 'TMP001'
  return <div>
    <div className="detail-breadcrumb"><button onClick={() => onNavigate('ai-clinic/templates')}><ArrowLeft size={15} />返回问诊模板</button><span>AI诊室 / 问诊模板 / {template.id}</span></div>
    <section className="session-hero template-hero">
      <div><small>模板编号 {template.id}</small><h1>{template.name}</h1><p>{template.department} · {template.audience} · {template.version}</p></div>
      <div className="session-status"><StatusTag value={template.status} /><b>{template.autoConclusionScore}</b><span>自动结论阈值</span></div>
    </section>
    <div className="template-detail-grid">
      <section className="panel"><div className="panel-head"><div><h2>基础配置</h2><span>模板详情与独立列表保持一致</span></div></div><Info items={[
        ['所属科室', template.department], ['所属系统', template.system], ['适用人群', template.audience], ['槽位数量', `${template.slotCount}个`],
        ['核心槽位', `${template.coreSlotCount}个`], ['身体部位图', template.bodyMap], ['直接结论', template.directConclusion], ['当前版本', template.version]
      ]} /></section>
      <section className="panel"><div className="panel-head"><div><h2>触发规则</h2><span>模板匹配和排除条件</span></div></div><Info items={[
        ['主触发词', template.id === 'TMP003' ? '胸痛、胸闷、胸口疼' : template.id === 'TMP002' ? '眼干、干涩、异物感' : '肚子疼、腹痛、胃痛'],
        ['最低置信度', template.id === 'TMP003' ? '0.65' : '0.72'], ['否定识别', '支持'], ['第三方识别', '支持'], ['排除条件', '物品主体、影视剧情、假设提问']
      ]} /></section>
    </div>
    <section className="panel clinic-live">
      <div className="panel-head"><div><h2>槽位配置</h2><span>{isAbdominal ? '腹痛模板已启用槽位权重合计100分' : '其他模板展示摘要配置'}</span></div><button onClick={() => onNavigate('ai-clinic/slots')}>查看槽位列表</button></div>
      <div className="mini-table wide"><table><thead><tr><th>顺序</th><th>槽位</th><th>分类</th><th>组件</th><th>必填</th><th>核心</th><th>权重</th><th>没有计分</th><th>状态</th></tr></thead><tbody>
        {(isAbdominal ? abdominalSlots : abdominalSlots.slice(0, 6)).map(slot => <tr key={slot.id}><td>{slot.order}</td><td>{slot.name}</td><td>{slot.category}</td><td>{slot.component}</td><td>{slot.required ? '是' : '否'}</td><td>{slot.core ? '是' : '否'}</td><td>{slot.weight}分</td><td>{slot.noCounts ? '是' : '否'}</td><td><StatusTag value={slot.status} /></td></tr>)}
      </tbody></table></div>
    </section>
    <div className="template-detail-grid">
      {['问诊流程', '快捷选项', '身体部位图', '风险规则', '结论规则', 'Prompt配置', '版本记录'].map(name => <section className="panel template-card" key={name}>
        <div className="panel-head"><div><h2>{name}</h2><span>当前模板 {template.version}</span></div></div>
        <p>{name === '风险规则' ? '全局安全检查优先于普通问诊流程，命中后中断槽位追问和直接结论。' : name === '版本记录' ? '历史会话继续展示当时实际使用的模板与Prompt版本。' : `${template.name} 的${name}已关联到AI诊室独立配置列表。`}</p>
      </section>)}
    </div>
  </div>
}

function Info({ items }: { items: string[][] }) {
  return <div className="business-info-grid session-info-grid">{items.map(item => <div key={item[0]}><span>{item[0]}</span><strong>{item[1]}</strong></div>)}</div>
}
