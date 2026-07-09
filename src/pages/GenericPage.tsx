import { useMemo, useState } from 'react'
import { MoreHorizontal } from 'lucide-react'
import type { PageConfig, RowData } from '../types'
import FilterBar from '../components/FilterBar'
import DataTable from '../components/DataTable'
import DrawerDetail from '../components/DrawerDetail'
import EditModal from '../components/EditModal'
import ConfirmDialog from '../components/ConfirmDialog'

export default function GenericPage({config,onNavigate,onToast}:{config:PageConfig;onNavigate:(k:string)=>void;onToast:(m:string)=>void}) {
  const [rows,setRows]=useState(config.rows)
  const [keyword,setKeyword]=useState(''),[filter,setFilter]=useState('全部'),[status,setStatus]=useState('全部'),[date,setDate]=useState('')
  const [selected,setSelected]=useState<string[]>([]),[detail,setDetail]=useState<RowData|null>(null),[editing,setEditing]=useState<RowData|null|undefined>(undefined)
  const [deleteRow,setDeleteRow]=useState<RowData|null>(null)
  const filterCfg=config.filters?.[0]??{key:'status',label:'状态',options:['全部','正常','待审核']}
  const shown=useMemo(()=>rows.filter(r=>{
    const matches=!keyword||Object.values(r).some(v=>String(v).toLowerCase().includes(keyword.toLowerCase()))
    const dateMatch=!date||String(r.updatedAt??r.date??r.reportDate??'').startsWith(date)
    return matches&&dateMatch&&(filter==='全部'||String(r[filterCfg.key])===filter)&&(status==='全部'||String(r.status)===status)
  }),[rows,keyword,filter,status,date,filterCfg.key])
  const action=(a:string,row:RowData)=>{
    if(/查看|关联|原图|预览|说明书/.test(a)){setDetail(row);return}
    if(a.includes('编辑')){setEditing(row);return}
    if(a.includes('删除')){setDeleteRow(row);return}
    if(a.includes('档案')){onNavigate('health');return}
    if(a.includes('病历')){onNavigate('records');return}
    if(a.includes('报告')&&!a.includes('解读')){onNavigate('reports');return}
    if(a.includes('号源')){onNavigate('slots');return}
    if(a.includes('智能体')){onNavigate('agents');return}
    if(a.includes('药箱')){onNavigate('medicine-box');return}
    if(a.includes('用药计划')){onNavigate('med-plans');return}
    if(a.includes('命中会话')){onNavigate('consults');return}
    if(a.includes('OCR')||a.includes('解读')){onNavigate('interpretation');return}
    const status=/通过|发布|上线|启用|确认|完成|处理|关闭/.test(a)?'已完成':String(row.status)
    setRows(xs=>xs.map(x=>x.id===row.id?{...x,status}:x));onToast(`${a}操作已完成`)
  }
  const save=(v:RowData)=>{
    if(editing&&editing.id)setRows(xs=>xs.map(x=>x.id===editing.id?{...x,...v}:x))
    else setRows(xs=>[config.mockCreateRecord?config.mockCreateRecord(v,xs):{id:`NEW-${Date.now().toString().slice(-6)}`,name:String(v.name||v.title||'新建记录'),status:'待审核',updatedAt:'2026-07-09 现在',...v},...xs])
    setEditing(undefined);onToast(editing?'修改已保存':'新增记录成功')
  }
  return <><div className="page-title"><div><h1>{config.title}</h1><p>{config.description}</p></div><button className="icon-btn"><MoreHorizontal/></button></div>
    <FilterBar keyword={keyword} onKeyword={setKeyword} filter={filter} onFilter={setFilter} options={filterCfg.options} filterLabel={filterCfg.label} status={status} onStatus={setStatus} date={date} onDate={setDate}
      onReset={()=>{setKeyword('');setFilter('全部');setStatus('全部');setDate('')}} onAdd={()=>setEditing(null)} addText={config.primaryAction??'新增记录'} onExport={()=>onToast(`已导出 ${shown.length} 条数据`)}/>
    <DataTable columns={config.columns} rows={shown} actions={config.actions??['查看','编辑','删除']} selected={selected} onSelected={setSelected} onAction={action}/>
    <DrawerDetail row={detail} pageKey={config.key} detailTabs={config.detailTabs} title={config.title} onClose={()=>setDetail(null)} onNavigate={k=>{setDetail(null);onNavigate(k)}}/>
    <EditModal open={editing!==undefined} title={`${editing?'编辑':'新增'}${config.title.replace('管理','')}`} fields={editing?(config.editFields??config.fields):(config.createFields??config.fields)} initial={editing} onClose={()=>setEditing(undefined)} onSave={save}/>
    <ConfirmDialog open={!!deleteRow} name={String(deleteRow?.name??'')} onClose={()=>setDeleteRow(null)} onConfirm={()=>{setRows(x=>x.filter(r=>r.id!==deleteRow?.id));setDeleteRow(null);onToast('记录已删除')}}/>
  </>
}
