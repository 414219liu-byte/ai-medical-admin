import { Download, Plus, RotateCcw, Search } from 'lucide-react'

interface Props {
  keyword: string
  onKeyword: (v: string) => void
  filter: string
  onFilter: (v: string) => void
  options: string[]
  filterLabel: string
  status: string
  onStatus: (v: string) => void
  date: string
  onDate: (v: string) => void
  onReset: () => void
  onAdd: () => void
  onExport: () => void
  addText: string
}

export default function FilterBar(p: Props) {
  return <div className="filter-card">
    <div className="filter-fields">
      <label><span>关键词</span><div className="input-with-icon"><Search size={15}/><input value={p.keyword} onChange={e=>p.onKeyword(e.target.value)} placeholder="搜索名称、用户或 ID"/></div></label>
      <label><span>{p.filterLabel}</span><select value={p.filter} onChange={e=>p.onFilter(e.target.value)}>{p.options.map(x=><option key={x}>{x}</option>)}</select></label>
      <label><span>业务状态</span><select value={p.status} onChange={e=>p.onStatus(e.target.value)}><option>全部</option><option>正常</option><option>已启用</option><option>待审核</option><option>待确认</option><option>处理中</option><option>已通过</option><option>已禁用</option></select></label>
      <label><span>创建时间</span><input type="date" value={p.date} onChange={e=>p.onDate(e.target.value)}/></label>
      <button className="btn primary"><Search size={15}/>查询</button>
      <button className="btn" onClick={p.onReset}><RotateCcw size={15}/>重置</button>
    </div>
    <div className="filter-actions">
      <button className="btn primary" onClick={p.onAdd}><Plus size={16}/>{p.addText}</button>
      <button className="btn" onClick={p.onExport}><Download size={16}/>导出数据</button>
    </div>
  </div>
}
