export type RowData = Record<string, string | number | boolean>

export interface Column {
  key: string
  title: string
  width?: number
  status?: boolean
}

export interface Field {
  key: string
  label: string
  type?: 'text' | 'number' | 'select' | 'multiselect' | 'radio' | 'date' | 'datetime-local' | 'textarea' | 'file'
  options?: string[]
  required?: boolean
  placeholder?: string
}

export interface PageConfig {
  key: string
  title: string
  description: string
  group: string
  icon?: string
  columns: Column[]
  fields: Field[]
  createFields?: Field[]
  editFields?: Field[]
  detailTabs?: string[]
  mockCreateRecord?: (values: RowData, rows: RowData[]) => RowData
  rows: RowData[]
  filters?: { label: string; key: string; options: string[] }[]
  actions?: string[]
  primaryAction?: string
}
