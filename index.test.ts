import { describe, expect, test } from "bun:test"
import type { CartItem, Discount } from "./index.type"
import { DiscountEngine } from "."

describe("Buy N Get M Free", () => {
  const discounts: Discount[] = [
    {
      id: 1,
      code: "BUY3GET1",
      rules: [
        {
          type: "total_quantity",
          operator: "gte",
          quantity: 3,
        },
      ],
      action: { type: "free_item", product_id: "jeans", quantity: 1 },
    },
  ]

  test("Success to buy 3 get 1", () => {
    const order: { cart: CartItem[]; discounts: Discount[] } = {
      cart: [{ id: "jeans", supplier_id: "supplierA", quantity: 3, price: 50 }],
      discounts,
    }

    const discountEngine = new DiscountEngine(order.cart)
    const discountActs = discountEngine.applyDiscounts(order.discounts)

    expect(discountActs).toEqual([
      { type: "free_item", product_id: "jeans", quantity: 1 },
    ])
  }),
    test("Fails to buy 3 get 1 if item less than 3", () => {
      const order: { cart: CartItem[]; discounts: Discount[] } = {
        cart: [
          { id: "jeans", supplier_id: "supplierA", quantity: 2, price: 50 },
        ],
        discounts,
      }

      const discountEngine = new DiscountEngine(order.cart)
      const actions = discountEngine.applyDiscounts(order.discounts)

      expect(actions).toBeArrayOfSize(0)
    })
})
