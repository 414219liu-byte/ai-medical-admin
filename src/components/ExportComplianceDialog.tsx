import { Download, ShieldCheck, X } from 'lucide-react'
import { useState } from 'react'

export default function ExportComplianceDialog({open,count,onClose,onConfirm}:{open:boolean;count:number;onClose:()=>void;onConfirm:()=>void}){
  const [reason,setReason]=useState('')
  if(!open)return null
  return <div className="overlay"><div className="modal export-modal">
    <div className="modal-head"><div><h2>家庭成员数据导出确认</h2><p>导出行为将进入隐私与安全审计日志</p></div><button onClick={onClose}><X/></button></div>
    <div className="export-content">
      <div className="compliance-notice"><ShieldCheck/><div><b>敏感健康数据合规提醒</b><span>请确认导出目的符合最小必要原则，禁止通过非授权渠道传播。</span></div></div>
      <div className="business-info-grid">
        <div><span>导出范围</span><strong>当前筛选结果，共 {count} 条家庭成员记录</strong></div>
        <div><span>脱敏方式</span><strong>手机号、姓名及医疗标识部分脱敏</strong></div>
        <div><span>操作人</span><strong>医学运营管理员</strong></div>
        <div><span>审计策略</span><strong>记录导出人、时间、范围、原因和设备IP</strong></div>
      </div>
      <label className="export-reason"><span><em>*</em>申请原因</span><textarea value={reason} onChange={e=>setReason(e.target.value)} placeholder="请说明本次导出的业务用途与数据接收方"/></label>
      {!reason.trim()&&<small className="export-hint">填写申请原因后方可确认导出</small>}
    </div>
    <div className="modal-foot"><button className="btn" onClick={onClose}>取消</button><button className="btn primary" disabled={!reason.trim()} onClick={onConfirm}><Download size={15}/>确认并记录审计</button></div>
  </div></div>
}
