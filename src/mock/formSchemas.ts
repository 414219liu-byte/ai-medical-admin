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
  health:[req('user','归属用户','select',['刘志辉 / U10021','陈雨桐 / U10022','周铭轩 / U10023','林婉清 / U10024']),req('subjectName','健康主体','select',['刘志辉 / HS10021','测试父亲 / HS10022','刘小朋友 / HS10023','新建健康主体']),
    f('memberId','家庭成员','select',['FM10021 / 刘志辉 / 本人','FM10022 / 测试父亲 / 父亲','FM10023 / 刘小朋友 / 女儿','无']),
    req('source','档案来源','select',['用户手动创建','医院同步','家庭成员共享','AI对话生成','后台管理员创建']),
    f('baseDiseaseTags','基础病标签','multiselect',['干眼症','睑板腺功能障碍','慢性胃炎','胆汁反流','高血压','糖尿病','冠心病','无']),
    f('allergySummary','过敏史','multiselect',['无','青霉素','头孢','磺胺类','食物过敏','待确认']),
    req('aiReadStatus','是否允许AI读取','select',['已授权可读取','部分可读取','未授权','仅本次授权','限定范围授权']),
    f('aiReadScope','AI读取范围','multiselect',['基础信息','基础病与过敏史','检查报告','病历记录','诊断记录','用药记录','家族史','生活习惯']),
    textArea('remark','备注'),req('operationReason','操作原因','textarea')],
  records:[
    req('source','病历来源','select',['用户上传','医院同步','在线授权拉取','后台补录','旧系统迁移']),
    {...req('user','归属用户','select',users),showWhen:{key:'source',values:['用户上传','医院同步','后台补录','旧系统迁移']}},
    {...req('subject','健康主体','select',subjects),showWhen:{key:'source',values:['用户上传','医院同步','后台补录','旧系统迁移']}},
    {...req('hospital','医院','select',hospitals),showWhen:{key:'source',values:['用户上传','医院同步','后台补录','旧系统迁移']}},
    {...req('department','科室','select',departments),showWhen:{key:'source',values:['用户上传','医院同步','后台补录','旧系统迁移']}},
    {...req('visitDate','就诊时间','datetime-local'),showWhen:{key:'source',values:['用户上传','医院同步','后台补录','旧系统迁移']}},
    {...f('attachment','病历附件上传','file'),showWhen:{key:'source',values:['用户上传','后台补录','旧系统迁移']}},
    {...req('startOcr','是否启动OCR','select',['是','否']),showWhen:{key:'source',values:['用户上传']}},
    {...req('autoStructure','是否自动结构化','select',['是','否']),showWhen:{key:'source',values:['用户上传']}},
    {...req('allowAiSearch','是否允许AI检索','select',['是','否']),showWhen:{key:'source',values:['用户上传','后台补录']}},
    {...textArea('remark','备注'),showWhen:{key:'source',values:['用户上传','旧系统迁移']}},
    {...req('hospitalRecordNo','医院病历号'),showWhen:{key:'source',values:['医院同步']}},
    {...req('syncChannel','同步渠道','select',['医院HIS接口','区域医疗平台','院内数据中台']),showWhen:{key:'source',values:['医院同步']}},
    {...req('syncTime','同步时间','datetime-local'),showWhen:{key:'source',values:['医院同步']}},
    {...req('apiStatus','接口返回状态','select',['200 成功','部分成功','接口失败']),showWhen:{key:'source',values:['医院同步']},hint:'医院同步的原始数据为只读，修改需发起纠错流程。'},
    {...req('consentId','授权编号'),showWhen:{key:'source',values:['在线授权拉取']}},
    {...req('authorizedUser','授权用户','select',users),showWhen:{key:'source',values:['在线授权拉取']}},
    {...req('pullInstitution','拉取机构','select',hospitals),showWhen:{key:'source',values:['在线授权拉取']}},
    {...req('pullRange','拉取时间范围','select',['近3个月','近6个月','近12个月','自定义']),showWhen:{key:'source',values:['在线授权拉取']}},
    {...req('pullStatus','拉取状态','select',['待拉取','拉取中','成功','部分成功','失败']),showWhen:{key:'source',values:['在线授权拉取']}},
    {...f('pullCount','拉取到的病历数量','number'),showWhen:{key:'source',values:['在线授权拉取']}},
    {...req('complaint','主诉','textarea'),showWhen:{key:'source',values:['后台补录']}},
    {...textArea('history','现病史'),showWhen:{key:'source',values:['后台补录']}},
    {...textArea('pastHistory','既往史'),showWhen:{key:'source',values:['后台补录']}},
    {...textArea('physical','体格检查'),showWhen:{key:'source',values:['后台补录']}},
    {...textArea('auxiliary','辅助检查'),showWhen:{key:'source',values:['后台补录']}},
    {...req('name','医生诊断','textarea'),showWhen:{key:'source',values:['后台补录']}},
    {...textArea('advice','处理意见'),showWhen:{key:'source',values:['后台补录']}},
    {...f('doctor','医生姓名'),showWhen:{key:'source',values:['后台补录']}},
    {...req('supplementReason','补录原因','textarea'),showWhen:{key:'source',values:['后台补录']}},
    {...req('operator','操作人'),showWhen:{key:'source',values:['后台补录']}},
    {...req('needReview','是否需要医学复核','select',['是','否']),showWhen:{key:'source',values:['后台补录']}}
  ],
  reports:[req('userId','用户ID'),req('userName','用户姓名'),req('subjectId','健康主体ID'),req('subjectName','主体姓名'),req('relation','成员关系','select',['本人','父亲','母亲','配偶','儿子','女儿']),req('archiveId','健康档案ID'),
    req('name','报告名称'),req('reportType','报告类型','select',['眼科检查','内镜检查','检验报告','影像报告','功能检查','皮肤检查','体检报告']),req('hospital','医院','select',hospitals),req('department','科室','select',departments),req('examDate','检查日期','date'),
    req('source','报告来源','select',['用户上传','拍照上传','相册上传','文件上传','医院同步','在线查报告','体检机构接口','后台补录','旧系统迁移']),req('uploadMethod','上传方式','select',['拍照','相册','文件','在线拉取','接口同步','后台导入']),req('attachment','报告文件','file'),
    req('ocrStatus','OCR状态','select',['不适用','待识别','识别中','已完成','识别失败','人工修正']),req('structuredStatus','结构化状态','select',['待结构化','结构化中','已结构化','结构化失败','待人工复核']),
    req('aiStatus','AI解读状态','select',['待解读','解读中','已解读','解读失败','待重新解读']),req('reviewStatus','医学复核状态','select',['不需要复核','待复核','复核中','复核通过','复核驳回']),
    req('archiveStatus','入档状态','select',['未入档','待入档','已入档','入档失败','入档冲突待确认']),req('riskLevel','风险等级','select',['无明显异常','普通','低风险','中风险','高风险','紧急风险']),textArea('abnormal','异常摘要'),textArea('remark','备注')],
  diagnoses:[req('source','诊断来源','select',['医生诊断','病历提取','报告提取','AI初筛','用户自填','后台补录']),req('userId','用户ID'),req('userName','用户姓名'),req('subjectId','健康主体ID'),req('subjectName','主体姓名'),req('relation','成员关系','select',['本人','父亲','母亲','配偶','儿子','女儿']),req('archiveId','健康档案ID'),
    req('diagnosisName','诊断名称'),req('diagnosisConclusion','判断结论','select',['明确','可能','疑似','倾向','排除','自述既往诊断']),req('sourceId','来源单据ID'),req('department','关联科室','select',departments),
    req('confirmationStatus','确认状态','select',['AI初筛','待医生确认','医生确认','用户确认','已排除']),req('currentStatus','当前状态','select',['现患','已缓解','待复查','已排除','长期管理']),req('riskLevel','风险等级','select',['低风险','中风险','高风险','紧急风险']),
    {...req('recordId','来源病历ID'),showWhen:{key:'source',values:['医生诊断']}},{...req('doctor','医生姓名'),showWhen:{key:'source',values:['医生诊断']}},{...req('hospital','医院','select',hospitals),showWhen:{key:'source',values:['医生诊断']}},{...req('visitDate','就诊时间','datetime-local'),showWhen:{key:'source',values:['医生诊断']}},
    req('aiContext','是否纳入AI上下文','select',['纳入','限制纳入','不纳入','待确认']),req('archiveStatus','是否入档','select',['未入档','待入档','已入档','入档冲突','待人工复核']),textArea('remark','备注')],
  symptoms:[req('sourceType','来源类型','select',['AI诊室','用户手动记录','医生病历提取','报告解读提取','AI拍肤/图像问诊','后台补录']),req('userId','用户ID'),req('userName','用户姓名'),req('subjectId','健康主体ID'),req('subjectName','主体姓名'),req('relation','成员关系','select',['本人','父亲','母亲','配偶','儿子','女儿']),f('sourceSessionId','来源会话ID'),
    req('chiefComplaint','主诉','textarea'),req('symptomName','症状名称'),f('bodyPart','症状部位'),f('nature','症状性质'),f('onsetTime','起病时间'),f('duration','持续时间'),f('trigger','诱因'),f('aggravating','加重因素'),f('relieving','缓解因素'),req('severity','严重程度','select',['轻','中','重','急症']),f('companions','伴随症状'),
    req('redFlag','红旗症状','select',['是','否','待排查']),f('completeness','信息完整度'),f('diagnosisId','关联诊断ID'),req('archiveStatus','入档状态','select',['未入档','待入档','已入档','待人工复核','待确认']),textArea('remark','备注')],
  consults:[req('userId','用户ID'),req('userName','用户姓名'),req('subjectId','健康主体ID'),req('subjectName','主体姓名'),req('relation','成员关系','select',['本人','父亲','母亲','配偶','儿子','女儿']),req('consultType','问诊类型','select',['健康咨询','AI诊室','智能导诊','报告追问','用药咨询','图像问诊']),req('consultMode','问诊模式','select',['自由对话','结构化追问','多模态问诊','导诊问答','报告上下文问答']),req('inputType','输入类型','select',['文本','图片','语音','图文混合']),req('chiefComplaint','主诉','textarea'),f('currentSymptoms','当前症状'),f('progress','问诊进度'),f('rounds','追问轮次','number'),req('consultStatus','问诊状态','select',['问诊中','待用户补充','信息已足够','已生成结论','已回复','已中断','已转人工','已触发风险']),req('riskLevel','风险等级','select',['低风险','中风险','高风险','紧急风险']),f('rule','命中规则'),f('department','推荐科室'),req('modelName','模型名称','select',['deepseek-chat','MedGPT-4.1','multimodal-medical-vision']),req('promptVersion','Prompt版本'),req('archiveStatus','入档状态','select',['否','未入档','待入档','已入档','待人工复核'])],
  camera:[req('userId','用户ID'),req('userName','用户姓名'),req('subjectId','健康主体ID'),req('subjectName','主体姓名'),req('relation','成员关系','select',['本人','父亲','母亲','配偶','儿子','女儿']),req('captureType','拍摄类型','select',['皮肤患处','肌肤状态','舌苔','脱发','药盒','报告']),req('scene','拍摄场景','select',['普通拍摄','私密拍','无痕模式','自然光拍摄','相册上传']),req('traceless','是否无痕模式','radio',yesNo),req('qualityStatus','图像质量状态','select',['待检测','合格','光线不足','图像模糊','目标不完整','距离过近','距离过远','需重新拍摄']),req('privacyStatus','隐私脱敏状态','select',['不需要脱敏','待脱敏','已脱敏','脱敏失败','无痕模式不留存']),req('aiStatus','AI分析状态','select',['待分析','分析中','已完成','分析失败','待人工复核']),f('image','任务图片','file'),textArea('remark','备注')],
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
  agents:[req('name','智能体名称'),req('agentType','智能体类型','select',['医生AI分身','科室AI助手','专病管理助手','复诊随访助手','导诊辅助助手']),req('doctor','绑定医生','select',['王建安','程春生','龚伟','张筱茵','不适用']),f('doctorId','医生ID'),f('licenseNo','医生执业证号'),req('authStatus','医生授权状态','select',['已授权','授权待确认','授权已过期','未授权','不适用']),f('authEnd','授权有效期','date'),f('hospital','医院','select',hospitals),req('department','科室','select',departments),f('avatar','头像','file'),
    textArea('bio','医生简介'),textArea('welcome','欢迎语'),req('disclaimer','免责声明','textarea'),req('modelName','模型名称','select',['MedGPT','deepseek-chat']),req('modelVersion','模型版本'),req('promptTemplate','Prompt模板','select',['心血管医生分身模板','消化科问答模板','眼科专病管理模板','慢病随访模板','急症导诊模板']),req('promptVersion','Prompt版本'),textArea('promptSummary','Prompt摘要'),f('temperature','温度参数','number'),f('maxTokens','最大输出长度','number'),req('citationEnabled','开启引用来源','select',['是','否']),req('citation','引用展示方式','select',['不展示','仅标题','标题+来源','标题+原文片段']),
    req('specialty','专科领域'),req('answerScope','可回答范围','textarea'),req('rejectScope','不可回答范围','textarea'),req('forbiddenScope','禁止回答范围','textarea'),textArea('crossDeptTemplate','跨科回复模板'),f('referralDepartments','转诊科室','multiselect',departments),req('highRiskPolicy','高风险问题处理策略','textarea'),
    req('medicationAdvice','允许用药建议','select',['否','仅说明书信息','需医生审核']),req('reportExplain','允许解释报告','select',['是','否','仅查看摘要']),req('healthRead','允许读取健康档案','select',['是，需用户授权','否']),req('doctorRecommend','允许推荐医生','select',['是','否']),req('registrationGuide','允许挂号引导','select',['是，需用户确认','否']),
    req('reviewStatus','审核状态','select',['草稿','待医学审核','待合规审核','审核通过','审核驳回','待重新测试']),req('publishStatus','发布状态','select',['未上线','测试中','灰度上线','正式上线','已下线','已冻结']),f('grayScope','灰度范围'),f('onlineAt','上线时间','datetime-local'),f('offlineAt','下线时间','datetime-local'),f('rollbackVersion','回滚版本'),req('onlineReason','上线原因','textarea'),f('reviewer','审核人'),req('operationReason','操作原因','textarea')],
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

formSchemas['ai-clinic/sessions']=[req('userId','用户ID'),req('userName','账号姓名'),req('patientId','问诊人ID'),req('patientName','问诊人姓名'),req('relation','关系','select',['本人','父亲','母亲','女儿','儿子','配偶']),req('age','年龄','number'),req('gender','性别','radio',['男','女','未知']),req('chiefComplaint','原始主诉','textarea'),req('normalizedSymptoms','标准化症状'),req('templateId','当前模板','select',['TMP001 腹痛问诊模板','TMP002 眼睛干涩问诊模板','TMP003 胸痛问诊模板','TMP004 儿童发热问诊模板','TMP005 下肢肿胀问诊模板','TMP006 呕血问诊模板','未匹配问诊模板']),req('riskLevel','风险等级','select',['普通风险','关注风险','建议尽快就医','高风险','120急救','心理危机','非医疗']),req('status','会话状态','select',['问诊中','已生成自动结论','高风险中断','非医疗退出','心理危机暂停','图片识别失败','120中断']),req('conclusionType','结论类型','select',['未生成','自动结论','直接结论','安全提示','无结论']),req('rounds','问诊轮次','number'),req('multisymptom','是否多症状','radio',yesNo),req('hasUpload','是否上传资料','radio',yesNo),textArea('conclusion','结论摘要',true)]
formSchemas['ai-clinic/templates']=[req('name','模板名称'),req('department','所属科室','select',['消化内科','眼科','心内科/急诊','儿科','血管外科/心内科','消化内科/急诊']),req('system','所属系统','select',['消化系统','眼部','循环系统','感染/儿科']),req('audience','适用人群','select',['成人','儿童','全年龄']),req('slotCount','槽位数量','number'),req('coreSlotCount','核心槽位数量','number'),req('autoConclusionScore','自动结论阈值'),req('bodyMap','身体部位图','select',['成人腹部图','双眼症状选择图','胸部图','儿童全身图','下肢示意图','无']),req('directConclusion','直接结论','select',['支持','限制使用','不支持']),req('version','当前版本'),req('status','模板状态','select',['草稿','已启用','灰度中','已停用']),req('operationReason','配置原因','textarea')]
formSchemas['ai-clinic/slots']=[req('name','槽位名称'),req('code','槽位编码'),req('templateId','所属模板','select',['TMP001 腹痛问诊模板']),req('category','业务分类','select',['主诉','症状特征','时间','诱因','缓解','伴随症状','安全筛查','既往史','用药','资料']),req('component','展示组件','select',['文本确认','身体部位图','快捷选项','量表','多选','风险确认','报告上传']),req('question','默认提问文案','textarea'),f('quickOptionGroup','快捷选项组','select',['OPTG001 腹痛持续时间','OPTG002 腹痛疼痛性质','无']),req('requiredText','是否必填','radio',yesNo),req('coreText','是否核心','radio',yesNo),req('weight','权重','number'),req('noAllowed','是否允许“没有”','radio',yesNo),req('noCountsText','“没有”是否算完成','radio',yesNo),req('allowUnknownText','是否允许“不清楚”','radio',yesNo),f('unknownCoefficient','“不清楚”的信息系数','number'),req('aiInfer','是否允许AI推断','radio',yesNo),f('aiInferCoefficient','AI推断信息系数','number'),req('needConfirmText','是否需要用户确认','radio',yesNo),textArea('precondition','前置条件'),textArea('skipCondition','跳过条件'),req('maxAsk','最大追问次数','number'),req('status','状态','select',['已启用','已停用'])]
formSchemas['ai-clinic/risk-rules']=[req('name','规则名称'),req('symptom','所属症状','select',['胸痛','呕血','眼痛','发热','心理危机','腹痛']),req('triggerMode','触发方式','select',['关键词','语义','组合条件','模型判断']),req('keywords','关键词'),textArea('trigger','组合条件',true),textArea('exclude','排除条件'),req('negation','否定识别','radio',['支持','不支持']),req('timeState','当前或历史状态','select',['仅当前','当前或历史均提示','历史症状安全筛查']),req('objectCondition','对象条件','select',['本人','第三方也触发','仅问诊人']),f('ageCondition','年龄条件'),req('riskLevel','风险等级','select',['建议关注','建议尽快就医','立即急诊','呼叫120','心理危机']),req('interrupt','是否强制中断','radio',yesNo),req('allowContinue','是否允许继续问诊','radio',yesNo),req('alertTitle','提示标题'),req('alertBody','提示正文','textarea'),req('buttons','操作按钮','multiselect',['呼叫120','查看急诊提示','继续补充','联系人工']),req('entry','推荐科室'),req('priority','优先级','number'),req('status','状态','select',['已启用','已停用','草稿'])]
formSchemas['ai-clinic/template-rules']=[req('name','规则名称'),req('examples','用户表达示例','textarea'),req('method','匹配方式','select',['关键词+语义','语义匹配','风险语义','精确词+语义']),req('target','目标模板','select',['腹痛问诊模板','眼睛干涩问诊模板','胸痛问诊模板','呕血问诊模板']),req('confidence','最低置信度','number'),req('priority','优先级','number'),req('negation','否定识别','radio',['支持','不支持']),req('thirdParty','第三方识别','radio',['支持','不支持']),textArea('exclude','排除条件'),req('status','状态','select',['已启用','已停用','草稿'])]
formSchemas['ai-clinic/body-maps']=[req('name','图片名称'),req('type','图片类型','select',['腹部局部图','眼部局部图','胸部局部图','下肢局部图']),req('template','适用模板','select',['腹痛问诊模板','眼睛干涩模板','胸痛模板','儿童腹痛模板']),req('regions','热区数量'),req('age','适用年龄','select',['成人','儿童','全年龄']),req('gender','适用性别','select',['通用','男','女']),req('multi','是否支持多选','radio',yesNo),req('version','图片版本'),req('status','状态','select',['已启用','已停用','草稿']),textArea('hotRegionConfig','热区配置说明',true)]
formSchemas['ai-clinic/quick-options']=[req('name','选项组名称'),req('template','所属模板','select',['腹痛模板','眼睛干涩模板','胸痛模板']),req('slot','绑定槽位'),req('selectType','单选/多选','select',['单选','多选']),req('count','选项数量'),req('unknown','是否包含“不清楚”','radio',yesNo),req('options','选项明细','textarea'),req('status','状态','select',['已启用','已停用','草稿'])]
formSchemas['ai-clinic/flows']=[req('name','节点名称'),req('type','节点类型','select',['主诉确认','部位图','快捷选项','安全判断','结论','资料上传']),req('slot','绑定槽位'),textArea('question','问题文案',true),textArea('precondition','前置条件'),textArea('skip','跳过条件'),req('next','默认下一节点'),req('branches','分支数量','number'),textArea('riskAction','风险动作'),req('status','状态','select',['已启用','已停用','草稿'])]
formSchemas['ai-clinic/route-rules']=[req('name','规则名称'),req('examples','用户输入示例','textarea'),req('scene','当前场景'),req('action','目标动作'),req('target','目标功能'),req('endClinic','是否结束诊室','radio',yesNo),req('priority','优先级','number'),req('status','状态','select',['已启用','已停用','草稿'])]
formSchemas['ai-clinic/multi-symptom-rules']=[req('name','规则名称'),req('scene','识别场景','textarea'),req('strategy','处理策略','select',['高风险症状优先','用户选择主症状','合并进入模板','拆分问诊主题']),req('prioritySymptom','优先症状'),req('other','其他症状处理','textarea'),req('combined','是否生成综合结论','radio',yesNo),req('status','状态','select',['已启用','已停用','草稿'])]
formSchemas['ai-clinic/direct-conclusion-rules']=[req('template','所属模板','select',['腹痛模板','眼睛干涩模板','胸痛模板','呕血模板']),req('buttonScore','按钮显示分数'),req('minScore','最低生成分数'),req('autoScore','自动结论分数'),req('riskRequired','是否必须完成风险筛查','radio',yesNo),req('lowScoreAction','低分处理','textarea'),req('status','状态','select',['已启用','已停用','草稿'])]
formSchemas['ai-clinic/conclusion-templates']=[req('name','结论模板名称'),req('template','适用问诊模板','select',['腹痛问诊模板','眼睛干涩问诊模板','胸痛问诊模板','儿童发热问诊模板','呕血问诊模板']),req('summary','包含病情摘要','radio',yesNo),req('directions','包含可能方向','radio',yesNo),req('department','包含科室推荐','radio',yesNo),req('emergency','包含急症提示','radio',yesNo),req('modules','结论模块','multiselect',['本次病情摘要','已收集症状信息','当前风险等级','可能相关方向','建议就医时机','推荐科室','建议检查','日常护理建议','立即就医情况','信息不足说明','参考资料','免责声明']),req('version','当前版本'),req('status','状态','select',['已启用','已停用','草稿'])]
formSchemas['ai-clinic/report-rules']=[req('type','资料类型','select',['检查报告','检验报告','处方和药盒','非医疗图片']),req('formats','支持格式','multiselect',['JPG','PNG','PDF']),req('content','识别内容','textarea'),req('writeSlot','是否写入槽位','radio',yesNo),req('needConfirm','是否需要用户确认','radio',yesNo),req('nonMedical','非医疗内容处理','textarea'),req('status','状态','select',['已启用','已停用','草稿'])]
formSchemas['ai-clinic/prompts']=[req('name','Prompt名称'),req('type','Prompt类型','select',['会话路由','模板路由','信息提取','安全判断','问诊追问','结论生成','内容质检']),req('systemPrompt','系统提示词','textarea'),req('variables','输入变量','textarea'),req('jsonSchema','输出JSON结构','textarea'),req('model','使用模型','select',['医疗语言模型A','医疗语言模型B','医疗安全模型']),f('temperature','温度','number'),f('maxTokens','最大Token','number'),f('timeout','超时时间','number'),f('retry','重试次数','number'),f('backupModel','备用模型'),req('version','当前版本'),req('status','发布状态','select',['草稿','已发布','已停用'])]
formSchemas['ai-clinic/knowledge']=[req('title','知识标题'),req('department','所属科室','select',['消化内科','眼科','心内科','儿科','急诊科']),req('symptom','关联症状'),req('type','资料类型','select',['临床规则','安全规则','健康科普','指南摘要']),req('sourceLevel','来源级别','select',['高','中','低']),req('source','资料来源'),req('summary','知识正文摘要','textarea'),req('templates','适用问诊模板','multiselect',['腹痛问诊模板','眼睛干涩问诊模板','胸痛问诊模板','儿童发热问诊模板','呕血问诊模板']),req('audit','审核状态','select',['待审核','审核通过','驳回']),req('valid','有效状态','select',['有效','失效'])]
formSchemas['ai-clinic/quality-tests']=[req('name','用例名称'),req('input','用户输入','textarea'),req('type','测试类型','select',['模板路由','会话路由','高风险','否定语义','多症状','多模态','槽位更新']),req('expectedTemplate','预期模板'),req('expectedRisk','预期风险'),req('expectedAction','预期动作','textarea'),req('actual','实际结果','textarea'),req('passed','是否通过','select',['通过','不通过','未执行']),req('promptVersion','关联Prompt版本'),req('templateVersion','关联模板版本')]
formSchemas['ai-clinic/releases']=[req('name','版本名称'),req('content','发布内容','textarea'),req('scope','发布范围'),req('gray','灰度比例'),req('status','发布状态','select',['待发布','灰度中','已发布','已回滚']),req('publisher','发布人'),f('publishedAt','发布时间','datetime-local'),req('diff','版本差异说明','textarea')]
formSchemas['ai-clinic/logs']=[req('operator','操作人'),req('module','操作模块'),req('type','操作类型'),req('content','操作内容','textarea'),req('object','修改对象'),req('result','操作结果','select',['成功','失败']),textArea('before','修改前内容'),textArea('after','修改后内容'),f('ip','操作IP'),f('role','人员角色')]

const prefixes:Record<string,string>={users:'U',family:'FAM-',health:'HEA-',records:'MR-',reports:'RP-',diagnoses:'DG-',symptoms:'SYM-',consults:'AI-',doctors:'DOC-',rules:'RULE-',agents:'AGT-',slots:'SLOT-',
  'ai-clinic/sessions':'AIC','ai-clinic/templates':'TMP','ai-clinic/slots':'SLOT-AIC-','ai-clinic/risk-rules':'RULE-EMG-','ai-clinic/quality-tests':'QT','ai-clinic/releases':'REL','ai-clinic/logs':'LOG-AIC-'}
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
  if(key==='health')Object.assign(base,{id:`HEA-${10020+rows.length+1}`,archiveId:`HEA-${10020+rows.length+1}`,subjectId:`HS${10020+rows.length+1}`,memberId:String(values.memberId??'').split(' / ')[0]||`FM${10020+rows.length+1}`,consentId:`CONSENT-HEA-${10020+rows.length+1}`,auditLog:`AUDIT-HEA-${10020+rows.length+1}`,age,reportCount:0,medicalRecordCount:0,diagnosisCount:0,medicationCount:0,archiveStatus:'待完善',status:'待完善',lastArchiveTime:'尚未入档'})
  if(key==='family'){
    const n=rows.length+21
    Object.assign(base,{id:`FM${10020+rows.length+1}`,memberId:`FM${10020+rows.length+1}`,subjectId:`HS${10020+rows.length+1}`,familyRelationId:`FR${10020+rows.length+1}`,consentId:`CONSENT${10020+rows.length+1}`,age,archiveCompleteness:'20%',lastArchiveTime:'尚未入档',businessStatus:'待确认',status:'待确认',auditLog:`AUDIT-FAM-${n}`})
  }
  if(key==='health'){
    const [userName='',userId='']=String(values.user??'').split(' / ')
    const subjectName=String(values.subjectName??'').split(' / ')[0]
    return {...base,...values,id:base.id,archiveId:base.archiveId,subjectId:base.subjectId,memberId:base.memberId,consentId:base.consentId,auditLog:base.auditLog,userName,userId,subjectName,name:`${subjectName}健康档案`,userDisplay:`${userName} / ${userId}`,archiveStatus:'待完善',status:'待完善',updatedAt:base.updatedAt}
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
