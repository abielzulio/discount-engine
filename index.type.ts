export interface Rule {
  type: RuleType
  operator: RuleOperator
  values?: number
  product_id?: string
  supplier_id?: string
  quantity?: number
}

export type RuleOperator = "eq" | "gte" | "lte" | "in" | "gt"
export type RuleType =
  | "product_quantity"
  | "supplier_quantity"
  | "total_quantity"
  | "cart_value"

export type ActionType = "percentage_discount" | "flat_discount" | "free_item"

export interface Action {
  type: ActionType
  value?: number
  product_id?: string
  quantity?: number
}

export interface Discount {
  id: string | number
  code: string
  name?: string
  rules: Rule[]
  action: Action
}

export interface CartItem {
  id: string
  supplier_id: string
  quantity: number
  price: number
}
