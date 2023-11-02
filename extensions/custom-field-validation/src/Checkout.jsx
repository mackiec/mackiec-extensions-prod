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
  // Set the target age that a buyer must be to complete an order
  const { ageTarget = 18, fieldTitle, showVatNumberField } = useSettings();

  // Set up the app state
  const [age, setAge] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [validationError, setValidationError] = useState("");
  const canBlockProgress = useExtensionCapability("block_progress");
  const ageLabel = canBlockProgress ? "Your age" : "Your age (optional)";
  const vatNumberLabel = canBlockProgress ? "VAT Number" : "VAT Number (optional)";

  // Use the `buyerJourney` intercept to conditionally block checkout progress
  useBuyerJourneyIntercept(({ canBlockProgress }) => {
    // Validate that the age of the buyer is known, and that they're old enough to complete the purchase
    if (canBlockProgress && !showVatNumberField && !isAgeSet()) {
      return {
        behavior: "block",
        reason: "Age is required",
        perform: (result) => {
          // If progress can be blocked, then set a validation error on the custom field
          if (result.behavior === "block") {
            setValidationError("Enter your age");
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
            message:
              "You're not legally old enough to buy some of the items in your cart.",
          },
        ],
      };
    }

    if (canBlockProgress && showVatNumberField) {
      if (!isVatNumberSet()) {
        return {
          behavior: "block",
          reason: "VAT number is required",
          perform: (result) => {
            if (result.behavior === "block") {
              setValidationError("VAT number is required");
            }
          },
        };
      }

      if (!isVatNumberValid()) {
        return {
          behavior: "block",
          reason: "Invalid VAT number",
          errors: [
            {
              message: "Invalid VAT number",
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