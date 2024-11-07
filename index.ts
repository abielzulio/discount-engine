import type {
  Action,
  CartItem,
  Discount,
  Rule,
  RuleOperator,
} from "./index.type"

export class DiscountEngine<T extends CartItem> {
  private cart: T[]
  constructor(cart: T[]) {
    this.cart = cart
  }

  applyDiscounts(discounts: Discount[]): Action[] {
    const disc = discounts
      .map((d) => {
        if (this.evaluateRuleGroup(d.rules)) {
          return this.applyAction(d.action)
        }
        return null
      })
      .filter((x) => !!x)
    return disc
  }

  private evaluateRuleGroup(ruleGroup: Rule[]): boolean {
    return ruleGroup.every((condition) => this.checkRule(condition))
  }

  private checkRule(condition: Rule): boolean {
    switch (condition.type) {
      /** Product-based quantity*/
      case "product_quantity":
        if (!condition.product_id)
          throw new Error("'product_id' rule is not defined")
        if (!condition.quantity)
          throw new Error("'quantity' rule is not defined")
        return this.checkProductQuantity(
          condition.operator,
          condition.product_id,
          condition.quantity
        )
      /** Supplier-based quantity */
      case "supplier_quantity":
        if (!condition.supplier_id)
          throw new Error("'supplier_id' rule is not defined")
        if (!condition.quantity)
          throw new Error("'quantity' rule is not defined")
        return this.checkSupplierQuantity(
          condition.operator,
          condition.supplier_id,
          condition.quantity
        )
      /** Total quantity */
      case "total_quantity":
        if (!condition.quantity) throw new Error("'quantity' is not defined")
        return this.checkTotalQuantity(condition.operator, condition.quantity)
      /** Cart value */
      case "cart_value":
        if (!condition.values) throw new Error("'values' is not defined")
        return this.checkCartValue(condition.operator, condition.values)
      default:
        return false
    }
  }

  private checkSupplierQuantity(
    operator: RuleOperator,
    supplierId: string,
    requiredQuantity: number
  ): boolean {
    const cartItems = this.cart.filter(
      (item) => item.supplier_id === supplierId
    )
    const cartQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0)
    return this.applyOperator(cartQuantity, operator, requiredQuantity)
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

  private checkTotalQuantity(
    operator: RuleOperator,
    requiredQuantity: number
  ): boolean {
    const totalQuantity = this.cart.reduce(
      (acc, item) => acc + item.quantity,
      0
    )

    /** TODO: Handle multiplication */
    /** Buy 3 Get 1 = Buy 6 Get 2 = etc.. */
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
      case "gt":
        return cartValue > conditionValue
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

  private applyAction(action: Action): Action {
    switch (action.type) {
      case "percentage_discount":
        return action
      case "flat_discount":
        return action
      case "free_item":
        return action
    }
  }
}
