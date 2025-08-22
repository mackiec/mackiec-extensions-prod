import {
  DeliveryDiscountSelectionStrategy,
  DiscountClass,
  DeliveryInput,
  CartDeliveryOptionsDiscountsGenerateRunResult,
} from "../generated/api";

interface Configuration {
  shippingDiscountPercentage: number;
  shippingDiscountMessage: string;
}

export function cartDeliveryOptionsDiscountsGenerateRun(
  input: DeliveryInput,
): CartDeliveryOptionsDiscountsGenerateRunResult {
  const firstDeliveryGroup = input.cart.deliveryGroups[0];
  if (!firstDeliveryGroup) {
    throw new Error("No delivery groups found");
  }

  // Get configuration from metafield or use defaults
  const defaultConfig: Configuration = {
    shippingDiscountPercentage: 100,
    shippingDiscountMessage: "FREE DELIVERY",
  };

  const configuration: Configuration = input.discount.metafield?.jsonValue 
    ? { ...defaultConfig, ...input.discount.metafield.jsonValue } 
    : defaultConfig;

  const hasShippingDiscountClass = input.discount.discountClasses.includes(
    DiscountClass.Shipping,
  );

  if (!hasShippingDiscountClass) {
    return {operations: []};
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
                    id: firstDeliveryGroup.id,
                  },
                },
              ],
              value: {
                percentage: {
                  value: configuration.shippingDiscountPercentage,
                },
              },
            },
          ],
          selectionStrategy: DeliveryDiscountSelectionStrategy.All,
        },
      },
    ],
  };
}