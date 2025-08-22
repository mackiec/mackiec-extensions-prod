import {describe, it, expect} from "vitest";

import {cartLinesDiscountsGenerateRun} from "./cart_lines_discounts_generate_run";
import {
  OrderDiscountSelectionStrategy,
  ProductDiscountSelectionStrategy,
  DiscountClass,
  CartInput,
  CartLinesDiscountsGenerateRunResult,
} from "../generated/api";

describe("cartLinesDiscountsGenerateRun", () => {
  const baseInput: CartInput = {
    cart: {
      lines: [
        {
          id: "gid://shopify/CartLine/0",
          cost: {
            subtotalAmount: {
              amount: 100,
            },
          },
        },
      ],
    },
    discount: {
      discountClasses: [],
      metafield: null,
    },
  };

  it("returns empty operations when no discount classes are present", () => {
    const input: CartInput = {
      ...baseInput,
      discount: {
        discountClasses: [],
        metafield: null,
      },
    };

    const result: CartLinesDiscountsGenerateRunResult =
      cartLinesDiscountsGenerateRun(input);
    expect(result.operations).toHaveLength(0);
  });

  it("returns only order discount when only order discount class is present", () => {
    const input: CartInput = {
      ...baseInput,
      discount: {
        discountClasses: [DiscountClass.Order],
        metafield: null,
      },
    };

    const result: CartLinesDiscountsGenerateRunResult =
      cartLinesDiscountsGenerateRun(input);
    expect(result.operations).toHaveLength(1);
    expect(result.operations[0]).toMatchObject({
      orderDiscountsAdd: {
        candidates: [
          {
            message: "10% OFF ORDER",
            targets: [
              {
                orderSubtotal: {
                  excludedCartLineIds: [],
                },
              },
            ],
            value: {
              percentage: {
                value: 10,
              },
            },
          },
        ],
        selectionStrategy: OrderDiscountSelectionStrategy.First,
      },
    });
  });

  it("returns only product discount when only product discount class is present", () => {
    const input: CartInput = {
      ...baseInput,
      discount: {
        discountClasses: [DiscountClass.Product],
        metafield: null,
      },
    };

    const result: CartLinesDiscountsGenerateRunResult =
      cartLinesDiscountsGenerateRun(input);
    expect(result.operations).toHaveLength(1);
    expect(result.operations[0]).toMatchObject({
      productDiscountsAdd: {
        candidates: [
          {
            message: "20% OFF PRODUCT",
            targets: [
              {
                cartLine: {
                  id: "gid://shopify/CartLine/0",
                },
              },
            ],
            value: {
              percentage: {
                value: 20,
              },
            },
          },
        ],
        selectionStrategy: ProductDiscountSelectionStrategy.First,
      },
    });
  });

  it("returns both discounts when both discount classes are present", () => {
    const input: CartInput = {
      ...baseInput,
      discount: {
        discountClasses: [DiscountClass.Order, DiscountClass.Product],
        metafield: null,
      },
    };

    const result: CartLinesDiscountsGenerateRunResult =
      cartLinesDiscountsGenerateRun(input);
    expect(result.operations).toHaveLength(2);
    expect(result.operations[0]).toMatchObject({
      orderDiscountsAdd: {
        candidates: [
          {
            message: "10% OFF ORDER",
            targets: [
              {
                orderSubtotal: {
                  excludedCartLineIds: [],
                },
              },
            ],
            value: {
              percentage: {
                value: 10,
              },
            },
          },
        ],
        selectionStrategy: OrderDiscountSelectionStrategy.First,
      },
    });

    expect(result.operations[1]).toMatchObject({
      productDiscountsAdd: {
        candidates: [
          {
            message: "20% OFF PRODUCT",
            targets: [
              {
                cartLine: {
                  id: "gid://shopify/CartLine/0",
                },
              },
            ],
            value: {
              percentage: {
                value: 20,
              },
            },
          },
        ],
        selectionStrategy: ProductDiscountSelectionStrategy.First,
      },
    });
  });

  it("uses custom configuration from metafield", () => {
    const input: CartInput = {
      ...baseInput,
      discount: {
        discountClasses: [DiscountClass.Order, DiscountClass.Product],
        metafield: {
          jsonValue: {
            orderDiscountPercentage: 15,
            productDiscountPercentage: 25,
            orderDiscountMessage: "15% OFF EVERYTHING",
            productDiscountMessage: "25% OFF MOST EXPENSIVE ITEM",
          },
        },
      },
    };

    const result: CartLinesDiscountsGenerateRunResult =
      cartLinesDiscountsGenerateRun(input);
    expect(result.operations).toHaveLength(2);
    
    // Check order discount uses custom values
    expect(result.operations[0]).toMatchObject({
      orderDiscountsAdd: {
        candidates: [
          {
            message: "15% OFF EVERYTHING",
            value: {
              percentage: {
                value: 15,
              },
            },
          },
        ],
      },
    });

    // Check product discount uses custom values
    expect(result.operations[1]).toMatchObject({
      productDiscountsAdd: {
        candidates: [
          {
            message: "25% OFF MOST EXPENSIVE ITEM",
            value: {
              percentage: {
                value: 25,
              },
            },
          },
        ],
      },
    });
  });
});