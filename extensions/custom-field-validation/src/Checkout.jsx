import {
  reactExtension,
  TextField,
  useExtensionCapability,
  useBuyerJourneyIntercept,
  useSettings,
  BlockStack,
  Heading,
} from "@shopify/ui-extensions-react/checkout";
import React, { useState } from "react";

// Set the entry point for the extension
export default reactExtension("purchase.checkout.block.render", () => (
  <App />
));

function App() {
  // Use the merchant-defined settings to retrieve the extension's content
  const { 
    ageTarget = 18, 
    fieldTitle, 
    showVatNumberField,
    age_field_label: ageFieldLabel,
    age_field_label_optional: ageFieldLabelOptional,
    vat_field_label: vatFieldLabel,
    vat_field_label_optional: vatFieldLabelOptional,
    age_required_error: ageRequiredError,
    age_too_young_error: ageTooYoungError,
    vat_required_error: vatRequiredError,
    vat_invalid_error: vatInvalidError
  } = useSettings();

  // Set up the app state
  const [age, setAge] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [validationError, setValidationError] = useState("");
  const canBlockProgress = useExtensionCapability("block_progress");
  
  // Use configurable labels with fallbacks
  const ageLabel = canBlockProgress 
    ? (ageFieldLabel || "Your age")
    : (ageFieldLabelOptional || "Your age (optional)");
  const vatNumberLabel = canBlockProgress 
    ? (vatFieldLabel || "VAT Number")
    : (vatFieldLabelOptional || "VAT Number (optional)");

  // Use the `buyerJourney` intercept to conditionally block checkout progress
  useBuyerJourneyIntercept(({ canBlockProgress }) => {
    // Validate that the age of the buyer is known, and that they're old enough to complete the purchase
    if (canBlockProgress && !showVatNumberField && !isAgeSet()) {
      return {
        behavior: "block",
        reason: ageRequiredError || "Age is required",
        perform: (result) => {
          // If progress can be blocked, then set a validation error on the custom field
          if (result.behavior === "block") {
            setValidationError(ageRequiredError || "Enter your age");
          }
        },
      };
    }

    if (canBlockProgress && !showVatNumberField && !isAgeValid()) {
      return {
        behavior: "block",
        reason: `Age is less than ${ageTarget}.`,
        errors: [
          {
            // Show a validation error on the page
            message: ageTooYoungError || "You're not legally old enough to buy some of the items in your cart.",
          },
        ],
      };
    }

    if (canBlockProgress && showVatNumberField) {
      if (!isVatNumberSet()) {
        return {
          behavior: "block",
          reason: vatRequiredError || "VAT number is required",
          perform: (result) => {
            if (result.behavior === "block") {
              setValidationError(vatRequiredError || "VAT number is required");
            }
          },
        };
      }

      if (!isVatNumberValid()) {
        return {
          behavior: "block",
          reason: vatInvalidError || "Invalid VAT number",
          errors: [
            {
              message: vatInvalidError || "Invalid VAT number",
            },
          ],
        };
      }
    }

    return {
      behavior: "allow",
      perform: () => {
        // Ensure any errors are hidden
        clearValidationErrors();
      },
    };
  });

  function isAgeSet() {
    return age !== "";
  }

  function isAgeValid() {
    return Number(age) >= ageTarget;
  }

  function isVatNumberSet() {
    return vatNumber !== "";
  }

  function isVatNumberValid() {
    return vatNumber.length === 9;
  }

  function clearValidationErrors() {
    setValidationError("");
  }

  // Render the extension
  return (
    <BlockStack>
      <Heading level="2">{fieldTitle}</Heading>
      {showVatNumberField ? (
        <TextField
          label={vatNumberLabel}
          type="text"
          value={vatNumber}
          onChange={setVatNumber}
          onInput={clearValidationErrors}
          required={canBlockProgress}
          error={validationError}
        />
      ) : (
        <TextField
          label={ageLabel}
          type="number"
          value={age}
          onChange={setAge}
          onInput={clearValidationErrors}
          required={canBlockProgress}
          error={validationError}
        />
      )}
    </BlockStack>
  );
}