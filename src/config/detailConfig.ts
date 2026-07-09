export interface DetailConfig {
  businessType: string
  titleField: string
  subtitle: (data: Record<string, unknown>) => string
  statusFields: string[]
  tabs: string[]
  actions: { label: string; route?: string; tone?: 'primary' | 'danger' }[]
}

const standard=(businessType:string,tabs=['基础信息','关联记录','流程记录','操作日志']):DetailConfig=>({
  businessType,titleField:'name',subtitle:d=>`业务编号：${d.id??'—'}`,statusFields:['status'],tabs,
  actions:[{label:'标记已处理',tone:'primary'}]
})

export const detailConfigs:Record<string,DetailConfig>={
  users:{...standard('用户管理'),subtitle:d=>`用户编号：${d.id}｜${d.phone??''}`,tabs:['基础信息','健康主体','最近问诊','检查报告','药箱与用药计划','风险与标签','操作日志'],actions:[{label:'查看健康档案',route:'health',tone:'primary'},{label:'导出用户数据'}]},
  family:standard('家庭成员管理',['基础信息','所属用户','共享权限','健康档案','操作日志']),
  health:{...standard('健康档案管理'),subtitle:d=>`档案编号：${d.id}｜${d.user??''} / ${d.relation??''}`,tabs:['档案概览','基础病与过敏史','病历记录','检查报告','诊断记录','用药记录','AI可读取范围','数据审计'],actions:[{label:'查看病历',route:'records'},{label:'查看报告',route:'reports',tone:'primary'}]},
  records:{...standard('病历管理'),tabs:['病历原文','结构化字段','AI可检索状态','关联报告','关联诊断','操作日志'],actions:[{label:'查看关联报告',route:'reports'},{label:'提交复核',tone:'primary'}]},
  reports:{...standard('检查报告管理'),subtitle:d=>`报告编号：${d.id}｜${d.user??''} / ${d.subject??''}`,statusFields:['ocr','structured','ai'],tabs:['报告概览','报告原图 / OCR文本','结构化字段','AI解读','医学复核','关联问诊','操作日志'],actions:[{label:'查看AI解读',route:'interpretation',tone:'primary'},{label:'提交复核'}]},
  diagnoses:standard('诊断记录管理',['诊断概览','来源病历','关联报告','状态变更','操作日志']),
  symptoms:standard('症状记录管理',['症状概览','来源对话','入档记录','风险研判','操作日志']),
  consults:{...standard('AI问诊管理'),subtitle:d=>`会话编号：${d.id}｜咨询主体：${d.subject??'—'}`,statusFields:['risk','status'],tabs:['会话概览','完整对话','AI追问过程','健康档案引用','急症规则命中','导诊与服务卡','入档结果','质检记录','操作日志'],actions:[{label:'查看入档记录',route:'archive',tone:'primary'},{label:'查看命中规则',route:'rules'},{label:'生成摘要'}]},
  interpretation:{
    ...standard('报告解读管理'),
    titleField:'name',
    subtitle:d=>`报告编号：${d.reportId}｜用户：${d.userName} ${d.userId}｜档案主体：${d.subject}`,
    statusFields:['ocr','structured','ai','review'],
    tabs:['任务概览','OCR文本','结构化字段','AI解读内容','医学复核','关联问诊','纠错记录','操作日志'],
    actions:[{label:'查看原报告',route:'reports'},{label:'提交复核',tone:'primary'}]
  },
  triage:standard('智能导诊管理',['导诊概览','症状采集','规则命中','推荐科室','推荐检查','挂号转化','操作日志']),
  hospitals:standard('医院管理',['基础信息','科室列表','医生列表','号源能力','服务接入','操作日志']),
  departments:standard('科室管理',['基础信息','适用症状','关联疾病','医生列表','导诊规则','操作日志']),
  doctors:{...standard('医生管理'),tabs:['基础信息','擅长与简介','出诊号源','服务配置','智能体绑定','推荐与审核','操作日志'],actions:[{label:'查看号源',route:'slots',tone:'primary'},{label:'查看医生智能体',route:'agents'}]},
  slots:standard('号源管理',['号源概览','预约情况','放号配置','同步记录','操作日志']),
  'doctor-rules':standard('医生推荐规则',['规则概览','权重配置','命中医生','转化效果','操作日志']),
  agents:standard('医生智能体管理',['基础配置','专科边界','知识库引用','工具权限','测试记录','用户反馈','操作日志']),
  'medical-kb':standard('医学知识库',['疾病概览','症状与风险','检查与治疗','参考来源','审核记录','操作日志']),
  'drug-kb':standard('药品知识库',['基础信息','说明书','用药安全规则','用户药箱引用','用药计划引用','操作日志']),
  'medicine-box':standard('用户药箱管理',['药品概览','关联说明书','用药计划','安全核查','操作日志']),
  'med-plans':standard('用药计划管理',['计划概览','药品说明','提醒记录','安全核查','操作日志']),
  rules:{...standard('规则中心'),tabs:['规则配置','命中条件','输出模板','命中记录','测试记录','操作日志'],actions:[{label:'查看命中会话',route:'consults',tone:'primary'},{label:'测试规则'}]},
  models:standard('AI模型配置',['模型配置','使用场景','调用监控','成本统计','版本记录','操作日志']),
  prompts:standard('Prompt管理',['Prompt配置','变量与格式','版本记录','评测结果','操作日志']),
  tools:standard('工具调用配置',['工具配置','请求参数','返回字段','调用记录','失败记录','操作日志']),
  archive:standard('数据入档管理',['申请概览','来源数据','处理建议','处理记录','操作日志']),
  corrections:standard('纠错记录管理',['申请概览','来源数据','处理建议','处理记录','操作日志']),
  requests:standard('删除/迁移申请',['申请概览','来源数据','影响评估','处理记录','操作日志']),
  feedback:standard('用户反馈与质检',['反馈概览','关联对象','沟通记录','处理结果','操作日志']),
  reviews:standard('人工审核任务',['任务概览','审核内容','关联对象','处理记录','操作日志']),
  content:standard('内容运营',['内容概览','投放配置','曝光数据','版本记录','操作日志']),
  messages:standard('消息与提醒',['消息概览','模板内容','发送记录','送达统计','操作日志']),
  permissions:standard('权限与角色',['账号信息','角色权限','菜单权限','数据权限','登录日志']),
  privacy:standard('隐私授权管理',['授权概览','授权范围','调用记录','撤回记录','操作日志']),
  settings:standard('系统设置',['配置概览','灰度策略','变更记录','影响范围','操作日志'])
}

export const chineseFieldLabels:Record<string,string>={
  id:'业务编号',name:'名称',user:'归属用户',phone:'手机号',gender:'性别',age:'年龄',birthday:'出生日期',city:'所在城市',source:'数据来源',
  subjects:'健康主体数量',consults:'问诊次数',reports:'报告数量',risk:'风险等级',status:'当前状态',updatedAt:'最近更新时间',subject:'档案主体',
  relation:'成员关系',shared:'共享状态',completion:'档案完整度',diseases:'基础疾病',allergy:'过敏史',records:'病历数量',diagnoses:'诊断数量',
  medicines:'用药数量',aiReadable:'AI可读取状态',hospital:'医院',department:'科室',visitDate:'就诊时间',complaint:'主诉',history:'现病史',
  pastHistory:'既往史',physical:'体格检查',auxiliary:'辅助检查',advice:'处理意见',doctor:'医生姓名',ocr:'OCR状态',aiSearch:'AI可检索状态',
  reportType:'报告类型',reportDate:'报告日期',structured:'结构化状态',ai:'AI解读状态',abnormal:'异常摘要',intent:'意图分类',emergency:'是否命中急症',
  rule:'命中规则',archived:'入档状态',model:'AI模型',level:'医院等级',area:'所在区域',insurance:'医保支持',registration:'挂号支持',
  access:'接入状态',title:'职称',specialty:'擅长领域',slots:'近期号源',audit:'审核状态',date:'日期',period:'时段',remaining:'剩余数量',
  fee:'费用',category:'分类',form:'剂型',rx:'处方属性',quantity:'数量',expiry:'有效期',frequency:'用药频率',reminder:'提醒时间',
  dose:'每次剂量',type:'业务类型',priority:'优先级',action:'推荐动作',confidence:'置信度',object:'关联对象',handler:'处理人',
  opinion:'处理意见',module:'关联模块',owner:'负责人',sla:'SLA剩余时间',role:'角色',dataScope:'数据权限',scope:'授权范围',
  authTime:'授权时间',withdraw:'撤回时间',gray:'灰度范围',operator:'操作人'
}
