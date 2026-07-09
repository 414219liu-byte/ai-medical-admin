import { Activity, Bell, Bot, Camera, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Database, FileText, HeartPulse, Hospital, LayoutDashboard, Menu, Search, Settings, ShieldCheck, Users, Workflow } from 'lucide-react'
import { menuGroups } from '../mock/mockData'

const icons:Record<string,React.ReactNode>={
  dashboard:<LayoutDashboard/>,users:<Users/>,family:<Users/>,health:<HeartPulse/>,records:<FileText/>,reports:<FileText/>,diagnoses:<Activity/>,symptoms:<Activity/>,
  consults:<Bot/>,camera:<Camera/>,interpretation:<Bot/>,triage:<Workflow/>,agents:<Bot/>,hospitals:<Hospital/>,departments:<Hospital/>,doctors:<Users/>,slots:<Hospital/>,
  'doctor-rules':<Workflow/>,'medical-kb':<Database/>,'drug-kb':<Database/>,'medicine-box':<Database/>,'med-plans':<Activity/>,rules:<Workflow/>,models:<Bot/>,prompts:<FileText/>,tools:<Settings/>,
  archive:<Database/>,corrections:<ShieldCheck/>,requests:<ShieldCheck/>,feedback:<CircleHelp/>,reviews:<ShieldCheck/>,content:<FileText/>,messages:<Bell/>,permissions:<ShieldCheck/>,privacy:<ShieldCheck/>,settings:<Settings/>
}

export default function Layout({active,onNavigate,collapsed,setCollapsed,children}:{active:string;onNavigate:(k:string)=>void;collapsed:boolean;setCollapsed:(v:boolean)=>void;children:React.ReactNode}) {
  const title=menuGroups.flatMap(g=>g.items).find(x=>x[0]===active)?.[1]??'工作台'
  return <div className={`app ${collapsed?'collapsed':''}`}>
    <aside className="sidebar">
      <div className="brand"><div><HeartPulse/></div><span><b>慧医云</b><small>AI MEDICAL</small></span></div>
      <nav>{menuGroups.map(g=><section key={g.name}><h4>{g.name}</h4>{g.items.map(([key,label])=><button key={key} className={active===key?'active':''} onClick={()=>onNavigate(key)} title={label}>
        {icons[key]??<Menu/>}<span>{label}</span>{active===key&&<i/>}</button>)}</section>)}</nav>
      <div className="side-user"><div>医</div><span><b>医学运营管理员</b><small>超级管理员</small></span><ChevronDown/></div>
      <button className="collapse" onClick={()=>setCollapsed(!collapsed)}>{collapsed?<ChevronRight/>:<ChevronLeft/>}</button>
    </aside>
    <main>
      <header className="topbar"><div className="crumb"><span>AI 医疗助手</span><i>/</i><b>{title}</b></div><div className="top-actions">
        <div className="global-search"><Search/><input placeholder="搜索用户、报告、会话..."/><kbd>⌘ K</kbd></div>
        <button><CircleHelp/></button><button className="notification"><Bell/><i>6</i></button><div className="avatar">医</div><span className="admin-name">医学运营管理员<small>医疗运营中心</small></span><ChevronDown size={16}/>
      </div></header>
      <div className="content">{children}</div>
    </main>
  </div>
}
