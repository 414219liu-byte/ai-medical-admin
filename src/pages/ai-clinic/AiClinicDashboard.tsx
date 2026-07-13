import { Activity, AlertTriangle, BarChart3, Bot, CheckCircle2, FileWarning, ShieldAlert, Stethoscope } from 'lucide-react'
import { aiClinicSessions } from '../../mock/aiClinicAdminData'
import StatusTag from '../../components/StatusTag'

export default function AiClinicDashboard({ onNavigate }: { onNavigate: (key: string) => void }) {
  const stats = [
    ['今日问诊会话', '1,286', '+12.4%', <Stethoscope />],
    ['完成问诊', '968', '完成率 75.27%', <CheckCircle2 />],
    ['平均问诊轮次', '6.8轮', '平均时长 4分32秒', <Activity />],
    ['直接结论次数', '186', '严格受进度和风险筛查限制', <Bot />],
    ['高风险触发次数', '39', '120急救 8 次', <ShieldAlert />],
    ['非医疗退出次数', '72', '桌子/车辆/写文案等', <FileWarning />],
    ['模板匹配成功率', '93.61%', '否定语义已启用', <BarChart3 />],
    ['高风险漏判率', '0.18%', '需持续质检', <AlertTriangle />]
  ]
  const templates = [
    ['1', '腹痛问诊模板', '238次', '78.6%', '7.2轮', '42次', '12次'],
    ['2', '眼睛干涩问诊模板', '186次', '84.9%', '6.3轮', '35次', '2次'],
    ['3', '胸痛问诊模板', '109次', '68.8%', '5.1轮', '8次', '16次'],
    ['4', '儿童发热问诊模板', '96次', '81.2%', '6.1轮', '28次', '5次']
  ]
  const exceptions = [
    ['重复追问', '18', '槽位状态未及时闭环', '中'],
    ['模板匹配错误', '11', '胃痛与胸痛边界样本', '高'],
    ['槽位提取失败', '24', '用户纠正表达未覆盖', '中'],
    ['非医疗图片误识别', '6', '车辆、桌面、菜品图片', '高'],
    ['高风险误报', '4', '历史胸痛被当作当前胸痛', '高'],
    ['用户修改答案后未更新', '9', '持续时间覆盖失败', '中']
  ]
  return <div>
    <div className="page-title"><div><h1>AI诊室 · 诊室工作台</h1><p>监控结构化问诊、模板路由、槽位进度、高风险中断和质检表现</p></div></div>
    <div className="stats ai-clinic-stats">{stats.map(([label, value, tip, icon], i) => <div className={`stat ${i === 4 || i === 7 ? 's2' : ''}`} key={String(label)}>
      <div>{icon}</div><span>{label}</span><b>{value}</b><small className={i === 7 ? 'danger' : ''}>{tip}</small><i className="sparkline" />
    </div>)}</div>
    <div className="clinic-chart-grid">
      <ChartPanel title="最近7天问诊会话趋势" values={[820, 936, 902, 1040, 1135, 1198, 1286]} />
      <DonutPanel title="问诊结束状态分布" items={[['自动结论', '52%'], ['直接结论', '14%'], ['高风险中断', '3%'], ['非医疗退出', '6%'], ['用户退出', '25%']]} />
      <DonutPanel title="风险等级分布" items={[['普通风险', '71%'], ['关注风险', '18%'], ['尽快就医', '7%'], ['120/心理危机', '4%']]} />
      <ChartPanel title="用户退出节点分布" values={[72, 48, 35, 29, 18, 12, 8]} compact />
    </div>
    <div className="dash-grid">
      <section className="panel">
        <div className="panel-head"><div><h2>热门问诊模板排行</h2><span>今日调用、完成率、轮次和风险表现</span></div><button onClick={() => onNavigate('ai-clinic/templates')}>查看模板</button></div>
        <div className="mini-table"><table><thead><tr><th>排名</th><th>模板名称</th><th>今日调用</th><th>完成率</th><th>平均轮次</th><th>直接结论</th><th>高风险</th></tr></thead><tbody>
          {templates.map(row => <tr key={row[0]}>{row.map((cell, i) => <td key={i}>{cell}</td>)}</tr>)}
        </tbody></table></div>
      </section>
      <section className="panel">
        <div className="panel-head"><div><h2>异常情况</h2><span>点击进入质检测试并带入异常类型</span></div><button onClick={() => onNavigate('ai-clinic/quality-tests')}>进入质检</button></div>
        <div className="todo-list clinic-exceptions">{exceptions.map(item => <div key={item[0]}>
          <div className={`priority ${item[3] === '高' ? '' : 'p2'}`}>{item[3]}</div><div><b>{item[0]}</b><p>{item[2]}</p></div><aside><StatusTag value={`${item[1]}条`} /><small>待回归</small></aside><button onClick={() => onNavigate('ai-clinic/quality-tests')}>查看</button>
        </div>)}</div>
      </section>
    </div>
    <section className="panel clinic-live">
      <div className="panel-head"><div><h2>今日核心会话样本</h2><span>统一用户、问诊人、模板、风险、模型调用关系</span></div><button onClick={() => onNavigate('ai-clinic/sessions')}>查看全部</button></div>
      <div className="mini-table wide"><table><thead><tr><th>会话</th><th>问诊人</th><th>主诉</th><th>模板</th><th>进度</th><th>风险</th><th>状态</th><th>操作</th></tr></thead><tbody>
        {aiClinicSessions.slice(0, 6).map(row => <tr key={row.id}><td>{row.id}</td><td>{row.patientName}</td><td>{row.chiefComplaint}</td><td>{row.templateName}</td><td>{row.progress}</td><td><StatusTag value={row.riskLevel} /></td><td><StatusTag value={row.status} /></td><td><button onClick={() => onNavigate(`ai-clinic/sessions/${row.id}`)}>查看详情</button></td></tr>)}
      </tbody></table></div>
    </section>
  </div>
}

function ChartPanel({ title, values, compact }: { title: string; values: number[]; compact?: boolean }) {
  const max = Math.max(...values)
  return <section className="panel clinic-chart"><div className="panel-head"><div><h2>{title}</h2><span>按业务口径实时汇总</span></div></div>
    <div className={compact ? 'bar-chart compact' : 'bar-chart'}>{values.map((value, index) => <div key={index}><i style={{ height: `${Math.max(14, value / max * 100)}%` }} /><span>{compact ? `${index + 1}` : `7/${7 + index}`}</span></div>)}</div>
  </section>
}

function DonutPanel({ title, items }: { title: string; items: string[][] }) {
  return <section className="panel clinic-chart"><div className="panel-head"><div><h2>{title}</h2><span>今日样本分布</span></div></div>
    <div className="clinic-donut"><div><b>{items[0][1]}</b><span>{items[0][0]}</span></div><ul>{items.map(item => <li key={item[0]}><i />{item[0]}<b>{item[1]}</b></li>)}</ul></div>
  </section>
}
