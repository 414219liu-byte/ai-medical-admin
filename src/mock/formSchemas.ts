import type { Field, RowData } from '../types'

const f=(key:string,label:string,type:Field['type']='text',options?:string[],required=false,placeholder?:string):Field=>({key,label,type,options,required,placeholder})
const req=(key:string,label:string,type:Field['type']='text',options?:string[],placeholder?:string)=>f(key,label,type,options,true,placeholder)
const yesNo=['是','否'], enabled=['启用','停用'], users=['刘志辉 U10001','陈雨桐 U10002','周铭轩 U10003','林婉清 U10004']
const subjects=['刘志辉/本人','测试父亲/爸爸','刘小朋友/女儿','陈雨桐/本人']
const hospitals=['华中科技大学协和深圳医院','北京大学深圳医院','南方医科大学深圳医院','深圳市第三人民医院']
const departments=['眼科门诊','消化内科','心血管内科','急诊科','皮肤科','儿科']
const textArea=(key:string,label:string,required=false,placeholder?:string)=>f(key,label,'textarea',undefined,required,placeholder)

export const formSchemas:Record<string,Field[]>={
  users:[req('name','姓名'),f('nickname','昵称'),req('phone','手机号'),req('gender','性别','radio',['男','女','未知']),f('birthday','出生日期','date'),
    req('city','所在城市','select',['深圳南山','深圳福田','深圳宝安','深圳龙岗','惠州大亚湾','广州天河']),req('source','注册来源','select',['AI问诊','报告解读','健康档案','挂号入口','药箱入口','支付宝搜索']),
    req('status','账号状态','select',['正常','待完善','禁用','注销中']),f('risk','风险标签','multiselect',['无','干眼复诊','胃病随访','高血压风险','急症提醒','投诉用户']),textArea('remark','备注')],
  family:[
    req('user','所属用户','select',['刘志辉 / U10021 / 138****6210','陈雨桐 / U10022 / 138****6211','周铭轩 / U10023 / 138****6212','林婉清 / U10024 / 138****6213']),
    {...f('subjectId','健康主体ID'),readonly:true,placeholder:'保存后系统自动生成'},
    req('relation','成员关系','select',['本人','父亲','母亲','配偶','儿子','女儿','祖父','祖母','其他']),req('name','成员姓名'),req('gender','性别','radio',['男','女','未知']),
    req('birthDate','出生日期','date',undefined,'请选择出生日期'),f('phone','手机号'),req('source','成员来源','select',['用户手动添加','报告上传识别','AI问诊创建','后台管理员创建']),
    req('realNameStatus','实名状态','select',['未实名','已实名','监护人确认']),req('shareStatus','共享状态','select',['未共享','已共享','待家属确认','已拒绝','已撤销']),
    f('authEnd','授权有效期','date'),req('authScope','AI读取范围','multiselect',['不允许','仅本次','允许问诊读取','允许报告解读读取','允许入档与个性化建议']),
    req('operationReason','操作原因','textarea',undefined,'管理员后台新增家庭成员的业务原因'),textArea('remark','备注')
  ],
  health:[req('user','归属用户','select',users),req('subject','档案主体','radio',['本人','家庭成员']),req('relation','成员关系','select',['本人','爸爸','妈妈','老公','老婆','儿子','女儿','哥哥','姐姐','其他']),
    req('name','主体姓名'),req('gender','性别','radio',['男','女','未知']),req('birthday','出生日期','date'),f('height','身高 cm','number'),f('weight','体重 kg','number'),
    f('diseases','基础疾病标签','multiselect',['干眼症','睑板腺功能障碍','慢性胃炎','胆汁反流','高血压','糖尿病','冠心病','无']),
    f('allergy','过敏史','multiselect',['无','青霉素','头孢','磺胺类','食物过敏','其他']),textArea('surgery','手术史',false,'无；2025年胃息肉电凝切除'),
    textArea('familyHistory','家族史',false,'父亲高血压；母亲糖尿病'),f('habits','生活习惯','multiselect',['久坐','长时间看屏幕','熬夜','吸烟','饮酒','清淡饮食','运动不足']),
    req('source','档案来源','select',['用户手动创建','医院同步','家庭成员共享','AI对话生成','后台创建']),req('aiReadable','AI可读取状态','select',['已授权可读取','未授权','部分可读取','禁止AI读取']),
    req('status','档案状态','select',['正常','待完善','待核验','已停用']),textArea('remark','备注')],
  records:[req('user','归属用户','select',users),req('subject','档案主体','select',subjects),req('hospital','医院','select',hospitals),req('department','科室','select',departments),
    req('visitDate','就诊时间','datetime-local'),req('complaint','主诉','textarea',undefined,'双眼干涩、眼痒、异物感不适2年'),textArea('history','现病史'),textArea('pastHistory','既往史'),
    textArea('physical','体格检查'),textArea('auxiliary','辅助检查'),req('name','医生诊断','textarea'),textArea('advice','处理意见'),f('doctor','医生姓名'),
    req('source','病历来源','select',['医院同步','用户上传','OCR识别','AI对话提取','后台录入']),req('ocr','OCR状态','select',['无','待识别','识别中','成功','失败','部分成功']),
    req('aiSearch','AI可检索状态','select',['已同步','未同步','部分同步','同步失败']),req('status','审核状态','select',['待审核','已通过','已驳回','待复核']),f('attachment','病历附件','file'),textArea('remark','备注')],
  reports:[req('user','归属用户','select',users),req('subject','档案主体','select',subjects),req('name','报告名称'),req('reportType','报告类型','select',['检验报告','检查报告','影像报告','眼科检查','屈光检查','胃镜报告','体检报告','门诊记录']),
    req('hospital','医院','select',hospitals),req('department','科室','select',departments),req('reportDate','报告日期','date'),req('attachment','报告文件','file'),textArea('conclusion','医生结论'),
    textArea('items','检查项目',false,'BUT OD 2s；OS 1s；Schirmer OD 10，OS 7'),req('risk','是否异常','select',['正常','异常','高风险','待确认']),textArea('abnormal','异常摘要'),
    req('ocr','OCR状态','select',['未识别','识别中','成功','失败','部分成功']),req('structured','结构化状态','select',['未结构化','已结构化','部分结构化','结构化异常']),
    req('ai','AI解读状态','select',['未解读','已解读','待复核','解读失败']),req('source','上传来源','select',['用户上传','医院同步','后台上传','AI对话上传']),textArea('remark','备注')],
  diagnoses:[req('user','归属用户','select',users),req('subject','档案主体','select',subjects),req('name','诊断名称'),req('category','疾病分类','select',['眼科','消化','心血管','呼吸','皮肤','儿科','其他']),
    req('source','诊断来源','select',['医生病历','检查报告','AI提取','用户自填','后台录入']),req('date','诊断时间','date'),f('hospital','诊断医院','select',hospitals),f('department','诊断科室','select',departments),
    f('doctor','医生姓名'),req('confirm','确认状态','select',['医生确认','AI提取','用户自填','待确认']),req('current','当前状态','select',['现患','已恢复','待复查','未知']),f('recordId','关联病历'),f('reportId','关联报告'),textArea('remark','备注')],
  symptoms:[req('user','归属用户','select',users),req('subject','档案主体','select',subjects),req('name','症状名称'),req('description','症状描述','textarea'),f('bodyPart','发生部位'),
    req('severity','严重程度','select',['轻','中','重','急症']),f('duration','持续时间'),f('trigger','诱因'),f('companions','伴随症状'),req('source','来源','select',['AI对话','用户手动','医生记录','后台录入']),
    req('test','是否测试','radio',['是','否','未知']),req('proxy','是否代问','radio',['是','否','未知']),req('targetSubject','建议入档主体','select',subjects),req('archived','入档状态','select',['已入档','待确认','已拒绝','已删除','已申请删除']),textArea('remark','备注')],
  consults:[req('user','用户','select',users),req('subject','咨询主体','select',subjects),req('name','问诊主题'),req('firstQuestion','首次问题','textarea'),req('intent','意图分类','select',['症状问诊','报告解读','用药咨询','智能导诊','复诊摘要','家人代问','产品测试']),
    req('risk','风险等级','select',['普通','门诊','尽快就医','急诊']),req('emergency','是否命中急症','radio',yesNo),f('rule','命中规则'),textArea('advice','AI建议摘要'),
    req('archived','是否入档','select',['是','否','待确认','已取消']),req('model','AI模型','select',['MedGPT-4.1','MedGPT-Safety','Qwen-Medical']),req('status','处理状态','select',['已完成','待复核','转人工','已关闭']),textArea('remark','备注')],
  interpretation:[req('reportId','报告ID'),req('user','用户','select',users),req('subject','档案主体','select',subjects),req('fileType','文件类型','select',['图片','PDF','拍照上传']),
    req('reportType','报告类型','select',['眼科检查','屈光检查','胃镜报告','检验报告']),req('model','OCR模型','select',['Vision OCR Pro','Medical OCR V2']),req('status','OCR状态','select',['待识别','识别中','成功','失败']),
    f('confidence','识别置信度','number'),f('abnormal','异常字段数','number'),textArea('remark','备注')],
  triage:[req('name','规则名称'),req('symptoms','触发症状','textarea'),f('companions','伴随症状'),f('exclude','排除条件'),req('department','推荐科室','select',departments),f('alternative','备选科室','select',departments),
    f('exam','推荐检查'),req('risk','风险等级','select',['普通','门诊','尽快就医','急诊']),f('emergency','急诊条件'),textArea('template','回复模板'),f('priority','规则优先级','number'),req('status','是否启用','radio',enabled)],
  hospitals:[req('name','医院名称'),f('shortName','医院简称'),req('level','医院等级','select',['三甲','三乙','二甲','专科医院','社区医院']),req('type','医院类型','select',['综合医院','专科医院','中医医院','妇幼保健院','社区卫生中心']),
    req('city','城市','select',['深圳','广州','惠州']),req('area','区域','select',['南山区','福田区','宝安区','龙岗区','天河区']),req('address','详细地址'),f('coordinate','经纬度'),f('phone','联系电话'),f('website','官网'),
    req('insurance','是否支持医保','radio',yesNo),req('registration','是否支持挂号','radio',yesNo),req('online','是否支持在线问诊','radio',yesNo),req('access','接入状态','select',['已接入','部分接入','未接入','暂停合作']),
    req('status','启用状态','select',enabled),textArea('intro','医院介绍'),f('logo','Logo','file')],
  departments:[req('name','科室名称'),req('category','一级分类','select',['内科','外科','五官科','妇儿','皮肤','急诊','其他']),f('alias','科室别名'),textArea('symptoms','适用症状'),
    textArea('exclude','排除症状'),textArea('diseases','常见疾病'),textArea('exams','常见检查'),f('referral','可转诊科室','multiselect',departments),textArea('emergency','急诊提示'),f('sort','排序','number'),req('status','是否启用','radio',enabled)],
  doctors:[req('name','医生姓名'),f('avatar','头像','file'),f('gender','性别','radio',['男','女','未知']),req('hospital','所属医院','select',hospitals),req('department','所属科室','select',departments),
    req('title','职称','select',['主任医师','副主任医师','主治医师','住院医师','专家团队','AI分身']),f('teachingTitle','教学职称'),req('diseases','擅长疾病','textarea'),textArea('skills','擅长技术'),
    textArea('bio','医生简介'),f('location','出诊地点'),req('registration','是否支持挂号','radio',yesNo),req('online','是否支持在线问诊','radio',yesNo),req('insurance','是否支持医保','radio',yesNo),
    f('slots','近期号源','number'),f('tags','医生标签','multiselect',['消化专家','心血管专家','干眼门诊','医保','线上问诊']),f('weight','推荐权重','number'),req('audit','审核状态','select',['待审核','已通过','已驳回']),req('status','启用状态','select',enabled)],
  slots:[req('doctor','医生','select',['程春生','龚伟','张筱茵','王建安']),req('hospital','医院','select',hospitals),req('department','科室','select',departments),req('date','出诊日期','date'),
    req('period','出诊时段','select',['上午','下午','晚上']),req('type','号源类型','select',['普通号','专家号','特需号','线上问诊']),req('total','总号数','number'),req('remaining','剩余号数','number'),
    req('fee','挂号费','number'),f('releaseTime','放号时间','datetime-local'),f('deadline','截止时间','datetime-local'),f('link','预约链接'),req('status','状态','select',['可预约','已满','已下架','暂停预约'])],
  agents:[req('name','智能体名称'),req('doctor','绑定医生','select',['王建安','程春生','龚伟','张筱茵']),f('hospital','医院','select',hospitals),req('department','科室','select',departments),f('avatar','头像','file'),
    textArea('bio','医生简介'),req('specialty','专科领域'),req('answerScope','可回答范围','textarea'),req('rejectScope','不可回答范围','textarea'),textArea('welcome','欢迎语'),req('systemPrompt','系统 Prompt','textarea'),
    req('knowledge','绑定知识库','multiselect',['心血管指南库','消化疾病库','眼科知识库','药品说明书库']),f('tools','工具权限','multiselect',['健康档案检索','医生推荐','挂号服务','药品查询','报告解读']),
    f('emergencyRules','绑定急症规则','multiselect',['胸痛急症规则','高血压急症规则']),req('citation','引用展示方式','select',['不展示','仅标题','标题+来源','标题+原文片段']),textArea('disclaimer','免责声明'),req('status','上线状态','select',['草稿','灰度','上线','下线'])],
  'drug-kb':[req('name','通用名'),f('tradeName','商品名'),f('brand','品牌'),req('category','药品分类'),req('spec','规格'),req('form','剂型','select',['片剂','胶囊','滴眼液','口服液','注射剂']),
    req('rx','处方属性','select',['处方药','非处方药','双跨药','禁售药']),textArea('indication','适应症'),textArea('dosage','用法用量'),textArea('contraindication','禁忌'),textArea('adverse','不良反应'),
    textArea('caution','注意事项'),textArea('interaction','药物相互作用'),f('storage','贮藏方式'),f('manualSource','说明书来源'),req('audit','审核状态','select',['待审核','已通过','已驳回'])],
  'medicine-box':[req('user','用户','select',users),req('subject','档案主体','select',subjects),req('name','药品名称','select',['思然 聚乙二醇滴眼液','滋润 环孢素滴眼液II','泌特 复方阿嗪米特肠溶片','贝飞达 双歧杆菌']),
    req('category','药品分类','select',['眼科用药','消化用药','微生态制剂','心血管用药']),req('quantity','数量','number'),f('expiry','有效期','date'),req('status','当前状态','select',['正在用','备用','已停用','待确认']),
    req('source','来源','select',['手动添加','拍照识别','处方同步','后台添加']),f('prescription','是否关联处方','radio',yesNo),textArea('remark','备注')],
  'med-plans':[req('user','用户','select',users),req('subject','档案主体','select',subjects),req('name','药品名称','select',['思然 聚乙二醇滴眼液','滋润 环孢素滴眼液II','泌特 复方阿嗪米特肠溶片','贝飞达 双歧杆菌']),
    req('frequency','用药频率','select',['每天','隔天','每周','按需']),f('dailyCount','每日次数','number'),req('reminder','提醒时间',undefined,undefined,'08:00、12:00、18:00'),f('dose','每次剂量'),
    f('period','饭前/饭后','select',['饭前','饭后','睡前','无要求','待确认']),req('startDate','开始日期','date'),f('endDate','结束日期','date'),req('status','计划状态','select',['未开始','进行中','暂停','已结束']),
    req('reminderStatus','提醒状态','radio',['开启','关闭']),textArea('remark','备注')],
  rules:[req('name','规则名称'),req('type','规则类型','select',['急症规则','用药安全规则','入档规则','报告解读规则','主体识别规则','医生推荐规则']),req('trigger','触发条件','textarea'),
    textArea('exclude','排除条件'),req('risk','风险等级','select',['普通','中风险','高风险','急诊']),req('action','推荐动作','textarea'),req('template','回复模板','textarea'),
    req('manualReview','是否需要人工复核','radio',yesNo),req('priority','优先级','number'),req('status','是否启用','radio',enabled),textArea('remark','备注')],
  models:[req('name','模型名称'),req('type','模型类型','select',['对话模型','OCR模型','Embedding模型','Rerank模型','分类模型']),req('provider','供应商','select',['OpenAI','阿里云','腾讯云','自研']),
    f('api','API地址'),req('scene','使用场景','multiselect',['AI问诊','报告解读','OCR识别','知识检索','急症风控']),f('context','上下文长度','number'),f('temperature','温度','number'),f('timeout','超时时间','number'),
    f('retry','重试次数','number'),f('cost','单次成本','number'),req('status','状态','select',enabled),textArea('remark','备注')],
  prompts:[req('name','Prompt 名称'),req('scene','适用场景','select',['AI问诊','报告解读','急症风控','用药安全','智能导诊','医生摘要','医生智能体']),req('version','版本号'),
    req('systemPrompt','系统提示词','textarea'),textArea('userTemplate','用户模板'),f('variables','输入变量'),f('format','输出格式','select',['JSON','Markdown','纯文本']),textArea('forbidden','禁止事项'),
    textArea('exampleQuestion','示例问题'),textArea('exampleAnswer','示例答案'),req('status','状态','select',['草稿','已发布','已停用']),textArea('versionNote','版本说明')],
  tools:[req('name','工具名称'),req('type','工具类型','select',['健康档案检索','报告检索','医生搜索','号源查询','药品查询','知识库检索','入档接口']),req('scene','适用场景'),
    f('api','接口地址'),textArea('request','请求参数说明'),textArea('response','返回字段说明'),f('permission','权限要求'),f('timeout','超时时间','number'),f('failure','失败策略','select',['重试','降级','转人工','终止']),
    f('log','是否记录调用日志','radio',yesNo),req('status','状态','select',enabled)],
  archive:[req('user','用户','select',users),req('subject','档案主体','select',subjects),req('sourceSession','来源会话'),req('name','识别内容','textarea'),req('type','推荐入档类型','select',['症状记录','诊断记录','用药记录','病历摘要','检查报告']),
    f('confidence','置信度','number'),req('test','是否测试','radio',yesNo),req('proxy','是否代问','radio',yesNo),req('targetSubject','建议入档主体','select',subjects),req('status','入档状态','select',['待确认','已入档','已拒绝','已取消']),textArea('remark','备注')],
  corrections:[req('user','用户','select',users),req('object','纠错对象','select',['报告字段','AI回答','诊断记录','症状记录','用药记录','主体归属']),req('original','原错误内容','textarea',undefined,'角膜荧光素染色：双眼阳性'),
    req('correct','正确内容','textarea',undefined,'报告原文仅写 OU，未标注阳性/阴性'),req('type','纠错类型','select',['OCR错误','医学误读','主体错误','报告字段错误','AI推断过度']),f('evidence','证据截图','file'),
    req('status','处理状态','select',['待处理','处理中','已修正','已驳回']),f('handler','处理人'),textArea('opinion','处理意见'),f('syncRules','是否同步规则库','radio',yesNo),textArea('remark','备注')],
  requests:[req('user','用户','select',users),req('dataType','数据类型','select',['报告','病历','症状','诊断','用药','AI对话']),req('current','当前主体','select',subjects),f('target','目标主体','select',subjects),
    req('requestType','申请类型','select',['删除','迁移','隐藏','恢复']),req('reason','申请原因','select',['误入本人档案','家人错档','测试数据','重复记录','用户要求删除']),f('objectId','关联对象ID'),
    req('status','处理状态','select',['待处理','处理中','已通过','已驳回']),f('handler','处理人'),textArea('opinion','处理意见')],
  feedback:[req('user','用户','select',users),req('type','反馈类型','select',['AI回答错误','报告解读错误','档案错归属','挂号推荐不准','药箱问题','其他']),req('name','反馈内容','textarea'),
    req('module','关联模块','select',['AI问诊','报告解读','健康档案','医生推荐','用户药箱']),f('objectId','关联对象ID'),req('priority','优先级','select',['普通','较高','紧急']),
    req('status','处理状态','select',['待处理','处理中','已回复','已关闭']),f('handler','处理人'),textArea('result','处理结果')],
  reviews:[req('type','任务类型','select',['医学审核','报告复核','AI质检','资质审核']),req('module','来源模块','select',['AI问诊','报告解读','医生管理','用户反馈']),req('objectId','关联对象ID'),
    req('risk','风险等级','select',['普通','中风险','高风险']),req('name','审核内容','textarea'),req('owner','负责人','select',['王医生','李运营','赵质检']),f('deadline','SLA截止时间','datetime-local'),
    req('status','处理状态','select',['待领取','处理中','已通过','已驳回']),textArea('conclusion','审核结论'),textArea('remark','备注')],
  permissions:[req('name','姓名'),req('phone','手机号'),f('email','邮箱'),req('role','角色','select',['超级管理员','医学运营管理员','医学审核员','AI质检员','客服','只读账号']),
    f('department','所属部门'),f('menuPermission','菜单权限','multiselect',['用户与档案','医疗数据','AI服务','医疗资源','系统管理']),f('buttonPermission','按钮权限','multiselect',['查看','新增','编辑','删除','审核']),
    f('dataScope','数据权限','select',['全部数据','所属部门','本人数据']),req('status','状态','select',enabled)],
  privacy:[req('user','用户','select',users),req('type','授权类型','select',['健康档案读取','报告读取','药箱读取','家人档案读取','AI个性化分析']),req('scope','授权范围'),
    req('status','授权状态','select',['已授权','部分授权','已撤回','已过期']),f('authTime','授权时间','datetime-local'),f('withdraw','撤回时间','datetime-local'),textArea('remark','备注')],
  settings:[req('name','开关名称'),req('module','所属模块','select',['入档治理','用户药箱','报告解读','家庭档案','AI问诊']),textArea('description','开关说明'),
    req('defaultState','默认状态','radio',['开启','关闭']),f('gray','灰度范围'),req('status','是否启用','radio',enabled),textArea('remark','备注')]
}

// Less central operational pages still have their own domain-specific forms.
formSchemas['doctor-rules']=[req('name','规则名称'),req('department','适用科室','select',departments),f('regionWeight','地区权重','number'),f('distance','距离权重','number'),f('level','医院等级权重','number'),f('slotWeight','号源权重','number'),f('titleWeight','职称权重','number'),f('insuranceWeight','医保权重','number'),req('status','是否启用','radio',enabled)]
formSchemas['medical-kb']=[req('name','疾病名称'),f('alias','别名'),req('department','所属科室','select',departments),req('category','疾病分类'),textArea('symptoms','常见症状'),textArea('danger','危险症状'),textArea('exams','常见检查'),textArea('treatment','治疗原则'),textArea('advice','就医建议'),textArea('emergency','急诊条件'),f('source','参考来源'),req('status','审核状态','select',['待审核','已通过','已驳回'])]
formSchemas.content=[req('name','内容标题'),req('type','内容类型','select',['专题','科普卡','指南','活动']),req('channel','投放渠道','multiselect',['支付宝首页','问诊会话','报告页','服务大厅']),textArea('summary','内容摘要'),f('publishAt','发布时间','datetime-local'),req('status','状态','select',['草稿','已发布','已下线'])]
formSchemas.messages=[req('name','消息模板名称'),req('type','消息类型','select',['用药提醒','复诊提醒','服务通知','系统通知']),req('channel','发送渠道','multiselect',['支付宝消息','短信','站内信']),req('template','消息模板','textarea'),f('sendAt','发送时间','datetime-local'),req('status','状态','select',enabled)]

const prefixes:Record<string,string>={users:'U',family:'FAM-',health:'HEA-',records:'MR-',reports:'RP-',diagnoses:'DG-',symptoms:'SYM-',consults:'AI-',doctors:'DOC-',rules:'RULE-',agents:'AGT-',slots:'SLOT-'}
export function createRecordFor(key:string,values:RowData,rows:RowData[]):RowData{
  const now=new Date(),stamp=`${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}`
  const seq=String(rows.length+21).padStart(3,'0')
  let prefix=prefixes[key]??`${key.slice(0,3).toUpperCase()}-`
  let id=`${prefix}${10020+rows.length+1}`
  if(['records','reports','consults'].includes(key))id=`${prefix}${stamp}${seq}`
  if(key==='rules'){const map:Record<string,string>={'急症规则':'EMG','用药安全规则':'MED','入档规则':'ARCH','报告解读规则':'RPT'};id=`RULE-${map[String(values.type)]??'GEN'}-${seq}`}
  const birthday=String(values.birthday??values.birthDate??'')
  const age=birthday?Math.max(0,now.getFullYear()-Number(birthday.slice(0,4))-(now.toISOString().slice(5,10)<birthday.slice(5,10)?1:0)):'—'
  const base:RowData={id,name:String(values.name??values.title??values.type??'新建记录'),status:String(values.status??'待审核'),updatedAt:`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`}
  if(key==='health')Object.assign(base,{age,reports:0,records:0,diagnoses:0,medicines:0})
  if(key==='family'){
    const n=rows.length+21
    Object.assign(base,{id:`FM${10020+rows.length+1}`,memberId:`FM${10020+rows.length+1}`,subjectId:`HS${10020+rows.length+1}`,familyRelationId:`FR${10020+rows.length+1}`,consentId:`CONSENT${10020+rows.length+1}`,age,archiveCompleteness:'20%',lastArchiveTime:'尚未入档',businessStatus:'待确认',status:'待确认',auditLog:`AUDIT-FAM-${n}`})
  }
  if(key==='users')Object.assign(base,{subjects:1,consults:0,reports:0,medicineCount:0,familyCount:0})
  if(key==='family'){
    const userText=String(values.user??'')
    const [userName='',userId='',userPhone='']=userText.split(' / ')
    return {...base,...values,id:base.id,memberId:base.memberId,subjectId:base.subjectId,familyRelationId:base.familyRelationId,consentId:base.consentId,auditLog:base.auditLog,
      name:String(values.name),memberName:String(values.name),userName,userId,userPhone,age,genderAge:`${values.gender} / ${age}岁`,businessStatus:'待确认',status:'待确认',updatedAt:base.updatedAt}
  }
  return {...base,...values,id,age:values.birthday?age:values.age??base.age}
}
