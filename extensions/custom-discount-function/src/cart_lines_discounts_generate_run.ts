import {
  DiscountClass,
  OrderDiscountSelectionStrategy,
  ProductDiscountSelectionStrategy,
  CartInput,
  CartLinesDiscountsGenerateRunResult,
} from '../generated/api';

interface Configuration {
  orderDiscountPercentage: number;
  productDiscountPercentage: number;
  orderDiscountMessage: string;
  productDiscountMessage: string;
}


export function cartLinesDiscountsGenerateRun(
  input: CartInput,
): CartLinesDiscountsGenerateRunResult {
  if (!input.cart.lines.length) {
    throw new Error('No cart lines found');
  }

  // Get configuration from metafield or use defaults
  const defaultConfig: Configuration = {
    orderDiscountPercentage: 10,
    productDiscountPercentage: 20,
    orderDiscountMessage: '10% OFF ORDER',
    productDiscountMessage: '20% OFF PRODUCT',
  };

  const configuration: Configuration = input.discount.metafield?.jsonValue 
    ? { ...defaultConfig, ...input.discount.metafield.jsonValue } 
    : defaultConfig;

  const hasOrderDiscountClass = input.discount.discountClasses.includes(
    DiscountClass.Order,
  );
  const hasProductDiscountClass = input.discount.discountClasses.includes(
    DiscountClass.Product,
  );

  if (!hasOrderDiscountClass && !hasProductDiscountClass) {
    return {operations: []};
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
                  excludedCartLineIds: [],
                },
              },
            ],
            value: {
              percentage: {
                value: configuration.orderDiscountPercentage,
              },
            },
          },
        ],
        selectionStrategy: OrderDiscountSelectionStrategy.First,
      },
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
                  id: maxCartLine.id,
                },
              },
            ],
            value: {
              percentage: {
                value: configuration.productDiscountPercentage,
              },
            },
          },
        ],
        selectionStrategy: ProductDiscountSelectionStrategy.First,
      },
    });
  }

  return {
    operations,
  };
}