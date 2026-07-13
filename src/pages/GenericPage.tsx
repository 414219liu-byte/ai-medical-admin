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
    if(config.key.startsWith('ai-clinic/')){
      if(config.key==='ai-clinic/sessions'&&a==='查看'){onNavigate(`ai-clinic/sessions/${row.id}`);return}
      if(config.key==='ai-clinic/templates'&&a==='查看'){onNavigate(`ai-clinic/templates/${row.id}`);return}
      if(a==='规则测试'||a==='执行'||a==='批量执行'){onToast(`${a}完成：高风险规则优先于模板匹配、槽位追问和直接结论`);return}
      if(a.includes('停用')){setDeleteRow({...row,name:String(row.name??row.id),__confirmAction:'停用'});return}
      if(a.includes('删除')){
        if(!['草稿','待发布'].includes(String(row.status))){onToast('已发布或已被使用的配置不能直接删除，请先停用');return}
        setDeleteRow(row);return
      }
      if(/查看|详情|预览|差异/.test(a)){setDetailTab(undefined);setDetail(row);return}
      if(a.includes('编辑')){setEditing(row);return}
    }
    if(config.key==='camera'){
      if(a==='纠错记录'){onNavigate('corrections');return}
      const tabMap:Record<string,string>={
        '查看任务':'任务概览','查看图片':'原始图片','查看脱敏':'隐私脱敏','查看脱敏结果':'隐私脱敏',
        '查看结果':'AI分析结果','查看分析摘要':'AI分析结果','入档记录':'入档与症状记录',
        '复核':'风险评估','查看审计':'操作日志'
      }
      if(tabMap[a]){setDetailTab(tabMap[a]);setDetail(row);return}
    }
    if(config.key==='interpretation'){
      if(a==='查看纠错'||a==='纠错记录'){onNavigate('corrections');return}
      const tabMap:Record<string,string>={'查看详情':'任务概览','查看解读':'AI解读结果','查看原报告':'原始报告','查看OCR':'OCR结果','查看结构化':'结构化字段','查看结构化字段':'结构化字段','医学复核':'医学复核','入档记录':'入档记录'}
      if(tabMap[a]){setDetailTab(tabMap[a]);setDetail(row);return}
      if(a==='重新OCR'||a==='重新生成解读'||a==='提交复核'){onToast(`${a}任务已提交`);return}
    }
    if(config.key==='family'&&a==='查看档案'){onNavigate('health');return}
    if(config.key==='consults'){
      if(a==='查看详情'){setDetailTab('会话概览');setDetail(row);return}
      if(a==='查看症状记录'){onNavigate('symptoms');return}
      if(a==='查看诊断记录'){onNavigate('diagnoses');return}
      if(a==='查看入档记录'){onNavigate('archive');return}
    }
    if(config.key==='symptoms'){
      if(a==='查看来源会话'){onNavigate('consults');return}
      if(a==='查看关联诊断'){onNavigate('diagnoses');return}
    }
    if(config.key==='diagnoses'){
      if(a==='查看来源单据'){const id=String(row.sourceId);onNavigate(id.startsWith('RP')?'reports':id.startsWith('AI')?'consults':'records');return}
      if(a==='查看健康档案'){onNavigate('health');return}
    }
    if(config.key==='health'){
      if(a==='查看档案'){setDetailTab('档案概览');setDetail(row);return}
      if(a==='查看病历'){onNavigate('records');return}
      if(a==='查看报告'){onNavigate('reports');return}
      if(a==='入档记录'){onNavigate('archive');return}
    }
    if(config.key==='records'){
      if(a==='查看'){setDetailTab('病历原文');setDetail(row);return}
      if(a==='删除/迁移申请'){onNavigate('requests');return}
      if(a==='重新OCR'){onToast(`病历 ${row.id} 已提交 OCR 重识别，操作已写入审计日志`);return}
      if(a==='同步AI'){onToast(`病历 ${row.id} 已提交 AI 索引同步，操作已写入审计日志`);return}
      if(a==='人工审核'){onToast(`病历 ${row.id} 已进入医学运营复核队列`);return}
    }
    if(config.key==='reports'){
      if(a==='纠错记录'){onNavigate('corrections');return}
      if(a==='删除/迁移申请'){onNavigate('requests');return}
      const tabMap:Record<string,string>={'查看原图':'报告原图 / OCR文本','查看结构化':'结构化字段','医学复核':'医学复核'}
      if(tabMap[a]){setDetailTab(tabMap[a]);setDetail(row);return}
      if(a==='生成解读'){onNavigate('interpretation');return}
      if(a==='入档记录'){onNavigate('archive');return}
    }
    if(config.key==='agents'){
      if(a==='查看'){setDetailTab('基础配置');setDetail(row);return}
      if(a==='版本记录'){setDetailTab('上线审核 / 版本记录');setDetail(row);return}
      if(a==='提交审核'){setRows(xs=>xs.map(x=>x.id===row.id?{...x,reviewStatus:'待医学审核',status:'待医学审核',updatedAt:'2026-07-09 现在'}:x));onToast('已提交医学审核，操作已写入审计日志');return}
      if(a==='灰度发布'){setRows(xs=>xs.map(x=>x.id===row.id?{...x,publishStatus:'灰度上线',status:'灰度上线',updatedAt:'2026-07-09 现在'}:x));onToast('已进入灰度发布，支持回滚到上一稳定版本');return}
      if(a==='下线'){setRows(xs=>xs.map(x=>x.id===row.id?{...x,publishStatus:'已下线',status:'已下线',updatedAt:'2026-07-09 现在'}:x));onToast('智能体已下线，历史调用和审计记录继续保留');return}
      if(a==='归档'){onToast('已创建归档申请；产生过调用记录的智能体不会被硬删除');return}
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
    <DataTable columns={config.columns} rows={shown} actions={config.actions??['查看','编辑','删除']}
      actionsForRow={config.key==='camera'?(row=>row.traceless==='是'?['查看审计','查看脱敏结果','查看分析摘要']:(config.actions??[])):undefined}
      selected={selected} onSelected={setSelected} onAction={action}/>
    <BusinessDetailDrawer row={detail} pageKey={config.key} initialTab={detailTab} onClose={()=>setDetail(null)} onNavigate={k=>{setDetail(null);onNavigate(k)}} onToast={onToast}/>
    <EditModal open={editing!==undefined} title={editing?`编辑${config.title.replace('管理','')}`:(config.primaryAction??`新增${config.title.replace('管理','')}`)} fields={editing?(config.editFields??config.fields):(config.createFields??config.fields)} initial={editing} onClose={()=>setEditing(undefined)} onSave={save}/>
    <ConfirmDialog open={!!deleteRow} name={String(deleteRow?.name??'')} onClose={()=>setDeleteRow(null)} onConfirm={()=>{
      if(deleteRow?.__confirmAction==='停用'){setRows(xs=>xs.map(r=>r.id===deleteRow.id?{...r,status:'已停用',updatedAt:'2026-07-13 现在'}:r));onToast('配置已停用，历史会话继续保留原版本记录')}
      else {setRows(x=>x.filter(r=>r.id!==deleteRow?.id));onToast('记录已删除')}
      setDeleteRow(null)
    }}/>
    <ExportComplianceDialog open={exportOpen} count={shown.length} onClose={()=>setExportOpen(false)} onConfirm={()=>{setExportOpen(false);onToast(`已导出 ${shown.length} 条脱敏记录，审计日志已生成`)}}/>
  </>
}
