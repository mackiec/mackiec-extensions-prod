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
    content: merchantContent, 
    image: merchantImage, 
    icon: merchantIcon, 
    is_collapsible: merchantIsCollapsible,
    title_size: merchantTitleSize,
    icon_appearance: merchantIconAppearance,
  } = useSettings();

  // Set default values
  const title = merchantTitle ?? 'Important Information';
  const description = merchantContent ?? 'This is some important information about your order.';
  const icon = merchantIcon ?? 'info'; // Default icon
  const titleSize = merchantTitleSize ?? 'medium';
  const iconAppearance = merchantIconAppearance ?? 'accent';
  const isCollapsible = merchantIsCollapsible ?? false;

  // State to control the open state of the disclosure
  const [openIds, setOpenIds] = useState([]);

  // Split the description into lines
  const descriptionLines = description.split('\n');

  // Render the block stack with text blocks inside a Disclosure
  return (
    <View border="base" padding="base" cornerRadius="base">
      {isCollapsible && ( // Only render Disclosure if collapsible
        <Disclosure onToggle={(open) => setOpenIds(open)}>
          <Pressable toggles="content" padding="base">
            <InlineLayout blockAlignment="start" spacing="base" columns={['auto', 'fill', 'auto']}>
              <Icon source={icon} appearance={iconAppearance}/> {/* Use the selected icon */}
              <Text size={titleSize} emphasis="bold">
                {title}
              </Text>
              <Icon source={openIds.includes('content') ? "chevronUp" : "chevronDown"} appearance={iconAppearance} />
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
      {!isCollapsible && ( // Render content directly if not collapsible
        <View padding="base">
          <BlockStack spacing="loose">
            <InlineLayout blockAlignment="start" spacing="base" columns={['auto', 'fill']}>
              <Icon source={icon} appearance={iconAppearance}/> {/* Add icon to non-collapsible view */}
              <Text size={titleSize} emphasis="bold">
                {title}
              </Text>
            </InlineLayout>
            {descriptionLines.map((line, index) => (
              <TextBlock key={index} size="base">
                {line}
              </TextBlock>
            ))}
            {merchantImage && (
              <BlockStack spacing="tight">
                <Image source={merchantImage} />
              </BlockStack>
            )}
          </BlockStack>
        </View>
      )}
    </View>
  );
}
