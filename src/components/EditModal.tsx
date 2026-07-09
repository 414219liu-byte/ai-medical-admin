import { Upload, X } from 'lucide-react'
import type { Field, RowData } from '../types'
import { useEffect, useState } from 'react'

export default function EditModal({open,title,fields,initial,onClose,onSave}:{open:boolean;title:string;fields:Field[];initial?:RowData|null;onClose:()=>void;onSave:(v:RowData)=>void}) {
  const [form,setForm]=useState<RowData>({})
  const [errors,setErrors]=useState<Record<string,string>>({})
  const [files,setFiles]=useState<Record<string,string>>({})
  useEffect(()=>setForm(initial??{}),[initial,open])
  useEffect(()=>{setErrors({});setFiles({})},[open])
  const save=()=>{
    const next:Record<string,string>={}
    fields.filter(f=>!f.showWhen||f.showWhen.values.includes(String(form[f.showWhen.key]??''))).forEach(f=>{if(f.required&&!String(form[f.key]??'').trim())next[f.key]=`请选择或填写${f.label}`})
    if(Object.keys(next).length){setErrors(next);return}
    onSave(form)
  }
  const birthValue=String(form.birthDate??form.birthday??'')
  const calculatedAge=birthValue?new Date().getFullYear()-Number(birthValue.slice(0,4))-(new Date().toISOString().slice(5,10)<birthValue.slice(5,10)?1:0):null
  const visibleFields=fields.filter(f=>!f.showWhen||f.showWhen.values.includes(String(form[f.showWhen.key]??'')))
  if(!open)return null
  return <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&onClose()}>
    <div className="modal">
      <div className="modal-head"><div><h2>{title}</h2><p>请填写以下信息，带 * 项为必填</p></div><button onClick={onClose}><X/></button></div>
      <div className="form-grid">{calculatedAge!==null&&calculatedAge<18&&<div className="minor-alert full"><b>未成年人主体</b><span>该成员未满 18 岁，保存前必须确认监护人身份与授权范围。</span></div>}
      {form.source==='后台补录'&&!form.attachment&&<div className="minor-alert full"><b>缺少原始病历凭证</b><span>需医学运营复核后才允许入档或进入 AI 检索索引。</span></div>}
      {visibleFields.map(f=><label key={f.key} className={f.type==='textarea'||f.type==='file'?'full':''}>
        <span>{f.required&&<em>*</em>}{f.label}</span>
        {f.type==='select'?<select className={errors[f.key]?'invalid':''} value={String(form[f.key]??'')} onChange={e=>{const value=e.target.value;setForm(prev=>({...prev,[f.key]:value,...(f.key==='source'&&value==='AI初筛'?{confirmationStatus:'待医生确认'}:{})}));setErrors(prev=>({...prev,[f.key]:''}))}}><option value="">请选择</option>{(f.key==='confirmationStatus'&&form.source==='AI初筛'?['AI初筛','待医生确认']:f.options)?.map(x=><option key={x}>{x}</option>)}</select>
        :f.type==='radio'?<div className="radio-group">{f.options?.map(x=><label key={x}><input type="radio" name={f.key} checked={form[f.key]===x} onChange={()=>{setForm(prev=>({...prev,[f.key]:x}));setErrors(prev=>({...prev,[f.key]:''}))}}/>{x}</label>)}</div>
        :f.type==='multiselect'?<div className="multi-select">{f.options?.map(x=>{const values=String(form[f.key]??'').split(',').filter(Boolean);return <label key={x}><input type="checkbox" checked={values.includes(x)} onChange={()=>setForm(prev=>{const current=String(prev[f.key]??'').split(',').filter(Boolean);return {...prev,[f.key]:current.includes(x)?current.filter(v=>v!==x).join(','):[...current,x].join(',')}})}/>{x}</label>})}</div>
        :f.type==='textarea'?<textarea value={String(form[f.key]??'')} onChange={e=>{const value=e.target.value;setForm(prev=>({...prev,[f.key]:value}))}} placeholder={`请输入${f.label}`}/>
        :f.type==='file'?<div className={`upload ${errors[f.key]?'invalid':''}`}><Upload/><span>{files[f.key]||String(form[f.key]??'')||'点击上传或拖拽文件到此处'}</span><small>{files[f.key]?'文件已选择（模拟上传）':'支持 JPG、PNG、PDF，最大 10MB'}</small><input type="file" onChange={e=>{const name=e.target.files?.[0]?.name??'';setFiles(prev=>({...prev,[f.key]:name}));setForm(prev=>({...prev,[f.key]:name}));setErrors(prev=>({...prev,[f.key]:''}))}}/></div>
        :<input className={errors[f.key]?'invalid':''} readOnly={f.readonly} type={f.type==='date'||f.type==='datetime-local'||f.type==='number'?f.type:'text'} value={String(form[f.key]??'')}
          onInput={e=>{const value=e.currentTarget.value;setForm(prev=>({...prev,[f.key]:value}));setErrors(prev=>({...prev,[f.key]:''}))}}
          onChange={e=>{const value=e.target.value;setForm(prev=>({...prev,[f.key]:value}));setErrors(prev=>({...prev,[f.key]:''}))}} placeholder={f.placeholder??`请输入${f.label}`}/>}
        {errors[f.key]&&<small className="field-error">{errors[f.key]}</small>}
        {f.hint&&<small>{f.hint}</small>}
      </label>)}</div>
      <div className="modal-foot"><button className="btn" onClick={onClose}>取消</button><button className="btn primary" onClick={save}>保存</button></div>
    </div>
  </div>
}
