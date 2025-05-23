import React, { useEffect, useState } from "react";
import {
  Icon,
  reactExtension,
  DatePicker,
  BlockSpacer,
  View,
  InlineLayout,
  Checkbox,
  useApplyMetafieldsChange,
  useMetafield,
  Text,
  Banner,
  useCartLines,
  useAppMetafields,
  useSettings,
  BlockStack,
} from "@shopify/ui-extensions-react/checkout";

// Define that the extension should be rendeerd in the ShippingMethods page, after the methods
reactExtension("purchase.checkout.shipping-option-list.render-after", () => (
  <Extension />
));

// Function that formats dates they way they need to be stored in metafields
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Find the next date that should be selectable by the buyer
function getNextAvailableDate(disabledDateRanges) {
  const lastDisabledDate = disabledDateRanges.reduce((maxDate, range) => {
    const endDate = new Date(range.end);
    return endDate > maxDate ? endDate : maxDate;
  }, new Date(disabledDateRanges[0].end));

  const nextAvailableDate = new Date(lastDisabledDate);
  nextAvailableDate.setDate(nextAvailableDate.getDate() + 2);
  return formatDate(nextAvailableDate);
}

export default function Extension() {
  // Use the merchant-defined settings to retrieve the extension's content
  const {
    title: merchantTitle,
    description: merchantDescription,
    banner_status: merchantBannerStatus,
    icon: merchantIcon,
    background_appearance: merchantBackgroundAppearance,
    icon_appearance: merchantIconAppearance,
    text_appearance: merchantTextAppearance,
  } = useSettings();

  // Set default values
  const title = merchantTitle ?? "Not going to be at home?";
  const description = merchantDescription ?? "Yes - I'll choose a delivery date.";
  const bannerStatus = merchantBannerStatus ?? "info";
  const iconSource = merchantIcon ?? "truck";
  const backgroundAppearance = merchantBackgroundAppearance ?? "subdued";
  const iconAppearance = merchantIconAppearance ?? "monochrome";
  const textAppearance = merchantTextAppearance ?? "accent";

  // Set the metafield namespace and key you want to store data to on the order
  const METAFIELD_NAMESPACE = "custom";
  const METAFIELD_KEY = "delivery_date";

  // Make X days into the future unselectable, here X=2
  // Consider making this configurable by merchant, and handle weekends differently.
  const currentDate = new Date();
  const twoDaysFromNow = new Date(currentDate);
  twoDaysFromNow.setDate(currentDate.getDate() + 2);

  // Make all past dates unselectable, up to X days from now as set above
  const disableDateRanges = [
    {
      start: "0001-01-01", // Minimum possible date
      end: formatDate(twoDaysFromNow),
    },
  ];

  // Set states
  const initialSelectedDate = getNextAvailableDate(disableDateRanges);
  const [selectedDate, setSelectedDate] = useState(initialSelectedDate);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [hasShowDatePickerMetafield, setHasShowDatePickerMetafield] =
    useState("false");
  const cartLines = useCartLines();
  const appMetafields = useAppMetafields();
  const updateMetafield = useApplyMetafieldsChange();
  const requestedShippingDateMetafield = useMetafield({
    namespace: METAFIELD_NAMESPACE,
    key: METAFIELD_KEY,
  });

  // Handle when the checkbox is checked. 
  // If the checkbox is unchecked by the buyer, unset (delete) the metafield
  const handleCheckboxChange = (isChecked) => {
    setShowDatePicker(isChecked);
    if (!isChecked) {
      updateMetafield({
        type: "removeMetafield",
        namespace: METAFIELD_NAMESPACE,
        key: METAFIELD_KEY,
      });
    }
  };

  // Handle when a buyer selects a new date
  const handleDateChange = (newSelectedDate) => {
    setSelectedDate(newSelectedDate);
    if (showDatePicker) {
      updateMetafield({
        type: "updateMetafield",
        namespace: METAFIELD_NAMESPACE,
        key: METAFIELD_KEY,
        valueType: "string",
        value: newSelectedDate,
      });
    }
  };

  // Check if any product in the cart has the show_shipping_date_picker metafield set to true
  useEffect(() => {
    for (const cartLine of cartLines) {
      const product = cartLine.merchandise.product;
      product.id = String(product.id.match(/(\d+)$/)[0]);
      for (const metafieldEntry of appMetafields) {
        if (
          metafieldEntry.target.type === "product" &&
          metafieldEntry.target.id === product.id &&
          metafieldEntry.metafield.namespace === "custom" &&
          metafieldEntry.metafield.key === "show_date_picker" &&
          metafieldEntry.metafield.value === "true"
        ) {
          setHasShowDatePickerMetafield("true");
          break;
        }
      }
      if (hasShowDatePickerMetafield === "true") {
        break;
      }
    }
  }, [cartLines, appMetafields, hasShowDatePickerMetafield]);

  // Boolean to check if Express is selected
  const isExpressSelected = () => {
    if (
      target !== "purchase.checkout.shipping-option-list.render-after" ||
      !deliveryGroups
    ) {
      return false;
    }

    const expressHandle = deliveryGroups[0].deliveryOptions.find(
      (method) => method.title === "Express"
    )?.handle;

    return expressHandle === deliveryGroups[0].selectedDeliveryOption?.handle
      ? true
      : false;
  };

  // Render the checkbox and datepicker
  return (
    <>
      {hasShowDatePickerMetafield === "true" && (
        <>
          <BlockStack>
            <View maxInlineSize={700} background={bannerStatus === "info" ? backgroundAppearance : undefined} padding="base">
              <BlockStack spacing="loose">
                <InlineLayout blockAlignment="center" spacing="small100" columns={['auto', 'fill']}> 
                  <Icon source={iconSource} appearance={iconAppearance}></Icon>
                  <Text size="medium" appearance={textAppearance} emphasis="bold">
                    {title}
                  </Text>
                </InlineLayout>
                <Checkbox
                  id="showDatePicker"
                  name="showDatePicker"
                  onChange={handleCheckboxChange}
                >
                  {description}
                </Checkbox>
              </BlockStack>
            </View>
          </BlockStack>
        </>
      )}
      <BlockSpacer spacing="loose" />
      {hasShowDatePickerMetafield === "true" && showDatePicker && (
        <DatePicker
          selected={selectedDate}
          disabled={disableDateRanges}
          onChange={handleDateChange}
        />
      )}
    </>
  );
}
