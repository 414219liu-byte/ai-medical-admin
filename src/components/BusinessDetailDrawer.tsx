import { Activity, Bot, ClipboardList, ExternalLink, FileText, ShieldAlert, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { chineseFieldLabels, detailConfigs } from '../config/detailConfig'
import { detailMockData, type BusinessDetail, type DetailBlock } from '../mock/detailMockData'
import type { RowData } from '../types'
import StatusTag from './StatusTag'

export default function BusinessDetailDrawer({row,pageKey,initialTab,onClose,onNavigate,onToast}:{row:RowData|null;pageKey:string;initialTab?:string;onClose:()=>void;onNavigate:(key:string)=>void;onToast:(message:string)=>void}){
  const [active,setActive]=useState(0)
  const config=detailConfigs[pageKey]??detailConfigs.users
  useEffect(()=>setActive(Math.max(0,initialTab?config.tabs.indexOf(initialTab):0)),[row?.id,pageKey,initialTab,config.tabs])
  const detail=useMemo(()=>row?resolveDetail(pageKey,row,config.tabs):null,[pageKey,row,config.tabs])
  if(!row||!detail)return null
  const tab=config.tabs[active]??config.tabs[0]
  const blocks=detail.tabs[tab]??fallbackTab(pageKey,row,tab)
  const statusValues=config.statusFields.map(k=>String(detail[k]??row[k]??'')).filter(Boolean)
  return <div className="drawer-wrap" onMouseDown={e=>e.target===e.currentTarget&&onClose()}>
    <aside className="drawer business-drawer">
      <header className="business-drawer-head">
        <div className="drawer-icon"><ClipboardList/></div>
        <div className="business-title"><small>{config.businessType}</small><h2>{String(detail[config.titleField]??detail.name)}</h2><p>{config.subtitle(detail)}</p></div>
        <div className="header-status">{statusValues.map(x=><StatusTag key={x} value={x}/>)}</div>
        <button className="drawer-close" onClick={onClose}><X/></button>
      </header>
      <div className="drawer-tabs business-tabs">{config.tabs.map((name,index)=><button key={name} className={active===index?'active':''} onClick={()=>setActive(index)}>{name}</button>)}</div>
      <div className="drawer-body business-body"><BlockList blocks={blocks} onNavigate={onNavigate}/></div>
      <footer className="drawer-foot business-actions">
        <button className="btn" onClick={onClose}>关闭</button>
        {config.actions.map(action=><button key={action.label} className={`btn ${action.tone==='primary'?'primary':''}`} onClick={()=>action.route?onNavigate(action.route):onToast(`${action.label}操作已完成`)}>
          {action.route&&<ExternalLink size={14}/>} {action.label}
        </button>)}
      </footer>
    </aside>
  </div>
}

function BlockList({blocks,onNavigate}:{blocks:DetailBlock[];onNavigate:(key:string)=>void}){
  return <div className="detail-blocks">{blocks.map((block,index)=>{
    if(block.type==='info')return <section className="info-section" key={index}>{block.title&&<h3>{block.title}</h3>}<div className="business-info-grid">{block.items.map(([label,value])=><div key={label}><span>{label}</span><strong>{String(value)}</strong></div>)}</div></section>
    if(block.type==='table')return <section className="related-section" key={index}><div className="business-table"><table><thead><tr>{block.columns.map(x=><th key={x}>{x}</th>)}<th>操作</th></tr></thead><tbody>{block.rows.map((cells,i)=><tr key={i}>{cells.map((cell,j)=><td key={j}>{isStatus(String(cell))?<StatusTag value={cell}/>:String(cell)}</td>)}<td><button onClick={()=>navigateById(String(cells[0]),onNavigate)}>查看</button></td></tr>)}</tbody></table></div></section>
    if(block.type==='timeline')return <section className="business-timeline" key={index}>{block.items.map((item,i)=><div key={i}><i/><time>{item.time}</time><h4>{item.title}<span>{item.actor}</span></h4><p>{item.content}</p><small>IP 10.24.16.{8+i} · Web 管理端</small></div>)}</section>
    if(block.type==='conversation')return <section className="conversation business-conversation" key={index}>{block.messages.map((message,i)=><div key={i} className={message.role==='user'?'user-msg':`ai-msg ${message.role==='warning'?'warning':''}`}><b>{message.name}</b><p>{message.content}</p>{message.time&&<small>{message.time}</small>}</div>)}</section>
    if(block.type==='alert')return <section className={`risk-alert ${block.tone}`} key={index}>{block.tone==='danger'?<ShieldAlert/>:<Activity/>}<div><h3>{block.title}</h3><p>{block.content}</p></div></section>
    if(block.type==='text')return <section className="clinical-text" key={index}><h3>{block.title}</h3><p>{block.content}</p></section>
    if(block.type==='ai')return <section className="ai-call-card" key={index}><div><Bot/><h3>AI 调用记录</h3><StatusTag value="调用成功"/></div><div className="ai-meta"><span>模型<strong>{block.model}</strong></span><span>调用工具<strong>{block.tool}</strong></span><span>耗时<strong>{block.duration}</strong></span></div><div className="ai-summary"><p><b>输入摘要</b>{block.input}</p><p><b>输出摘要</b>{block.output}</p></div></section>
    return null
  })}</div>
}

function resolveDetail(pageKey:string,row:RowData,tabs:string[]):BusinessDetail{
  const id=String(row.id)
  const found=detailMockData[pageKey]?.[id]
  if(found)return found
  const items=Object.entries(row).filter(([key])=>chineseFieldLabels[key]).map(([key,value])=>[chineseFieldLabels[key],String(value)] as [string,string])
  const tabData:Record<string,DetailBlock[]>={}
  tabs.forEach((tab,index)=>{
    if(index===0)tabData[tab]=[{type:'info',title:`${tab}信息`,items}]
    else if(/日志|记录|流程|审计|变更/.test(tab))tabData[tab]=[uniqueTimeline(pageKey,id,tab)]
    else tabData[tab]=[{type:'info',title:tab,items:contextItems(pageKey,row,tab)},{type:'alert',tone:'info',title:`${tab}说明`,content:`此处展示 ${String(row.name??id)} 的${tab}业务上下文，数据按当前对象独立生成。`}]
  })
  return {id,name:String(row.name??id),status:String(row.status??'正常'),...row,tabs:tabData}
}

function fallbackTab(pageKey:string,row:RowData,tab:string):DetailBlock[]{
  return [{type:'info',title:tab,items:contextItems(pageKey,row,tab)},uniqueTimeline(pageKey,String(row.id),tab)]
}

function contextItems(pageKey:string,row:RowData,tab:string):[string,string][]{
  const name=String(row.name??row.id)
  const module=detailConfigs[pageKey]?.businessType??'业务模块'
  return [['业务对象',name],['所属模块',module],['当前页签',tab],['关联数据状态','已完成最新同步'],['数据更新时间',String(row.updatedAt??'2026-07-09 10:24')],['数据完整性','核心字段完整，扩展信息待持续补充']]
}

function uniqueTimeline(pageKey:string,id:string,tab:string):DetailBlock{
  const module=detailConfigs[pageKey]?.businessType??'业务'
  return {type:'timeline',items:[
    {time:'2026-07-09 10:24',actor:'医学运营管理员',title:`查看${tab}`,content:`查看 ${id} 在${module}中的${tab}内容`},
    {time:'2026-07-08 16:42',actor:`${module}服务`,title:'关联数据同步',content:`完成 ${id} 的关联对象和流程状态同步`},
    {time:'2026-07-07 09:18',actor:'系统任务',title:'数据质量校验',content:`完成 ${id} 字段完整性及权限范围检查`}
  ]}
}

function navigateById(id:string,onNavigate:(key:string)=>void){
  if(id.startsWith('RP'))onNavigate('reports')
  else if(id.startsWith('AI'))onNavigate('consults')
  else if(id.startsWith('MR'))onNavigate('records')
  else if(id.startsWith('HEA'))onNavigate('health')
  else if(id.startsWith('DG'))onNavigate('diagnoses')
  else if(id.startsWith('RULE'))onNavigate('rules')
  else if(id.startsWith('COR'))onNavigate('corrections')
}
function isStatus(value:string){return /正常|异常|风险|完成|通过|待|可读取|不可读取|启用|上线|关闭|缺失|成功|否|是$/.test(value)}
