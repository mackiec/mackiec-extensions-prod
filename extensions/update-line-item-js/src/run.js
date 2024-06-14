// @ts-check

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 * @typedef {import("../generated/api").CartOperation} CartOperation
 */

/**
 * @type {FunctionRunResult}
 */
const NO_CHANGES = {
  operations: [],
};

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  // Check if the customer's membership is active
  // @ts-ignore
  const isMemberActive = input.cart.buyerIdentity.customer.metafield && input.cart.buyerIdentity.customer.metafield.value === 'true';

  const operations = input.cart.lines.reduce(
    /** @param {CartOperation[]} acc */
    (acc, cartLine) => {
      // @ts-ignore
      const presentmentCurrencyRate = input.presentmentCurrencyRate; // Declare the presentmentCurrencyRate variable

      // If the customer's membership is not active, prevent the price of the cart from being updated
      if (!isMemberActive) {
        return acc;
      }

      const updateOperation = optionallyBuildUpdateOperation(
        cartLine,
        presentmentCurrencyRate
      );

      if (updateOperation) {
        return [...acc, { update: updateOperation }];
      }

      return acc;
    },
    []
  );

  return operations.length > 0 ? { operations } : NO_CHANGES;
};

/**
 * @param {RunInput['cart']['lines'][number]} cartLine
 * @param {RunInput} presentmentCurrencyRate
 */
function optionallyBuildUpdateOperation(
  { id: cartLineId, merchandise },
  presentmentCurrencyRate
) {
  if (
    merchandise.__typename === "ProductVariant" &&
    merchandise.product &&
    merchandise.product.metafield &&
    merchandise.product.metafield.value
  ) {
    return {
      cartLineId,
      price: {
        adjustment: {
          fixedPricePerUnit: {
            amount: Number(merchandise.product.metafield.value) * Number(presentmentCurrencyRate)
          }
        }
      }
    };
  }

  return null;
}