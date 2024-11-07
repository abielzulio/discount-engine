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

  test("Success to get 1 if buy 3 items", () => {
    const order: { cart: CartItem[]; discounts: Discount[] } = {
      cart: [{ id: "jeans", supplier_id: "supplierA", quantity: 3, price: 50 }],
      discounts,
    }

    const discountEngine = new DiscountEngine(order.cart)
    const discountActs = discountEngine.applyDiscounts(order.discounts)

    expect(discountActs).toEqual([
      { type: "free_item", product_id: "jeans", quantity: 1 },
    ])
  })

  test("Fails to get 1 if buy less than 3 items", () => {
    const order: { cart: CartItem[]; discounts: Discount[] } = {
      cart: [{ id: "jeans", supplier_id: "supplierA", quantity: 2, price: 50 }],
      discounts,
    }

    const discountEngine = new DiscountEngine(order.cart)
    const discountActs = discountEngine.applyDiscounts(order.discounts)

    expect(discountActs).toBeArrayOfSize(0)
  })
})

describe("Buy N Get Discount", () => {
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
      action: { type: "percentage_discount", value: 5 },
    },
  ]

  test("Success to get a 5% disc if buy 3 items", () => {
    const order: { cart: CartItem[]; discounts: Discount[] } = {
      cart: [{ id: "jeans", supplier_id: "supplierA", quantity: 3, price: 50 }],
      discounts,
    }

    const discountEngine = new DiscountEngine(order.cart)
    const discountActs = discountEngine.applyDiscounts(order.discounts)

    expect(discountActs).toEqual([{ type: "percentage_discount", value: 5 }])
  })

  test("Fails to get a 5% disc if buy less than 3 items", () => {
    const order: { cart: CartItem[]; discounts: Discount[] } = {
      cart: [{ id: "jeans", supplier_id: "supplierA", quantity: 2, price: 50 }],
      discounts,
    }

    const discountEngine = new DiscountEngine(order.cart)
    const discountActs = discountEngine.applyDiscounts(order.discounts)

    expect(discountActs).toBeArrayOfSize(0)
  })
})
