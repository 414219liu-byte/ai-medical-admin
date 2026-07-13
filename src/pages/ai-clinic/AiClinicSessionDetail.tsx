import { ArrowLeft, Bot, ShieldAlert } from 'lucide-react'
import { useMemo, useState } from 'react'
import StatusTag from '../../components/StatusTag'
import { aiClinicConversation, aiClinicKnowledgeRefs, aiClinicModelCalls, aiClinicRiskRecords, aiClinicSessions, aiClinicSlotValues, aiClinicTemplates, aiClinicTemplateSlots, sessionProgress } from '../../mock/aiClinicAdminData'
import { calculateConsultationProgress } from '../../utils/calculateConsultationProgress'

export default function AiClinicSessionDetail({ sessionId, onNavigate }: { sessionId: string; onNavigate: (key: string) => void }) {
  const session = aiClinicSessions.find(item => item.id === sessionId) ?? aiClinicSessions[0]
  const [tab, setTab] = useState('问诊概览')
  const templateSlots = aiClinicTemplateSlots[session.currentTemplateId] ?? []
  const progress = useMemo(() => templateSlots.length
    ? calculateConsultationProgress(aiClinicSlotValues.filter(v => v.sessionId === session.id), templateSlots, { patientConfirmed: true, chiefComplaintIdentified: true, riskScreeningDone: !['高风险中断', '120中断', '心理危机暂停'].includes(session.status), highRiskTriggered: ['高风险中断', '120中断', '心理危机暂停'].includes(session.status) })
    : sessionProgress[session.id], [session, templateSlots])
  const autoThreshold = Number(String(aiClinicTemplates.find(t => t.id === session.currentTemplateId)?.autoConclusionScore ?? '80').replace(/\D/g, '')) || 80
  const coreDone = progress.rows.filter(row => row.core).every(row => row.score > 0 || row.status === '不适用')
  const riskDone = progress.rows.find(row => row.slotName === '危险症状筛查')?.score ? '已完成' : session.status.includes('中断') ? '高风险中断' : '未完成'
  const tabs = ['问诊概览', '完整对话', '槽位记录', '进度计算', '风险记录', '模板路由', '模型调用', '知识引用']
  const conversations = aiClinicConversation[session.id] ?? [
    { role: 'user', type: '用户输入', time: session.startAt.slice(11), latency: '—', content: session.chiefComplaint, slotUpdated: '主诉确认', riskChecked: '是' },
    { role: 'ai', type: session.status.includes('中断') ? '系统安全提示' : 'AI问题', time: '下一轮', latency: '1.0s', content: session.conclusion, slotUpdated: '按模板更新', riskChecked: '是' }
  ]
  return <div>
    <div className="detail-breadcrumb"><button onClick={() => onNavigate('ai-clinic/sessions')}><ArrowLeft size={15} />返回问诊会话</button><span>AI诊室 / 问诊会话 / {session.id}</span></div>
    <section className="session-hero">
      <div><small>会话编号</small><h1>{session.id}</h1><p>{session.patientName} · {session.age}岁/{session.gender} · {session.chiefComplaint}</p></div>
      <div className="session-status"><StatusTag value={session.status} /><StatusTag value={session.riskLevel} /><b>{progress.highRiskInterrupted ? '中断' : `${progress.cappedPercent}%`}</b><span>当前进度</span></div>
    </section>
    <div className="session-summary-grid">
      {[
        ['开始时间', session.startAt], ['结束时间', session.endAt], ['问诊人', `${session.patientName} / ${session.patientId}`], ['当前模板', `${session.templateName}（${session.currentTemplateId}）`],
        ['模板版本', session.templateVersion], ['模型版本', session.modelVersion], ['问诊轮次', `${session.rounds}轮`], ['结论类型', session.conclusionType]
      ].map(item => <div key={item[0]}><span>{item[0]}</span><b>{item[1]}</b></div>)}
    </div>
    <div className="drawer-tabs page-tabs">{tabs.map(name => <button key={name} className={tab === name ? 'active' : ''} onClick={() => setTab(name)}>{name}</button>)}</div>
    <section className="session-tab-panel">
      {tab === '问诊概览' && <InfoGrid items={[
        ['用户ID', session.userId], ['问诊人ID', session.patientId], ['与用户关系', session.relation], ['年龄和性别', `${session.age}岁 / ${session.gender}`],
        ['原始主诉', session.chiefComplaint], ['标准化症状', session.normalizedSymptoms], ['当前模板', session.templateName], ['是否多症状', session.multisymptom],
        ['当前模板ID', session.currentTemplateId], ['最终模板ID', session.finalTemplateId], ['模板版本', session.templateVersion], ['模板快照版本', session.templateSnapshotId],
        ['匹配置信度', session.templateMatchConfidence.toFixed(2)], ['是否点击直接结论', session.clickedDirectConclusion], ['结束原因', session.endReason], ['推荐科室', session.department], ['结论摘要', session.conclusion]
      ]} />}
      {tab === '完整对话' && <div className="round-list">{conversations.map((message, i) => <section key={i} className="round-card">
        <header><b>第 {message.round ?? i + 1} 轮</b><span>{message.time} · {message.type}</span><StatusTag value={String(message.template ?? `${session.currentTemplateId} · ${session.templateVersion}`)} /></header>
        <div className="round-dialog"><div><span>用户消息</span><p>{String(message.userMessage ?? message.content ?? session.chiefComplaint)}</p></div><div><span>{message.type === 'AI问诊结论' ? 'AI问诊结论' : 'AI问题'}</span><p>{String(message.aiMessage ?? message.content ?? session.conclusion)}</p></div></div>
        <div className="round-meta">{[['当前流程节点', message.node], ['本轮槽位更新', message.slotUpdated], ['本轮得分变化', message.scoreChange], ['进度变化', message.progressChange], ['风险判断', message.riskChecked], ['响应耗时', message.latency]].map(item => <div key={String(item[0])}><span>{item[0]}</span><b>{String(item[1] ?? '—')}</b></div>)}</div>
      </section>)}</div>}
      {tab === '槽位记录' && <SimpleTable columns={['槽位ID', '槽位名称', '当前值', '原始用户表达', '信息来源', '信息状态', '可信度', '模板权重', '信息系数', '实际得分', '是否核心', '更新时间']} rows={progress.rows.map(r => [r.slotId, r.slotName, r.value, r.raw, r.source, displaySlotStatus(String(r.status)), r.confidence, `${r.weight}分`, r.coefficient, `${r.score}分`, r.core ? '是' : '否', r.updatedAt])} />}
      {tab === '进度计算' && <div className="progress-panel"><div className="progress-total fixed"><div><b>{progress.score}分</b><span>当前有效槽位得分</span></div><div><b>{progress.total}分</b><span>当前适用槽位总权重</span></div><div><b>{progress.percent}%</b><span>原始问诊完成度</span></div><div><b>{progress.cappedPercent}%</b><span>最终展示进度</span></div></div>{progress.capReasons.length > 0 && <div className="risk-alert warning"><ShieldAlert /><div><h3>进度上限原因</h3><p>{progress.capReasons.join('；')}</p></div></div>}<InfoGrid items={[
        ['核心槽位完成状态', coreDone ? '已完成' : '未完成'], ['危险症状筛查状态', riskDone], ['当前进度上限', progress.highRiskInterrupted ? '高风险中断' : `${progress.cap}%`], ['自动结论阈值', `${autoThreshold}分`], ['信息冲突', progress.rows.some(r => r.status === '冲突') ? '有' : '无'], ['是否满足自动结论条件', progress.score >= autoThreshold && coreDone && riskDone === '已完成' && !progress.rows.some(r => r.status === '冲突') ? '是' : '否']
      ]} /><SimpleTable columns={['槽位ID', '槽位', '权重', '信息状态', '系数', '实际得分', '核心', '当前值']} rows={progress.rows.map(r => [r.slotId, r.slotName, `${r.weight}分`, displaySlotStatus(String(r.status)), r.coefficient, `${r.score}分`, r.core ? '是' : '否', r.value])} /></div>}
      {tab === '风险记录' && <SimpleTable columns={['风险规则', '命中内容', '命中时间', '风险等级', '是否中断', '系统动作', '人工复核']} rows={aiClinicRiskRecords.filter(r => r.sessionId === session.id).map(r => [r.rule, r.hitContent, r.hitAt, r.riskLevel, r.interrupted, r.action, r.review])} empty="本会话暂未命中高风险规则" />}
      {tab === '模板路由' && <InfoGrid items={[
        ['初始识别症状', session.normalizedSymptoms], ['初始模板', session.initialTemplateId || '未匹配'], ['候选模板', candidateTemplates(session)], ['候选置信度', session.templateMatchConfidence.toFixed(2)], ['当前模板', `${session.currentTemplateId} · ${session.templateName}`], ['最终模板', session.finalTemplateId || '未匹配'],
        ['是否发生模板切换', session.initialTemplateId !== session.currentTemplateId ? '是' : '否'], ['切换原因', session.id === 'AIC202607130006' ? '多症状中胸闷风险优先，眼干和腹痛进入待处理列表' : '首轮模板命中后保持当前模板'], ['多症状待处理列表', session.multisymptom === '是' ? '眼干、腹痛' : '无']
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

function displaySlotStatus(status: string) {
  const map: Record<string, string> = { 用户明确输入: '已确认', 快捷选项: '已确认', 身体部位图: '已确认', 报告识别且用户确认: '已确认', 报告识别未确认: '待确认', AI上下文推断: '待确认', 模糊信息: '模糊', 冲突: '冲突', 未填写: '未填写', 不适用: '不适用' }
  return map[status] ?? status
}

function candidateTemplates(session: { id: string; currentTemplateId: string; templateName: string }) {
  if (session.id === 'AIC202607130006') return 'TMP002 眼睛干涩问诊模板 / 0.74；TMP001 腹痛问诊模板 / 0.71；TMP003 胸痛问诊模板 / 0.88'
  return `${session.currentTemplateId} ${session.templateName} / 已选`
}
