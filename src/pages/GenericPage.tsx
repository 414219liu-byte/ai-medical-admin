import { useMemo, useState } from 'react'
import { MoreHorizontal } from 'lucide-react'
import type { PageConfig, RowData } from '../types'
import FilterBar from '../components/FilterBar'
import DataTable from '../components/DataTable'
import BusinessDetailDrawer from '../components/BusinessDetailDrawer'
import EditModal from '../components/EditModal'
import ConfirmDialog from '../components/ConfirmDialog'
import ExportComplianceDialog from '../components/ExportComplianceDialog'

export default function GenericPage({config,onNavigate,onToast}:{config:PageConfig;onNavigate:(k:string)=>void;onToast:(m:string)=>void}) {
  const [rows,setRows]=useState(config.rows)
  const [keyword,setKeyword]=useState(''),[filter,setFilter]=useState('全部'),[status,setStatus]=useState('全部'),[date,setDate]=useState(''),[endDate,setEndDate]=useState('')
  const [extraValues,setExtraValues]=useState<Record<string,string>>({})
  const [selected,setSelected]=useState<string[]>([]),[detail,setDetail]=useState<RowData|null>(null),[editing,setEditing]=useState<RowData|null|undefined>(undefined)
  const [detailTab,setDetailTab]=useState<string|undefined>()
  const [deleteRow,setDeleteRow]=useState<RowData|null>(null)
  const [exportOpen,setExportOpen]=useState(false)
  const filterCfg=config.filters?.[0]??{key:'status',label:'状态',options:['全部','正常','待审核']}
  const shown=useMemo(()=>rows.filter(r=>{
    const matches=!keyword||Object.values(r).some(v=>String(v).toLowerCase().includes(keyword.toLowerCase()))
    const rowDate=String(r.updatedAt??r.date??r.reportDate??'').slice(0,10)
    const dateMatch=(!date||rowDate>=date)&&(!endDate||rowDate<=endDate)
    const extras=(config.filters??[]).slice(1).every(item=>(extraValues[item.key]??'全部')==='全部'||String(r[item.key]).includes(extraValues[item.key]))
    return matches&&dateMatch&&extras&&(filter==='全部'||String(r[filterCfg.key])===filter)&&(status==='全部'||String(r.status)===status)
  }),[rows,keyword,filter,status,date,endDate,extraValues,filterCfg.key,config.filters])
  const action=(a:string,row:RowData)=>{
    if(config.key==='interpretation'){
      if(a==='查看纠错'){onNavigate('corrections');return}
      if(a==='查看原报告'){onNavigate('reports');return}
      const tabMap:Record<string,string>={'查看详情':'任务概览','查看结构化字段':'结构化字段'}
      if(tabMap[a]){setDetailTab(tabMap[a]);setDetail(row);return}
      if(a==='重新OCR'||a==='重新生成解读'||a==='提交复核'){onToast(`${a}任务已提交`);return}
    }
    if(config.key==='family'&&a==='查看档案'){onNavigate('health');return}
    if(config.key==='health'){
      if(a==='查看档案'){setDetailTab('档案概览');setDetail(row);return}
      if(a==='查看病历'){onNavigate('records');return}
      if(a==='查看报告'){onNavigate('reports');return}
      if(a==='入档记录'){onNavigate('archive');return}
    }
    if(/查看|关联|原图|预览|说明书/.test(a)){setDetailTab(undefined);setDetail(row);return}
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
    if(a.includes('调整权限')){setDetailTab('共享权限');setDetail(row);return}
    if(a.includes('停用')||a.includes('解除关系')){setRows(xs=>xs.map(x=>x.id===row.id?{...x,businessStatus:'已停用',status:'已停用',updatedAt:'2026-07-09 现在'}:x));onToast('成员关系已停用，数据仍保留并进入审计日志');return}
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
    <FilterBar keyword={keyword} onKeyword={setKeyword} filter={filter} onFilter={setFilter} options={filterCfg.options} filterLabel={filterCfg.label} status={status} onStatus={setStatus} date={date} onDate={setDate} endDate={endDate} onEndDate={setEndDate}
      extraFilters={(config.filters??[]).slice(1)} extraValues={extraValues} onExtra={(key,value)=>setExtraValues(v=>({...v,[key]:value}))}
      onReset={()=>{setKeyword('');setFilter('全部');setStatus('全部');setDate('');setEndDate('');setExtraValues({})}} onAdd={()=>setEditing(null)} addText={config.primaryAction??'新增记录'} onExport={()=>config.key==='family'?setExportOpen(true):onToast(`已导出 ${shown.length} 条数据`)}/>
    <DataTable columns={config.columns} rows={shown} actions={config.actions??['查看','编辑','删除']} selected={selected} onSelected={setSelected} onAction={action}/>
    <BusinessDetailDrawer row={detail} pageKey={config.key} initialTab={detailTab} onClose={()=>setDetail(null)} onNavigate={k=>{setDetail(null);onNavigate(k)}} onToast={onToast}/>
    <EditModal open={editing!==undefined} title={`${editing?'编辑':'新增'}${config.title.replace('管理','')}`} fields={editing?(config.editFields??config.fields):(config.createFields??config.fields)} initial={editing} onClose={()=>setEditing(undefined)} onSave={save}/>
    <ConfirmDialog open={!!deleteRow} name={String(deleteRow?.name??'')} onClose={()=>setDeleteRow(null)} onConfirm={()=>{setRows(x=>x.filter(r=>r.id!==deleteRow?.id));setDeleteRow(null);onToast('记录已删除')}}/>
    <ExportComplianceDialog open={exportOpen} count={shown.length} onClose={()=>setExportOpen(false)} onConfirm={()=>{setExportOpen(false);onToast(`已导出 ${shown.length} 条脱敏记录，审计日志已生成`)}}/>
  </>
}
