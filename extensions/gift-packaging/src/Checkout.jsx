import React, { useState } from "react";
import {
  reactExtension,
  TextField,
  BlockStack,
  useApplyMetafieldsChange,
  useMetafield,
  Checkbox,
  Text,
  BlockSpacer,
  InlineLayout,
  Icon,
  View,
  Choice,
  ChoiceList,
  InlineStack,
  Image,
  useSettings,
} from "@shopify/ui-extensions-react/checkout";

// Set the entry point for the extension
export default reactExtension("purchase.checkout.block.render", () => {
  return <App />;
});

function App() {
  const {
    OptionTwo: merchantOptionTwo, 
    image_two: merchantImageTwo,
    OptionOne: merchantOptionOne, 
    image_one: merchantImageOne,
    choice_title: merchantChoiceTitle,
    section_title: merchantSectionTitle,
    section_prompt: merchantSectionPrompt,
    text_field_desc: merchantTextFieldDescription,
    background_appearance: merchantBackgroundAppearance,
    icon_appearance: merchantIconAppearance,
    text_appearance: merchantTextAppearance,
    choice_text_appearance: merchantChoiceTextAppearance,
  } = useSettings();

  const OptionOne = merchantOptionOne ?? 'Option One';
  const OptionTwo = merchantOptionTwo ?? 'Option Two';
  const choice_title = merchantChoiceTitle ?? 'Choice Title';
  const section_title = merchantSectionTitle ?? 'Section Title';
  const section_prompt = merchantSectionPrompt ?? 'Section Prompt';
  const text_field_desc = merchantTextFieldDescription ?? 'Text Field Description';
  const backgroundAppearance = merchantBackgroundAppearance ?? "subdued";
  const iconAppearance = merchantIconAppearance ?? "monochrome";
  const textAppearance = merchantTextAppearance ?? "accent";
  const choiceTextAppearance = merchantChoiceTextAppearance ?? "accent";

  // Define placeholder images
  const placeholderImageSilver = "https://cdn.shopify.com/s/files/1/0669/6809/2894/files/360_F_655298366_WfWIlJ1VKXesygLrYluFbDL6EdbdpuE1.png?v=1743699033"; // Placeholder for silver packaging
  const placeholderImageGold = "https://cdn.shopify.com/s/files/1/0669/6809/2894/files/photo-1545873509-33e944ca7655.png?v=1743699027"; // Placeholder for gold packaging

  // Set up the checkbox state
  const [checked, setChecked] = useState(false);
  const [senderName, setSenderName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [packagingOption, setPackagingOption] = useState("gold"); // Default packaging option

  // Define the metafield namespace and keys
  const metafieldNamespace = "custom";
  const giftMessageKey = "gift_message"; // Key for gift message
  const senderNameKey = "sender_name"; // Key for sender's name
  const recipientNameKey = "recipient_name"; // Key for recipient's name
  const packagingKey = "packaging_option"; // Key for packaging option

  // Get references to the metafields
  const giftMessage = useMetafield({
    namespace: metafieldNamespace,
    key: giftMessageKey,
  });

  // Set a function to handle updating metafields
  const applyMetafieldsChange = useApplyMetafieldsChange();

  // Handle when the checkbox is checked.
  const handleCheckboxChange = (isChecked) => {
    setChecked(isChecked);
    if (!isChecked) {
      applyMetafieldsChange({
        type: "removeMetafield",
        namespace: metafieldNamespace,
        key: giftMessageKey,
      });
      applyMetafieldsChange({
        type: "removeMetafield",
        namespace: metafieldNamespace,
        key: senderNameKey,
      });
      applyMetafieldsChange({
        type: "removeMetafield",
        namespace: metafieldNamespace,
        key: recipientNameKey,
      });
      applyMetafieldsChange({
        type: "removeMetafield",
        namespace: metafieldNamespace,
        key: packagingKey,
      });
      // Reset fields when unchecked
      setSenderName("");
      setRecipientName("");
      setPackagingOption("gold"); // Reset packaging option
    }
  };

  // Update the metafields when any of the inputs change
  const updateMetafields = () => {
    applyMetafieldsChange({
      type: "updateMetafield",
      namespace: metafieldNamespace,
      key: senderNameKey,
      valueType: "string",
      value: senderName,
    });
    applyMetafieldsChange({
      type: "updateMetafield",
      namespace: metafieldNamespace,
      key: recipientNameKey,
      valueType: "string",
      value: recipientName,
    });
    applyMetafieldsChange({
      type: "updateMetafield",
      namespace: metafieldNamespace,
      key: packagingKey,
      valueType: "string",
      value: packagingOption,
    });
  };

  // Render the extension components
  return (
    <BlockStack>
      <View maxInlineSize={700} background={backgroundAppearance} padding="loose">
        <InlineLayout blockAlignment="center" spacing="small100" columns={['auto', 'fill']}> 
          <Icon source="note" appearance={iconAppearance}></Icon>
          <Text size="medium" appearance={textAppearance} emphasis="bold">
            {section_title}
          </Text>
        </InlineLayout>
        <BlockSpacer spacing="loose" />
        <Checkbox checked={checked} onChange={handleCheckboxChange}>
          <Text>{section_prompt}</Text>
        </Checkbox>
        {checked && (
          <>
            <BlockSpacer spacing="loose" />
            <InlineLayout spacing="tight">
              <TextField
                label="Sender's Name"
                maxLength={25}
                onChange={(value) => {
                  setSenderName(value);
                  updateMetafields();
                }}
                value={senderName}
              />
              <TextField
                label="Recipient's Name"
                maxLength={25}
                onChange={(value) => {
                  setRecipientName(value);
                  updateMetafields();
                }}
                value={recipientName}
              />
            </InlineLayout>
            <BlockSpacer spacing="loose" />
            <TextField
              label={text_field_desc}
              multiline={3}
              maxLength={100}
              onChange={(value) => {
                // Apply the change to the metafield
                applyMetafieldsChange({
                  type: "updateMetafield",
                  namespace: metafieldNamespace,
                  key: giftMessageKey,
                  valueType: "string",
                  value,
                });
              }}
              value={giftMessage?.value}
            />
            <BlockSpacer spacing="loose" />
            <Text size="medium" appearance={choiceTextAppearance} emphasis="bold">
              {choice_title}
            </Text>
            <BlockSpacer spacing="loose" />
            <InlineStack spacing="loose">
              <ChoiceList
                name="packaging"
                value={packagingOption}
                onChange={(value) => {
                  setPackagingOption(value);
                  updateMetafields();
                }}
              >
                <Choice id="gold">
                  <Text>{OptionOne}</Text>
                  <BlockSpacer spacing="tight" />
                  <Image // Set the aspect ratio to 1:1
                    source={merchantImageOne || placeholderImageGold} // Use placeholder if no image
                    fit="contain" 
                    cornerRadius="fullyRounded"
                  />
                </Choice>
                <Choice id="silver">
                  <Text>{OptionTwo}</Text>
                  <BlockSpacer spacing="tight" />
                  <Image // Set the width of the image
                    source={merchantImageTwo || placeholderImageSilver} // Use placeholder if no image
                    fit="contain" 
                    cornerRadius="fullyRounded"
                  />
                </Choice>
              </ChoiceList>
            </InlineStack>
          </>
        )}
      </View>
    </BlockStack>
  );
}
