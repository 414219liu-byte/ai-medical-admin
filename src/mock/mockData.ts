import type { Column, Field, PageConfig, RowData } from '../types'
import { createRecordFor, formSchemas } from './formSchemas'
import { userProfiles } from './userData'
import { familyMembers } from './familyData'
import { healthArchives } from './healthData'
import { aiClinicSessions, diagnosisRecords, symptomRecords } from './aiClinicData'
import { reportInterpretationTasks } from './reportInterpretationData'
import { cameraTasks } from './cameraData'

const people = ['刘志辉', '陈雨桐', '周铭轩', '林婉清', '吴嘉诚', '赵欣怡', '孙建国', '高晓雯', '叶子航', '许安然']
const hospitals = ['华中科技大学协和深圳医院', '北京大学深圳医院', '南方医科大学深圳医院', '深圳市第三人民医院']
const dates = ['2026-07-09 10:24', '2026-07-09 09:16', '2026-07-08 18:40', '2026-07-08 14:32', '2026-07-07 11:08']

const statusWords = ['正常', '待审核', '已启用', '待确认', '处理中', '已通过']
const col = (key: string, title: string, status = false): Column => ({ key, title, status })
const field = (key: string, label: string, type: Field['type'] = 'text', options?: string[]): Field =>
  ({ key, label, type, options, required: ['name', 'user', 'title'].some(x => key.includes(x)) })

const generate = (prefix: string, names: string[], extra: (i: number) => RowData = () => ({}), count = 10): RowData[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `${prefix}${String(10021 + i)}`, name: names[i % names.length], user: people[i % people.length],
    status: statusWords[i % statusWords.length], updatedAt: dates[i % dates.length], ...extra(i)
  }))

const commonFields: Field[] = [
  field('name', '名称'), field('user', '所属用户', 'select', people), field('status', '状态', 'select', ['正常', '启用', '停用', '待审核']),
  field('date', '生效日期', 'date'), field('source', '数据来源', 'select', ['用户提交', 'AI 提取', '医院同步', '运营录入']),
  field('attachment', '相关附件', 'file'), field('remark', '备注', 'textarea')
]

const makePage = (
  key: string, title: string, group: string, names: string[], customCols: Column[] = [],
  extra: (i: number) => RowData = () => ({}), actions = ['查看', '编辑', '删除']
): PageConfig => ({
  key, title, group, description: `管理平台内的${title}数据、状态与业务操作`,
  primaryAction: title.includes('管理') ? `新增${title.replace('管理', '')}` : '新增记录',
  columns: [col('id', `${title.replace('管理', '')}ID`), col('name', '名称'), ...customCols, col('status', '状态', true), col('updatedAt', '更新时间')],
  fields: commonFields, rows: generate(key.slice(0, 3).toUpperCase() + '-', names, extra),
  filters: [{ key: 'status', label: '状态', options: ['全部', '正常', '启用', '停用', '待审核', '待确认'] }],
  actions
})

export const userRows:RowData[]=userProfiles.map(user=>({...user}))

export const specialConfigs: Record<string, PageConfig> = {
  users: {
    key: 'users', title: '用户管理', group: '用户与档案', description: '管理平台注册用户、健康主体及账号风险状态',
    primaryAction: '新增用户', columns: [col('id', '用户ID'), col('name', '姓名/昵称'), col('phone', '手机号'), col('gender', '性别'),
      col('age', '年龄'), col('city', '城市'), col('source', '注册来源'), col('subjects', '健康主体'), col('consults', '问诊次数'),
      col('reports', '报告数'), col('risk', '风险标签', true), col('status', '账号状态', true),col('lastLogin','最近登录时间')],
    fields: [field('name', '姓名', 'text'), field('nickname', '昵称'), field('phone', '手机号'), field('gender', '性别', 'select', ['男', '女']),
      field('birthday', '出生日期', 'date'), field('city', '所在城市', 'select', ['深圳', '上海', '杭州', '北京']),
      field('source', '注册来源', 'select', ['支付宝', '微信', '医院服务窗']), field('status', '账号状态', 'select', ['正常', '禁用']), field('remark', '备注', 'textarea')],
    rows: userRows, filters: [{ key: 'city', label: '城市', options: ['全部','深圳南山','深圳福田','深圳宝安','深圳龙岗','惠州大亚湾','广州天河'] }, { key: 'status', label: '账号状态', options: ['全部','正常','待完善','禁用'] },{key:'risk',label:'风险标签',options:['全部','低风险','干眼复诊','胃病随访','高血压关注','测试记录待清理','投诉用户']}],
    actions: ['查看详情', '编辑', '查看档案', '禁用账号']
  },
  family: {
    key: 'family', title: '家庭成员管理', group: '用户与档案', description: '维护家庭健康主体、共享关系与数据归属',
    primaryAction: '新增成员', columns: [col('memberId','成员ID'),col('subjectId','健康主体ID'),col('userName','所属用户'),col('relation','关系'),col('memberName','成员姓名'),
      col('genderAge','性别/年龄'),col('shareStatus','共享状态',true),col('aiReadAuthStatus','AI读取授权',true),col('archiveCompleteness','档案完整度'),col('lastArchiveTime','最近入档'),
      col('riskTags','风险标签',true),col('businessStatus','业务状态',true),col('updatedAt','最近更新')],
    fields: [field('user', '所属用户', 'select', people), field('relation', '关系', 'select', ['本人', '爸爸', '妈妈', '老公', '老婆', '儿子', '女儿', '其他']),
      field('name', '姓名'), field('gender', '性别', 'select', ['男', '女']), field('birthday', '出生日期', 'date'), field('phone', '手机号'),
      field('shared', '是否共享', 'select', ['是', '否']), field('permission', '共享权限', 'select', ['仅查看', '可管理']), field('remark', '备注', 'textarea')],
    rows:familyMembers.map(x=>({...x,genderAge:`${x.gender} / ${x.age}岁`})),
    filters:[{key:'relation',label:'关系',options:['全部','本人','父亲','母亲','配偶','儿子','女儿','祖父','祖母']},{key:'shareStatus',label:'共享状态',options:['全部','本人主体','未共享','已共享','待家属确认','已拒绝','已撤销']},{key:'aiReadAuthStatus',label:'AI读取授权',options:['全部','已授权','未授权','仅本次授权','限定范围授权','授权已过期']},{key:'businessStatus',label:'业务状态',options:['全部','正常','待确认','授权过期','已停用','数据冲突','待人工复核']}],
    actions:['查看档案','编辑','调整权限','停用/解除关系']
  },
  records: {
    key: 'records', title: '病历管理', group: '医疗数据', description: '统一管理医院同步、用户上传与 AI 提取的病历',
    primaryAction: '新增病历', columns: [col('id', '病历ID'), col('user', '用户'), col('subject', '档案主体'), col('hospital', '医院'), col('department', '科室'),
      col('visitDate', '就诊时间'), col('name', '诊断'), col('source', '来源'), col('ocr', 'OCR状态', true), col('status', '审核状态', true)],
    fields: [field('user','用户','select',people),field('subject','档案主体'),field('hospital','医院','select',hospitals),field('department','科室','select',['眼科','消化内科','心内科']),
      field('visitDate','就诊时间','date'),field('complaint','主诉','textarea'),field('history','现病史','textarea'),field('name','诊断'),field('advice','处理意见','textarea'),field('attachment','附件图片','file')],
    rows: generate('MR', ['干眼症、睑板腺功能障碍', '慢性胃炎、胆汁反流', '父亲高血压测试记录', '结膜炎'], i => ({
      subject: i === 2 ? '测试父亲' : people[i%people.length], hospital: hospitals[i%4], department: ['眼科','消化内科','心内科'][i%3],
      visitDate: dates[i%5].slice(0,10), source: ['医院同步','用户上传','OCR识别','AI提取'][i%4], ocr: i===2?'待确认':'已识别'
    })), filters:[{key:'source',label:'来源',options:['全部','医院同步','用户上传','OCR识别','AI提取']}], actions:['查看','编辑','重新 OCR','同步 AI','人工审核','删除']
  },
  reports: {
    key:'reports',title:'检查报告管理',group:'医疗数据',description:'报告上传、OCR 结构化、风险识别与 AI 解读全流程',
    primaryAction:'上传报告', columns:[col('id','报告ID'),col('user','用户'),col('subject','档案主体'),col('name','报告名称'),col('reportType','报告类型'),col('hospital','医院'),
      col('reportDate','报告日期'),col('ocr','OCR状态',true),col('structured','结构化',true),col('ai','AI解读',true),col('abnormal','异常摘要'),col('risk','风险',true)],
    fields:[field('user','用户','select',people),field('subject','档案主体'),field('name','报告名称'),field('reportType','报告类型','select',['检验报告','检查报告','影像报告','眼科检查','屈光检查','胃镜报告','体检报告']),
      field('hospital','医院','select',hospitals),field('reportDate','报告日期','date'),field('attachment','报告文件','file'),field('items','检查项目','textarea'),field('conclusion','医生结论','textarea')],
    rows:generate('RP',['泪液分泌功能测定报告','屈光检查报告','消化门诊记录','幽门螺杆菌检测'],i=>({
      subject:i===3?'测试父亲':people[i%10],reportType:['眼科检查','屈光检查','门诊记录','检验报告'][i%4],hospital:hospitals[i%4],reportDate:dates[i%5].slice(0,10),
      ocr:'已完成',structured:i===1?'待复核':'已完成',ai:i===0?'已解读':'待生成',abnormal:['BUT OD 2s / OS 1s','DC 字段疑似占位','慢性胃炎、胆汁反流','未见异常'][i%4],risk:i===2?'中风险':'普通'
    })),filters:[{key:'reportType',label:'报告类型',options:['全部','检验报告','眼科检查','屈光检查','胃镜报告']}],actions:['查看原图','编辑','OCR识别','生成解读','人工复核','删除']
  },
  consults: {
    key:'consults',title:'AI 问诊管理',group:'AI 服务',description:'AI 问诊会话、急症命中、入档及服务转化管理',
    columns:[col('id','会话ID'),col('user','用户'),col('subject','咨询主体'),col('name','问诊主题'),col('intent','意图分类'),col('risk','风险等级',true),col('emergency','急症命中',true),col('rule','命中规则'),col('archived','是否入档',true),col('model','AI模型'),col('status','处理状态',true)],
    fields:commonFields,rows:generate('AI',['干眼报告解读','高血压急症测试','胃不舒服导诊','父亲胸痛代问','药箱用药计划核查'],i=>({
      subject:i===3?'测试父亲':people[i%10],intent:['报告解读','急症咨询','智能导诊','代问','用药咨询'][i%5],risk:i===1||i===3?'高风险':'普通',
      emergency:i===1||i===3?'已命中':'未命中',rule:i===1?'高血压急症规则':i===3?'胸痛急症规则':'—',archived:i%2?'待确认':'已入档',model:'MedGPT-4.1'
    })),filters:[{key:'risk',label:'风险等级',options:['全部','普通','高风险']}],actions:['查看详情','转人工','生成摘要','取消入档','导出']
  }
}

const definitions: [string,string,string,string[],Column[],(i:number)=>RowData,string[]?][] = [
  ['health','健康档案管理','用户与档案',['刘志辉健康档案','测试父亲档案','小柚子成长档案'],[col('user','归属用户'),col('relation','关系'),col('diseases','基础病标签'),col('allergy','过敏史'),col('reports','报告数')],i=>({relation:['本人','爸爸','女儿'][i%3],diseases:['干眼症','高血压风险','无'][i%3],allergy:i%2?'青霉素':'无',reports:i+2})],
  ['diagnoses','诊断记录管理','医疗数据',['干眼症','睑板腺功能障碍','结膜炎','慢性胃炎','胆汁反流','高血压风险'],[col('user','用户'),col('subject','档案主体'),col('source','诊断来源'),col('confirm','确认状态',true),col('current','当前状态',true)],i=>({subject:i===5?'测试父亲':people[i%10],source:['医生诊断','AI提取','用户自填'][i%3],confirm:i===5?'待确认':'医生确认',current:i%3?'现患':'待复查'})],
  ['symptoms','症状记录管理','医疗数据',['眼干','右上腹胀痛','胸痛测试记录','父亲血压160/100头晕'],[col('user','用户'),col('subject','档案主体'),col('severity','严重程度',true),col('duration','持续时间'),col('source','来源'),col('archived','入档状态',true)],i=>({subject:i===3?'测试父亲':people[i%10],severity:i>1?'严重':'一般',duration:`${i+1}天`,source:['AI对话','用户手动','医生记录'][i%3],archived:i>1?'待确认':'已入档'})],
  ['interpretation','报告解读管理','AI 服务',['泪液分泌功能 OCR','屈光报告结构化','胃镜报告患者版解读'],[col('reportId','报告ID'),col('type','任务类型'),col('confidence','置信度'),col('abnormal','异常字段'),col('review','复核状态',true)],i=>({reportId:`RP${10021+i}`,type:['OCR任务','结构化结果','解读记录'][i%3],confidence:`${96-i}%`,abnormal:i%4,review:i%2?'待复核':'已通过'})],
  ['triage','智能导诊管理','AI 服务',['右上腹痛导诊规则','胸痛急症规则','眼干专科规则','高血压急症规则'],[col('symptoms','症状组合'),col('department','推荐科室'),col('risk','风险等级',true),col('priority','优先级')],i=>({symptoms:['右上腹痛+油腻后加重','胸痛+冷汗+左臂酸','眼干+BUT短','血压180/115+胸痛'][i%4],department:['消化内科','急诊/120','眼科/干眼门诊','急诊'][i%4],risk:i===1||i===3?'高风险':'普通',priority:100-i})],
  ['hospitals','医院管理','医疗资源',hospitals,[col('level','等级'),col('city','城市'),col('area','区域'),col('insurance','医保',true),col('registration','挂号',true),col('access','接入状态',true)],i=>({level:'三甲',city:'深圳',area:['南山区','福田区','宝安区','龙岗区'][i%4],insurance:'支持',registration:'支持',access:i%3?'已接入':'接入中'})],
  ['departments','科室管理','医疗资源',['消化内科','心血管内科','眼科','全科医学科'],[col('hospital','所属医院'),col('category','一级分类'),col('symptoms','适用症状'),col('sort','排序')],i=>({hospital:hospitals[i%4],category:['内科','内科','五官科','综合'][i%4],symptoms:['腹痛、反酸','胸痛、心悸','眼干、视力下降','常见症状'][i%4],sort:i+1})],
  ['doctors','医生管理','医疗资源',['程春生','龚伟','张筱茵','王建安AI分身'],[col('hospital','所属医院'),col('department','科室'),col('title','职称'),col('specialty','擅长'),col('slots','近期号源'),col('audit','审核状态',true)],i=>({hospital:hospitals[i%4],department:i===3?'心血管内科':'消化内科',title:['主任医师','主任医师','副主任医师','主任医师'][i%4],specialty:['胃镜/ERCP','胆胰疾病ERCP','超声内镜','冠心病'][i%4],slots:12-i,audit:'已通过'})],
  ['slots','号源管理','医疗资源',['程春生专家号','龚伟专家号','张筱茵门诊号'],[col('doctor','医生'),col('hospital','医院'),col('date','出诊日期'),col('period','时段'),col('remaining','剩余号数'),col('fee','挂号费')],i=>({doctor:['程春生','龚伟','张筱茵'][i%3],hospital:hospitals[i%4],date:'2026-07-'+(10+i),period:i%2?'下午':'上午',remaining:8-i,fee:`¥${50+i*10}`})],
  ['doctor-rules','医生推荐规则','医疗资源',['南山/福田医生优先规则','三甲优先规则','医保优先规则'],[col('department','适用科室'),col('distance','距离权重'),col('level','等级权重'),col('slotWeight','号源权重'),col('serviceGap','服务卡覆盖')],i=>({department:['消化内科','全科','全科'][i%3],distance:`${20+i*5}%`,level:`${25-i*2}%`,slotWeight:`${30+i}%`,serviceGap:i%3===0?'南山/福田优先，服务卡不足':'覆盖正常'})],
  ['agents','医生智能体管理','AI 服务',['王建安AI分身','消化健康助手','干眼诊疗助手'],[col('doctor','绑定医生'),col('hospital','医院'),col('department','科室'),col('calls','调用次数'),col('rating','用户评分')],i=>({doctor:['王建安','龚伟','程春生'][i%3],hospital:hospitals[i%4],department:['心血管内科','消化内科','眼科'][i%3],calls:1260+i*287,rating:(4.9-i*.1).toFixed(1)})],
  ['medical-kb','医学知识库','知识与药品',['干眼症','慢性胃炎','高血压','胸痛'],[col('category','疾病分类'),col('department','所属科室'),col('symptoms','常见症状'),col('source','参考来源'),col('audit','审核状态',true)],i=>({category:['眼科疾病','消化系统','心血管','症状'][i%4],department:['眼科','消化内科','心内科','急诊'][i%4],symptoms:['眼干涩','上腹不适','头晕','胸部疼痛'][i%4],source:'临床诊疗指南',audit:i%3?'已通过':'待审核'})],
  ['drug-kb','药品知识库','知识与药品',['思然 聚乙二醇滴眼液','滋润 环孢素滴眼液II','泌特 复方阿嗪米特肠溶片','贝飞达 双歧杆菌'],[col('generic','通用名'),col('category','分类'),col('form','剂型'),col('rx','处方属性',true),col('audit','审核状态',true)],i=>({generic:['聚乙二醇滴眼液','环孢素滴眼液','复方阿嗪米特','双歧杆菌三联活菌'][i%4],category:['眼科用药','眼科用药','消化用药','微生态制剂'][i%4],form:i<2?'滴眼液':'片剂',rx:i===1?'处方药':'OTC',audit:'已通过'})],
  ['medicine-box','用户药箱管理','知识与药品',['思然滴眼液','滋润环孢素滴眼液','泌特','贝飞达'],[col('user','用户'),col('subject','档案主体'),col('quantity','数量'),col('expiry','有效期'),col('source','来源')],i=>({subject:people[i%10],quantity:i+1,expiry:`2027-0${i%9+1}`,source:['手动添加','拍照识别','处方同步'][i%3]})],
  ['med-plans','用药计划管理','知识与药品',['思然用药计划','泌特用药计划','贝飞达用药计划'],[col('user','用户'),col('frequency','用药频率'),col('reminder','提醒时间'),col('dose','每次剂量'),col('period','饭前/饭后')],i=>({frequency:i?'每天3次':'每天3次',reminder:i?'08:00 / 13:00 / 19:00':'08:00 / 12:00 / 18:00',dose:i?'1片':'未填写',period:i?'饭后待确认':'不限'})],
  ['rules','规则中心','AI 配置',['胸痛急症规则','高血压急症规则','OU禁止推断阳性','处方药不可自行加量','测试场景入档前确认','家人代问主体确认'],[col('type','规则类型'),col('risk','风险等级',true),col('action','推荐动作'),col('priority','优先级')],i=>({type:['急症规则','急症规则','解读规则','用药安全','入档规则','主体识别'][i%6],risk:i<2?'高风险':'一般',action:i<2?'建议急诊/120':'提示并确认',priority:100-i})],
  ['models','AI 模型配置','AI 配置',['MedGPT-4.1','Vision OCR Pro','Medical Embedding V3','Rerank-Med'],[col('type','模型类型'),col('provider','供应商'),col('scene','使用场景'),col('context','上下文'),col('cost','成本')],i=>({type:['对话','OCR','Embedding','Rerank'][i%4],provider:['OpenAI','阿里云','自研','自研'][i%4],scene:['AI问诊','报告识别','知识检索','结果排序'][i%4],context:i?'8K':'128K',cost:`¥${(i+1)*0.01}/次`})],
  ['prompts','Prompt 管理','AI 配置',['AI问诊系统提示词','患者版报告解读','医生摘要生成','智能导诊'],[col('scene','适用场景'),col('version','版本'),col('format','输出格式'),col('publisher','发布人')],i=>({scene:['问诊','报告解读','摘要','导诊'][i%4],version:`v2.${i+1}`,format:i%2?'Markdown':'JSON',publisher:'医学运营组'})],
  ['tools','工具调用配置','AI 配置',['医院搜索','医生号源查询','药品相互作用核查','健康档案检索'],[col('type','工具类型'),col('scene','适用场景'),col('permission','权限'),col('timeout','超时时间'),col('log','记录日志',true)],i=>({type:'API',scene:['导诊','挂号','用药','问诊'][i%4],permission:i===2?'医学审核':'内部服务',timeout:`${3+i}s`,log:'是'})],
  ['archive','数据入档管理','数据治理',['父亲血压160/100伴头晕','胸痛测试记录','慢性胃炎诊断','滴眼液用药计划'],[col('user','用户'),col('subject','建议主体'),col('type','入档类型'),col('confidence','置信度'),col('test','测试场景',true)],i=>({subject:i===0?'测试父亲':people[i%10],type:['症状','症状','诊断','用药计划'][i%4],confidence:`${92-i*4}%`,test:i<2?'是':'否'})],
  ['corrections','纠错记录管理','数据治理',['OU误写阳性纠错','屈光DC模板占位','档案主体错误','药品剂量识别错误'],[col('user','用户'),col('object','纠错对象'),col('type','纠错类型'),col('handler','处理人'),col('opinion','处理意见')],i=>({object:['报告字段','结构化字段','档案主体','用药计划'][i%4],type:['医学误读','报告字段错误','主体错误','OCR错误'][i%4],handler:i%2?'王医生':'待分配',opinion:i%2?'已核对原图':'—'})],
  ['requests','删除/迁移申请','数据治理',['胸痛测试记录删除申请','父亲档案迁移','报告隐藏申请'],[col('user','用户'),col('dataType','数据类型'),col('current','当前主体'),col('target','目标主体'),col('requestType','申请类型')],i=>({dataType:['症状','健康档案','报告'][i%3],current:people[i%10],target:i===1?'测试父亲':'—',requestType:['删除','迁移','隐藏'][i%3]})],
  ['feedback','用户反馈与质检','运营与审核',['药箱无法读取','报告解释不准确','找不到合适医生','提醒未送达'],[col('user','用户'),col('type','反馈类型'),col('module','关联模块'),col('priority','优先级',true),col('handler','处理人')],i=>({type:['功能异常','内容纠错','推荐问题','提醒问题'][i%4],module:['用户药箱','报告解读','医生推荐','消息提醒'][i%4],priority:i===1?'高':'普通',handler:i%2?'李运营':'待分配'})],
  ['reviews','人工审核任务','运营与审核',['高风险问诊医学审核','OU字段复核','医生资质审核','用户反馈质检'],[col('type','任务类型'),col('module','来源模块'),col('risk','风险等级',true),col('owner','负责人'),col('sla','SLA剩余')],i=>({type:['医学审核','报告复核','资质审核','质检'][i%4],module:['AI问诊','报告解读','医生管理','用户反馈'][i%4],risk:i===0?'高风险':'一般',owner:i%2?'王医生':'待领取',sla:`${30+i*25}分钟`})],
  ['content','内容运营','运营与审核',['夏季肠胃健康专题','高血压科普卡片','干眼护眼指南','体检季活动'],[col('type','内容类型'),col('channel','投放渠道'),col('views','曝光量'),col('publisher','负责人')],i=>({type:['专题','科普卡','指南','活动'][i%4],channel:['支付宝首页','问诊会话','报告页','服务大厅'][i%4],views:12560+i*3570,publisher:'内容运营组'})],
  ['messages','消息与提醒','运营与审核',['用药提醒模板','复诊提醒','报告解读完成通知','审核结果通知'],[col('type','消息类型'),col('channel','发送渠道'),col('sent','发送量'),col('rate','送达率')],i=>({type:['用药提醒','复诊提醒','服务通知','系统通知'][i%4],channel:['支付宝消息','短信','站内信','站内信'][i%4],sent:820+i*113,rate:`${98-i}%`})],
  ['permissions','权限与角色','系统管理',['张敏','李浩','王医生','赵质检'],[col('phone','手机号'),col('role','角色'),col('department','部门'),col('dataScope','数据权限'),col('lastLogin','最近登录')],i=>({phone:`139****${5200+i}`,role:['超级管理员','医学运营','医学审核','质检专员'][i%4],department:['平台研发','医疗运营','医学中心','服务质检'][i%4],dataScope:i?'所属部门':'全部数据',lastLogin:dates[i%5]})],
  ['privacy','隐私授权管理','系统管理',['健康档案授权','AI问诊数据授权','家人档案共享','医院数据同步'],[col('user','用户'),col('type','授权类型'),col('scope','授权范围'),col('authTime','授权时间'),col('withdraw','撤回时间')],i=>({type:['健康数据','AI服务','家庭共享','医院同步'][i%4],scope:['全部档案','本次会话','指定成员','指定医院'][i%4],authTime:dates[i%5],withdraw:'—'})],
  ['settings','系统设置','系统管理',['对话入档前确认','药箱AI读取','引用原文可点击','家人档案主体强确认'],[col('type','配置类型'),col('module','所属模块'),col('gray','灰度范围'),col('operator','操作人')],i=>({type:'功能开关',module:['入档治理','用户药箱','报告解读','家庭档案'][i%4],gray:['20%用户','全量关闭','规划中','50%用户'][i%4],operator:'医学运营管理员',status:['灰度开启','关闭','规划中','灰度开启'][i%4]})]
]

export const pageConfigs: Record<string, PageConfig> = { ...specialConfigs }
definitions.forEach(([key,title,group,names,cols,extra,actions]) => {
  pageConfigs[key] = makePage(key,title,group,names,cols,extra,actions)
})

Object.entries(pageConfigs).forEach(([key,config])=>{
  const schema=formSchemas[key]
  if(schema){
    config.createFields=schema
    config.editFields=schema
    config.fields=schema
    config.mockCreateRecord=(values,rows)=>createRecordFor(key,values,rows)
  }
})

pageConfigs.health.columns=[
  col('archiveId','健康档案ID'),col('subjectId','健康主体ID'),col('userDisplay','归属用户'),col('subjectName','主体姓名'),col('relation','成员关系'),
  col('genderAge','性别/年龄'),col('baseDiseaseTags','基础病标签'),col('allergySummary','过敏史'),col('reportCount','报告数'),
  col('medicalRecordCount','病历数'),col('diagnosisCount','诊断数'),col('medicationCount','用药数'),col('aiReadStatus','AI可读取状态',true),
  col('archiveStatus','档案状态',true),col('lastArchiveTime','最近入档'),col('updatedAt','最近更新')
]
pageConfigs.health.rows=healthArchives.map(x=>({...x,userDisplay:`${x.userName} / ${x.userId}`,genderAge:`${x.gender} / ${x.age}岁`}))
pageConfigs.health.filters=[{key:'relation',label:'成员关系',options:['全部','本人','父亲','母亲','女儿','配偶']},{key:'aiReadStatus',label:'AI读取状态',options:['全部','已授权可读取','部分可读取','未授权','仅本次授权','限定范围授权','授权已过期']},{key:'archiveStatus',label:'档案状态',options:['全部','正常','待完善','待核验','已停用','数据冲突']}]
pageConfigs.health.actions=['查看档案','编辑','查看病历','查看报告','入档记录']
pageConfigs.health.detailTabs=['基础信息','病历记录','检查报告','诊断记录','症状记录','用药记录','AI可读取范围','数据审计日志']
pageConfigs.reports.detailTabs=['报告原图','OCR文本','结构化字段','AI解读','人工复核','操作日志']
pageConfigs.consults.detailTabs=['完整对话','AI追问','健康档案引用','急症规则命中','导诊结果','服务卡曝光','入档结果','质检记录','操作日志']

pageConfigs.interpretation={
  ...pageConfigs.interpretation,
  title:'报告解读管理',
  description:'管理报告 OCR、字段结构化、AI 解读及医学复核的完整处理链路',
  primaryAction:'新建解读任务',
  columns:[
    col('id','解读任务ID'),col('reportId','报告ID'),col('userId','用户ID'),col('userName','用户姓名'),col('subject','档案主体'),col('subjectName','主体姓名'),
    col('name','报告名称'),col('reportType','报告类型'),col('hospital','医院'),col('department','科室'),col('taskType','任务类型'),
    col('ocr','OCR状态',true),col('structured','结构化状态',true),col('ai','AI解读状态',true),col('confidence','识别置信度'),
    col('abnormalCount','异常字段数'),col('uncertainCount','不确定字段数'),col('review','复核状态',true),col('updatedAt','更新时间')
  ],
  rows:[
    ['INT-10021','RP10021','U10021','刘志辉','本人','刘志辉','泪液分泌功能测定报告','眼科检查','华中科技大学协和深圳医院','眼科门诊','OCR+结构化+解读','成功','已结构化','已解读','96%',4,1,'待复核'],
    ['INT-10022','RP10022','U10021','刘志辉','本人','刘志辉','屈光检查报告','屈光检查','华中科技大学协和深圳医院','眼科门诊','结构化+解读','成功','部分结构化','待复核','93%',2,1,'待复核'],
    ['INT-10023','RP10023','U10021','刘志辉','本人','刘志辉','消化门诊记录','门诊记录','北京大学深圳医院','消化内科','OCR+解读','成功','已结构化','已解读','97%',2,0,'已通过'],
    ['INT-10024','RP10024','U10021','刘志辉','爸爸','测试父亲','血压记录','AI对话提取','后台数据','心血管内科','结构化任务','无需OCR','已结构化','待复核','91%',1,2,'待复核'],
    ['INT-10025','RP10025','U10035','李梅','本人','李梅','幽门螺杆菌检测','检验报告','南方医科大学深圳医院','消化内科','OCR+结构化+解读','成功','已结构化','已解读','99%',0,0,'已通过'],
    ['INT-10026','RP10026','U10028','陈雨桐','本人','陈雨桐','腹部超声检查','影像报告','北京大学深圳医院','超声科','OCR+解读','成功','已结构化','已解读','95%',1,0,'已通过'],
    ['INT-10027','RP10027','U10032','周铭轩','本人','周铭轩','胃镜检查报告','胃镜报告','深圳市第三人民医院','消化内科','OCR+结构化','部分成功','部分结构化','未解读','82%',3,2,'待复核'],
    ['INT-10028','RP10028','U10041','林婉清','女儿','林小朋友','儿童血常规','检验报告','深圳市儿童医院','儿科','OCR+结构化+解读','成功','已结构化','已解读','98%',3,0,'已通过']
  ].map((x,i)=>({id:x[0],reportId:x[1],userId:x[2],userName:x[3],user:String(x[3]),subject:x[4],subjectName:x[5],name:x[6],reportType:x[7],hospital:x[8],department:x[9],taskType:x[10],ocr:x[11],structured:x[12],ai:x[13],confidence:x[14],abnormalCount:x[15],uncertainCount:x[16],review:x[17],status:x[17],updatedAt:dates[i%dates.length]} as RowData)),
  filters:[
    {key:'userName',label:'用户',options:['全部','刘志辉','李梅','陈雨桐','周铭轩','林婉清']},
    {key:'subject',label:'档案主体',options:['全部','本人','爸爸','女儿']},
    {key:'reportType',label:'报告类型',options:['全部','眼科检查','屈光检查','门诊记录','AI对话提取','检验报告','影像报告','胃镜报告']},
    {key:'ocr',label:'OCR状态',options:['全部','成功','部分成功','无需OCR']},
    {key:'structured',label:'结构化状态',options:['全部','已结构化','部分结构化']},
    {key:'ai',label:'AI解读状态',options:['全部','已解读','待复核','未解读']},
    {key:'review',label:'复核状态',options:['全部','待复核','已通过']}
  ],
  actions:['查看详情','查看原报告','查看结构化字段','重新OCR','重新生成解读','提交复核','查看纠错']
}
pageConfigs.camera={
  key:'camera',title:'AI 智能相机管理',group:'AI 服务',description:'管理拍皮肤、看舌苔、测脱发、拍药盒等图像类 AI 健康检测任务',primaryAction:'新建相机任务',
  columns:[col('id','任务ID'),col('userId','用户ID'),col('userName','用户姓名'),col('subjectId','健康主体ID'),col('subjectName','主体姓名'),col('relation','成员关系'),
    col('captureType','拍摄类型'),col('scene','拍摄场景'),col('traceless','无痕模式',true),col('qualityStatus','图像质量',true),col('privacyStatus','隐私脱敏',true),
    col('aiStatus','AI分析状态',true),col('riskLevel','风险等级',true),col('summary','分析结果摘要'),col('symptomCreated','症状记录',true),col('diagnosisCreated','诊断记录',true),
    col('archiveStatus','是否入档',true),col('reviewStatus','医学复核',true),col('modelName','模型名称'),col('promptVersion','Prompt版本'),col('createdAt','创建时间'),col('updatedAt','最近更新时间')],
  fields:[],createFields:formSchemas.camera??[],editFields:formSchemas.camera??[],rows:cameraTasks,
  filters:[{key:'captureType',label:'拍摄类型',options:['全部','皮肤患处','肌肤状态','舌苔','脱发','药盒','报告']},{key:'scene',label:'拍摄场景',options:['全部','普通拍摄','私密拍','无痕模式','自然光拍摄','相册上传']},{key:'qualityStatus',label:'图像质量',options:['全部','待检测','合格','光线不足','图像模糊','目标不完整','距离过近','距离过远','需重新拍摄']},{key:'aiStatus',label:'AI分析状态',options:['全部','待分析','分析中','已完成','分析失败','待人工复核','待重新拍摄']}],
  actions:['查看任务','查看图片','查看脱敏','查看结果','入档记录','复核','纠错记录']
}
pageConfigs.interpretation={
  ...pageConfigs.interpretation,
  description:'管理报告上传或在线拉取、OCR、结构化、AI解读、风险评估、健康建议、医学复核和健康档案入档全链路',
  columns:[col('id','解读任务ID'),col('reportId','报告ID'),col('userId','用户ID'),col('userName','用户姓名'),col('subjectId','健康主体ID'),col('subjectName','主体姓名'),col('relation','成员关系'),
    col('name','报告名称'),col('reportType','报告类型'),col('uploadMethod','上传方式'),col('dataSource','数据来源'),col('hospital','医院'),col('department','科室'),col('examDate','检查日期'),
    col('ocrStatus','OCR状态',true),col('structuredStatus','结构化状态',true),col('aiStatus','AI解读状态',true),col('riskLevel','风险等级',true),col('reviewStatus','医学复核',true),
    col('archiveStatus','入档状态',true),col('feedbackStatus','用户反馈',true),col('modelName','模型名称'),col('promptVersion','Prompt版本'),col('createdAt','创建时间'),col('updatedAt','最近更新时间')],
  rows:reportInterpretationTasks,
  filters:[{key:'uploadMethod',label:'上传方式',options:['全部','拍照上传','相册上传','文件上传','在线查报告']},{key:'dataSource',label:'数据来源',options:['全部','用户上传','深圳区域医疗平台','医院HIS','医院LIS','体检机构接口','后台管理员上传']},{key:'reportType',label:'报告类型',options:['全部','眼科检查','内镜检查','检验报告','影像报告']},{key:'ocrStatus',label:'OCR状态',options:['全部','待识别','识别中','已完成','识别失败','人工修正','不适用']},{key:'aiStatus',label:'AI解读状态',options:['全部','待解读','解读中','已解读','解读失败','待重新解读']},{key:'reviewStatus',label:'复核状态',options:['全部','不需要复核','待复核','复核通过','复核驳回','复核中']},{key:'archiveStatus',label:'入档状态',options:['全部','未入档','待入档','已入档','入档失败','入档冲突待确认']}],
  actions:['查看解读','查看原报告','查看OCR','查看结构化','医学复核','入档记录','纠错记录']
}

pageConfigs.doctors.fields = [
  field('name','医生姓名'),field('avatar','头像','file'),field('hospital','所属医院','select',hospitals),
  field('department','所属科室','select',['消化内科','心血管内科','眼科','全科医学科']),field('title','职称','select',['主任医师','副主任医师','主治医师']),
  field('teachingTitle','教学职称','select',['教授','副教授','无']),field('diseases','擅长疾病','textarea'),field('skills','擅长技术','textarea'),
  field('bio','医生简介','textarea'),field('location','出诊地点'),field('registration','支持挂号','select',['是','否']),
  field('online','支持在线问诊','select',['是','否']),field('insurance','支持医保','select',['是','否']),field('weight','推荐权重'),
  field('audit','审核状态','select',['待审核','已通过','已驳回']),field('status','启用状态','select',['启用','停用'])
]
pageConfigs.rules.fields = [
  field('name','规则名称'),field('type','规则类型','select',['急症规则','用药安全','入档规则','报告解读','主体识别','医生推荐']),
  field('trigger','触发条件','textarea'),field('exclude','排除条件','textarea'),field('risk','风险等级','select',['普通','中风险','高风险']),
  field('action','推荐动作','textarea'),field('template','回复模板','textarea'),field('priority','优先级'),field('status','是否启用','select',['启用','停用'])
]
pageConfigs.health.actions = ['查看档案','编辑','查看病历','查看报告','入档记录']
pageConfigs.consults={
  ...pageConfigs.consults,title:'AI 诊室 / 问诊会话管理',description:'管理 AI 医疗助手多轮问诊、症状采集、风险分级、导诊结论和数据入档全过程',
  columns:[col('id','问诊会话ID'),col('userId','用户ID'),col('userName','用户姓名'),col('subjectId','健康主体ID'),col('subjectName','主体姓名'),col('relation','成员关系'),
    col('chiefComplaint','主诉'),col('currentSymptoms','当前症状'),col('progress','问诊进度'),col('rounds','追问轮次'),col('consultStatus','问诊状态',true),col('riskLevel','风险等级',true),
    col('rule','命中规则'),col('department','推荐科室'),col('symptomCreated','症状记录',true),col('diagnosisCreated','诊断记录',true),col('archiveStatus','是否入档',true),
    col('modelName','模型名称'),col('promptVersion','Prompt版本'),col('updatedAt','最近更新时间')],
  rows:aiClinicSessions,filters:[{key:'consultStatus',label:'问诊状态',options:['全部','问诊中','待用户补充','信息已足够','已生成结论','已中断','已转人工','已触发风险']},{key:'riskLevel',label:'风险等级',options:['全部','低风险','中风险','高风险','紧急风险']},{key:'department',label:'推荐科室',options:['全部','消化内科','眼科','急诊科','心血管内科','皮肤科','呼吸内科']}],
  actions:['查看详情','查看症状记录','查看诊断记录','查看入档记录']
}
pageConfigs.symptoms={
  ...pageConfigs.symptoms,columns:[col('id','症状记录ID'),col('userId','用户ID'),col('subjectId','健康主体ID'),col('subjectName','主体姓名'),col('sourceType','来源类型'),
    col('sourceSessionId','来源会话ID'),col('chiefComplaint','主诉'),col('name','症状名称'),col('bodyPart','症状部位'),col('nature','症状性质'),col('duration','持续时间'),
    col('severity','严重程度',true),col('companions','伴随症状'),col('redFlag','红旗症状',true),col('completeness','信息完整度'),col('diagnosisId','关联诊断ID'),
    col('archiveStatus','是否入档',true),col('updatedAt','更新时间')],
  rows:symptomRecords,filters:[{key:'sourceType',label:'来源类型',options:['全部','AI诊室','用户手动记录','医生病历提取','报告解读提取','后台管理员录入']},{key:'redFlag',label:'红旗症状',options:['全部','是','否','待排查']}],
  actions:['查看详情','编辑','查看来源会话','查看关联诊断']
}
pageConfigs.diagnoses={
  ...pageConfigs.diagnoses,columns:[col('id','诊断ID'),col('userId','用户ID'),col('subjectId','健康主体ID'),col('subjectName','主体姓名'),col('name','诊断名称'),
    col('source','诊断来源'),col('sourceId','来源单据ID'),col('department','关联科室'),col('confirmStatus','确认状态',true),col('currentStatus','当前状态',true),
    col('riskLevel','风险等级',true),col('doctor','确认医生'),col('aiContext','AI上下文',true),col('archiveStatus','是否入档',true),col('updatedAt','更新时间')],
  rows:diagnosisRecords,filters:[{key:'source',label:'诊断来源',options:['全部','医生诊断','病历提取','报告提取','AI初筛','用户自填']},{key:'confirmStatus',label:'确认状态',options:['全部','医生确认','AI初筛','待医生确认','用户确认','已排除']},{key:'currentStatus',label:'当前状态',options:['全部','现患','已缓解','待复查','已排除','长期管理']}],
  actions:['查看详情','编辑','查看来源单据','查看健康档案']
}
pageConfigs.doctors.actions = ['查看详情','编辑','查看号源','查看智能体','删除']
pageConfigs['drug-kb'].actions = ['查看说明书','编辑','查看药箱','用药计划','删除']
pageConfigs.rules.actions = ['查看详情','编辑','命中会话','启用','删除']

export const menuGroups: { name: string; items: readonly (readonly [string, string])[] }[] = [
  { name: '总览', items: [['dashboard','工作台']] },
  { name: '用户与档案', items: [['users','用户管理'],['family','家庭成员管理'],['health','健康档案管理']] },
  { name: '医疗数据', items: [['records','病历管理'],['reports','检查报告管理'],['diagnoses','诊断记录管理'],['symptoms','症状记录管理']] },
  { name: 'AI 服务', items: [['consults','AI 诊室管理'],['camera','AI 智能相机管理'],['interpretation','报告解读管理'],['triage','智能导诊管理'],['agents','医生智能体管理']] },
  { name: '医疗资源', items: [['hospitals','医院管理'],['departments','科室管理'],['doctors','医生管理'],['slots','号源管理'],['doctor-rules','医生推荐规则']] },
  { name: '知识与药品', items: [['medical-kb','医学知识库'],['drug-kb','药品知识库'],['medicine-box','用户药箱管理'],['med-plans','用药计划管理']] },
  { name: 'AI 配置', items: [['rules','规则中心'],['models','AI 模型配置'],['prompts','Prompt 管理'],['tools','工具调用配置']] },
  { name: '数据治理', items: [['archive','数据入档管理'],['corrections','纠错记录管理'],['requests','删除/迁移申请']] },
  { name: '运营与审核', items: [['feedback','用户反馈与质检'],['reviews','人工审核任务'],['content','内容运营'],['messages','消息与提醒']] },
  { name: '系统管理', items: [['permissions','权限与角色'],['privacy','隐私授权管理'],['settings','系统设置']] }
]

export const dashboardStats = [
  ['今日 AI 问诊','1,286','+12.8%'],['报告解读次数','436','+8.2%'],['急症命中次数','18','需关注'],['挂号点击次数','329','+21.6%'],
  ['新增健康档案','157','+6.4%'],['待审核任务','24','4 项超时'],['待入档确认','63','-5.1%'],['用户反馈','12','2 项紧急']
]

export const riskRows = generate('WARN-', ['父亲胸痛代问','高血压伴头晕','持续右上腹痛','儿童高热'], i => ({
  user: people[i], subject: i<2?'测试父亲':people[i], symptom:['胸痛、冷汗、左臂酸','血压185/118、头晕','右上腹持续疼痛','高热39.8℃'][i%4],
  risk: i<2?'高风险':'中风险', rule:['胸痛急症规则','高血压急症规则','腹痛风险规则','儿童高热规则'][i%4],
  sessionId:`AI${10022+i}`,advice:i<2?'立即呼叫120':'建议尽快就医', contacted:['未联系','已联系','无需联系','联系失败'][i%4], status:i===0?'待处理':'处理中', updatedAt:dates[i]
}), 4)

export const taskRows = generate('TASK-', ['OU字段医学复核','高风险会话审核','医生资质审核','药箱识别反馈'], i => ({
  type:['医学复核','急症审核','资质审核','用户反馈'][i%4], source:['报告解读','AI问诊','医生管理','用户药箱'][i%4],
  object:['RP10021','AI10022','DR10023','FB10024'][i%4], priority:i<2?'紧急':'普通', owner:i%2?'王医生':'待领取',
  sla:`${18+i*16} 分钟`,deadline:['2026-07-09 10:42','2026-07-09 11:05','2026-07-09 12:30','2026-07-09 14:00'][i%4],status:i===0?'待处理':'处理中'
}), 4)

export const monitorCards = [
  {title:'AI 安全事件趋势',sub:'近 7 日风险事件',value:'42',delta:'较上周 -18.6%',color:'#e85c63',points:[42,55,38,61,48,35,28],legend:[['急症漏判','2'],['不当推断','7'],['主体错配','3']]},
  {title:'模型质量监控',sub:'MedGPT-4.1 线上表现',value:'96.8%',delta:'评测通过率 +1.2%',color:'#15a085',points:[72,78,76,83,86,91,96],legend:[['意图准确率','97.2%'],['医学一致性','96.5%'],['拒答准确率','98.1%']]},
  {title:'数据治理看板',sub:'今日治理任务完成度',value:'87.4%',delta:'已处理 1,264 条',color:'#4b83c3',points:[45,52,61,67,74,80,87],legend:[['待入档','63'],['待纠错','18'],['迁移申请','7']]},
  {title:'服务转化看板',sub:'问诊到医疗服务转化',value:'25.6%',delta:'较昨日 +3.7%',color:'#9a70cf',points:[18,20,19,23,22,24,26],legend:[['挂号卡曝光','1,286'],['点击挂号','329'],['完成预约','86']]}
]
