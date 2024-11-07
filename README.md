# Discount Engine

Discount engine is a service to apply discounts dynamically based on configurable rules related to quantity, suppliers, and product combinations.

## Discount rule type definition

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
