import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react'
import type { Column, RowData } from '../types'
import StatusTag from './StatusTag'

interface Props { columns: Column[]; rows: RowData[]; actions: string[]; actionsForRow?:(row:RowData)=>string[]; selected: string[]; onSelected:(v:string[])=>void; onAction:(a:string,r:RowData)=>void }

export default function DataTable({columns,rows,actions,actionsForRow,selected,onSelected,onAction}:Props) {
  const toggleAll = () => onSelected(selected.length===rows.length ? [] : rows.map(r=>String(r.id)))
  return <div className="table-card">
    {selected.length>0 && <div className="batch-bar">已选择 <b>{selected.length}</b> 项 <button onClick={()=>onSelected([])}>取消选择</button><button>批量处理</button></div>}
    <div className="table-scroll"><table>
      <thead><tr><th className="check"><input type="checkbox" checked={rows.length>0&&selected.length===rows.length} onChange={toggleAll}/></th><th className="index">序号</th>
        {columns.map(c=><th key={c.key} style={{minWidth:c.width}}>{c.title}</th>)}<th className="operations">操作</th></tr></thead>
      <tbody>{rows.map((row,i)=><tr key={String(row.id)}>
        <td className="check"><input type="checkbox" checked={selected.includes(String(row.id))} onChange={()=>onSelected(selected.includes(String(row.id))?selected.filter(x=>x!==String(row.id)):[...selected,String(row.id)])}/></td>
        <td className="index">{i+1}</td>
        {columns.map(c=><td key={c.key} className={c.key==='templateDisplay'?'template-cell':''} title={String(row[c.key]??'—')}>{c.status?<StatusTag value={row[c.key]??'—'}/>:c.key==='templateDisplay'?String(row[c.key]??'—').split('\n').map((x,i)=><span key={i}>{x}</span>):String(row[c.key]??'—')}</td>)}
        <td className="operations"><div>{(actionsForRow?.(row)??actions).map((a,j)=><button key={a} className={j===0?'main-op':''} onClick={()=>onAction(a,row)}>{a}</button>)}</div></td>
      </tr>)}</tbody>
    </table></div>
    {rows.length===0 && <div className="empty"><Inbox/><b>没有找到匹配数据</b><span>试试调整筛选条件</span></div>}
    <div className="pagination"><span>共 {rows.length} 条记录</span><select defaultValue="10"><option>10 条/页</option><option>20 条/页</option></select><button disabled><ChevronLeft size={15}/></button><button className="active">1</button><button disabled><ChevronRight size={15}/></button></div>
  </div>
}
