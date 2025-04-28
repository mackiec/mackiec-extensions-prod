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
 * Combined cart transform function
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  const operations = input.cart.lines.reduce(
    /** @param {CartOperation[]} acc */
    (acc, cartLine) => {
      const buyerIdentity = input.cart.buyerIdentity;
      const isMemberActive = buyerIdentity && buyerIdentity.customer && buyerIdentity.customer.metafield && buyerIdentity.customer.metafield.value === 'true';
      const isCustomised = cartLine.attribute?.value === 'true';
      const presentmentCurrencyRate = input.presentmentCurrencyRate;

      let finalPrice = null;

      // Determine the base price based on membership
      if (isMemberActive) {
        finalPrice = getMemberPrice(cartLine, presentmentCurrencyRate);
      } else {
        finalPrice = getOriginalPrice(cartLine);
      }

      // If the base price is determined, apply markup if needed
      if (finalPrice !== null) {
        if (isCustomised) {
          finalPrice = applyMarkup(finalPrice, 0.10); // Apply 10% markup
        }

        acc.push({
          update: {
            cartLineId: cartLine.id,
            price: {
              adjustment: {
                fixedPricePerUnit: {
                  amount: finalPrice.toFixed(2) // Format to 2 decimal places
                }
              }
            }
          }
        });
      }

      return acc; // Return accumulated operations
    },
    /** @type {CartOperation[]} */ ([]),
  );

  return operations.length > 0 ? { operations } : NO_CHANGES;
}

/**
 * Get the member price based on the product metafield
 * @param {RunInput['cart']['lines'][number]} cartLine
 * @param {RunInput} presentmentCurrencyRate
 * @returns {number | null}
 */
function getMemberPrice(cartLine, presentmentCurrencyRate) {
  const { merchandise } = cartLine;

  if (
    merchandise.__typename === "ProductVariant" &&
    merchandise.product &&
    merchandise.product.metafield &&
    merchandise.product.metafield.value
  ) {
    return Number(merchandise.product.metafield.value) * Number(presentmentCurrencyRate);
  }

  return null;
}

/**
 * Get the original price from the cart line
 * @param {RunInput['cart']['lines'][number]} cartLine
 * @returns {number | null}
 */
function getOriginalPrice(cartLine) {
  const { cost: { amountPerQuantity } } = cartLine;

  if (amountPerQuantity) {
    return Number(amountPerQuantity.amount);
  }

  return null;
}

/**
 * Apply a markup to the given price
 * @param {number} price
 * @param {number} markupPercentage
 * @returns {number}
 */
function applyMarkup(price, markupPercentage) {
  return price * (1 + markupPercentage);
}