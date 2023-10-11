import React, {useEffect, useState} from 'react';
import {
  useApi,
  reactExtension,
  BlockStack,
  BlockSpacer,
  TextBlock,
  useCartLineTarget,
  View,
  useSettings,
} from '@shopify/ui-extensions-react/checkout';

const checkoutBlock = reactExtension("purchase.checkout.cart-line-item.render-after", () => <App />);
export { checkoutBlock };

function App() {
  const {style: merchantAppearance} = useSettings();
  const style = merchantAppearance ?? 'info';
  const [data, setData] = useState();
  const {merchandise} = useCartLineTarget();
  const prodID = merchandise.product.id;
  const {query} = useApi();

  useEffect(() => {
    query(
      `query ($id: ID!) {
        product(id: $id) {
          id
          title
          metafield(namespace: "custom", key: "product_data") {
            id
            value
          }
        }
      }`,
      {
        variables: {id: prodID},
      },
    )
      .then(({data, errors}) => setData(data))
      .catch(console.error);
  }, [query]);
  console.log(data);

  return (
    <View>
      <BlockSpacer spacing="tight"/>
      <BlockStack>
        <TextBlock size='small' appearance={style} inlineAlignment='start'>{data?.product?.metafield?.value}</TextBlock>
      </BlockStack>
      <BlockSpacer spacing="tight"/>
    </View>
  );
}