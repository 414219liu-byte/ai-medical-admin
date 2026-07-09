# 慧医云 AI 医疗助手后台管理系统

基于 React、Vite、TypeScript 和 Tailwind CSS 开发的 AI 医疗助手后台原型。项目模拟真实医疗运营后台，所有业务数据均为前端 Mock 数据，无需后端服务或数据库。

## 功能说明

- 医疗运营工作台、AI 安全事件趋势、模型质量监控和数据治理看板
- 用户、家庭成员、健康档案、病历、检查报告、诊断和症状管理
- AI 问诊、报告解读、智能导诊和医生智能体管理
- 医院、科室、医生、号源及医生推荐规则管理
- 医学知识库、药品知识库、用户药箱和用药计划
- AI 模型、Prompt、工具调用及规则中心配置
- 数据入档、纠错、删除迁移申请、用户反馈和人工审核
- 权限角色、隐私授权和系统设置
- 可用的筛选、分页、新增、编辑、删除、详情抽屉和跨模块跳转
- 按业务页面配置的真实表单字段、校验及业务 ID 生成

## 环境要求

- Node.js 18 或更高版本
- npm 9 或更高版本

## 安装

```bash
npm install
```

## 本地运行

```bash
npm run dev
```

默认访问地址为 `http://localhost:5173`。

## 生产打包

```bash
npm run build
```

构建产物生成在 `dist/` 目录。

## 预览生产构建

```bash
npm run preview
```

## 目录结构

```text
.
├── src/
│   ├── components/        # 布局、表格、筛选、弹窗和详情抽屉
│   ├── mock/
│   │   ├── formSchemas.ts # 各业务页面独立新增/编辑表单配置
│   │   └── mockData.ts    # 页面配置及医疗业务模拟数据
│   ├── pages/             # 工作台及配置化业务页面
│   ├── App.tsx            # 页面路由状态与应用入口
│   ├── main.tsx           # React 挂载入口
│   ├── styles.css         # Tailwind 与全局视觉样式
│   └── types.ts           # 通用 TypeScript 类型
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

## 数据说明

项目数据仅用于产品原型演示，不代表真实患者、医生或医疗机构数据，也不应作为医疗诊断依据。
