// extensions/custom-discount-function/node_modules/@shopify/shopify_function/run.ts
function run_default(userfunction) {
  if (!Javy.JSON) {
    throw new Error("Javy.JSON is not defined. Please rebuild your function using the latest version of Shopify CLI.");
  }
  const input_obj = Javy.JSON.fromStdin();
  const output_obj = userfunction(input_obj);
  Javy.JSON.toStdout(output_obj);
}

// extensions/custom-discount-function/src/cart_lines_discounts_generate_run.ts
function cartLinesDiscountsGenerateRun(input) {
  if (!input.cart.lines.length) {
    throw new Error("No cart lines found");
  }
  const defaultConfig = {
    orderDiscountPercentage: 10,
    productDiscountPercentage: 20,
    orderDiscountMessage: "10% OFF ORDER",
    productDiscountMessage: "20% OFF PRODUCT"
  };
  const configuration = input.discount.metafield?.jsonValue ? { ...defaultConfig, ...input.discount.metafield.jsonValue } : defaultConfig;
  const hasOrderDiscountClass = input.discount.discountClasses.includes(
    "ORDER" /* Order */
  );
  const hasProductDiscountClass = input.discount.discountClasses.includes(
    "PRODUCT" /* Product */
  );
  if (!hasOrderDiscountClass && !hasProductDiscountClass) {
    return { operations: [] };
  }
  const maxCartLine = input.cart.lines.reduce((maxLine, line) => {
    if (line.cost.subtotalAmount.amount > maxLine.cost.subtotalAmount.amount) {
      return line;
    }
    return maxLine;
  }, input.cart.lines[0]);
  const operations = [];
  if (hasOrderDiscountClass) {
    operations.push({
      orderDiscountsAdd: {
        candidates: [
          {
            message: configuration.orderDiscountMessage,
            targets: [
              {
                orderSubtotal: {
                  excludedCartLineIds: []
                }
              }
            ],
            value: {
              percentage: {
                value: configuration.orderDiscountPercentage
              }
            }
          }
        ],
        selectionStrategy: "FIRST" /* First */
      }
    });
  }
  if (hasProductDiscountClass) {
    operations.push({
      productDiscountsAdd: {
        candidates: [
          {
            message: configuration.productDiscountMessage,
            targets: [
              {
                cartLine: {
                  id: maxCartLine.id
                }
              }
            ],
            value: {
              percentage: {
                value: configuration.productDiscountPercentage
              }
            }
          }
        ],
        selectionStrategy: "FIRST" /* First */
      }
    });
  }
  return {
    operations
  };
}

// extensions/custom-discount-function/src/cart_delivery_options_discounts_generate_run.ts
function cartDeliveryOptionsDiscountsGenerateRun(input) {
  const firstDeliveryGroup = input.cart.deliveryGroups[0];
  if (!firstDeliveryGroup) {
    throw new Error("No delivery groups found");
  }
  const defaultConfig = {
    shippingDiscountPercentage: 100,
    shippingDiscountMessage: "FREE DELIVERY"
  };
  const configuration = input.discount.metafield?.jsonValue ? { ...defaultConfig, ...input.discount.metafield.jsonValue } : defaultConfig;
  const hasShippingDiscountClass = input.discount.discountClasses.includes(
    "SHIPPING" /* Shipping */
  );
  if (!hasShippingDiscountClass) {
    return { operations: [] };
  }
  return {
    operations: [
      {
        deliveryDiscountsAdd: {
          candidates: [
            {
              message: configuration.shippingDiscountMessage,
              targets: [
                {
                  deliveryGroup: {
                    id: firstDeliveryGroup.id
                  }
                }
              ],
              value: {
                percentage: {
                  value: configuration.shippingDiscountPercentage
                }
              }
            }
          ],
          selectionStrategy: "ALL" /* All */
        }
      }
    ]
  };
}

// <stdin>
function cartLinesDiscountsGenerateRun2() {
  return run_default(cartLinesDiscountsGenerateRun);
}
function cartDeliveryOptionsDiscountsGenerateRun2() {
  return run_default(cartDeliveryOptionsDiscountsGenerateRun);
}
export {
  cartDeliveryOptionsDiscountsGenerateRun2 as cartDeliveryOptionsDiscountsGenerateRun,
  cartLinesDiscountsGenerateRun2 as cartLinesDiscountsGenerateRun
};
