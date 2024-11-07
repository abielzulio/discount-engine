# Discount Engine

Discount engine is a service to apply discounts dynamically based on configurable rules related to quantity, suppliers, and product combinations.

## Example usage

```typescript
/** CASE 1: Multiple discount **/
const multipleDiscounts = [
  {
    id: "disc_da21c",
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
  {
    id: "disc_3123ca",
    code: "DISCSUPB",
    rules: [
      {
        type: "supplier_quantity",
        operator: "gte",
        quantity: 5,
        supplier_id: "supplierB",
      },
    ],
    action: { type: "flat_discount", value: 5 },
  },
]

const order1 = {
  cart: [
    { id: "jeans", supplier_id: "supplierB", quantity: 5, price: 50 },
    { id: "shirt", supplier_id: "supplierA", quantity: 2, price: 80 },
  ],
}

const engine = new DiscountEngine(order1.cart)
const actions = engine.applyDiscounts(multipleDiscounts)

console.log(actions) // [{ type: "free_item", product_id: "jeans", quantity: 1 }, { type: "flat_discount", value: 5 }]

/** CASE 2: Discount is not applicable **/
const order2 = {
  cart: [{ id: "jeans", supplier_id: "supplierA", quantity: 1, price: 50 }],
}

const engine2 = new DiscountEngine(order2.cart)
const actions2 = engine2.applyDiscounts(multipleDiscounts)

console.log(actions2) // []

/** CASE 3: Single discount with multiple rules **/
const singleDiscountWithMultipleRules = [
  {
    id: "disc_da21c",
    code: "BUY3GET1",
    rules: [
      {
        type: "cart_value",
        operator: "gt",
        cart_value: 200,
      },
      {
        type: "product_quantity",
        operator: "gt",
        product_id: "jeans",
        quantity: 3,
      },
    ],
    action: { type: "flat_discount", value: 10 },
  },
]

const order3 = {
  cart: [
    { id: "jeans", supplier_id: "supplierB", quantity: 4, price: 30 },
    { id: "tshirt", supplier_id: "supplierA", quantity: 6, price: 15 },
  ],
}

const engine3 = new DiscountEngine(order3.cart)
const actions3 = engine.applyDiscounts(singleDiscountWithMultipleRules)

console.log(actions3) // [{ type: "flat_discount", value: 10 }]
```

## Discount schema

### Base

```typescript
export interface Discount {
  id: string | number
  code: string
  name?: string
  /** List of rules to apply the discount */
  rules: Rule[]
  /** Action to apply the discount */
  action: Action
}
```

### Action

```typescript
export interface Action {
  type: "percentage_discount" | "flat_discount" | "free_item"
  value?: number
  product_id?: string
  quantity?: number
}
```

### Rule

```typescript
export interface Rule {
  /** Type of the rule */
  type:
    | "product_quantity"
    | "supplier_quantity"
    | "total_quantity"
    | "cart_value"
  /** Operator to apply the rule */
  operator: "eq" | "gte" | "lte" | "gt"
  /** Cart value to apply the rule */
  cart_value?: number
  /** Product ID to apply the rule */
  product_id?: string
  /** Supplier ID to apply the rule */
  supplier_id?: string
  /** Quantity to apply the rule */
  quantity?: number
  /** Multiply the discount */
  multiply?: boolean
  /** Discount multiplier ratio */
  multiplierRatio?: number
}
```

### Example

1. **Product quantity**

A discount rule to apply a discount based on the quantity of the product.

```json
{
  "type": "product_quantity",
  "operator": "gte",
  "quantity": 2,
  "product_id": "jeans"
}
```

> Apply a discount if the quantity of the product with ID `jeans` is greater than or equal to 2.

2. **Supplier quantity**

A discount rule to apply a discount based on the quantity of the supplier.

```json
{
  "type": "supplier_quantity",
  "operator": "gt",
  "quantity": 5,
  "supplier_id": "supplierA"
}
```

> Apply a discount if the quantity of the supplier with ID `supplierA` is greater than 5.

3. **Total quantity**

A discount rule to apply a discount based on the total quantity of the cart.

```json
{
  "type": "total_quantity",
  "operator": "gte",
  "quantity": 10
}
```

> Apply a discount if the total quantity of the cart is greater than or equal to 10.

4. **Cart value**

A discount rule to apply a discount based on the total value of the cart.

```json
{
  "type": "cart_value",
  "operator": "gt",
  "cart_value": 100
}
```

> Apply a discount if the total value of the cart is greater than to 100.
