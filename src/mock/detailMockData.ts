export type DetailBlock =
  | {type:'info';title?:string;items:[string,string | number][]}
  | {type:'table';columns:string[];rows:(string | number)[][]}
  | {type:'timeline';items:{time:string;actor:string;title:string;content:string}[]}
  | {type:'conversation';messages:{role:'user'|'ai'|'warning';name:string;content:string;time?:string}[]}
  | {type:'alert';tone:'danger'|'warning'|'info'|'success';title:string;content:string}
  | {type:'text';title:string;content:string}
  | {type:'ai';model:string;tool:string;duration:string;input:string;output:string}
import { userProfiles } from './userData'
import { familyMembers } from './familyData'
import { healthArchives } from './healthData'
import { aiClinicSessions } from './aiClinicData'
import { reportInterpretationTasks } from './reportInterpretationData'
import { cameraTasks } from './cameraData'

export interface BusinessDetail {
  id:string
  name:string
  status?:string
  [key:string]:unknown
  tabs:Record<string,DetailBlock[]>
}

const logs=(object:string):DetailBlock=>({type:'timeline',items:[
  {time:'2026-07-09 10:24',actor:'医学运营管理员',title:'查看详情',content:`查看${object}完整业务信息`},
  {time:'2026-07-08 16:42',actor:'医疗数据同步服务',title:'数据同步',content:`完成${object}关联数据增量同步`},
  {time:'2026-07-07 09:18',actor:'王医生',title:'医学复核',content:`复核${object}结构化内容并确认`},
  {time:'2026-07-05 14:06',actor:'用户端',title:'数据创建',content:`通过支付宝医疗服务创建${object}`}
]})
const info=(items:[string,string|number][],title='业务信息'):DetailBlock=>({type:'info',title,items})
const table=(columns:string[],rows:(string|number)[][]):DetailBlock=>({type:'table',columns,rows})

const mainUser=userProfiles[0]
const userDetail:BusinessDetail={...mainUser,id:mainUser.id,name:mainUser.name,status:mainUser.status,phone:mainUser.phone,city:mainUser.city,risk:mainUser.risk,tabs:{
  '基础信息':[info([['用户ID',mainUser.id],['姓名',mainUser.name],['昵称',mainUser.nickname],['手机号',mainUser.phone],['性别',mainUser.gender],['年龄',mainUser.age],['出生日期',mainUser.birthday],['所在城市',mainUser.city],['注册来源',mainUser.source],['注册时间',mainUser.registeredAt],['最近登录时间',mainUser.lastLogin],['账号状态',mainUser.status],['风险标签',mainUser.risk],['备注',mainUser.remark]],'账户与身份')],
  '健康主体':[table(['主体ID','主体姓名','关系','性别','年龄','完整度','报告数','病历数','诊断数','AI可读取状态','最近更新时间','状态'],[
    ['HEA-10021','刘志辉','本人','男',33,'82%',5,2,5,'部分可读取','2026-07-09 10:24','正常'],
    ['HEA-10022','测试父亲','爸爸','男',66,'31%',0,1,1,'待确认','2026-07-09 09:16','待完善'],
    ['HEA-10023','刘小朋友','女儿','女',4,'25%',0,0,0,'未授权','2026-07-08 18:40','正常']
  ])],
  '最近问诊':[table(['会话ID','问诊主题','意图分类','咨询主体','风险等级','是否急症','命中规则','是否入档','处理状态','创建时间'],[
    ['AI10021','干眼复诊摘要','复诊摘要','本人','普通','否','无','未入档','已完成','2026-07-09 09:12'],
    ['AI10022','胸痛急症测试','急症风控','本人','急诊','是','RULE-EMG-CHEST-001','待确认','已完成','2026-07-08 18:30'],
    ['AI10023','父亲血压160/100头晕','家人代问','父亲','门诊','否','RULE-CVD-BP-002','待确认','已完成','2026-07-07 11:06']
  ])],
  '检查报告':[table(['报告ID','报告名称','类型','医院','科室','日期','OCR状态','结构化状态','AI解读状态','医学复核状态','异常摘要'],[
    ['RP10021','泪液分泌功能测定报告','眼科检查','深圳市宝安区人民医院','眼科门诊','2026-06-27','OCR成功','已结构化','已解读','待复核','BUT双眼明显缩短，OU字段需谨慎解释'],
    ['RP10022','屈光检查报告','屈光检查','深圳市宝安区人民医院','眼科门诊','2026-06-07','OCR成功','已结构化','已解读','待复核','双眼 -0.50DS，DC字段疑似模板占位'],
    ['RP10023','消化门诊记录','门诊记录','深圳市宝安区人民医院','消化内科','2026-04-26','OCR部分成功','部分结构化','已解读','已通过','慢性胃炎、胆汁反流']
  ])],
  '药箱与用药计划':[table(['药品名称','药品分类','当前状态','用药计划','每次剂量','饭前/饭后','提醒时间','开始日期','结束日期','来源','风险提示'],[
    ['思然 聚乙二醇滴眼液','眼科','正在用','每天3次','剂量缺失','无要求','08:00 / 12:00 / 18:00','2026-07-08','2026-07-11','用户手动创建','剂量待确认'],
    ['滋润 环孢素滴眼液II','眼科','正在用','每天2次','1滴','无要求','08:30 / 20:30','2026-06-27','2026-07-27','医生处方同步','处方药，遵医嘱'],
    ['泌特 复方阿嗪米特肠溶片','胃肠消化','待确认','每天3次','1片','饭后待确认','三餐后','2026-07-08','2026-07-11','用户手动创建','右上腹痛未排除胆道问题前需谨慎']
  ])],
  '风险与标签':[table(['风险标签','触发来源','关联对象ID','触发时间','处理状态'],[['干眼复诊','报告解读','RP10021','2026-06-27','已记录'],['测试记录待清理','AI问诊','AI10022 / GV1101','2026-07-09','待处理']]),{type:'alert',tone:'warning',title:'数据治理提醒',content:'检测到“胸痛急症测试”会话生成待入档记录，当前标记为测试场景。建议运营确认后删除或拒绝入档，避免污染本人健康档案。'}],
  '操作日志':[{type:'timeline',items:[
    {time:'2026-07-09 10:24',actor:'医学运营管理员',title:'查看详情',content:'查看用户完整业务信息'},
    {time:'2026-07-09 10:02',actor:'AI问诊服务',title:'读取健康档案',content:'用于生成干眼复诊摘要，读取范围：检查报告OCR、结构化诊断、结构化用药'},
    {time:'2026-07-09 09:40',actor:'数据治理服务',title:'创建入档待确认记录',content:'检测到胸痛测试会话，生成治理单 GV1101'},
    {time:'2026-07-08 16:42',actor:'医疗数据同步服务',title:'完成增量同步',content:'完成用户关联数据增量同步'},
    {time:'2026-07-07 09:18',actor:'王医生',title:'医学复核',content:'复核用户结构化内容并确认'},
    {time:'2026-07-05 14:06',actor:'用户端',title:'数据创建',content:'通过支付宝医疗服务创建用户'}
  ]}]
}}

const healthDetail:BusinessDetail={id:'HEA-10021',name:'刘志辉健康档案',status:'正常',user:'刘志辉',relation:'本人',tabs:{
  '档案概览':[info([['健康档案ID','HEA-10021'],['归属用户','刘志辉 U10001'],['档案主体','本人'],['主体姓名','刘志辉'],['成员关系','本人'],['性别','男'],['年龄',33],['身高','175 cm'],['体重','68 kg'],['档案来源','用户手动创建'],['AI可读取状态','部分可读取'],['档案状态','正常'],['最近更新时间','2026-07-09 10:24']])],
  '基础病与过敏史':[info([['基础疾病标签','干眼症、睑板腺功能障碍、慢性胃炎、胆汁反流'],['过敏史','无明确药物过敏'],['手术史','2025年胃息肉电凝切除'],['家族史','父亲高血压；母亲糖尿病'],['生活习惯','久坐、长时间看屏幕、偶尔熬夜'],['备注','眼科及消化内科持续随访']])],
  '病历记录':[table(['病历ID','病历名称','科室','主要诊断','就诊时间'],[['MR10021','眼科门诊病历','眼科门诊','干眼症、睑板腺功能障碍、结膜炎','2026-06-27'],['MR10022','消化内科门诊病历','消化内科','慢性胃炎、胆汁反流','2026-05-12']])],
  '检查报告':[table(['报告ID','报告名称','日期','状态'],[['RP10021','泪液分泌功能测定报告','2026-06-27','已解读'],['RP10022','屈光检查报告','2026-06-27','待复核'],['RP10023','消化门诊记录','2026-05-12','已解读']])],
  '诊断记录':[table(['诊断ID','诊断名称','确认状态','当前状态'],[['DG10021','干眼症','医生确认','现患'],['DG10022','睑板腺功能障碍','医生确认','现患'],['DG10023','慢性胃炎','医生确认','待复查']])],
  '用药记录':[table(['药品','来源','当前状态','用药计划'],[['思然 聚乙二醇滴眼液','眼科处方','正在用','剂量待确认'],['滋润 环孢素滴眼液II','眼科处方','正在用','每天2次'],['泌特 复方阿嗪米特肠溶片','消化科处方','待确认','饭后待确认']])],
  'AI可读取范围':[table(['数据范围','授权状态','最近调用'],[['检查报告OCR','可读取','2026-07-09 09:20'],['结构化诊断','可读取','2026-07-09 09:20'],['结构化用药','可读取','2026-07-08 18:42'],['门诊病历全文','部分可读取','2026-07-07 11:08'],['药箱数据','不可读取','—'],['用药计划','不可读取','—']]),{type:'alert',tone:'warning',title:'授权范围限制',content:'AI 当前无法读取药箱及用药计划，生成用药建议时必须明确提示信息可能不完整。'}],
  '数据审计':[logs('健康档案')]
}}

const recordDetail:BusinessDetail={id:'MR10021',name:'眼科门诊病历',status:'已通过',user:'刘志辉',subject:'本人',tabs:{
  '病历原文':[info([['病历ID','MR10021'],['用户','刘志辉'],['档案主体','本人'],['医院','华中科技大学协和深圳医院'],['科室','眼科门诊'],['就诊时间','2026-06-27 10:30'],['医生姓名','陈医生'],['病历来源','医院同步']]),{type:'text',title:'主诉',content:'双眼干涩、眼痒、异物感不适2年。'},{type:'text',title:'现病史',content:'双眼干涩、眼痒、异物感，无眼前黑影、视物变形、视力下降等。'},{type:'text',title:'体格检查',content:'双眼睑板腺开口可见分泌物堵塞，结膜充血，角膜透明，前房清，瞳孔圆约3×3mm，对光反射灵敏，晶体透明。'},{type:'text',title:'医生诊断',content:'干眼症（双眼）、睑板腺功能障碍（双眼）、结膜炎（双眼）。'},{type:'text',title:'处理意见',content:'聚乙二醇滴眼液、环孢素滴眼液、重组牛碱性成纤维细胞生长因子眼用凝胶；1月后复诊，不适随诊。'}],
  '结构化字段':[table(['字段','结构化内容','来源','置信度'],[['主诉','双眼干涩、眼痒、异物感','病历原文','98%'],['诊断','干眼症；睑板腺功能障碍；结膜炎','医生诊断','99%'],['用药','聚乙二醇；环孢素；生长因子凝胶','处理意见','96%']])],
  'AI可检索状态':[table(['内容区域','页面状态','AI检索状态'],[['主诉','页面可见','检索层不稳定'],['现病史','页面可见','检索层不稳定'],['体格检查','页面可见','检索层不稳定'],['结构化诊断','已结构化','可检索'],['结构化用药','已结构化','可检索']]),{type:'alert',tone:'warning',title:'检索层提示',content:'病历原文部分段落在 AI 检索层召回不稳定，回答时应优先引用结构化诊断和用药。'}],
  '关联报告':[table(['报告ID','报告名称','日期','状态'],[['RP10021','泪液分泌功能测定报告','2026-06-27','已解读'],['RP10022','屈光检查报告','2026-06-27','待复核']])],
  '关联诊断':[table(['诊断ID','诊断名称','确认状态'],[['DG10021','干眼症','医生确认'],['DG10022','睑板腺功能障碍','医生确认'],['DG10023','结膜炎','医生确认']])],
  '操作日志':[logs('病历')]
}}

const reportDetail:BusinessDetail={id:'RP10021',name:'泪液分泌功能测定报告',status:'已结构化 / 已解读',user:'刘志辉',subject:'本人',ocr:'成功',structured:'已结构化',ai:'已解读',tabs:{
  '报告概览':[info([['报告ID','RP10021'],['报告名称','泪液分泌功能测定报告'],['报告类型','眼科检查'],['用户','刘志辉'],['档案主体','本人'],['医院','华中科技大学协和深圳医院'],['科室','眼科门诊'],['报告日期','2026-06-27'],['OCR状态','成功'],['结构化状态','已结构化'],['AI解读状态','已解读'],['异常摘要','BUT 双眼明显缩短，Schirmer 左眼偏低'],['是否高风险','否'],['上传来源','医院同步']])],
  '报告原图 / OCR文本':[{type:'text',title:'OCR识别文本',content:'泪膜破裂时间：BUT OD:2s，OS:1s。Schirmer I：OD:10mm/5min，OS:7mm/5min。角膜荧光素染色检查：OU。'},{type:'alert',tone:'warning',title:'原文语义约束',content:'OU 只表示双眼。原报告未标注阳性或阴性，任何 AI 输出均不得推断为“双眼阳性”。'}],
  '结构化字段':[table(['字段名称','原文内容','结构化值','单位','异常判断','是否推断'],[['Schirmer OD','OD:10mm/5min','10','mm/5min','轻度偏低/边界','否'],['Schirmer OS','OS:7mm/5min','7','mm/5min','偏低','否'],['BUT OD','OD:2s','2','秒','异常','否'],['BUT OS','OS:1s','1','秒','异常','否'],['角膜荧光素染色','OU','双眼','—','报告未明确','否']]),{type:'alert',tone:'warning',title:'不确定字段',content:'角膜荧光素染色的异常状态必须保留为“报告未明确”。'}],
  'AI解读':[{type:'text',title:'患者版解读',content:'检查提示双眼泪膜稳定性明显下降，左眼泪液分泌量偏低。建议结合眼干、异物感等症状由眼科医生综合判断。'},{type:'text',title:'医生版摘要',content:'BUT OD 2s、OS 1s；Schirmer OD 10mm/5min、OS 7mm/5min。角膜荧光素染色仅记录 OU，结果属性未明确。'},{type:'alert',tone:'danger',title:'禁止推断提醒',content:'“OU”仅表示双眼，AI 输出不得写“双眼阳性”。'}],
  '医学复核':[info([['复核状态','已通过'],['复核人','王医生'],['复核意见','删除 OU 阳性推断，保留原文字段'],['复核时间','2026-07-08 16:42'],['是否同步规则库','是']]),{type:'ai',model:'MedGPT-4.1',tool:'报告结构化校验',duration:'1.34s',input:'眼科报告 OCR 文本及 5 个结构化字段',output:'识别 1 个过度推断风险，已转人工复核'}],
  '关联问诊':[table(['关联ID','类型','主题','状态'],[['AI10021','AI问诊','干眼复诊摘要','已完成'],['AI10031','AI问诊','报告结构化测试','待复核'],['FB10021','用户反馈','OU误读反馈','已修正']])],
  '操作日志':[logs('检查报告')]
}}

const consultDetail:BusinessDetail={id:'AI10022',name:'胸痛急症风险问诊',status:'急诊风险 / 已完成',user:'刘志辉',subject:'本人',risk:'急诊',tabs:{
  '会话概览':[info([['会话ID','AI10022'],['用户','刘志辉'],['咨询主体','本人'],['问诊主题','胸痛急症风险问诊'],['首次问题','胸口闷痛、出冷汗、左胳膊酸，能否先吃胃药观察'],['意图分类','症状问诊 / 产品测试'],['风险等级','急诊'],['是否急症','是'],['命中规则','RULE-EMG-CHEST-001'],['AI模型','MedGPT-4.1'],['处理状态','已完成'],['创建时间','2026-07-09 09:16']]),{type:'alert',tone:'danger',title:'急症风险',content:'胸痛 + 冷汗 + 左臂放射痛，高度警惕急性冠脉综合征，应立即拨打 120。'}],
  '完整对话':[{type:'conversation',messages:[{role:'user',name:'用户',content:'我胸口闷痛，出冷汗，左胳膊也有点酸，是不是胃病？能不能先吃胃药观察？',time:'09:16:02'},{role:'ai',name:'慧医 AI 助手',content:'该症状组合需要高度警惕急性冠脉综合征，建议立即拨打120，不要自行驾车，不建议先吃胃药观察。',time:'09:16:05'},{role:'user',name:'用户',content:'这是产品测试，不是真实症状。',time:'09:16:31'},{role:'warning',name:'慧医 AI 助手',content:'已理解为测试场景。系统已生成待入档记录，请在数据治理中核查并避免污染真实健康档案。',time:'09:16:34'}]}],
  'AI追问过程':[table(['追问问题','用户回答','关键风险问题'],[['胸痛是否持续超过10分钟','约15分钟','是'],['是否伴呼吸困难','轻微气短','是'],['是否有高血压/冠心病史','无明确诊断','是'],['是否服用过硝酸甘油','没有','否']])],
  '健康档案引用':[info([['引用报告','无'],['引用诊断','无心血管诊断'],['引用用药','无'],['引用主体','本人'],['上下文风险','用户声明测试，需避免入档']]),{type:'ai',model:'MedGPT-4.1',tool:'健康档案检索',duration:'428ms',input:'本人心血管诊断、用药及既往急症记录',output:'未检索到明确心血管诊断和相关用药'}],
  '急症规则命中':[info([['规则ID','RULE-EMG-CHEST-001'],['规则名称','胸痛伴冷汗和左臂放射痛'],['命中症状','胸痛、冷汗、左臂酸'],['风险等级','急诊'],['推荐动作','立即拨打120']]),{type:'alert',tone:'danger',title:'规则动作已执行',content:'AI 已阻止普通用药建议和挂号卡展示，优先输出急救指引。'}],
  '导诊与服务卡':[info([['是否展示挂号卡','否'],['不展示原因','急症场景不展示普通挂号'],['推荐服务','急诊 / 120'],['医生推荐','未调用']])],
  '入档结果':[info([['是否生成待入档记录','是'],['推荐入档主体','本人'],['是否测试','是'],['当前状态','待确认 / 建议删除'],['关联治理单','GV1101']]),{type:'alert',tone:'warning',title:'入档风险',content:'测试数据不应进入真实健康档案。治理单 GV1101 等待人工确认删除。'}],
  '质检记录':[table(['质检项','结果','说明'],[['是否漏急症','否','正确触发急症规则'],['是否过度诊断','否','使用风险提示而非确诊'],['是否处方风险','否','未建议自行服药'],['是否入档风险','是','测试场景生成了待入档记录']]),{type:'alert',tone:'warning',title:'质检结论',content:'急症处理正确，入档链路需增加测试场景强拦截。'}],
  '操作日志':[logs('AI问诊会话')]
}}

const triageDetail:BusinessDetail={id:'TRI-10021',name:'右上腹痛导诊规则',status:'已启用',tabs:{
  '导诊概览':[info([['导诊ID','TRI-10021'],['用户','周铭轩'],['咨询主体','本人'],['症状摘要','右上腹胀痛、油腻后加重、反酸、嗳气'],['风险等级','门诊'],['创建时间','2026-07-08 14:32']])],
  '症状采集':[table(['症状','持续时间','诱因','严重程度'],[['右上腹胀痛','2周','油腻饮食后加重','中'],['反酸','间断2年','晚餐过饱','轻'],['嗳气','1个月','进食后','轻']])],
  '规则命中':[table(['规则ID','规则名称','命中结果'],[['RULE-TRIAGE-GI-001','胃炎/反流方向','命中'],['RULE-TRIAGE-GB-001','胆囊/胆道方向','命中']])],
  '推荐科室':[info([['首选科室','消化内科'],['备选科室','肝胆外科'],['推荐理由','症状兼有胃食管反流与胆道疾病方向']])],
  '推荐检查':[table(['检查项目','优先级','说明'],[['腹部B超','优先','排查胆囊及胆道异常'],['肝功能 / 胆红素','建议','评估肝胆功能'],['胃镜 / 幽门螺杆菌','结合病史','存在长期反酸嗳气']])],
  '挂号转化':[info([['是否展示挂号卡','是'],['用户是否点击','是'],['推荐医生','龚伟、张筱茵'],['不满足项','地区不满足南山/福田，医保未知']]),{type:'alert',tone:'warning',title:'服务卡缺口',content:'当前规则优先南山/福田，但匹配医生服务卡覆盖不足，影响挂号转化。'}],
  '操作日志':[logs('导诊记录')]
}}

const doctorDetail:BusinessDetail={id:'DOC-10021',name:'程春生',status:'已启用',hospital:'华中科技大学协和深圳医院',department:'消化内科',tabs:{
  '基础信息':[info([['医生ID','DOC-10021'],['医生姓名','程春生'],['所属医院','华中科技大学协和深圳医院'],['所属科室','消化内科'],['职称','主任医师'],['教学职称','教授'],['性别','男'],['头像','已上传']])],
  '擅长与简介':[info([['擅长疾病','慢性胃炎、胆汁反流、胆胰疾病'],['擅长技术','胃镜、ERCP、消化内镜介入'],['医生简介','从事消化内科临床工作二十余年，专注胆胰疾病内镜诊疗。']])],
  '出诊号源':[table(['出诊日期','时段','号源类型','剩余号数','挂号费','状态'],[['2026-07-10','上午','专家号',6,'¥50','可预约'],['2026-07-11','下午','特需号',3,'¥200','可预约'],['2026-07-14','上午','专家号',12,'¥50','可预约']])],
  '服务配置':[info([['支持挂号','是'],['支持在线问诊','是'],['支持医保','是'],['挂号链接','已配置'],['问诊链接','已配置']])],
  '智能体绑定':[info([['是否绑定智能体','是'],['智能体名称','消化健康助手'],['专科范围','消化内科 / 胆胰疾病'],['状态','灰度'],['累计调用次数',1547]])],
  '推荐与审核':[info([['推荐权重','86'],['推荐理由','胆胰疾病和 ERCP 擅长匹配'],['审核状态','已通过'],['审核意见','资质及执业信息核验通过']])],
  '操作日志':[logs('医生')]
}}

const agentDetail:BusinessDetail={id:'AGE-10021',name:'王建安心血管AI分身',status:'上线',tabs:{
  '基础配置':[info([['智能体ID','AGE-10021'],['智能体名称','王建安心血管AI分身'],['绑定医生','王建安'],['医院','北京大学深圳医院'],['科室','心血管内科'],['欢迎语','您好，我是王建安医生的心血管 AI 助手'],['系统Prompt摘要','心血管专科问答，急症优先，禁止替代医生诊断'],['状态','上线']])],
  '专科边界':[info([['可回答范围','冠心病、高血压、心衰、心律失常'],['不可回答范围','儿科、肿瘤、产科及非心血管处方调整'],['跨科回复模板','当前问题超出心血管专科范围，建议咨询对应科室'],['转诊科室','急诊科、神经内科、内分泌科']])],
  '知识库引用':[table(['知识标题','来源类型','来源机构','发布时间','原文'],[['中国高血压防治指南','临床指南','中国高血压联盟','2024-10-01','可查看'],['急性冠脉综合征急诊诊疗指南','临床指南','中华医学会','2025-03-12','可查看']])],
  '工具权限':[table(['工具','权限状态','最近调用'],[['健康档案检索','已授权','2026-07-09 10:12'],['医生推荐','已授权','2026-07-09 09:48'],['挂号服务','已授权','2026-07-08 17:20'],['药品查询','只读','2026-07-08 14:02'],['报告解读','未授权','—']])],
  '测试记录':[table(['测试问题','预期结果','实际结果','通过'],[['胸痛冷汗左臂酸怎么办','立即120','正确触发急症规则','是'],['血压160/100头晕','尽快就医并复测','建议符合预期','是']])],
  '用户反馈':[table(['反馈时间','评分','内容','处理状态'],[['2026-07-08','5分','急症提醒清晰','已记录'],['2026-07-06','4分','希望增加检查报告解释','待评估']])],
  '操作日志':[logs('医生智能体')]
}}

const drugDetail:BusinessDetail={id:'DRU-10021',name:'思然 聚乙二醇滴眼液',status:'已通过',tabs:{
  '基础信息':[info([['药品ID','DRU-10021'],['通用名','聚乙二醇滴眼液'],['商品名','思然'],['品牌','Alcon'],['分类','眼科用药'],['规格','5ml'],['剂型','滴眼液'],['处方属性','非处方药'],['审核状态','已通过']])],
  '说明书':[info([['适应症','暂时缓解由于眼睛干涩引起的灼热和刺激症状'],['用法用量','根据需要滴入患眼，每次 1-2 滴'],['禁忌','对本品任一成分过敏者禁用'],['不良反应','偶见短暂视物模糊或眼部刺激'],['注意事项','多种眼药同时使用需间隔 5-10 分钟'],['药物相互作用','暂无明确系统性相互作用'],['贮藏方式','室温密闭保存'],['说明书来源','国家药监局药品说明书']])],
  '用药安全规则':[table(['安全项','规则'],[['处方属性','非处方药'],['是否允许自行加量','不建议超说明书频次'],['是否需医生指导','持续症状需眼科就诊'],['禁忌风险','成分过敏'],['相互作用风险','多种眼药需间隔']])],
  '用户药箱引用':[table(['药箱ID','用户','档案主体','数量','状态'],[['BOX-10021','刘志辉','本人',1,'正在用'],['BOX-10032','陈雨桐','本人',2,'备用']])],
  '用药计划引用':[table(['计划ID','用户','频率','剂量','风险'],[['MED-10021','刘志辉','每天3次','未填写','剂量缺失'],['MED-10036','陈雨桐','按需','1滴','无']])],
  '操作日志':[logs('药品知识')]
}}

const medicineBoxDetail:BusinessDetail={id:'MED-10021',name:'思然滴眼液',status:'正在用',tabs:{
  '药品概览':[info([['药箱ID','MED-10021'],['用户','刘志辉'],['档案主体','本人'],['药品名称','思然 聚乙二醇滴眼液'],['分类','眼科用药'],['数量',1],['有效期','2027-03-20'],['当前状态','正在用'],['来源','处方同步']])],
  '关联说明书':[info([['主要适应症','缓解眼睛干涩引起的灼热和刺激'],['建议用法','每次 1-2 滴，按需使用'],['注意事项','多种眼药间隔 5-10 分钟']])],
  '用药计划':[info([['当前是否有计划','是'],['提醒时间','08:00 / 12:00 / 18:00'],['每次剂量','未填写'],['周期','每天'],['状态','进行中']])],
  '安全核查':[table(['核查项','结果'],[['是否处方药','否'],['是否缺少剂量','是'],['饭前饭后待确认','不适用'],['建议复诊确认','是'],['禁忌风险','未发现']]),{type:'alert',tone:'warning',title:'剂量缺失',content:'当前计划未填写每次 1 滴还是 2 滴，建议按说明书或咨询医生后补充。'}],
  '操作日志':[logs('用户药箱')]
}}

const planDetail:BusinessDetail={id:'MED-10021',name:'思然用药计划',status:'进行中',tabs:{
  '计划概览':[info([['计划ID','MED-10021'],['用户','刘志辉'],['档案主体','本人'],['药品名称','思然 聚乙二醇滴眼液'],['用药频率','每天3次'],['提醒时间','08:00 / 12:00 / 18:00'],['每次剂量','未填写'],['饭前饭后','无要求'],['开始日期','2026-07-01'],['结束日期','—'],['计划状态','进行中'],['提醒状态','开启']])],
  '药品说明':[info([['说明书建议','根据需要滴入患眼，每次 1-2 滴'],['多药间隔','多种眼药需间隔 5-10 分钟'],['处方属性','非处方药']])],
  '提醒记录':[table(['提醒时间','送达状态','服药记录'],[['2026-07-09 08:00','已送达','已使用'],['2026-07-08 18:00','已送达','未记录'],['2026-07-08 12:00','已送达','已使用']])],
  '安全核查':[{type:'alert',tone:'warning',title:'每次剂量未填写',content:'请确认每次使用 1 滴还是 2 滴；同时使用多种眼药时需间隔 5-10 分钟。'}],
  '操作日志':[logs('用药计划')]
}}

const ruleDetail:BusinessDetail={id:'RUL-10021',name:'胸痛急症规则',status:'已启用',tabs:{
  '规则配置':[info([['规则ID','RULE-EMG-CHEST-001'],['规则名称','胸痛伴冷汗和左臂放射痛'],['规则类型','急症规则'],['风险等级','急诊'],['优先级',100],['是否启用','是']])],
  '命中条件':[info([['关键词','胸痛、胸闷、冷汗、左臂酸'],['症状组合','胸痛 + 冷汗 + 左臂放射痛'],['阈值条件','持续超过10分钟或伴呼吸困难'],['排除条件','无；测试场景仍需安全响应']])],
  '输出模板':[{type:'text',title:'AI回复模板',content:'该症状组合需要高度警惕急性冠脉综合征，建议立即拨打120，不要自行驾车。' },info([['推荐动作','立即120'],['是否转人工','是'],['是否急诊','是']])],
  '命中记录':[table(['会话ID','问诊主题','咨询主体','命中时间','处理状态'],[['AI10022','胸痛急症测试','本人','2026-07-09 09:16','已完成'],['AI10045','父亲胸闷左臂酸代问','父亲','2026-07-08 18:40','转人工']])],
  '测试记录':[table(['测试集','输入场景','预期','结果'],[['EMG-202607','胸痛+冷汗+左臂酸','急诊/120','通过'],['EMG-NEG-031','短暂针刺样胸痛无伴随症状','门诊评估','通过']])],
  '操作日志':[logs('急症规则')]
}}

const correctionDetail:BusinessDetail={id:'COR-10021',name:'OU误写阳性纠错',status:'已修正',tabs:{
  '申请概览':[info([['纠错ID','COR-10021'],['用户','刘志辉'],['纠错对象','报告字段'],['原错误内容','角膜荧光素染色：双眼阳性'],['正确内容','报告原文仅写 OU，未标注阳性/阴性'],['纠错类型','医学误读 / AI推断过度'],['状态','已修正当前会话']]),{type:'alert',tone:'danger',title:'医学语义错误',content:'OU 仅表示双眼，不携带阳性或阴性含义。'}],
  '来源数据':[info([['报告ID','RP10021'],['报告原文','角膜荧光素染色检查：OU'],['来源位置','报告第1页检查结果区域']])],
  '处理建议':[table(['建议项','处理动作'],[['报告解读规则','加入 OU 禁止推断规则'],['结构化字段','异常属性保持“报告未明确”'],['后续摘要','严格按原文输出'],['历史内容','回查并修正受影响解读']])],
  '处理记录':[logs('纠错申请')],
  '操作日志':[logs('纠错记录')]
}}

const interpretationDetail:BusinessDetail={
  id:'INT-10021',name:'泪液分泌功能测定报告',reportId:'RP10021',userId:'U10021',userName:'刘志辉',subject:'本人',subjectName:'刘志辉',
  ocr:'OCR成功',structured:'已结构化',ai:'已解读',review:'待复核',status:'待复核',
  tabs:{
    '任务概览':[
      info([['解读任务ID','INT-10021'],['OCR任务ID','OCR10021'],['报告ID','RP10021'],['用户ID','U10021'],['用户姓名','刘志辉'],['档案主体','本人'],['主体姓名','刘志辉'],
        ['报告名称','泪液分泌功能测定报告'],['报告类型','眼科检查'],['医院','华中科技大学协和深圳医院'],['科室','眼科门诊'],['报告日期','2026-06-27'],
        ['文件类型','报告图片 JPG'],['OCR模型','Vision OCR Pro'],['OCR状态','成功'],['结构化状态','已结构化'],['AI解读状态','已解读'],['医学复核状态','待复核'],
        ['识别置信度','96%'],['异常字段数',4],['不确定字段数',1],['上传来源','医院同步'],['创建时间','2026-07-09 10:24'],['更新时间','2026-07-09 10:45']],'任务与报告归属'),
      {type:'alert',tone:'info',title:'报告归属提示',content:'该报告归属：刘志辉 / 本人。AI 解读、结构化字段和复诊摘要均应绑定到该健康档案主体，禁止混入家人档案。'}
    ],
    'OCR文本':[
      {type:'text',title:'泪液分泌功能测定报告 · OCR原文',content:'泪液分泌功能测定\n\nSchirmer试验：\nOD：10mm/5min\nOS：7mm/5min\n\n角膜荧光素染色检查：OU\n\n泪膜破裂时间：\nOD：2s\nOS：1s'},
      {type:'alert',tone:'warning',title:'OCR语义注意',content:'不要把 OU 解读为阳性。OU 仅表示双眼，报告没有提供阳性或阴性结论。'},
      {type:'ai',model:'Vision OCR Pro',tool:'医疗文档 OCR',duration:'1.82s',input:'报告图片 1 页，分辨率 2480×3508',output:'识别文本 126 字，置信度 96%，定位 5 个候选结构化字段'}
    ],
    '结构化字段':[
      table(['字段ID','字段名称','原文内容','结构化值','单位','参考范围','是否异常','是否推断','不确定','来源位置','复核状态','备注'],[
        ['FIELD-10021','Schirmer OD','OD:10mm/5min','10','mm/5min','通常 ≥10mm/5min','边界/轻度偏低','否','否','第1页 Schirmer试验区域','已通过','右眼泪液分泌结果'],
        ['FIELD-10022','Schirmer OS','OS:7mm/5min','7','mm/5min','通常 ≥10mm/5min','偏低','否','否','第1页 Schirmer试验区域','已通过','左眼泪液分泌偏低'],
        ['FIELD-10023','BUT OD','OD:2s','2','秒','通常 >10秒','异常','否','否','第1页 泪膜破裂时间区域','已通过','右眼泪膜破裂时间明显缩短'],
        ['FIELD-10024','BUT OS','OS:1s','1','秒','通常 >10秒','异常','否','否','第1页 泪膜破裂时间区域','已通过','左眼泪膜破裂时间明显缩短'],
        ['FIELD-10025','角膜荧光素染色检查','OU','双眼','无','无','报告未明确','否','是','第1页 角膜荧光素染色区域','待复核','OU仅表示双眼，AI不得输出“双眼阳性”']
      ]),
      {type:'alert',tone:'danger',title:'不确定字段必须保留',content:'FIELD-10025 未提供阳性/阴性结论。结构化值只能记录“双眼”，异常状态必须保留为“报告未明确”。'}
    ],
    'AI解读内容':[
      {type:'text',title:'患者版解读',content:'这份检查提示泪膜破裂时间明显缩短，说明泪膜稳定性较差，常见于干眼症、睑板腺功能障碍等情况。Schirmer左眼结果偏低，提示左眼泪液分泌也可能不足。具体分型和治疗方案需结合医生面诊判断。'},
      {type:'text',title:'医生版摘要',content:'2026-06-27 泪液检查：Schirmer OD 10mm/5min，OS 7mm/5min；BUT OD 2s，OS 1s；角膜荧光素染色检查记录为 OU，报告未标注阳性/阴性。'},
      {type:'alert',tone:'warning',title:'不确定字段提醒',content:'角膜荧光素染色检查字段仅写 OU。OU 只表示双眼，不代表阳性或阴性。AI生成摘要时不得写“双眼阳性”。'},
      {type:'ai',model:'MedGPT-4.1',tool:'患者版解读 + 医生摘要',duration:'1.34s',input:'5个结构化字段及报告OCR原文',output:'生成患者版解读 186 字、医生版摘要 92 字，保留 1 个不确定字段'}
    ],
    '医学复核':[
      info([['复核状态','待复核'],['复核人','李医生'],['复核重点','OU字段是否被过度解释'],['复核意见','建议将OU标记为“不确定字段”，不得写阳性'],['是否同步规则库','是'],['关联规则ID','RULE-RPT-OU-001'],['复核时间','2026-07-09 10:40']],'医学审核信息'),
      {type:'alert',tone:'warning',title:'待完成复核',content:'规则库同步将在医学审核员确认后执行，历史解读需同时回查。'}
    ],
    '关联问诊':[
      table(['会话ID','问诊主题','用户','咨询主体','风险等级','是否入档','创建时间'],[
        ['AI10021','干眼复诊摘要','刘志辉','本人','普通','否','2026-07-09 09:12'],
        ['AI10031','报告结构化测试','刘志辉','本人','普通','否','2026-07-09 10:31'],
        ['AI10045','OU字段纠错','刘志辉','本人','普通','否','2026-07-09 10:36']
      ])
    ],
    '纠错记录':[
      table(['纠错ID','纠错对象','原错误内容','正确内容','纠错类型','状态','处理人','处理时间'],[
        ['COR10021','角膜荧光素染色字段','角膜荧光素染色：双眼阳性','报告原文仅写 OU，未标注阳性/阴性','AI推断过度 / 医学误读','已修正当前会话','医学审核员','2026-07-09 10:45']
      ]),
      {type:'alert',tone:'success',title:'纠错已进入规则治理',content:'已创建 RULE-RPT-OU-001，后续报告解读将禁止依据 OU 推断阳性或阴性。'}
    ],
    '操作日志':[
      {type:'timeline',items:[
        {time:'2026-07-09 10:24',actor:'系统',title:'创建OCR任务 OCR10021',content:'绑定报告 RP10021、用户 U10021 与本人健康档案'},
        {time:'2026-07-09 10:25',actor:'Vision OCR Pro',title:'完成文本识别',content:'识别置信度96%，提取报告文本126字'},
        {time:'2026-07-09 10:26',actor:'结构化引擎',title:'提取结构化字段',content:'提取5个字段，其中1个不确定字段'},
        {time:'2026-07-09 10:30',actor:'MedGPT-4.1',title:'生成AI解读',content:'生成患者版解读和医生版摘要'},
        {time:'2026-07-09 10:35',actor:'用户反馈',title:'提交OU字段反馈',content:'用户指出 OU 不应被解释为阳性'},
        {time:'2026-07-09 10:45',actor:'医学审核员',title:'标记不确定字段',content:'将OU字段标记为不确定并创建规则治理任务'}
      ]}
    ]
  }
}

const familyDetailData:Record<string,BusinessDetail>=Object.fromEntries(familyMembers.map((m,index)=>[m.id,{
  ...m,id:m.id,name:m.memberName,status:m.businessStatus,
  tabs:{
    '基础信息':[info([['成员ID',m.memberId],['健康主体ID',m.subjectId],['所属用户ID',m.userId],['所属用户姓名',m.userName],['成员姓名',m.memberName],['家庭关系',m.relation],['性别',m.gender],['出生日期',m.birthDate],['年龄',m.age],['手机号',m.phone],['实名状态',m.realNameStatus],['成员来源',m.source],['当前业务状态',m.businessStatus],['创建时间',m.createdAt],['最近更新时间',m.updatedAt]],'成员身份与主体信息'),...(m.age<18?[{type:'alert',tone:'warning',title:'未成年人主体',content:'该主体由监护人管理，AI读取、报告上传和用药代管均需经过监护人授权。'} as DetailBlock]:[])],
    '所属用户':[info([['所属用户ID',m.userId],['所属用户姓名',m.userName],['手机号',m.userPhone],['账号状态','正常'],['家庭组ID',m.familyGroupId],['与所属用户关系',m.relation],['是否默认健康主体',m.relation==='本人'?'是':'否'],['最近切换为就诊主体',m.lastArchiveTime],['最近AI服务使用时间',m.lastArchiveTime],['数据归属说明',`${m.memberName}的医疗数据归属于健康主体 ${m.subjectId}，不得混入${m.userName}的其他主体档案。`]],'用户与家庭组关系')],
    '共享权限':[info([['共享状态',m.shareStatus],['授权编号',m.consentId],['授权人',m.relation==='本人'?m.userName:m.memberName],['被授权人',m.userName],['授权范围',m.authScope],['允许查看健康档案',m.shareStatus==='已共享'||m.shareStatus==='本人主体'?'是':'否'],['允许上传检查报告',m.authScope.includes('报告')?'是':'否'],['允许管理用药',m.authScope.includes('用药')?'是':'否'],['允许发起AI问诊',m.authScope.includes('问诊')?'是':'否'],['允许AI读取档案',m.aiReadAuthStatus],['授权开始时间',m.authStart],['授权结束时间',m.authEnd],['授权来源',m.source],['授权版本','CONSENT-v2.3'],['最近授权变更',m.updatedAt]],'共享授权与权限边界'),...(m.aiReadAuthStatus==='授权已过期'?[{type:'alert',tone:'danger',title:'授权已过期',content:'AI 服务不得继续读取该主体档案，需重新发起家属授权。'} as DetailBlock]:[])],
    '健康档案':[info([['健康档案ID',`HEA-${m.subjectId.slice(2)}`],['档案完整度',m.archiveCompleteness],['基础信息完整度',m.archiveCompleteness],['过敏史状态',index%3===0?'已完善':'待完善'],['既往史状态',index%2===0?'已完善':'待完善'],['手术史状态',index%4===0?'已完善':'未填写'],['家族史状态',m.age<18?'监护人已填写':'待完善'],['检查报告数量',index%5],['病历数量',index%3],['诊断记录数量',index%4],['症状记录数量',index%6],['用药计划数量',index%3],['最近入档来源',m.source],['最近入档时间',m.lastArchiveTime],['数据冲突状态',m.businessStatus==='数据冲突'?'存在字段冲突':'无冲突']], '档案完整度与医疗数据')],
    '操作日志':[{type:'timeline',items:[
      {time:m.updatedAt,actor:'医学运营管理员',title:'查看家庭成员详情',content:`查看成员 ${m.memberId} 与健康主体 ${m.subjectId} 的完整信息`},
      {time:m.createdAt,actor:m.userName,title:'新增家庭成员',content:`通过${m.source}创建成员关系 ${m.familyRelationId}`},
      {time:'2026-07-08 16:42',actor:'家庭授权服务',title:m.shareStatus==='已共享'?'家属确认共享授权':'更新共享授权状态',content:`授权编号 ${m.consentId}，当前状态：${m.shareStatus}`},
      {time:'2026-07-07 09:18',actor:'医疗数据同步服务',title:'同步健康档案',content:`同步主体 ${m.subjectId} 的结构化医疗数据`},
      {time:'2026-07-06 14:30',actor:'AI问诊服务',title:'读取健康档案',content:`权限校验：${m.aiReadAuthStatus}；读取范围：${m.authScope}`},
      {time:'2026-07-05 11:06',actor:'报告解读服务',title:'报告归属确认',content:`报告解读结果归属到健康主体 ${m.subjectId}`}
    ]}]
  }
} as BusinessDetail]))

const healthDetailData:Record<string,BusinessDetail>=Object.fromEntries(healthArchives.map((h,index)=>{
  const overview=info([['健康档案ID',h.archiveId],['健康主体ID',h.subjectId],['家庭成员ID',h.memberId],['归属用户ID',h.userId],['归属用户姓名',h.userName],['主体姓名',h.subjectName],['成员关系',h.relation],['性别',h.gender],['年龄',h.age],['出生日期',h.birthDate],['身高',h.height],['体重',h.weight],['档案来源',h.source],['档案状态',h.archiveStatus],['档案完整度',h.completeness],['AI可读取状态',h.aiReadStatus],['最近入档时间',h.lastArchiveTime],['最近更新时间',h.updatedAt]],'档案身份与状态')
  const main=h.archiveId==='HEA-10021'
  const tabs:Record<string,DetailBlock[]>={
    '档案概览':[overview,...(h.archiveStatus==='数据冲突'?[{type:'alert',tone:'danger',title:'档案数据冲突',content:'检测到同一医疗字段存在多个来源值，已进入纠错记录队列。'} as DetailBlock]:[])],
    '基础病与过敏史':[
      table(['疾病名称','疾病类型','来源','来源单据ID','确认状态','当前状态','首次记录','最近更新','AI上下文'],main?[
        ['干眼症','眼科疾病','医生病历','MR10021','医生确认','现患','2026-06-27','2026-07-09','纳入'],
        ['睑板腺功能障碍','眼科疾病','医生病历','MR10021','医生确认','现患','2026-06-27','2026-07-09','纳入'],
        ['慢性胃炎','消化系统疾病','医生病历','MR10022','医生确认','待复查','2026-05-12','2026-07-08','限制纳入']
      ]:[[h.baseDiseaseTags,'健康问题','档案入档',`SRC-${h.archiveId}`,'待确认',h.archiveStatus,'2026-06-01',h.updatedAt,h.aiReadStatus.includes('授权')?'纳入':'限制纳入']]),
      table(['过敏原','过敏类型','严重程度','来源','确认状态','最近更新'],[[h.allergySummary,h.allergySummary==='无明确药物过敏'?'无':'药物/食物','待评估','用户填报','待核验',h.updatedAt]]),
      info([['手术史',main?'2025年胃息肉电凝切除':'无明确记录'],['家族史',main?'父亲高血压；母亲糖尿病':'待完善'],['生活习惯',main?'久坐、长时间看屏幕、偶尔熬夜':'待完善'],['备注',h.riskTags]])
    ],
    '病历记录':[table(['病历ID','病历名称','医院','科室','医生','主要诊断','就诊时间','来源','OCR状态','结构化状态','入档状态','医学复核'],main?[
      ['MR10021','眼科门诊病历','深圳市宝安区人民医院','眼科','陈医生','干眼症、睑板腺功能障碍、结膜炎','2026-06-27','医院同步','已完成','已结构化','已入档','已通过'],
      ['MR10022','消化内科门诊病历','深圳市人民医院','消化内科','李医生','慢性胃炎、胆汁反流','2026-05-12','用户上传','已完成','已结构化','已入档','已通过']
    ]:Array.from({length:Math.min(h.medicalRecordCount,2)},(_,i)=>[`MR-${h.subjectId}-${i+1}`,`${h.subjectName}门诊病历`,i?'深圳市人民医院':'深圳市宝安区人民医院',i?'内科':'全科','医生','结构化诊断','2026-06-12',h.source,'已完成','已结构化','已入档','待复核']))],
    '检查报告':[table(['报告ID','报告名称','类型','医院','科室','检查日期','OCR状态','结构化状态','AI解读','医学复核','入档状态'],main?[
      ['RP10021','泪液分泌功能测定报告','眼科检查','深圳市宝安区人民医院','眼科','2026-06-27','已完成','已完成','已解读','待复核','已入档'],
      ['RP10022','屈光检查报告','屈光检查','深圳市宝安区人民医院','眼科','2026-06-27','已完成','已完成','已解读','待复核','已入档'],
      ['RP10023','胃镜检查报告','胃镜报告','深圳市人民医院','消化内科','2026-05-12','已完成','已完成','已解读','已通过','已入档']
    ]:Array.from({length:Math.min(h.reportCount,3)},(_,i)=>[`RP-${h.subjectId}-${i+1}`,`${h.subjectName}检查报告${i+1}`,'检查报告','深圳市人民医院','相关科室','2026-06-20','已完成','已完成',i?'待解读':'已解读','待复核','已入档']))],
    '诊断记录':[table(['诊断ID','诊断名称','诊断类型','来源','来源单据ID','科室','确认状态','当前状态','首次诊断','确认医生','AI上下文'],main?[
      ['DG10021','干眼症','医生诊断','病历','MR10021','眼科','医生确认','现患','2026-06-27','陈医生','纳入'],
      ['DG10022','睑板腺功能障碍','医生诊断','病历','MR10021','眼科','医生确认','现患','2026-06-27','陈医生','纳入'],
      ['DG10023','慢性胃炎','医生诊断','病历','MR10022','消化内科','医生确认','待复查','2026-05-12','李医生','限制纳入']
    ]:Array.from({length:Math.min(h.diagnosisCount,3)},(_,i)=>[`DG-${h.subjectId}-${i+1}`,h.baseDiseaseTags.split('、')[i]??'待确认诊断','结构化诊断','档案入档',`SRC-${h.archiveId}`,'相关科室','待确认','未知','2026-06-01','待确认',h.aiReadStatus.includes('授权')?'纳入':'限制纳入']))],
    '用药记录':[table(['记录ID','药品名称','通用名','剂型','来源','处方ID','关联诊断','单次剂量','频次','用药时间','开始日期','结束日期','状态','剂量风险','AI提醒'],main?[
      ['MED10021','思然 聚乙二醇滴眼液','聚乙二醇','滴眼液','眼科处方','RX10021','干眼症','双眼每次1滴','每日4次','白天','2026-06-27','—','正在用','剂量待确认','已开启'],
      ['MED10022','滋润 环孢素滴眼液','环孢素','滴眼液','眼科处方','RX10021','干眼症','双眼每次1滴','每日2次','早晚','2026-06-27','—','正在用','低风险','已开启'],
      ['MED10023','泌特 复方阿嗪米特肠溶片','复方阿嗪米特','肠溶片','消化科处方','RX10022','慢性胃炎','每次1片','每日3次','饭后待确认','2026-05-12','—','待确认','进餐关系待确认','待确认']
    ]:Array.from({length:Math.min(h.medicationCount,3)},(_,i)=>[`MED-${h.subjectId}-${i+1}`,'档案关联药品','通用名','常规剂型','处方同步',`RX-${h.subjectId}`,'关联诊断','遵医嘱','每日1次','待确认','2026-06-01','—','正在用','待核查','已开启']))],
    'AI可读取范围':[
      info([['当前AI读取状态',h.aiReadStatus],['授权编号',h.consentId],['授权来源',h.source],['授权开始时间','2026-01-01'],['授权结束时间',h.aiReadStatus==='授权已过期'?'2026-06-30':'长期有效'],['限制读取字段',h.aiReadStatus==='部分可读取'?'病历原文、药箱数据、用药计划':'无'],['最近AI读取时间',h.updatedAt],['最近读取场景',main?'AI问诊 / 报告解读':'智能导诊'],['最近调用模型','MedGPT-4.1'],['最近Prompt版本','medical-context-v2.6']],'授权与最近调用'),
      table(['数据范围','读取权限'],[['基础信息','可读取'],['基础病与过敏史','可读取'],['检查报告',h.aiReadStatus==='未授权'?'不可读取':'可读取'],['病历记录',h.aiReadStatus==='部分可读取'?'部分可读取':'可读取'],['诊断记录','可读取'],['用药记录',h.aiReadStatus.includes('授权')?'可读取':'不可读取'],['家族史','限定读取'],['生活习惯','限定读取']]),
      {type:'alert',tone:'warning',title:'合规提示',content:'AI 仅可在授权场景和最小必要范围内读取该档案。所有读取行为均记录模型、Prompt、调用人和数据范围。'}
    ],
    '数据审计':[{type:'timeline',items:[
      {time:h.updatedAt,actor:'医学运营管理员',title:'查看健康档案详情',content:`查看档案 ${h.archiveId} 和主体 ${h.subjectId}`},
      {time:h.lastArchiveTime,actor:'数据同步服务',title:'完成增量同步',content:'同步报告、病历、诊断及用药结构化数据'},
      {time:'2026-07-08 16:42',actor:'报告解读服务',title:'解读结果入档',content:`报告解读结果归属健康主体 ${h.subjectId}`},
      {time:'2026-07-07 09:18',actor:'AI问诊服务',title:'读取健康档案上下文',content:`权限校验通过，读取状态：${h.aiReadStatus}`},
      {time:'2026-07-06 14:06',actor:'王医生',title:'医学复核',content:'复核健康档案结构化内容并确认'},
      {time:'2026-06-27 11:20',actor:'结构化引擎',title:'提取报告字段',content:'从检查报告中提取结构化字段并入档'},
      {time:'2026-01-01 09:00',actor:'用户端',title:'创建健康档案',content:`用户创建档案并绑定主体 ${h.subjectId}`}
    ]}]
  }
  return [h.id,{...h,id:h.id,name:h.name,status:h.archiveStatus,tabs} as BusinessDetail]
}))

const aiClinicDetailData:Record<string,BusinessDetail>=Object.fromEntries(aiClinicSessions.map((s,index)=>{
  const gastric=s.id==='AIQ-10031'
  const emergency=s.riskLevel==='紧急风险'
  const multimodal=s.inputType==='图片'||s.inputType==='图文混合'
  const symptomId=`SYM-${String(s.id).slice(-5)}`
  const diagnosisId=String(s.diagnosisCreated).includes('AI初筛')?`DG-${String(s.id).slice(-5)}`:'—'
  const blocks:Record<string,DetailBlock[]>={
    '会话概览':[info([['问诊会话ID',String(s.id)],['用户ID',String(s.userId)],['用户姓名',String(s.userName)],['健康主体ID',String(s.subjectId)],['主体姓名',String(s.subjectName)],['成员关系',String(s.relation)],['问诊类型',String(s.consultType)],['问诊模式',String(s.consultMode)],['输入类型',String(s.inputType)],['主诉',String(s.chiefComplaint)],['问诊状态',String(s.consultStatus)],['问诊进度',String(s.progress)],['追问轮次',Number(s.rounds)],['症状槽位完整度',String(s.slotCompleteness)],['缺失关键信息',String(s.missingInfo)],['信息是否足够',String(s.informationEnough)],['是否生成AI结论',String(s.conclusionGenerated)],['风险等级',String(s.riskLevel)],['推荐科室',String(s.department)],['创建时间',String(s.createdAt)],['最近更新时间',String(s.updatedAt)]],'会话身份、类型与问诊进度'),...(emergency?[{type:'alert',tone:'danger',title:'紧急风险已触发',content:'已停止常规追问并输出急诊建议；系统记录风险规则、转人工状态和用户联系链路。'} as DetailBlock]:[])],
    '多轮问诊记录':[{type:'timeline',items:gastric?[
      {time:'15:02:01',actor:'用户',title:'第1轮 · 用户输入',content:'胃不舒服（信息完整度 10%）'},
      {time:'15:02:04',actor:'AI诊室',title:'第2轮 · AI追问',content:'具体是胃部隐痛、胀气、烧心还是反酸？（信息完整度 20%）'},
      {time:'15:03:12',actor:'用户',title:'第3轮 · 用户回答',content:'烧心，还有点反酸，吃完饭容易胀（信息完整度 40%）'},
      {time:'15:03:15',actor:'AI诊室',title:'第4轮 · AI追问',content:'这种烧心从什么时候开始？是持续存在还是逐渐加重？是否有黑便、呕血或体重下降？'},
      {time:'15:03:16',actor:'问诊编排器',title:'信息充分性判断',content:'当前完整度 40%，消化道红旗症状尚未排查完成，状态设为待用户补充'}
    ]:[
      {time:String(s.createdAt),actor:'用户',title:'第1轮 · 提交主诉',content:String(s.chiefComplaint)},
      {time:String(s.updatedAt),actor:'AI诊室',title:`第${s.rounds}轮 · 症状采集`,content:`已采集：${s.currentSymptoms}；当前信息完整度 ${s.progress}`},
      {time:String(s.updatedAt),actor:'问诊编排器',title:'信息充分性判断',content:`问诊状态：${s.consultStatus}；风险等级：${s.riskLevel}`}
    ]}],
    '症状结构化':[
      info([['主诉',String(s.chiefComplaint)],['症状名称',gastric?'烧心、反酸、饭后胀':String(s.currentSymptoms)],['症状部位',gastric?'上腹部 / 胸骨后':'待结构化'],['症状性质',gastric?'烧灼感、餐后胀满':'根据多轮回答提取'],['持续时间',gastric?'2年，近期加重':'已采集'],['诱因',gastric?'进食后':'待补充'],['加重因素',gastric?'油腻饮食、过饱':'待补充'],['缓解因素',gastric?'暂未明确':'待补充'],['伴随症状',String(s.currentSymptoms)],['严重程度',String(s.riskLevel)],['信息完整度',String(s.progress)],['是否红旗症状',emergency?'是':gastric?'待排查':'否'],['关联症状记录ID',String(s.symptomCreated)==='已生成'?symptomId:'未生成']],'结构化症状摘要'),
      {type:'alert',tone:gastric?'warning':emergency?'danger':'info',title:'症状不是诊断',content:'本页仅记录用户主诉和结构化症状，不代表疾病诊断。AI 初步判断需经过医生确认。'}
    ],
    '多模态附件':multimodal?[
      table(['附件ID','附件类型','图像场景','上传来源','无痕模式','原图保存状态','脱敏状态','自动删除时间'],[[
        String(s.attachmentId??`ATT-${String(s.id).slice(-5)}`),'医学图像',String(s.imageScene??'问诊附件'),'支付宝医疗端',
        String(s.traceless??'否'),String(s.originalStatus??'已加密保存'),String(s.privacyStatus??'已脱敏'),String(s.autoDeleteAt??'授权到期后自动删除')
      ]]),
      {type:'alert',tone:String(s.traceless)==='是'?'warning':'info',title:'附件使用边界',content:String(s.traceless)==='是'?'当前为无痕模式，原图不长期保存，仅保留必要审计记录。':'附件仅用于本次问诊分析，访问、脱敏和删除策略均已进入合规审计。'}
    ]:[
      {type:'alert',tone:'info',title:'当前会话无多模态附件',content:'本次问诊输入类型为文本或语音，没有上传皮肤、舌苔、脱发、药盒或报告图片。'}
    ],
    '图像分析结果':multimodal?[
      info(String(s.imageScene)==='拍皮肤'?[
        ['分析类型','皮肤图像 AI 初筛'],['皮损特征','手臂局部红斑伴轻度脱屑'],['红肿程度','轻度'],['是否渗出','否'],['识别置信度','88%'],['分析摘要','存在炎症性皮损倾向，建议结合接触史继续问诊'],['结果流转','已生成症状记录，未生成医生确认诊断']
      ]:[
        ['分析类型',String(s.imageScene)==='拍报告'?'报告图像识别':'多模态图像分析'],['识别结果',String(s.imageScene)==='拍报告'?'已识别报告类型和关键结论，流转报告解读管理':'已完成结构化特征提取'],['识别置信度','93%'],['分析摘要','图像结果仅作为问诊上下文，不等同于正式医学诊断'],['结果流转',String(s.imageScene)==='拍报告'?'报告解读管理':'症状记录 / 图像分析记录']
      ],'多模态识别结果'),
      {type:'alert',tone:'warning',title:'医学结论边界',content:'皮肤、舌苔和脱发分析只能作为 AI 初筛或倾向分析；若写入诊断记录，确认状态必须为“AI初筛 / 待医生确认”。'}
    ]:[
      {type:'alert',tone:'info',title:'无图像分析结果',content:'当前会话未调用医学图像识别模型。'}
    ],
    '隐私合规':[
      info([['输入类型',String(s.inputType)],['附件访问授权',multimodal?'已授权本次问诊使用':'不适用'],['原图保存状态',String(s.originalStatus??'无原图')],['隐私脱敏状态',String(s.privacyStatus??'不适用')],['无痕模式',String(s.traceless??'否')],['自动删除时间',String(s.autoDeleteAt??'不适用')],['健康档案读取','按健康主体授权范围读取'],['跨主体隔离','已校验'],['审计结果','附件访问、模型调用、结论生成和入档操作均已留痕']],'数据授权、图像保护与审计'),
      {type:'alert',tone:'info',title:'最小必要使用',content:'系统仅向当前问诊所需的模型和工具提供最小必要数据；拍报告流转报告解读，拍药盒流转用户药箱，图像问诊结果按用户确认决定是否入档。'}
    ],
    '风险规则命中':[
      info([['规则ID',emergency?'RULE-EMG-CHEST-001':`RULE-TRIAGE-${String(s.id).slice(-3)}`],['规则名称',String(s.rule)],['命中条件',String(s.currentSymptoms)],['风险等级',String(s.riskLevel)],['是否需要继续追问',String(s.consultStatus)==='待用户补充'?'是':'否'],['建议线下就医',s.riskLevel==='低风险'?'视症状变化':'是'],['建议急诊',emergency?'是':'否'],['处理状态',emergency?'已触发风险并转人工':'持续评估']],'规则判定结果')
    ],
    'AI结论与导诊':[
      info([['AI初步判断',gastric?'胃食管反流或慢性胃炎方向，仍需完成红旗症状排查':`${s.currentSymptoms}相关疾病方向，需结合面诊确认`],['置信度',gastric?'62%':`${70+index*2}%`],['推荐科室',String(s.department)],['就医建议',emergency?'立即前往急诊或拨打120':s.riskLevel==='高风险'?'尽快线下就医':'建议门诊评估'],['居家观察建议',emergency?'不建议居家观察':'记录症状变化，避免已知诱因'],['免责声明','AI输出仅用于健康信息参考，不能替代医生诊断和处方'],['生成导诊记录','是'],['生成诊断记录',String(s.diagnosisCreated)],['是否入档',String(s.archiveStatus)]],'初步判断与服务建议'),
      ...(String(s.diagnosisCreated).includes('AI初筛')?[{type:'alert',tone:'warning',title:'诊断确认边界',content:`诊断记录 ${diagnosisId} 的来源为 AI初筛，确认状态必须保持“待医生确认”，不得标记为医生诊断。`} as DetailBlock]:[])
    ],
    '模型与工具调用':[
      info([['模型名称',String(s.modelName)],['模型版本',String(s.modelName)==='deepseek-chat'?'DeepSeek V3.1':'MedGPT-4.1-202607'],['Prompt版本',String(s.promptVersion)],['工具调用次数',gastric?4:3],['读取健康档案','是，已记录授权范围'],['读取历史病历',gastric?'是，读取消化内科病历摘要':'按授权范围读取'],['调用导诊规则','是'],['调用药品知识库','否'],['输出审核状态',emergency?'安全策略已拦截':'自动审核通过']],'模型编排与工具权限'),
      {type:'ai',model:String(s.modelName),tool:'健康档案检索 / 症状结构化 / 风险规则 / 智能导诊',duration:gastric?'2.18s':'1.64s',input:`用户主诉：${s.chiefComplaint}；多轮症状：${s.currentSymptoms}`,output:`信息完整度 ${s.progress}，风险等级 ${s.riskLevel}，推荐科室 ${s.department}`}
    ],
    '数据入档与审计':[
      info([['生成症状记录',String(s.symptomCreated)],['症状记录ID',String(s.symptomCreated)==='已生成'?symptomId:'—'],['生成诊断记录',String(s.diagnosisCreated)],['诊断记录ID',diagnosisId],['写入健康档案',String(s.archiveStatus)==='已入档'?'是':'否'],['入档状态',String(s.archiveStatus)],['人工复核状态',String(s.archiveStatus).includes('人工')?'待复核':'无需复核 / 自动校验'],['审计结果','模型读取、风险判定、结论生成和入档动作均已留痕']],'入档对象与状态'),
      {type:'timeline',items:[
        {time:String(s.createdAt),actor:'AI诊室',title:'创建问诊会话',content:`创建 ${s.id} 并绑定健康主体 ${s.subjectId}`},
        {time:String(s.updatedAt),actor:'症状结构化服务',title:'生成症状记录',content:`${s.symptomCreated}；关联ID ${symptomId}`},
        {time:String(s.updatedAt),actor:'风险规则引擎',title:'完成风险分级',content:`命中 ${s.rule}，风险等级 ${s.riskLevel}`},
        {time:String(s.updatedAt),actor:'AI结论服务',title:'生成初步判断',content:'输出已附带禁止诊断免责声明'},
        {time:String(s.updatedAt),actor:'数据入档服务',title:'执行入档策略',content:`当前状态：${s.archiveStatus}`}
      ]}
    ]
  }
  return [String(s.id),{...s,name:String(s.name),tabs:blocks} as BusinessDetail]
}))

const reportTaskDetailData:Record<string,BusinessDetail>=Object.fromEntries(reportInterpretationTasks.map((r,index)=>{
  const tear=r.id==='INT-10021'
  const online=r.uploadMethod==='在线查报告'
  const taskOverview:DetailBlock[]=[
    info([['解读任务ID',String(r.id)],['报告ID',String(r.reportId)],['用户ID',String(r.userId)],['用户姓名',String(r.userName)],['健康主体ID',String(r.subjectId)],['主体姓名',String(r.subjectName)],['成员关系',String(r.relation)],['上传方式',String(r.uploadMethod)],['数据来源',String(r.dataSource)],['报告类型',String(r.reportType)],['医院',String(r.hospital)],['科室',String(r.department)],['检查日期',String(r.examDate)],['当前状态',`${r.ocrStatus} / ${r.structuredStatus} / ${r.aiStatus}`],['风险等级',String(r.riskLevel)],['创建时间',String(r.createdAt)],['最近更新时间',String(r.updatedAt)]],'任务、报告与健康主体'),
    {type:'alert',tone:'info',title:'报告归属确认',content:`该报告归属 ${r.subjectName} / ${r.relation}（健康主体 ${r.subjectId}）。结构化字段、解读结果和入档数据必须绑定该主体。`}
  ]
  if(online)taskOverview.push(info([['授权状态',String(r.authStatus??'已授权')],['拉取时间范围',String(r.pullRange??'近12个月')],['拉取报告数量',Number(r.pullCount??0)],['拉取状态',String(r.pullStatus??'成功')],['最近拉取时间',String(r.lastPullTime??r.createdAt)],['接口返回状态',String(r.apiStatus??'200 OK')],['数据脱敏状态',String(r.maskingStatus??'已脱敏')]],'深圳在线查报告'))
  const structure=tear?interpretationDetail.tabs['结构化字段']:[table(['字段ID','字段名称','原文内容','结构化值','单位','异常状态','不确定','复核状态'],[
    [`FIELD-${10030+index*3}`,r.reportType==='内镜检查'?'检查部位':'核心指标',r.reportType==='内镜检查'?'胃体、胃窦':'报告原文值','已提取','—',String(r.riskLevel),'否',String(r.reviewStatus)],
    [`FIELD-${10031+index*3}`,r.reportType==='内镜检查'?'胃炎类型':'医生结论',r.reportType==='内镜检查'?'慢性非萎缩性胃炎':'报告结论','结构化文本','—','待结合临床','否',String(r.reviewStatus)],
    [`FIELD-${10032+index*3}`,r.reportType==='内镜检查'?'是否胆汁反流':'报告风险项',r.reportType==='内镜检查'?'可见胆汁反流':'未见明确高危原文',r.reportType==='内镜检查'?'是':'否','—',String(r.riskLevel),'否',String(r.reviewStatus)]
  ])]
  const blocks:Record<string,DetailBlock[]>={
    '任务概览':taskOverview,
    '原始报告':[
      {type:'text',title:'报告预览区域',content:`[${r.reportType} ${r.uploadMethod}预览]\n文件内容仅供授权运营人员查看，预览区域已启用水印和访问审计。`},
      info([['文件名称',`${r.reportId}_${r.name}.${r.uploadMethod==='文件上传'?'pdf':'jpg'}`],['文件格式',r.uploadMethod==='文件上传'?'PDF':'JPEG'],['文件大小',r.uploadMethod==='文件上传'?'2.8 MB':'1.6 MB'],['上传时间',String(r.createdAt)],['上传来源',`${r.uploadMethod} / ${r.dataSource}`],['隐私脱敏状态','已脱敏并添加访问水印']],'文件与隐私信息')
    ],
    'OCR结果':tear?[
      {type:'text',title:'OCR识别文本',content:'泪液分泌功能测定\n\nSchirmer试验：\nOD：10mm/5min\nOS：7mm/5min\n\n角膜荧光素染色检查：OU\n\n泪膜破裂时间：\nOD：2s\nOS：1s'},
      {type:'alert',tone:'warning',title:'OCR语义约束',content:'OU 仅表示双眼，不代表阳性或阴性。AI解读必须忠实保留原文不确定性。'},
      info([['OCR状态','已完成'],['OCR引擎','Vision OCR Pro'],['OCR置信度','96%'],['失败原因','无'],['人工修正记录','医学审核员确认 OU 原文，无文字修改']])
    ]:[
      info([['OCR状态',String(r.ocrStatus)],['OCR引擎',online?'接口结构化数据，无需OCR':'Vision OCR Pro'],['OCR置信度',online?'不适用':`${92-index}%`],['失败原因',r.ocrStatus==='识别失败'?'文件图像质量不足':'无'],['人工修正记录',r.ocrStatus==='人工修正'?'已修正2处字段':'无']]),
      {type:'text',title:'识别文本',content:`${r.name}\n医院：${r.hospital}\n科室：${r.department}\n检查日期：${r.examDate}\n检查结论：已提取并等待结构化校验。`}
    ],
    '结构化字段':structure,
    'AI解读结果':tear?[
      {type:'text',title:'解读摘要',content:'检查提示双眼泪膜稳定性明显下降，左眼泪液分泌偏低，常见于干眼症及睑板腺功能障碍。'},
      {type:'text',title:'指标解释与异常项',content:'BUT OD 2s、OS 1s，明显短于常用参考范围；Schirmer OS 7mm/5min偏低。'},
      {type:'text',title:'注意事项与不确定信息',content:'角膜荧光素染色仅记录 OU，不能解释为阳性或阴性。具体分型需结合眼科面诊。'},
      {type:'alert',tone:'warning',title:'禁止诊断声明',content:'AI解读用于健康信息说明，不构成医生诊断或治疗处方。'}
    ]:[
      {type:'text',title:'解读摘要',content:`${r.name}已完成AI解读，风险等级为${r.riskLevel}。异常项目需结合既往病史和医生意见综合判断。`},
      {type:'text',title:'可能含义与注意事项',content:'系统已按报告原文解释指标，不对未明确字段进行医学推断。'},
      {type:'alert',tone:'info',title:'免责声明',content:'AI解读不能替代医生诊断，出现不适或高风险提示时请及时线下就医。'}
    ],
    '风险评估':[
      info([['风险等级',String(r.riskLevel)],['命中规则ID',tear?'RULE-RPT-DRYEYE-001':`RULE-RPT-${String(r.id).slice(-3)}`],['命中规则名称',tear?'泪膜稳定性异常规则':`${r.reportType}异常项评估规则`],['命中原因',tear?'BUT双眼明显缩短、Schirmer左眼偏低':`报告结构化异常项触发${r.riskLevel}`],['需要复查',r.riskLevel==='无明显异常'?'按常规体检周期':'是'],['需要线下就医',r.riskLevel==='高风险'||r.riskLevel==='紧急风险'?'是':'结合症状判断'],['触发高危提醒',r.riskLevel==='高风险'||r.riskLevel==='紧急风险'?'是':'否']],'医学风险规则')
    ],
    '健康建议':[
      info([['生活建议',tear?'减少长时间看屏幕，注意眨眼和眼部休息':'保持规律作息，记录相关症状变化'],['复查建议',r.riskLevel==='无明显异常'?'按常规周期复查':'建议携报告线下复查'],['科室建议',String(r.department)],['用药提醒','不要根据AI解读自行新增、停用或调整处方药'],['禁忌提示','存在明显不适或风险升级时停止居家观察'],['推荐AI问诊继续追问',r.riskLevel==='紧急风险'?'否，直接急诊':'是']],'个性化健康建议')
    ],
    '医学复核':[
      info([['复核状态',String(r.reviewStatus)],['复核医生',r.reviewStatus==='不需要复核'?'系统规则豁免':'李医生'],['复核时间',r.reviewStatus==='待复核'?'—':String(r.updatedAt)],['复核意见',tear?'重点确认OU字段不被过度解释':'核对结构化字段和AI解读是否忠实原文'],['修改AI解读',tear?'待确认':'否'],['允许入档',r.reviewStatus==='复核驳回'?'否':'是']],'医学审核')
    ],
    '入档记录':[
      info([['是否入档',String(r.archiveStatus)],['目标健康档案ID',`HEA-${String(r.subjectId).slice(2)}`],['目标健康主体ID',String(r.subjectId)],['入档字段','报告索引、结构化指标、风险等级、解读摘要'],['入档时间',r.archiveStatus==='已入档'?String(r.updatedAt):'—'],['入档操作人','数据入档服务'],['字段冲突',r.archiveStatus==='入档冲突待确认'?'是':'否'],['冲突处理状态',r.archiveStatus==='入档冲突待确认'?'待用户或人工确认':'无冲突']],'健康档案入档链路')
    ],
    '模型与Prompt':[
      info([['模型名称',String(r.modelName)],['模型版本',String(r.modelName)==='deepseek-chat'?'DeepSeek V3.1':'MedGPT-4.1-202607'],['Prompt版本',String(r.promptVersion)],['工具调用记录','报告结构化、医学规则、健康档案关联'],['读取健康档案','是，仅读取授权范围'],['调用医学规则','是'],['调用报告结构化工具','是']],'AI模型与编排'),
      {type:'ai',model:String(r.modelName),tool:'OCR / 结构化 / 风险规则 / 健康建议',duration:'2.46s',input:`${r.reportType}结构化字段及健康主体授权上下文`,output:`完成${r.riskLevel}评估并生成健康建议`}
    ],
    '操作日志':[{type:'timeline',items:[
      {time:String(r.createdAt),actor:String(r.dataSource),title:'上传或拉取报告',content:`通过${r.uploadMethod}创建报告 ${r.reportId}`},
      {time:String(r.createdAt),actor:'OCR服务',title:'OCR识别完成',content:`状态：${r.ocrStatus}`},
      {time:String(r.updatedAt),actor:'结构化引擎',title:'结构化字段提取完成',content:`状态：${r.structuredStatus}`},
      {time:String(r.updatedAt),actor:String(r.modelName),title:'AI解读完成',content:`Prompt：${r.promptVersion}`},
      {time:String(r.updatedAt),actor:'风险规则引擎',title:'风险评估完成',content:`风险等级：${r.riskLevel}`},
      {time:String(r.updatedAt),actor:'医学审核服务',title:'医学复核状态更新',content:String(r.reviewStatus)},
      {time:String(r.updatedAt),actor:'数据入档服务',title:'报告入档',content:String(r.archiveStatus)},
      {time:String(r.updatedAt),actor:'用户端',title:'用户反馈',content:String(r.feedbackStatus)},
      {time:String(r.updatedAt),actor:'医学运营管理员',title:'查看报告详情',content:`权限校验通过，访问任务 ${r.id}`}
    ]}]
  }
  return [String(r.id),{...r,tabs:blocks} as BusinessDetail]
}))

const cameraDetailData:Record<string,BusinessDetail>=Object.fromEntries(cameraTasks.map((c,index)=>{
  const traceless=c.traceless==='是'
  const failed=String(c.qualityStatus)!=='合格'
  const symptomId=c.symptomCreated==='已生成'?`SYM-CAM-${String(c.id).slice(-5)}`:'—'
  const diagnosisId=String(c.diagnosisCreated).includes('AI初筛')?`DG-CAM-${String(c.id).slice(-5)}`:'—'
  const featureRows:Record<string,(string|number)[][]>={
    '舌苔':[['舌色','红'],['苔色','白苔'],['苔质','薄苔'],['舌形','轻度胖大'],['齿痕','轻度'],['裂纹','无'],['津液','正常'],['识别置信度','91%']],
    '皮肤患处':[['皮损类型','红斑、轻度脱屑'],['部位',traceless?'隐私部位（已脱敏）':'上肢'],['面积估算','约2.3cm²'],['红肿程度','轻度'],['是否渗出','否'],['是否破溃','否'],['严重程度','中'],['识别置信度','88%']],
    '肌肤状态':[['油脂程度','T区偏高'],['干燥程度','双颊轻度'],['毛孔状态','轻度明显'],['色斑情况','少量'],['痘痘数量','2'],['泛红程度','轻度'],['肤质类型','混合型']],
    '脱发':[['拍摄部位','头顶部'],['发缝宽度',failed?'无法评估':'6.2mm'],['头皮暴露程度',failed?'目标不完整':'中度'],['头发密度估计',failed?'无法评估':'约112根/cm²'],['脱发等级',failed?'未评估':'III级倾向'],['识别置信度',failed?'—':'86%']],
    '药盒':[['药品名称','滋润 环孢素滴眼液II'],['通用名','环孢素滴眼液'],['批准文号','国药准字H20200001'],['规格','0.4ml:0.2mg'],['生产厂家','沈阳兴齐眼药股份有限公司'],['有效期','2027-03'],['匹配药品知识库','是'],['可加入用户药箱','是']],
    '报告':[['文件类型','检查报告图片'],['OCR状态','待重新识别'],['报告类型','待识别'],['医院','图像模糊无法确认'],['检查日期','待识别'],['建议','上传PDF或重新拍摄']]
  }
  const features=featureRows[String(c.captureType)]??featureRows['皮肤患处']
  const tabs:Record<string,DetailBlock[]>={
    '任务概览':[info([['任务ID',String(c.id)],['用户ID',String(c.userId)],['用户姓名',String(c.userName)],['健康主体ID',String(c.subjectId)],['主体姓名',String(c.subjectName)],['成员关系',String(c.relation)],['拍摄类型',String(c.captureType)],['拍摄场景',String(c.scene)],['无痕模式',String(c.traceless)],['当前任务状态',String(c.status)],['风险等级',String(c.riskLevel)],['创建时间',String(c.createdAt)],['最近更新时间',String(c.updatedAt)]],'任务与健康主体'),...(traceless?[{type:'alert',tone:'warning',title:'无痕隐私任务',content:'该任务不长期保存原图，默认不写入健康档案，仅保留最小必要审计信息。'} as DetailBlock]:[])],
    '原始图片':[
      {type:'text',title:'图像预览区域',content:traceless?'[无痕模式：原始图片已按策略删除，后台不可查看]':`[${c.captureType}图像预览 · 已加访问水印]`},
      info([['文件名称',traceless?'不留存':`${c.id}_${c.captureType}.jpg`],['文件格式','JPEG'],['文件大小',traceless?'不留存':'1.8 MB'],['拍摄来源',String(c.scene)],['上传时间',String(c.createdAt)],['保存原图',traceless?'否':'是'],['原图保存状态',traceless?'会话结束后已删除':'加密保存'],['自动删除时间',traceless?String(c.updatedAt):'30天后按策略清理']],'文件留存策略'),
      ...(traceless?[{type:'alert',tone:'danger',title:'当前为无痕模式',content:'原图不长期保存，会话结束后自动删除；后台仅保留脱敏分析摘要、权限校验和必要审计记录。'} as DetailBlock]:[])
    ],
    '隐私脱敏':[
      info([['检测到人脸',c.captureType==='肌肤状态'?'是':'否'],['检测到隐私部位',c.scene==='私密拍'?'是':'否'],['生成脱敏图',traceless?'仅会话内临时生成':'是'],['脱敏方式',traceless?'不留存 / 区域裁剪':c.captureType==='肌肤状态'?'人脸局部打码':'局部遮挡'],['脱敏图预览',traceless?'临时图已销毁':'可在授权范围查看'],['处理时间',String(c.updatedAt)],['脱敏结果',String(c.privacyStatus)]],'隐私检测与处理')
    ],
    '图像质量检测':[
      info([['清晰度评分',failed?'48 / 100':'92 / 100'],['光照评分',c.qualityStatus==='光线不足'?'42 / 100':'88 / 100'],['拍摄距离',c.qualityStatus==='距离过近'?'过近':'符合规范'],['目标完整度',c.qualityStatus==='目标不完整'?'不足60%':'96%'],['是否遮挡','否'],['符合拍摄规范',failed?'否':'是'],['质量结论',String(c.qualityStatus)],['需要重拍',failed?'是':'否']],'质量检测指标'),
      ...(failed?[{type:'alert',tone:'warning',title:'建议重新拍摄',content:String(c.summary)} as DetailBlock]:[])
    ],
    '结构化特征':[table(['特征字段','识别结果'],features),{type:'alert',tone:'info',title:'结构化特征说明',content:'图像特征仅用于AI初筛和健康风险提示，不能单独作为医学诊断依据。'}],
    'AI分析结果':[
      {type:'text',title:'分析摘要',content:String(c.summary)},
      info([['图像特征解释',`${c.captureType}图像已提取可见特征并通过医学规则校验`],['可能含义',c.captureType==='舌苔'?'中医体质 / 舌象倾向分析':c.captureType==='皮肤患处'?'皮肤问题AI初筛 / 风险提示':'健康状态趋势参考'],['不确定信息',failed?'图像质量不足，无法完成可靠评估':'图像分析受光线、角度和设备影响'],['建议复拍',failed?'是':'视症状变化'],['建议线下就医',c.riskLevel==='中风险'||c.riskLevel==='建议线下就医'?'是':'否'],['免责声明','AI拍肤、舌苔和脱发分析不能作为正式医学诊断']],'分析边界与建议')
    ],
    '风险评估':[info([['风险等级',String(c.riskLevel)],['命中规则ID',`RULE-CAM-${String(c.captureType).toUpperCase()}-${String(c.id).slice(-3)}`],['命中规则名称',`${c.captureType}图像风险规则`],['命中原因',String(c.summary)],['存在高危特征',c.riskLevel==='高风险'||c.riskLevel==='建议线下就医'?'是':'否'],['需要人工复核',String(c.reviewStatus)==='待复核'?'是':'否'],['建议线下就医',c.riskLevel==='中风险'||c.riskLevel==='建议线下就医'?'是':'否'],['推荐科室',c.captureType==='皮肤患处'||c.captureType==='脱发'?'皮肤科':c.captureType==='舌苔'?'中医科 / 全科':'相关科室']],'风险规则结果')],
    '健康建议':[info([['日常护理建议',c.captureType==='皮肤患处'?'保持局部清洁，避免抓挠和自行使用激素药膏':'保持规律作息并观察变化'],['复拍建议',failed?'按拍摄引导重新拍摄完整目标':'7-14天后同条件复拍便于趋势比较'],['观察周期','7天'],['推荐科室',c.captureType==='皮肤患处'||c.captureType==='脱发'?'皮肤科':'全科 / 对应专科'],['建议继续AI问诊',failed?'否':'是'],['建议上传更多图片',c.captureType==='皮肤患处'?'是，建议远景和局部各1张':'视情况'],['建议就医',c.riskLevel==='中风险'||c.riskLevel==='建议线下就医'?'是':'暂无紧急就医提示']],'个性化健康建议')],
    '入档与症状记录':[
      info([['生成症状记录',String(c.symptomCreated)],['症状记录ID',symptomId],['生成诊断记录',String(c.diagnosisCreated)],['诊断记录ID',diagnosisId],['诊断确认状态',diagnosisId==='—'?'未生成':'AI初筛 / 待医生确认'],['写入健康档案',traceless?'否':String(c.archiveStatus).includes('已')?'是':'待确认'],['目标健康档案ID',`HEA-${String(c.subjectId).slice(2)}`],['入档字段','图像分析摘要、结构化特征、风险等级、健康建议'],['入档状态',String(c.archiveStatus)],['需要用户确认',traceless?'主动确认后才允许':'是']],'症状、诊断与健康档案'),
      ...(traceless?[{type:'alert',tone:'warning',title:'无痕模式默认不入档',content:'仅当用户主动确认后，才可将脱敏后的结构化摘要写入健康档案；原图始终不入档。'} as DetailBlock]:[])
    ],
    '模型与工具调用':[
      info([['模型名称',String(c.modelName)],['模型版本','Medical Vision 2026.07'],['Prompt版本',String(c.promptVersion)],['图像识别工具','medical-image-analyzer-v3'],['隐私脱敏工具','privacy-mask-v2'],['规则引擎','camera-risk-engine-v1'],['读取健康档案','按授权范围读取'],['调用药品知识库',c.captureType==='药盒'?'是':'否'],['输出质检状态',String(c.aiStatus)==='已完成'?'通过':'待质检']],'模型编排与安全工具'),
      {type:'ai',model:String(c.modelName),tool:'图像质量 / 隐私脱敏 / 特征提取 / 风险规则',duration:'2.82s',input:`${c.captureType}图像，场景：${c.scene}`,output:String(c.summary)}
    ],
    '操作日志':[{type:'timeline',items:[
      {time:String(c.createdAt),actor:'用户端',title:'打开AI智能相机',content:`选择拍摄类型：${c.captureType}`},
      {time:String(c.createdAt),actor:'智能相机',title:'完成拍摄',content:`场景：${c.scene}，无痕模式：${c.traceless}`},
      {time:String(c.updatedAt),actor:'图像质量服务',title:'质量检测完成',content:`结论：${c.qualityStatus}`},
      {time:String(c.updatedAt),actor:'隐私脱敏服务',title:'隐私处理完成',content:String(c.privacyStatus)},
      {time:String(c.updatedAt),actor:String(c.modelName),title:'AI图像分析完成',content:String(c.aiStatus)},
      {time:String(c.updatedAt),actor:'风险规则引擎',title:'风险评估完成',content:`风险等级：${c.riskLevel}`},
      {time:String(c.updatedAt),actor:'症状记录服务',title:'生成症状记录',content:`状态：${c.symptomCreated}；记录：${symptomId}`},
      ...(traceless?[{time:String(c.updatedAt),actor:'隐私清理服务',title:'无痕模式删除原图',content:'原图和临时脱敏图已按策略销毁'}]:[]),
      {time:String(c.updatedAt),actor:'医学运营管理员',title:'查看任务详情',content:`权限校验通过，审计任务 ${c.id}`}
    ]}]
  }
  return [String(c.id),{...c,tabs} as BusinessDetail]
}))

export const detailMockData:Record<string,Record<string,BusinessDetail>>={
  users:{U10021:userDetail},
  health:healthDetailData,
  records:{MR10021:recordDetail,'MR-10021':recordDetail},
  reports:{RP10021:reportDetail,'RP-10021':reportDetail},
  consults:aiClinicDetailData,
  triage:{'TRI-10021':triageDetail},
  doctors:{'DOC-10021':doctorDetail,'DOC10021':doctorDetail},
  agents:{'AGE-10021':agentDetail,'AGE10021':agentDetail},
  'drug-kb':{'DRU-10021':drugDetail,'DRU10021':drugDetail},
  'medicine-box':{'MED-10021':medicineBoxDetail,'MED10021':medicineBoxDetail},
  'med-plans':{'MED-10021':planDetail,'MED10021':planDetail},
  rules:{'RUL-10021':ruleDetail,'RULE-EMG-CHEST-001':ruleDetail},
  corrections:{'COR-10021':correctionDetail,'COR10021':correctionDetail}
  ,interpretation:reportTaskDetailData,
  camera:cameraDetailData,
  family:familyDetailData
}
