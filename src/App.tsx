import { useEffect, useState } from 'react'
import { CheckCircle2, X } from 'lucide-react'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import GenericPage from './pages/GenericPage'
import AiClinicDashboard from './pages/ai-clinic/AiClinicDashboard'
import AiClinicSessionDetail from './pages/ai-clinic/AiClinicSessionDetail'
import AiClinicTemplateDetail from './pages/ai-clinic/AiClinicTemplateDetail'
import { pageConfigs } from './mock/mockData'

export default function App(){
  const initial=location.hash.slice(1)||'dashboard'
  const [active,setActive]=useState(initial),[collapsed,setCollapsed]=useState(false),[toast,setToast]=useState('')
  const navigate=(key:string)=>{setActive(key);location.hash=key;window.scrollTo({top:0,behavior:'smooth'})}
  useEffect(()=>{const fn=()=>setActive(location.hash.slice(1)||'dashboard');addEventListener('hashchange',fn);return()=>removeEventListener('hashchange',fn)},[])
  useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(''),2600);return()=>clearTimeout(t)},[toast])
  return <Layout active={active} onNavigate={navigate} collapsed={collapsed} setCollapsed={setCollapsed}>
    {active==='dashboard'?<Dashboard onNavigate={navigate} onToast={setToast}/>:
      active==='ai-clinic/dashboard'?<AiClinicDashboard onNavigate={navigate}/>:
      active.startsWith('ai-clinic/sessions/')?<AiClinicSessionDetail sessionId={active.split('/').pop()??''} onNavigate={navigate}/>:
      active.startsWith('ai-clinic/templates/')?<AiClinicTemplateDetail templateId={active.split('/').pop()??''} onNavigate={navigate}/>:
      pageConfigs[active]?<GenericPage key={active} config={pageConfigs[active]} onNavigate={navigate} onToast={setToast}/>:null}
    {toast&&<div className="toast"><CheckCircle2/><span>{toast}</span><button onClick={()=>setToast('')}><X/></button></div>}
  </Layout>
}
