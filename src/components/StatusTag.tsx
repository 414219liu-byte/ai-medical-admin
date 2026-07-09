export default function StatusTag({ value }: { value: string | number | boolean }) {
  const text = String(value)
  const tone = /急|高风险|失败|删除|禁用|驳回/.test(text) ? 'red' :
    /待|灰度|处理中|中风险|接入中|未填写/.test(text) ? 'amber' :
    /正常|启用|通过|完成|支持|已入档|已共享|已接入|低风险/.test(text) ? 'green' :
    /停用|未知|关闭|规划/.test(text) ? 'gray' : 'blue'
  return <span className={`status-tag ${tone}`}><i />{text}</span>
}
