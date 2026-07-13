import { ArrowLeft, Bot, ShieldAlert } from 'lucide-react'
import { useMemo, useState } from 'react'
import StatusTag from '../../components/StatusTag'
import { abdominalSlots, aiClinicConversation, aiClinicKnowledgeRefs, aiClinicModelCalls, aiClinicRiskRecords, aiClinicSessions, aiClinicSlotValues, sessionProgress } from '../../mock/aiClinicAdminData'
import { calculateConsultationProgress } from '../../utils/calculateConsultationProgress'

export default function AiClinicSessionDetail({ sessionId, onNavigate }: { sessionId: string; onNavigate: (key: string) => void }) {
  const session = aiClinicSessions.find(item => item.id === sessionId) ?? aiClinicSessions[0]
  const [tab, setTab] = useState('问诊概览')
  const progress = useMemo(() => session.templateId === 'TMP001'
    ? calculateConsultationProgress(abdominalSlots, aiClinicSlotValues.filter(v => v.sessionId === session.id), { patientConfirmed: true, chiefComplaintIdentified: true, riskScreeningDone: true })
    : sessionProgress[session.id], [session])
  const tabs = ['问诊概览', '完整对话', '槽位记录', '进度计算', '风险记录', '模板路由', '模型调用', '知识引用']
  const conversations = aiClinicConversation[session.id] ?? [
    { role: 'user', type: '用户输入', time: session.startAt.slice(11), latency: '—', content: session.chiefComplaint, slotUpdated: '主诉确认', riskChecked: '是' },
    { role: 'ai', type: session.status.includes('中断') ? '系统安全提示' : 'AI问题', time: '下一轮', latency: '1.0s', content: session.conclusion, slotUpdated: '按模板更新', riskChecked: '是' }
  ]
  return <div>
    <div className="detail-breadcrumb"><button onClick={() => onNavigate('ai-clinic/sessions')}><ArrowLeft size={15} />返回问诊会话</button><span>AI诊室 / 问诊会话 / {session.id}</span></div>
    <section className="session-hero">
      <div><small>会话编号</small><h1>{session.id}</h1><p>{session.patientName} · {session.age}岁/{session.gender} · {session.chiefComplaint}</p></div>
      <div className="session-status"><StatusTag value={session.status} /><StatusTag value={session.riskLevel} /><b>{progress.cappedPercent}%</b><span>当前进度</span></div>
    </section>
    <div className="session-summary-grid">
      {[
        ['开始时间', session.startAt], ['结束时间', session.endAt], ['问诊人', `${session.patientName} / ${session.patientId}`], ['当前模板', session.templateName],
        ['模板版本', session.templateVersion], ['模型版本', session.modelVersion], ['问诊轮次', `${session.rounds}轮`], ['结论类型', session.conclusionType]
      ].map(item => <div key={item[0]}><span>{item[0]}</span><b>{item[1]}</b></div>)}
    </div>
    <div className="drawer-tabs page-tabs">{tabs.map(name => <button key={name} className={tab === name ? 'active' : ''} onClick={() => setTab(name)}>{name}</button>)}</div>
    <section className="session-tab-panel">
      {tab === '问诊概览' && <InfoGrid items={[
        ['用户ID', session.userId], ['问诊人ID', session.patientId], ['与用户关系', session.relation], ['年龄和性别', `${session.age}岁 / ${session.gender}`],
        ['原始主诉', session.chiefComplaint], ['标准化症状', session.normalizedSymptoms], ['当前模板', session.templateName], ['是否多症状', session.multisymptom],
        ['是否点击直接结论', session.clickedDirectConclusion], ['结束原因', session.endReason], ['推荐科室', session.department], ['结论摘要', session.conclusion]
      ]} />}
      {tab === '完整对话' && <div className="conversation business-conversation detail-conversation">{conversations.map((message, i) => <div key={i} className={message.role === 'user' ? 'user-msg' : message.role === 'system' ? 'ai-msg warning' : 'ai-msg'}>
        <b>{message.type} · {message.time}</b><p>{message.content}</p><small>响应耗时：{message.latency} · 槽位更新：{message.slotUpdated} · 风险判断：{message.riskChecked}</small>
      </div>)}</div>}
      {tab === '槽位记录' && <SimpleTable columns={['槽位名称', '当前值', '原始用户表达', '信息来源', '信息状态', '可信度', '槽位权重', '是否核心', '更新时间']} rows={(session.templateId === 'TMP001' ? abdominalSlots.map(slot => {
        const value = aiClinicSlotValues.find(v => v.sessionId === session.id && v.slotId === slot.id)
        return [slot.name, value?.value ?? '未回答', value?.raw ?? '—', value?.source ?? '未回答', value?.status ?? '未回答', value ? value.confidence : '—', `${slot.weight}分`, slot.core ? '是' : '否', value?.updatedAt ?? '—']
      }) : aiClinicSlotValues.filter(v => v.sessionId === session.id).map(v => [v.slotId, v.value, v.raw, v.source, v.status, v.confidence, '按模板配置', '是', v.updatedAt]))} />}
      {tab === '进度计算' && <div className="progress-panel"><div className="progress-total"><b>{progress.score}分</b><span>当前有效槽位得分</span><b>{progress.total}分</b><span>当前适用槽位总权重</span><b>{progress.cappedPercent}%</b><span>问诊完成度</span></div>{progress.capReasons.length > 0 && <div className="risk-alert warning"><ShieldAlert /><div><h3>进度上限原因</h3><p>{progress.capReasons.join('；')}</p></div></div>}<SimpleTable columns={['槽位', '权重', '信息状态', '系数', '实际得分', '核心', '当前值']} rows={progress.rows.map(r => [r.slotName, `${r.weight}分`, r.status, r.coefficient, `${r.score}分`, r.core ? '是' : '否', r.value])} /></div>}
      {tab === '风险记录' && <SimpleTable columns={['风险规则', '命中内容', '命中时间', '风险等级', '是否中断', '系统动作', '人工复核']} rows={aiClinicRiskRecords.filter(r => r.sessionId === session.id).map(r => [r.rule, r.hitContent, r.hitAt, r.riskLevel, r.interrupted, r.action, r.review])} empty="本会话暂未命中高风险规则" />}
      {tab === '模板路由' && <InfoGrid items={[
        ['初始识别症状', session.normalizedSymptoms], ['候选模板', session.templateId ? `${session.templateName} / 0.86` : '未匹配'], ['候选置信度', session.templateId ? '0.86' : '0.12'], ['最终模板', session.templateName],
        ['是否发生模板切换', session.id === 'AIC202607130006' ? '是，普通症状转胸痛风险筛查' : '否'], ['切换原因', session.id === 'AIC202607130006' ? '多症状中胸闷风险优先' : '首轮模板命中'], ['多症状待处理列表', session.multisymptom === '是' ? '眼干、腹痛' : '无']
      ]} />}
      {tab === '模型调用' && <SimpleTable columns={['调用阶段', 'Prompt名称', 'Prompt版本', '模型名称', '输入摘要', '输出摘要', 'Token数', '响应耗时', '是否成功']} rows={aiClinicModelCalls.filter(r => r.sessionId === session.id).map(r => [r.stage, r.prompt, r.version, r.model, r.input, r.output, r.tokens, r.latency, r.success])} empty="本会话模型调用记录已归档，当前仅展示摘要" />}
      {tab === '知识引用' && <SimpleTable columns={['知识标题', '资料类型', '来源级别', '关联结论内容', '审核状态']} rows={aiClinicKnowledgeRefs.filter(k => session.normalizedSymptoms.includes(String(k.symptom)) || session.department.includes(String(k.department).split('/')[0])).map(k => [k.title, k.type, k.sourceLevel, k.conclusionPart, k.audit])} empty="本会话未生成普通医学知识引用" />}
    </section>
  </div>
}

function InfoGrid({ items }: { items: string[][] }) {
  return <div className="business-info-grid session-info-grid">{items.map(item => <div key={item[0]}><span>{item[0]}</span><strong>{item[1]}</strong></div>)}</div>
}

function SimpleTable({ columns, rows, empty = '暂无数据' }: { columns: string[]; rows: Array<Array<string | number | boolean>>; empty?: string }) {
  return rows.length ? <div className="business-table session-table"><table><thead><tr>{columns.map(c => <th key={c}>{c}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{String(cell)}</td>)}</tr>)}</tbody></table></div> : <div className="empty-inline"><Bot /><b>{empty}</b></div>
}
