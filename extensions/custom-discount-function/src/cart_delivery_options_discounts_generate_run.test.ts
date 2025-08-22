import {describe, it, expect} from "vitest";

import {cartDeliveryOptionsDiscountsGenerateRun} from "./cart_delivery_options_discounts_generate_run";
import {
  DeliveryDiscountSelectionStrategy,
  DiscountClass,
  DeliveryInput,
  CartDeliveryOptionsDiscountsGenerateRunResult,
} from "../generated/api";

describe("cartDeliveryOptionsDiscountsGenerateRun", () => {
  const baseInput: DeliveryInput = {
    cart: {
      deliveryGroups: [
        {
          id: "gid://shopify/DeliveryGroup/0",
        },
      ],
    },
    discount: {
      discountClasses: [],
      metafield: null,
    },
  };

  it("returns empty operations when no discount classes are present", () => {
    const input: DeliveryInput = {
      ...baseInput,
      discount: {
        discountClasses: [],
        metafield: null,
      },
    };

    const result: CartDeliveryOptionsDiscountsGenerateRunResult =
      cartDeliveryOptionsDiscountsGenerateRun(input);
    expect(result.operations).toHaveLength(0);
  });

  it("returns delivery discount when shipping discount class is present", () => {
    const input: DeliveryInput = {
      ...baseInput,
      discount: {
        discountClasses: [DiscountClass.Shipping],
        metafield: null,
      },
    };

    const result: CartDeliveryOptionsDiscountsGenerateRunResult =
      cartDeliveryOptionsDiscountsGenerateRun(input);
    expect(result.operations).toHaveLength(1);
    expect(result.operations[0]).toMatchObject({
      deliveryDiscountsAdd: {
        candidates: [
          {
            message: "FREE DELIVERY",
            targets: [
              {
                deliveryGroup: {
                  id: "gid://shopify/DeliveryGroup/0",
                },
              },
            ],
            value: {
              percentage: {
                value: 100,
              },
            },
          },
        ],
        selectionStrategy: DeliveryDiscountSelectionStrategy.All,
      },
    });
  });

  it("throws error when no delivery groups are present", () => {
    const input: DeliveryInput = {
      cart: {
        deliveryGroups: [],
      },
      discount: {
        discountClasses: [DiscountClass.Shipping],
        metafield: null,
      },
    };

    expect(() => cartDeliveryOptionsDiscountsGenerateRun(input)).toThrow(
      "No delivery groups found",
    );
  });

  it("uses custom configuration from metafield", () => {
    const input: DeliveryInput = {
      ...baseInput,
      discount: {
        discountClasses: [DiscountClass.Shipping],
        metafield: {
          jsonValue: {
            shippingDiscountPercentage: 50,
            shippingDiscountMessage: "50% OFF SHIPPING",
          },
        },
      },
    };

    const result: CartDeliveryOptionsDiscountsGenerateRunResult =
      cartDeliveryOptionsDiscountsGenerateRun(input);
    expect(result.operations).toHaveLength(1);
    expect(result.operations[0]).toMatchObject({
      deliveryDiscountsAdd: {
        candidates: [
          {
            message: "50% OFF SHIPPING",
            value: {
              percentage: {
                value: 50,
              },
            },
          },
        ],
        selectionStrategy: DeliveryDiscountSelectionStrategy.All,
      },
    });
  });
});