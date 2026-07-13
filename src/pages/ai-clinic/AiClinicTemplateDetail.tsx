import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import StatusTag from '../../components/StatusTag'
import { aiClinicSessions, aiClinicTemplates, templateSlotConfigs } from '../../mock/aiClinicAdminData'

export default function AiClinicTemplateDetail({ templateId, onNavigate }: { templateId: string; onNavigate: (key: string) => void }) {
  const template = aiClinicTemplates.find(item => item.id === templateId) ?? aiClinicTemplates[0]
  const [tab, setTab] = useState('基础配置')
  const tabs = ['基础配置', '触发规则', '模板槽位', '问诊流程', '身体部位图', '快捷选项', '高风险规则', '直接结论规则', 'Prompt配置', '发布版本', '使用记录']
  const slots = templateSlotConfigs.filter(item => item.templateId === template.id)
  return <div>
    <div className="detail-breadcrumb"><button onClick={() => onNavigate('ai-clinic/templates')}><ArrowLeft size={15} />返回问诊模板</button><span>AI诊室 / 问诊模板 / {template.id}</span></div>
    <section className="session-hero template-hero">
      <div><small>模板编号 {template.id}</small><h1>{template.name}</h1><p>{template.templateType} · {template.department} · {template.version}</p></div>
      <div className="session-status"><StatusTag value={template.publishStatus} /><StatusTag value={template.status} /><b>{template.autoConclusionScore}</b><span>自动结论阈值</span></div>
    </section>
    <div className="drawer-tabs page-tabs">{tabs.map(name => <button key={name} className={tab === name ? 'active' : ''} onClick={() => setTab(name)}>{name}</button>)}</div>
    <section className="session-tab-panel">
      {tab === '基础配置' && <Info items={[
        ['模板编号', template.id], ['模板名称', template.name], ['模板编码', template.code], ['模板类型', template.templateType],
        ['标准主症状', template.standardSymptom], ['所属科室', template.department], ['所属系统', template.system], ['适用人群', template.audience],
        ['当前版本', template.version], ['模板优先级', String(template.priority)], ['槽位数量', `${template.slotCount}个`], ['核心槽位数量', `${template.coreSlotCount}个`],
        ['自动结论阈值', template.autoConclusionScore], ['直接结论最低分', template.directConclusionMinScore], ['最大默认问诊轮次', `${template.maxRounds}轮`],
        ['必须完成风险筛查', template.riskScreeningRequired], ['允许中途切换模板', template.templateSwitchPolicy], ['允许多症状并行', template.multiSymptomParallel],
        ['其他症状处理', template.otherSymptomPolicy], ['通用兜底模板', template.fallbackTemplateId], ['关联Prompt', template.promptRef], ['身体部位图', template.bodyMap],
        ['模板状态', template.status], ['发布状态', template.publishStatus], ['最近发布时间', template.lastPublishedAt]
      ]} />}
      {tab === '触发规则' && <Info items={[
        ['主关键词', template.id === 'TMP001' ? '肚子疼、腹痛、胃痛、小腹痛、腹部不舒服' : template.standardSymptom],
        ['同义表达', template.id === 'TMP001' ? '肚子不舒服、上腹难受、下腹疼、胃部疼' : '按症状词库配置'],
        ['器官词', template.id === 'TMP001' ? '腹部、胃、小腹、肚脐周围、右下腹' : template.system],
        ['症状词', '疼、胀、绞痛、不舒服、加重'], ['最低置信度', template.id === 'TMP001' ? '0.72' : '0.70'], ['模板优先级', String(template.priority)],
        ['否定识别', '支持'], ['第三方对象识别', '支持'], ['当前症状识别', '支持'], ['历史症状识别', '支持但需安全筛查'],
        ['排除主体', '桌子、汽车、手机、物品'], ['排除场景', '影视剧情、假设提问、知识咨询、用户明确否定'],
        ['低置信度处理', '置信度接近时不自动进入模板，先发澄清问题'], ['无法确认时的澄清问题', '你说的不舒服主要在胸口，还是上腹部？']
      ]} />}
      {tab === '模板槽位' && <Table columns={['顺序', '槽位编号', '标准槽位', '槽位名称', '组件', '核心', '权重', '否定回答规则', '不清楚规则']} rows={slots.map(slot => [slot.order, slot.id, slot.standardSlotId, slot.name, slot.component, slot.core ? '是' : '否', `${slot.weight}分`, slot.negativeCompletionRule, `${slot.unknownAllowed} / 系数${slot.unknownCoefficient}`])} />}
      {tab === '问诊流程' && <Info items={[['流程策略', '优先选择未完成的高优先级核心槽位'], ['下一节点规则', '未完成高优先级核心槽位 > 普通核心槽位 > 可选槽位'], ['未回答处理', '不能按轮次跳过，用户选择继续当前主题后回到未完成问题'], ['模板软锁定', template.templateSwitchPolicy]]} />}
      {tab === '身体部位图' && <Info items={[['绑定部位图', template.bodyMap], ['热区写入', template.id === 'TMP001' ? '右上腹、上腹正中、左上腹、肚脐周围、右下腹等' : '按模板配置'], ['多选', '按部位图配置'], ['额外风险筛查', '命中相关热区后执行']]}/>}
      {tab === '快捷选项' && <Info items={[['持续时间选项', '刚刚开始、不到1天、1-3天、4-7天、超过1周、反复出现、不清楚'], ['不清楚处理', '不等同核心完成，按信息系数计分并继续追问'], ['选择后动作', '写入当前主题对应槽位']]}/>}
      {tab === '高风险规则' && <Info items={[['执行优先级', '高风险判断优先于模板匹配、槽位追问和主题切换'], ['高风险切换', '允许强制暂停当前模板'], ['示例', '右手突然抬不起来、说话不清楚 → 脑卒中风险 → 120提示']]}/>}
      {tab === '直接结论规则' && <Info items={[['最低分', template.directConclusionMinScore], ['自动结论阈值', template.autoConclusionScore], ['风险筛查要求', template.riskScreeningRequired], ['高风险时', '不生成普通结论，优先安全提示']]}/>}
      {tab === 'Prompt配置' && <Info items={[['关联Prompt', template.promptRef], ['输出结构', 'JSON结构化槽位、下一问题、风险标记、主题动作'], ['备用模板', template.fallbackTemplateId]]}/>}
      {tab === '发布版本' && <Table columns={['版本', '发布状态', '发布时间', '发布内容', '回滚策略']} rows={[[template.version, template.publishStatus, template.lastPublishedAt, '槽位、触发规则、切换策略同步发布', '历史会话继续绑定模板快照']]} />}
      {tab === '使用记录' && <Table columns={['会话编号', '问诊人', '主诉', '模板快照', '完成度', '状态']} rows={aiClinicSessions.filter(s => s.currentTemplateId === template.id || s.initialTemplateId === template.id).map(s => [s.id, s.patientName, s.chiefComplaint, s.templateSnapshotId, s.progress, s.status])} />}
    </section>
  </div>
}

function Info({ items }: { items: string[][] }) {
  return <div className="business-info-grid session-info-grid">{items.map(item => <div key={item[0]}><span>{item[0]}</span><strong>{item[1]}</strong></div>)}</div>
}

function Table({ columns, rows }: { columns: string[]; rows: Array<Array<string | number | boolean>> }) {
  return <div className="business-table session-table"><table><thead><tr>{columns.map(col => <th key={col}>{col}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{String(cell)}</td>)}</tr>)}</tbody></table></div>
}
