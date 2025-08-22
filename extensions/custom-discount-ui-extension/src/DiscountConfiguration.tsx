import React, { useState } from 'react';
import {
  reactExtension,
  AdminBlock,
  BlockStack,
  Text,
  TextField,
  Button,
  InlineStack,
  Banner,
  FunctionSettings,
  NumberField,
  Divider,
  Section,
  Heading,
} from '@shopify/ui-extensions-react/admin';

import { Configuration, validateConfiguration, ValidationResult } from './validation';

const DEFAULT_CONFIG: Configuration = {
  orderDiscountPercentage: 10,
  productDiscountPercentage: 20,
  orderDiscountMessage: '10% OFF ORDER',
  productDiscountMessage: '20% OFF PRODUCT',
};

export default reactExtension('admin.discount-details.function-settings.render', () => <DiscountConfiguration />);

function DiscountConfiguration() {
  const [configuration, setConfiguration] = useState<Configuration>(DEFAULT_CONFIG);
  const [validationResult, setValidationResult] = useState<ValidationResult>({ isValid: true, errors: {} });

  const updateConfiguration = (field: keyof Configuration, value: any) => {
    const newConfig = { ...configuration, [field]: value };
    setConfiguration(newConfig);
    
    // Validate the new configuration
    const validation = validateConfiguration(newConfig);
    setValidationResult(validation);
  };

  return (
    <AdminBlock>
      <FunctionSettings>
        <BlockStack>
          <Heading>Discount Configuration</Heading>
          <Text>
            Configure the discount percentages and messages for your custom discount function.
          </Text>

          {validationResult.errors.general && (
            <Banner tone="critical">
              {validationResult.errors.general}
            </Banner>
          )}

          <Section>
            <Heading>Discount Percentages</Heading>
            <BlockStack>
              <NumberField
                label="Order Discount Percentage"
                value={configuration.orderDiscountPercentage}
                onChange={(value) => updateConfiguration('orderDiscountPercentage', value)}
                suffix="%"
                min={0}
                max={100}
                error={validationResult.errors.orderDiscountPercentage}
              />

              <NumberField
                label="Product Discount Percentage"
                value={configuration.productDiscountPercentage}
                onChange={(value) => updateConfiguration('productDiscountPercentage', value)}
                suffix="%"
                min={0}
                max={100}
                error={validationResult.errors.productDiscountPercentage}
              />
            </BlockStack>
          </Section>

          <Divider />

          <Section>
            <Heading>Discount Messages</Heading>
            <BlockStack>
              <TextField
                label="Order Discount Message"
                value={configuration.orderDiscountMessage}
                onChange={(value) => updateConfiguration('orderDiscountMessage', value)}
                placeholder="e.g., 10% OFF ORDER"
                error={validationResult.errors.orderDiscountMessage}
              />

              <TextField
                label="Product Discount Message"
                value={configuration.productDiscountMessage}
                onChange={(value) => updateConfiguration('productDiscountMessage', value)}
                placeholder="e.g., 20% OFF PRODUCT"
                error={validationResult.errors.productDiscountMessage}
              />
            </BlockStack>
          </Section>

          <Divider />

          <Section>
            <Heading>Preview</Heading>
            <BlockStack>
              <InlineStack>
                <BlockStack>
                  <Text>Order Discount:</Text>
                  <Text>{configuration.orderDiscountPercentage}% - "{configuration.orderDiscountMessage}"</Text>
                </BlockStack>
                <BlockStack>
                  <Text>Product Discount:</Text>
                  <Text>{configuration.productDiscountPercentage}% - "{configuration.productDiscountMessage}"</Text>
                </BlockStack>
              </InlineStack>
            </BlockStack>
          </Section>

          <InlineStack>
            <Button 
              variant="primary"
              disabled={!validationResult.isValid}
              onPress={() => {
                // The FunctionSettings component handles saving automatically
                console.log('Configuration saved:', configuration);
              }}
            >
              Save Configuration
            </Button>
            <Button 
              onPress={() => {
                setConfiguration(DEFAULT_CONFIG);
                setValidationResult({ isValid: true, errors: {} });
              }}
            >
              Reset to Defaults
            </Button>
          </InlineStack>
        </BlockStack>
      </FunctionSettings>
    </AdminBlock>
  );
}