export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface Configuration {
  orderDiscountPercentage: number;
  productDiscountPercentage: number;
  orderDiscountMessage: string;
  productDiscountMessage: string;
}

export function validateConfiguration(config: Configuration): ValidationResult {
  const errors: Record<string, string> = {};

  // Validate order discount percentage
  if (config.orderDiscountPercentage < 0 || config.orderDiscountPercentage > 100) {
    errors.orderDiscountPercentage = 'Order discount must be between 0% and 100%';
  }

  // Validate product discount percentage
  if (config.productDiscountPercentage < 0 || config.productDiscountPercentage > 100) {
    errors.productDiscountPercentage = 'Product discount must be between 0% and 100%';
  }

  // Validate order discount message
  if (!config.orderDiscountMessage.trim()) {
    errors.orderDiscountMessage = 'Order discount message is required';
  } else if (config.orderDiscountMessage.length > 100) {
    errors.orderDiscountMessage = 'Order discount message must be 100 characters or less';
  }

  // Validate product discount message
  if (!config.productDiscountMessage.trim()) {
    errors.productDiscountMessage = 'Product discount message is required';
  } else if (config.productDiscountMessage.length > 100) {
    errors.productDiscountMessage = 'Product discount message must be 100 characters or less';
  }

  // Check if at least one discount is enabled
  if (config.orderDiscountPercentage === 0 && config.productDiscountPercentage === 0) {
    errors.general = 'At least one discount type must have a percentage greater than 0%';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}