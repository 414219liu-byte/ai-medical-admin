import { Activity, Bot, ClipboardList, X } from 'lucide-react'
import { useState } from 'react'
import type { RowData } from '../types'
import StatusTag from './StatusTag'

const tabSets:Record<string,string[]>={
  consults:['完整对话','AI 追问','健康档案引用','急症规则命中','导诊结果','服务卡曝光','入档结果','质检记录'],
  reports:['报告原图','OCR 文本','结构化字段','AI 解读','人工复核','操作日志'],
  doctors:['基础信息','出诊号源','擅长疾病','服务配置','智能体绑定','审核记录']
}
const standardTabs=['基础信息','关联记录','AI 调用记录','操作日志']
const routeSets:Record<string,[string,string,string][]>={
  users:[['health','健康档案','3'],['consults','问诊记录','12'],['reports','检查报告','6']],
  health:[['records','就诊病历','4'],['reports','检查报告','6'],['diagnoses','诊断与用药','8']],
  reports:[['interpretation','OCR 任务','1'],['interpretation','结构化字段','28'],['interpretation','解读记录','2']],
  consults:[['archive','入档待确认','2'],['corrections','关联纠错','1'],['triage','导诊记录','1']],
  doctors:[['slots','出诊号源','12'],['agents','医生智能体','1'],['reviews','审核记录','3']],
  'drug-kb':[['medicine-box','用户药箱','328'],['med-plans','用药计划','96'],['rules','安全规则','7']],
  rules:[['consults','命中会话','186'],['reviews','人工复核','12'],['corrections','关联纠错','4']]
}
export default function DrawerDetail({row,pageKey,detailTabs,title,onClose,onNavigate}:{row:RowData|null;pageKey:string;detailTabs?:string[];title:string;onClose:()=>void;onNavigate:(key:string)=>void}) {
  const [tab,setTab]=useState(0)
  if(!row)return null
  const tabs=detailTabs??tabSets[pageKey]??standardTabs
  const routes=routeSets[pageKey]??[['health','健康档案','3'],['reports','检查报告','6'],['records','就诊病历','4']]
  const isSpecial=!!tabSets[pageKey]||!!detailTabs
  return <div className="drawer-wrap" onMouseDown={e=>e.target===e.currentTarget&&onClose()}>
    <aside className="drawer">
      <div className="drawer-head"><div className="drawer-icon"><ClipboardList/></div><div><small>{title}</small><h2>{String(row.name??row.id)}</h2><span>编号：{String(row.id)}</span></div><button onClick={onClose}><X/></button></div>
      <div className="drawer-tabs">{tabs.map((x,i)=><button key={x} className={tab===i?'active':''} onClick={()=>setTab(i)}>{x}</button>)}</div>
      <div className="drawer-body">
        {tab===0&&<><h3>{tabs[0]}</h3>{pageKey==='consults'?<Conversation/>:pageKey==='reports'?<ReportPreview/>:<div className="detail-grid">{Object.entries(row).map(([k,v])=><div key={k}><span>{labelMap[k]??k}</span>{['status','risk','audit','ocr'].includes(k)?<StatusTag value={v}/>:<b>{String(v)}</b>}</div>)}</div>}
          <h3>业务关联与快捷跳转</h3><div className="link-cards">{routes.map(([key,name,count])=><button key={name} onClick={()=>onNavigate(key)}>{name} <b>{count}</b></button>)}</div></>}
        {tab>0&&isSpecial&&<BusinessTab pageKey={pageKey} label={tabs[tab]} row={row} onNavigate={onNavigate}/>}
        {tab===1&&!isSpecial&&<div className="timeline">{['创建基础档案','关联检查报告 RP10021','完成 AI 问诊并生成摘要','更新健康风险标签'].map((x,i)=><div key={x}><i/><b>{x}</b><span>{dates[i]}</span><p>系统已完成数据关联，内容可在对应业务模块中查看。</p></div>)}</div>}
        {tab===2&&!isSpecial&&<div className="ai-panel"><Bot/><h3>MedGPT-4.1 调用记录</h3><p>场景：{title}结构化与风险分析</p><div><span>输入 Token <b>2,460</b></span><span>输出 Token <b>628</b></span><span>耗时 <b>1.34s</b></span></div><pre>{`{ "risk_level": "${String(row.risk??'normal')}",\n  "confidence": 0.96,\n  "trace_id": "tr_med_89721" }`}</pre></div>}
        {tab===3&&!isSpecial&&<LogTimeline/>}
      </div>
      <div className="drawer-foot"><button className="btn" onClick={onClose}>关闭</button><button className="btn primary"><Activity size={15}/>发起处理</button></div>
    </aside>
  </div>
}
const dates=['2026-07-09 10:24','2026-07-08 16:42','2026-07-07 09:18','2026-07-05 14:06']
const labelMap:Record<string,string>={id:'业务编号',name:'名称/主题',user:'所属用户',status:'当前状态',updatedAt:'更新时间',phone:'手机号',city:'所在城市',risk:'风险等级',source:'数据来源',subject:'档案主体',hospital:'所属医院',department:'科室'}

function Conversation(){return <div className="conversation"><div className="user-msg">我爸爸血压 160/100，还有点头晕，需要马上去医院吗？<small>用户 · 10:21</small></div><div className="ai-msg"><b>慧医 AI 助手</b><p>这个血压明显升高。请确认是否伴随胸痛、呼吸困难、肢体麻木或言语不清？若有任一症状，请立即拨打 120。</p><small>MedGPT-4.1 · 急症规则已检测</small></div><div className="user-msg">没有胸痛，是替父亲问的，刚才测了两次。<small>用户 · 10:23</small></div><div className="ai-msg warning"><b>安全提示</b><p>已识别为家人代问。本次为测试场景，请勿直接入档；建议静坐 5 分钟后复测并尽快线下就医。</p></div></div>}
function ReportPreview(){return <div className="report-preview"><div className="paper"><b>泪液分泌功能测定报告</b><p>泪膜破裂时间：BUT OD 2s，OS 1s</p><p>Schirmer I：OD 10 mm，OS 7 mm</p><p>角膜荧光素染色：OU</p><em>注意：OU 仅表示双眼，未推断阳性/阴性</em></div><span>原始报告模拟预览 · 点击可放大</span></div>}
function BusinessTab({pageKey,label,row,onNavigate}:{pageKey:string;label:string;row:RowData;onNavigate:(k:string)=>void}){
  if(label.includes('AI 解读'))return <div className="clinical-note"><h3>患者版解读</h3><p>BUT 结果提示双眼泪膜稳定性下降，左眼更明显。Schirmer 检查右眼为 10 mm、左眼为 7 mm，需结合症状和眼表检查综合判断。</p><div>可信度 96.2% · 引用原文 3 处 · <b>无额外医学推断</b></div></div>
  if(label.includes('结构化'))return <div className="structured">{[['BUT OD','2','s','偏低'],['BUT OS','1','s','偏低'],['Schirmer OD','10','mm','临界'],['Schirmer OS','7','mm','偏低'],['角膜荧光素染色','OU','—','不推断']].map(x=><div key={x[0]}><b>{x[0]}</b><span>{x[1]} {x[2]}</span><StatusTag value={x[3]}/></div>)}</div>
  if(label.includes('号源'))return <div className="structured">{['07月10日 上午 · 专家号 · 剩余 6','07月11日 下午 · 特需号 · 剩余 3','07月14日 上午 · 专家号 · 剩余 12'].map(x=><div key={x}><b>{x}</b><button onClick={()=>onNavigate('slots')}>查看号源</button></div>)}</div>
  if(label.includes('智能体'))return <div className="clinical-note"><h3>王建安心血管 AI 分身</h3><p>绑定心血管专科知识库，仅回答冠心病、高血压和心衰相关问题；胸痛急症优先触发 120 提示。</p><button className="btn primary" onClick={()=>onNavigate('agents')}>进入智能体配置</button></div>
  return <div className="timeline">{[`${label}已由系统生成`,`${label}完成医学规则校验`,`${String(row.name)}关联数据已同步`,'医学运营管理员完成复核'].map((x,i)=><div key={x}><i/><b>{x}</b><span>{dates[i]}</span><p>{pageKey==='consults'?'会话链路与安全策略已留痕。':'业务数据已经过权限与质量校验。'}</p></div>)}</div>
}
function LogTimeline(){return <div className="timeline">{['医学运营管理员 查看详情','系统自动同步数据','王医生 完成人工复核','用户提交原始数据'].map((x,i)=><div key={x}><i/><b>{x}</b><span>{dates[i]}</span><p>IP 10.24.16.{8+i} · Web 管理端</p></div>)}</div>}
