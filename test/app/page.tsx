"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Bot,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Download,
  FileText,
  Lightbulb,
  MousePointerClick,
  PackageSearch,
  ReceiptText,
  RefreshCcw,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

const metrics = [
  {
    label: "今日销售额",
    value: "¥486,920",
    change: "+18.4%",
    trend: "up",
    note: "较昨日多 ¥75,600",
    icon: CircleDollarSign,
  },
  {
    label: "订单数",
    value: "6,284",
    change: "+12.7%",
    trend: "up",
    note: "高峰集中在 20:00-22:00",
    icon: ReceiptText,
  },
  {
    label: "退款率",
    value: "2.8%",
    change: "-0.6%",
    trend: "down",
    note: "低于近 7 日均值",
    icon: RefreshCcw,
  },
  {
    label: "访客数",
    value: "132,480",
    change: "+9.1%",
    trend: "up",
    note: "短视频引流贡献 42%",
    icon: Users,
  },
  {
    label: "转化率",
    value: "4.74%",
    change: "+0.31%",
    trend: "up",
    note: "搜索渠道转化最佳",
    icon: MousePointerClick,
  },
];

const insights = [
  {
    title: "销售增长由新品和直播间共同拉动",
    content:
      "AI 识别到今日销售额显著高于近 7 日均值，其中「轻氧控油精华」新品贡献 22.6%，直播间专属券带来额外 1,184 单。",
    tone: "blue",
  },
  {
    title: "风险商品集中在履约与差评",
    content:
      "TOP 风险商品主要问题为发货时效波动、尺码咨询量升高和售后原因集中，建议优先处理库存和客服话术。",
    tone: "amber",
  },
  {
    title: "投放预算存在优化空间",
    content:
      "信息流渠道流量增长 16%，但转化率低于全站 1.2 个百分点，建议将 15% 预算迁移至品牌搜索和私域复购。",
    tone: "green",
  },
];

const riskProducts = [
  {
    name: "轻氧控油精华 30ml",
    category: "美妆护肤",
    risk: 86,
    reason: "退款申请上升",
    sales: "¥92,840",
    stock: "1.8 天",
    owner: "张敏",
  },
  {
    name: "城市通勤防晒外套",
    category: "服饰",
    risk: 78,
    reason: "尺码咨询激增",
    sales: "¥74,320",
    stock: "3.2 天",
    owner: "Leo",
  },
  {
    name: "儿童益智磁力片套装",
    category: "母婴玩具",
    risk: 72,
    reason: "履约延迟",
    sales: "¥58,190",
    stock: "2.4 天",
    owner: "王珂",
  },
  {
    name: "低糖燕麦蛋白棒",
    category: "食品健康",
    risk: 63,
    reason: "差评关键词集中",
    sales: "¥41,650",
    stock: "5.6 天",
    owner: "Mia",
  },
];

const channels = [
  { name: "品牌搜索", visits: 28400, rate: 7.8, orders: 2215, cost: "¥18,200" },
  { name: "直播间", visits: 35200, rate: 6.4, orders: 2253, cost: "¥24,800" },
  { name: "私域社群", visits: 16800, rate: 5.9, orders: 991, cost: "¥4,600" },
  { name: "短视频", visits: 42600, rate: 3.6, orders: 1534, cost: "¥31,500" },
  { name: "信息流广告", visits: 9480, rate: 2.9, orders: 275, cost: "¥12,700" },
];

const suggestions = [
  "20:00 前追加直播间库存水位，重点保障精华与防晒外套两个爆品不断货。",
  "将信息流低转化计划降预算 15%，把预算迁移到品牌搜索词和老客召回券。",
  "客服侧上线尺码问答快捷语，并对高频退货原因商品增加详情页提示。",
  "对退款率上升商品发起 24 小时质检复盘，优先排查批次、物流和赠品缺失。",
];

function formatNumber(value: number) {
  return value.toLocaleString("zh-CN");
}

export default function Home() {
  const [dailyReport, setDailyReport] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const maxChannelRate = useMemo(
    () => Math.max(...channels.map((item) => item.rate)),
    []
  );

  const handleGenerateReport = () => {
    setIsGenerating(true);
    window.setTimeout(() => {
      setDailyReport(
        "今日经营表现整体向好：销售额 ¥486,920，较昨日增长 18.4%，订单数同步提升至 6,284 单，增长主要来自新品爆发、直播间专属券和品牌搜索转化提升。当前需重点关注「轻氧控油精华」退款申请上升与「城市通勤防晒外套」尺码咨询激增，建议晚高峰前完成库存补货、客服话术更新和低效投放预算迁移。若执行建议，预计明日可稳定销售额在 45-52 万区间，并将退款率控制在 2.5%-2.8%。"
      );
      setIsGenerating(false);
    }, 650);
  };

  return (
    <main className="min-h-screen px-6 py-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-4 rounded-lg border border-line bg-panel px-5 py-4 shadow-soft lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-muted">
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 font-medium text-brand-700">
                <Sparkles size={15} />
                AI 经营日报
              </span>
              <span className="inline-flex items-center gap-1">
                <CalendarDays size={15} />
                2026-06-10 经营数据，mock 演示
              </span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-ink lg:text-3xl">
              经营日报驾驶舱
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
              面向老板汇报的一页式经营看板，聚合销售、转化、商品风险与 AI 建议，帮助快速判断今天发生了什么、风险在哪里、下一步怎么做。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-4 py-2 text-sm font-medium text-ink transition hover:bg-slate-50">
              <Download size={16} />
              导出数据
            </button>
            <button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <FileText size={16} />
              {isGenerating ? "正在生成..." : "生成日报"}
            </button>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {metrics.map((item) => {
            const Icon = item.icon;
            const isUp = item.trend === "up";
            return (
              <article
                key={item.label}
                className="rounded-lg border border-line bg-panel p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted">
                    {item.label}
                  </span>
                  <span className="rounded-md bg-slate-100 p-2 text-brand-600">
                    <Icon size={18} />
                  </span>
                </div>
                <div className="mt-4 flex items-end justify-between gap-3">
                  <strong className="text-2xl font-semibold tracking-tight text-ink">
                    {item.value}
                  </strong>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                      isUp
                        ? "bg-emerald-50 text-success"
                        : "bg-blue-50 text-brand-600"
                    }`}
                  >
                    {isUp ? (
                      <ArrowUpRight size={14} />
                    ) : (
                      <ArrowDownRight size={14} />
                    )}
                    {item.change}
                  </span>
                </div>
                <p className="mt-3 text-xs leading-5 text-muted">{item.note}</p>
              </article>
            );
          })}
        </section>

        {dailyReport ? (
          <section className="rounded-lg border border-brand-100 bg-brand-50 p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-brand-700">
              <Bot size={20} />
              <h2 className="font-semibold">AI 经营日报总结</h2>
            </div>
            <p className="text-sm leading-7 text-slate-700">{dailyReport}</p>
          </section>
        ) : null}

        <section className="grid gap-6 xl:grid-cols-[1.05fr_1.45fr]">
          <div className="min-w-0 rounded-lg border border-line bg-panel p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-ink">
                  AI 经营洞察
                </h2>
                <p className="mt-1 text-sm text-muted">
                  基于销售、投放、售后和商品维度的自动归因。
                </p>
              </div>
              <span className="rounded-md bg-brand-50 p-2 text-brand-600">
                <Bot size={20} />
              </span>
            </div>
            <div className="space-y-4">
              {insights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-lg border border-line bg-slate-50 p-4"
                >
                  <div className="flex gap-3">
                    <span
                      className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                        item.tone === "blue"
                          ? "bg-brand-500"
                          : item.tone === "amber"
                            ? "bg-warning"
                            : "bg-success"
                      }`}
                    />
                    <div>
                      <h3 className="font-semibold text-ink">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted">
                        {item.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="min-w-0 rounded-lg border border-line bg-panel p-5 shadow-sm">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-ink">
                  渠道转化率分析
                </h2>
                <p className="mt-1 text-sm text-muted">
                  识别高转化来源与低效预算。
                </p>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-success">
                <TrendingUp size={15} />
                全站转化率 4.74%
              </span>
            </div>
            <div className="space-y-4">
              {channels.map((item) => (
                <div key={item.name} className="grid gap-2 md:grid-cols-[7rem_1fr_13rem] md:items-center">
                  <div>
                    <p className="font-medium text-ink">{item.name}</p>
                    <p className="text-xs text-muted">
                      {formatNumber(item.visits)} 访客
                    </p>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-brand-600"
                      style={{ width: `${(item.rate / maxChannelRate) * 100}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-right text-sm">
                    <span className="font-semibold text-brand-700">
                      {item.rate}%
                    </span>
                    <span className="text-muted">{item.orders} 单</span>
                    <span className="text-muted">{item.cost}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <div className="min-w-0 rounded-lg border border-line bg-panel p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-ink">
                  商品风险排行
                </h2>
                <p className="mt-1 text-sm text-muted">
                  综合退款、差评、库存、履约和客服咨询生成风险分。
                </p>
              </div>
              <span className="rounded-md bg-amber-50 p-2 text-warning">
                <PackageSearch size={20} />
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wide text-muted">
                    <th className="border-b border-line pb-3 font-semibold">
                      商品
                    </th>
                    <th className="border-b border-line pb-3 font-semibold">
                      风险原因
                    </th>
                    <th className="border-b border-line pb-3 font-semibold">
                      风险分
                    </th>
                    <th className="border-b border-line pb-3 font-semibold">
                      销售额
                    </th>
                    <th className="border-b border-line pb-3 font-semibold">
                      库存
                    </th>
                    <th className="border-b border-line pb-3 font-semibold">
                      负责人
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {riskProducts.map((item) => (
                    <tr key={item.name} className="align-middle">
                      <td className="border-b border-slate-100 py-4">
                        <p className="font-semibold text-ink">{item.name}</p>
                        <p className="mt-1 text-xs text-muted">
                          {item.category}
                        </p>
                      </td>
                      <td className="border-b border-slate-100 py-4 text-muted">
                        {item.reason}
                      </td>
                      <td className="border-b border-slate-100 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${
                              item.risk >= 80
                                ? "bg-danger"
                                : item.risk >= 70
                                  ? "bg-warning"
                                  : "bg-brand-500"
                            }`}
                          />
                          <span className="font-semibold text-ink">
                            {item.risk}
                          </span>
                        </div>
                      </td>
                      <td className="border-b border-slate-100 py-4 font-medium">
                        {item.sales}
                      </td>
                      <td className="border-b border-slate-100 py-4 text-muted">
                        {item.stock}
                      </td>
                      <td className="border-b border-slate-100 py-4 text-muted">
                        {item.owner}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="min-w-0 rounded-lg border border-line bg-panel p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-ink">
                  今日运营建议
                </h2>
                <p className="mt-1 text-sm text-muted">
                  按收益影响和紧急程度排序。
                </p>
              </div>
              <span className="rounded-md bg-emerald-50 p-2 text-success">
                <Lightbulb size={20} />
              </span>
            </div>
            <div className="space-y-3">
              {suggestions.map((item, index) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-lg border border-line bg-slate-50 p-4"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-6 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-lg border border-emerald-100 bg-emerald-50 p-4">
              <div className="flex items-center gap-2 font-semibold text-success">
                <CheckCircle2 size={18} />
                AI 预估收益
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                若今日 18:00 前完成以上动作，预计可减少 9%-12% 无效投放消耗，并降低高风险商品售后压力。
              </p>
            </div>
          </div>
        </section>

        <footer className="flex flex-col gap-2 rounded-lg border border-line bg-white px-5 py-4 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>Demo 数据更新时间：2026-06-10 15:30</span>
          <span className="inline-flex items-center gap-2 text-warning">
            <AlertTriangle size={15} />
            当前为纯前端 mock 数据，未连接数据库
          </span>
        </footer>
      </div>
    </main>
  );
}
