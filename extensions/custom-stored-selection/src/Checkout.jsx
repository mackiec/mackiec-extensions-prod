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

  // Set a default status for the banner if a merchant didn't configure the banner in the checkout editor
  const title1 = merchantTitle1 ?? 'Custom Title 1';
  const description1 = merchantDescription1 ?? 'Custom Content 1';
  const title2 = merchantTitle2 ?? 'Custom Title 2';
  const description2 = merchantDescription2 ?? 'Custom Content 2';
  const title3 = merchantTitle3 ?? 'Custom Title 3';
  const description3 = merchantDescription3 ?? 'Custom Content 3';

  // State to control the checked state of the checkboxes
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(false);

  // Split the descriptions into lines
  const descriptionLines1 = description1.split('\n');
  const descriptionLines2 = description2.split('\n');
  const descriptionLines3 = description3.split('\n');

  // Render the block stack with text blocks inside a Disclosure
  return (
    <BlockStack spacing="base">
      <View border="base" padding="base" cornerRadius="base">
        <InlineLayout blockAlignment="start" spacing="base" columns={['auto', 'fill', 'auto']}>
          <Checkbox checked={checked1} onChange={(newChecked) => {
            setChecked1(newChecked);
            if (newChecked) {
              setChecked2(false);
              setChecked3(false);
            }
          }} label="" />
          <Text size="medium" emphasis="bold" appearance="interactive">
            {title1}
          </Text>
        </InlineLayout>
        {checked1 && (
          <Disclosure open={checked1}>
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
            <Checkbox checked={checked2} onChange={(newChecked) => {
              setChecked2(newChecked);
              if (newChecked) {
                setChecked1(false);
                setChecked3(false);
              }
            }} label="" />
            <Text size="medium" emphasis="bold" appearance="interactive">
              {title2}
            </Text>
          </InlineLayout>
          {checked2 && (
            <Disclosure open={checked2}>
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
            <Checkbox checked={checked3} onChange={(newChecked) => {
              setChecked3(newChecked);
              if (newChecked) {
                setChecked1(false);
                setChecked2(false);
              }
            }} label="" />
            <Text size="medium" emphasis="bold" appearance="interactive">
              {title3}
            </Text>
          </InlineLayout>
          {checked3 && (
            <Disclosure open={checked3}>
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