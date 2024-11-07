interface Rule {
  type: RuleType
  operator: RuleOperator
  values?: number
  product_id?: string
  supplier_id?: string
  quantity?: number
}

type RuleOperator = "eq" | "gte" | "lte" | "in"
type RuleType =
  | "product_quantity"
  | "supplier"
  | "total_quantity"
  | "cart_value"

type ActionType = "percentage_discount" | "flat_discount" | "free_item"

interface Action {
  type: ActionType
  value?: number
  product_id?: string
  quantity?: number
}

interface Discount {
  id: string | number
  code: string
  name: string
  rules: Rule[]
  action: Action
}

const discounts: Discount[] = [
  {
    id: 1,
    code: "COMBO",
    name: "T-shirt and Jeans Combo Discount",
    rules: [
      {
        type: "product_quantity",
        operator: "eq",
        product_id: "tshirt",
        quantity: 1,
      },
      {
        type: "product_quantity",
        operator: "eq",
        product_id: "jeans",
        quantity: 2,
      },
    ],
    action: { type: "percentage_discount", value: 10 },
  },
  {
    id: 1,
    code: "SAVE",
    name: "Buy More, Save More on Supplier A",
    rules: [
      { type: "supplier", operator: "eq", supplier_id: "supplierA" },
      { type: "total_quantity", operator: "gte", quantity: 3 },
    ],
    action: { type: "flat_discount", value: 15 },
  },
]

interface CartItem {
  id: string
  supplier_id: string
  quantity: number
  price: number
}

class DiscountEngine<T extends CartItem> {
  private cart: T[]
  constructor(cart: T[]) {
    this.cart = cart
  }

  applyDiscounts(discounts: Discount[]): void {
    discounts.forEach((discount) => {
      if (this.evaluateRuleGroup(discount.rules)) {
        this.applyAction(discount.action)
      }
    })
  }

  private evaluateRuleGroup(ruleGroup: Rule[]): boolean {
    return ruleGroup.every((condition) => this.checkRule(condition))
  }

  private checkRule(condition: Rule): boolean {
    switch (condition.type) {
      case "product_quantity":
        if (!condition.product_id)
          throw new Error("'product_id' rule is undefined")
        if (!condition.quantity) throw new Error("'quantity' rule is undefined")
        return this.checkProductQuantity(
          condition.operator,
          condition.product_id,
          condition.quantity
        )
      case "supplier":
        if (!condition.supplier_id)
          throw new Error("'supplier_rule' is undefined")
        return this.checkSupplier(condition.operator, condition.supplier_id)
      case "total_quantity":
        if (!condition.quantity) throw new Error("'quantity' is undefined")
        return this.checkTotalQuantity(condition.operator, condition.quantity)
      case "cart_value":
        if (!condition.values) throw new Error("'values' is undefined")
        return this.checkCartValue(condition.operator, condition.values)
      default:
        return false
    }
  }

  private checkProductQuantity(
    operator: RuleOperator,
    productId: string,
    requiredQuantity: number
  ): boolean {
    const cartItem = this.cart.find((item) => item.id === productId)
    const cartQuantity = cartItem ? cartItem.quantity : 0
    return this.applyOperator(cartQuantity, operator, requiredQuantity)
  }

  private checkSupplier(operator: RuleOperator, supplierId: string): boolean {
    const hasSupplierItems = this.cart.some(
      (item) => item.supplier_id === supplierId
    )
    return operator === "eq" ? hasSupplierItems : false
  }

  private checkTotalQuantity(
    operator: RuleOperator,
    requiredQuantity: number
  ): boolean {
    const totalQuantity = this.cart.reduce(
      (acc, item) => acc + item.quantity,
      0
    )
    return this.applyOperator(totalQuantity, operator, requiredQuantity)
  }

  private checkCartValue(
    operator: RuleOperator,
    requiredValue: number
  ): boolean {
    const cartValue = this.cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    )
    return this.applyOperator(cartValue, operator, requiredValue)
  }

  private applyOperator(
    cartValue: number,
    operator: RuleOperator,
    conditionValue: number
  ): boolean {
    switch (operator) {
      case "eq":
        return cartValue === conditionValue
      case "gte":
        return cartValue >= conditionValue
      case "lte":
        return cartValue <= conditionValue
      case "in":
        return Array.isArray(conditionValue)
          ? conditionValue.includes(cartValue)
          : false
      default:
        return false
    }
  }

  private applyAction(action: Action): void {
    switch (action.type) {
      case "percentage_discount":
        console.log(`Applying ${action.value}% discount`)
        break
      case "flat_discount":
        console.log(`Applying flat discount of ${action.value}`)
        break
      case "free_item":
        console.log(
          `Adding free item: ${action.product_id}, Quantity: ${action.quantity}`
        )
        break
    }
  }
}

const main = () => {
  const cart: CartItem[] = [
    { id: "tshirt", supplier_id: "supplierA", quantity: 1, price: 20 },
    { id: "jeans", supplier_id: "supplierA", quantity: 2, price: 50 },
  ]

  const discountEngine = new DiscountEngine(cart)
  discountEngine.applyDiscounts(discounts)
}

main()
