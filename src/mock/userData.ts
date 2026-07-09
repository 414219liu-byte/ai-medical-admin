import type { RowData } from '../types'

export interface UserProfile extends RowData {
  id:string; name:string; nickname:string; phone:string; gender:string; age:number; birthday:string; city:string
  source:string; registeredAt:string; lastLogin:string; subjects:number; consults:number; reports:number
  medicineCount:number; familyCount:number; status:string; risk:string; remark:string
}

export const userProfiles:UserProfile[]=[
  {id:'U10021',name:'刘志辉',nickname:'ZhiHui',phone:'138****6210',gender:'男',age:33,birthday:'1993-03-12',city:'深圳南山',source:'支付宝搜索',registeredAt:'2025-11-18 09:21',lastLogin:'2026-07-09 10:02',subjects:3,consults:12,reports:6,medicineCount:4,familyCount:2,status:'正常',risk:'干眼复诊、测试记录待清理',remark:'本人及父亲、女儿共三个健康主体',updatedAt:'2026-07-09 10:02'},
  {id:'U10022',name:'陈雨桐',nickname:'Rain',phone:'138****6211',gender:'女',age:28,birthday:'1998-05-21',city:'深圳福田',source:'报告解读',registeredAt:'2026-01-08 14:20',lastLogin:'2026-07-09 09:16',subjects:1,consults:8,reports:3,medicineCount:2,familyCount:0,status:'正常',risk:'低风险',remark:'关注年度体检',updatedAt:'2026-07-09 09:16'},
  {id:'U10023',name:'周铭轩',nickname:'Ming',phone:'138****6212',gender:'男',age:41,birthday:'1985-08-16',city:'深圳宝安',source:'AI问诊',registeredAt:'2025-12-12 11:32',lastLogin:'2026-07-08 18:40',subjects:2,consults:21,reports:5,medicineCount:3,familyCount:1,status:'正常',risk:'胃病随访',remark:'消化内科随访用户',updatedAt:'2026-07-08 18:40'},
  {id:'U10024',name:'林婉清',nickname:'Wendy',phone:'138****6213',gender:'女',age:36,birthday:'1990-11-03',city:'深圳南山',source:'健康档案',registeredAt:'2026-02-18 08:45',lastLogin:'2026-07-08 14:32',subjects:2,consults:6,reports:4,medicineCount:1,familyCount:1,status:'正常',risk:'低风险',remark:'管理女儿健康档案',updatedAt:'2026-07-08 14:32'},
  {id:'U10025',name:'吴嘉诚',nickname:'Jason',phone:'138****6214',gender:'男',age:52,birthday:'1974-02-28',city:'深圳龙岗',source:'挂号入口',registeredAt:'2025-10-06 16:12',lastLogin:'2026-07-07 11:08',subjects:1,consults:15,reports:7,medicineCount:5,familyCount:0,status:'正常',risk:'高血压关注',remark:'血压持续随访',updatedAt:'2026-07-07 11:08'},
  {id:'U10026',name:'赵欣怡',nickname:'Xinyi',phone:'138****6215',gender:'女',age:31,birthday:'1995-07-09',city:'广州天河',source:'药箱入口',registeredAt:'2026-03-03 10:08',lastLogin:'2026-07-06 20:13',subjects:1,consults:4,reports:2,medicineCount:6,familyCount:0,status:'待完善',risk:'低风险',remark:'基础档案待完善',updatedAt:'2026-07-06 20:13'},
  {id:'U10027',name:'孙建国',nickname:'Jianguo',phone:'138****6216',gender:'男',age:66,birthday:'1960-01-15',city:'惠州大亚湾',source:'AI问诊',registeredAt:'2025-09-22 13:40',lastLogin:'2026-07-06 08:21',subjects:1,consults:18,reports:4,medicineCount:5,familyCount:0,status:'正常',risk:'高血压关注',remark:'家属协助管理',updatedAt:'2026-07-06 08:21'},
  {id:'U10028',name:'高晓雯',nickname:'Xiaowen',phone:'138****6217',gender:'女',age:39,birthday:'1987-09-18',city:'深圳福田',source:'支付宝搜索',registeredAt:'2026-01-29 09:18',lastLogin:'2026-07-05 19:42',subjects:2,consults:9,reports:3,medicineCount:1,familyCount:1,status:'禁用',risk:'投诉用户',remark:'投诉处理中，暂时限制服务',updatedAt:'2026-07-05 19:42'},
  {id:'U10029',name:'叶子航',nickname:'Zihang',phone:'138****6218',gender:'男',age:26,birthday:'2000-04-11',city:'深圳南山',source:'报告解读',registeredAt:'2026-04-07 17:05',lastLogin:'2026-07-05 13:24',subjects:1,consults:3,reports:2,medicineCount:0,familyCount:0,status:'正常',risk:'低风险',remark:'无',updatedAt:'2026-07-05 13:24'},
  {id:'U10030',name:'许安然',nickname:'Anran',phone:'138****6219',gender:'女',age:45,birthday:'1981-12-26',city:'深圳宝安',source:'健康档案',registeredAt:'2025-12-30 15:36',lastLogin:'2026-07-04 10:18',subjects:2,consults:11,reports:8,medicineCount:3,familyCount:1,status:'正常',risk:'干眼复诊',remark:'眼科复诊用户',updatedAt:'2026-07-04 10:18'}
]
