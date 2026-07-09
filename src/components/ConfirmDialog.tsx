import { AlertTriangle } from 'lucide-react'
export default function ConfirmDialog({open,name,onClose,onConfirm}:{open:boolean;name:string;onClose:()=>void;onConfirm:()=>void}) {
  if(!open)return null
  return <div className="overlay"><div className="confirm"><div className="warn"><AlertTriangle/></div><h2>确认删除这条记录？</h2><p>即将删除「{name}」。删除后无法恢复，请谨慎操作。</p><div><button className="btn" onClick={onClose}>取消</button><button className="btn danger" onClick={onConfirm}>确认删除</button></div></div></div>
}
