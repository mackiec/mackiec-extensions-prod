import React, { useState } from "react";
import {
  reactExtension,
  BlockStack,
  TextBlock,
  Text,
  useSettings,
  Disclosure,
  Pressable,
  InlineLayout,
  Icon,
  View,
  Image,
} from "@shopify/ui-extensions-react/checkout";

// Set the entry points for the extension
const checkoutBlock = reactExtension("purchase.checkout.block.render", () => <App />);
export { checkoutBlock };

function App() {
  // Use the merchant-defined settings to retrieve the extension's content
  const { 
    title: merchantTitle, 
    description: merchantDescription, 
    image: merchantImage, 
    icon: merchantIcon, 
    is_collapsible,
    title_size,
  } = useSettings();

  // Set default values
  const title = merchantTitle ?? 'Custom Title';
  const description = merchantDescription ?? 'Add an additional description';
  const icon = merchantIcon ?? 'note'; // Default icon

  // State to control the open state of the disclosure
  const [openIds, setOpenIds] = useState([]);

  // Split the description into lines
  const descriptionLines = description.split('\n');

  // Render the block stack with text blocks inside a Disclosure
  return (
    <View border="base" padding="base" cornerRadius="base">
      {is_collapsible && ( // Only render Disclosure if collapsible
        <Disclosure onToggle={(open) => setOpenIds(open)}>
          <Pressable toggles="content" padding="base">
            <InlineLayout blockAlignment="start" spacing="base" columns={['auto', 'fill', 'auto']}>
              <Icon source={icon} appearance="accent"/> {/* Use the selected icon */}
              <Text size={title_size} emphasis="bold">
                {title}
              </Text>
              <Icon source={openIds.includes('content') ? "chevronUp" : "chevronDown"} appearance="accent" />
            </InlineLayout>
          </Pressable>
          <View id="content" padding="base">
            <BlockStack spacing="loose">
              {descriptionLines.map((line, index) => (
                <TextBlock key={index} size="base">
                  {line}
                </TextBlock>
              ))}
              {merchantImage && <Image source={merchantImage} />}
            </BlockStack>
          </View>
        </Disclosure>
      )}
      {!is_collapsible && ( // Render content directly if not collapsible
        <View padding="base">
          <BlockStack spacing="loose">
            <Text size={title_size} emphasis="bold">
              {title}
            </Text>
            {descriptionLines.map((line, index) => (
              <TextBlock key={index} size="base">
                {line}
              </TextBlock>
            ))}
            {merchantImage && <Image source={merchantImage} />}
          </BlockStack>
        </View>
      )}
    </View>
  );
}