import React, { useState } from "react";
import {
  reactExtension,
  BlockStack,
  TextBlock,
  Text,
  useSettings,
  Disclosure,
  InlineLayout,
  View,
  Image,
  Checkbox,
  useApplyMetafieldsChange,
} from "@shopify/ui-extensions-react/checkout";

// Set the entry points for the extension
const checkoutBlock = reactExtension("purchase.checkout.block.render", () => <App />);
export { checkoutBlock };

function App() {
  // Use the merchant-defined settings to retrieve the extension's content
  const {
    title_1: merchantTitle1,
    description_1: merchantDescription1,
    image_1: merchantImage1,
    title_2: merchantTitle2,
    description_2: merchantDescription2,
    image_2: merchantImage2,
    title_3: merchantTitle3,
    description_3: merchantDescription3,
    image_3: merchantImage3
  } = useSettings();

  // Set default titles and descriptions if not provided by the merchant
  const title1 = merchantTitle1 ?? 'Custom Title 1';
  const description1 = merchantDescription1 ?? 'Custom Content 1';
  const title2 = merchantTitle2 ?? 'Custom Title 2';
  const description2 = merchantDescription2 ?? 'Custom Content 2';
  const title3 = merchantTitle3 ?? 'Custom Title 3';
  const description3 = merchantDescription3 ?? 'Custom Content 3';

  // State to control the checked state of the checkboxes
  const [selectedTitle, setSelectedTitle] = useState(null);

  // Metafield configuration
  const METAFIELD_NAMESPACE = "custom";
  const METAFIELD_KEY = "selected_option_title";
  const updateMetafield = useApplyMetafieldsChange();

  // Function to handle checkbox changes
  const handleCheckboxChange = (newChecked, title) => {
    if (newChecked) {
      // Update the metafield with the selected title
      updateMetafield({
        type: "updateMetafield",
        namespace: METAFIELD_NAMESPACE,
        key: METAFIELD_KEY,
        valueType: "string",
        value: title,
      });
      setSelectedTitle(title); // Set the currently selected title
    } else {
      // If the checkbox is unchecked, remove the metafield
      updateMetafield({
        type: "removeMetafield",
        namespace: METAFIELD_NAMESPACE,
        key: METAFIELD_KEY,
      });
      // If the current title matches the unchecked title, reset the selected title
      if (selectedTitle === title) {
        setSelectedTitle(null);
      }
    }
  };

  // Split the descriptions into lines
  const descriptionLines1 = description1.split('\n');
  const descriptionLines2 = description2.split('\n');
  const descriptionLines3 = description3.split('\n');

  // Render the block stack with text blocks inside a Disclosure
  return (
    <BlockStack spacing="base">
      <View border="base" padding="base" cornerRadius="base">
        <InlineLayout blockAlignment="start" spacing="base" columns={['auto', 'fill', 'auto']}>
          <Checkbox 
            checked={selectedTitle === title1} 
            onChange={(newChecked) => handleCheckboxChange(newChecked, title1)} 
            label="" 
          />
          <Text size="medium" emphasis="bold" appearance="interactive">
            {title1}
          </Text>
        </InlineLayout>
        {selectedTitle === title1 && (
          <Disclosure open={selectedTitle === title1}>
            <View id="content" padding="base">
              <BlockStack spacing="tight">
                {descriptionLines1.map((line, index) => (
                  <TextBlock key={index} size="small">
                    {line}
                  </TextBlock>
                ))}
                {merchantImage1 && <Image source={merchantImage1} />}
              </BlockStack>
            </View>
          </Disclosure>
        )}
      </View>
      {merchantTitle2 && merchantDescription2 && (
        <View border="base" padding="base" cornerRadius="base">
          <InlineLayout blockAlignment="start" spacing="base" columns={['auto', 'fill', 'auto']}>
            <Checkbox 
              checked={selectedTitle === title2} 
              onChange={(newChecked) => handleCheckboxChange(newChecked, title2)} 
              label="" 
            />
            <Text size="medium" emphasis="bold" appearance="interactive">
              {title2}
            </Text>
          </InlineLayout>
          {selectedTitle === title2 && (
            <Disclosure open={selectedTitle === title2}>
              <View id="content" padding="base">
                <BlockStack spacing="tight">
                  {descriptionLines2.map((line, index) => (
                    <TextBlock key={index} size="small">
                      {line}
                    </TextBlock>
                  ))}
                  {merchantImage2 && <Image source={merchantImage2} />}
                </BlockStack>
              </View>
            </Disclosure>
          )}
        </View>
      )}
      {merchantTitle3 && merchantDescription3 && (
        <View border="base" padding="base" cornerRadius="base">
          <InlineLayout blockAlignment="start" spacing="base" columns={['auto', 'fill', 'auto']}>
            <Checkbox 
              checked={selectedTitle === title3} 
              onChange={(newChecked) => handleCheckboxChange(newChecked, title3)} 
              label="" 
            />
            <Text size="medium" emphasis="bold" appearance="interactive">
              {title3}
            </Text>
          </InlineLayout>
          {selectedTitle === title3 && (
            <Disclosure open={selectedTitle === title3}>
              <View id="content" padding="base">
                <BlockStack spacing="tight">
                  {descriptionLines3.map((line, index) => (
                    <TextBlock key={index} size="small">
                      {line}
                    </TextBlock>
                  ))}
                  {merchantImage3 && <Image source={merchantImage3} />}
                </BlockStack>
              </View>
            </Disclosure>
          )}
        </View>
      )}
    </BlockStack>
  );
}