import {
  reactExtension,
  Banner,
  Text,
  Heading,
  useSettings,
  useApi,
  BlockStack,
  Button,
  InlineStack,
  Link,
  Modal,
  TextField,
} from "@shopify/ui-extensions-react/checkout";
import { useState } from "react";

// Set the entry point for the extension
export default reactExtension("purchase.thank-you.announcement.render", () => <App />);

function App() {
  const [surveyResponse, setSurveyResponse] = useState("");
  const [surveySubmitted, setSurveySubmitted] = useState(false);
  
  // Use the extension API to gather context from the shop
  const { shop } = useApi();
  
  // Use the merchant-defined settings to retrieve the extension's content
  const {
    show_heading: showHeading,
    title: merchantTitle,
    show_message: showMessage,
    message: merchantMessage,
    enable_survey_prompt: enableSurveyPrompt,
    survey_text: surveyText,
    survey_link_text: surveyLinkText,
    survey_modal_title: surveyModalTitle,
    survey_modal_description: surveyModalDescription,
    survey_field_label: surveyFieldLabel,
    survey_submit_text: surveySubmitText,
    survey_thank_you_message: surveyThankYouMessage
  } = useSettings();

  // Helper function to replace {shop_name} placeholder
  const replaceShopName = (text) => {
    return text?.replace(/{shop_name}/g, shop.name) || '';
  };

  // Set default values if merchant didn't configure the announcement
  const title = merchantTitle ?? 'We Appreciate Your Support!';
  const message = merchantMessage ?? 'Thanks so much for purchasing from our store.';
  const showSurvey = enableSurveyPrompt ?? false;

  const handleSurveySubmit = async () => {
    if (!surveyResponse.trim()) return;
    
    setSurveySubmitted(true);
    
    // Prepare survey data for logging and potential server submission
    const surveyData = {
      surveyResponse: surveyResponse.trim(),
      shopDomain: shop.primaryDomain?.url || shop.myshopifyDomain,
      shopName: shop.name,
      timestamp: new Date().toISOString(),
      // Note: We don't have direct access to order ID in this target
      // The server will need to find the order by timestamp/customer/shop or other means
    };
    
    // Log the survey response to console for development/debugging
    console.log('Survey Response Submitted:', surveyData);
    
    try {
      // OPTIONAL: Send survey response to your app server
      // 
      // IMPLEMENTATION GUIDE:
      // 1. Replace '/api/survey-response' with your actual app server endpoint
      // 2. Ensure your server can handle CORS if needed
      // 3. Your server endpoint should:
      //    - Receive this survey data
      //    - Find the most recent order for this shop around the timestamp
      //    - Add the survey response as an order note using Admin API:
      //      mutation orderUpdate($input: OrderInput!) {
      //        orderUpdate(input: $input) {
      //          order { id note }
      //          userErrors { field message }
      //        }
      //      }
      //    - OR save as order metafield using Admin API
      //    - OR store in your own database for analytics
      // 4. Handle authentication (you may need to include shop token)
      
      /* UNCOMMENT TO ENABLE SERVER SUBMISSION:
      const response = await fetch('/api/survey-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication headers if needed:
          // 'Authorization': `Bearer ${shopifyToken}`,
          // 'X-Shopify-Shop-Domain': shop.myshopifyDomain,
        },
        body: JSON.stringify(surveyData),
      });
      
      if (!response.ok) {
        console.error('Failed to save survey response:', response.statusText);
      } else {
        console.log('Survey response successfully saved to server');
      }
      */
      
    } catch (error) {
      console.error('Error submitting survey response:', error);
      // Still show success message to user even if server call failed
      // This ensures good UX even if there are server issues
    }
  };

  // Don't render anything if both heading and message are hidden
  if (!showHeading && !showMessage && !showSurvey) {
    return null;
  }

  return (
    <BlockStack spacing="base">
      {/* Heading and message structure - only show if enabled */}
      {(showHeading || showMessage) && (
        <BlockStack spacing="tight">
          {showHeading && (
            <Heading level={2}>{title}</Heading>
          )}
          {showMessage && (
            <Text size="base">{message}</Text>
          )}
        </BlockStack>
      )}

      {/* Survey section - following the official sample pattern */}
      {showSurvey && !surveySubmitted && (
        <InlineStack>
          <Text>{replaceShopName(surveyText) || `Help us improve ${shop.name}`}</Text>
          <Link
            overlay={
              <Modal
                title={surveyModalTitle || "Tell us about your shopping experience"}
                padding
              >
                <BlockStack spacing="base">
                  <Text>
                    {replaceShopName(surveyModalDescription) || `We'd love to hear about your shopping experience at ${shop.name}`}
                  </Text>
                  <TextField
                    multiline={4}
                    label={surveyFieldLabel || "How did you hear about us?"}
                    value={surveyResponse}
                    onChange={setSurveyResponse}
                  />
                  <Button onPress={handleSurveySubmit}>
                    {surveySubmitText || "Submit"}
                  </Button>
                </BlockStack>
              </Modal>
            }
          >
            {surveyLinkText || "Fill out our survey"}
          </Link>
        </InlineStack>
      )}

      {/* Thank you message after survey */}
      {showSurvey && surveySubmitted && (
        <Text>
          {replaceShopName(surveyThankYouMessage) || `We appreciate you taking the time to help us improve ${shop.name}!`}
        </Text>
      )}
    </BlockStack>
  );
}