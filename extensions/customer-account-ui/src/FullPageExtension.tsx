import { useEffect, useState } from 'react'
import {
  reactExtension,
  useApi,
  Grid,
  BlockStack,
  TextBlock,
  Button,
  Image,
  Page, 
  ResourceItem,
  SkeletonImage,
  SkeletonText,
} from "@shopify/ui-extensions-react/customer-account";

export default reactExtension(
  "customer-account.page.render",
  () => <FullPageExtension />
);
interface Product { 
  id: string;
  title: string;
  onlineStoreUrl: string;
  featuredImage: {
    url: string;
  }
  priceRange: {
    minVariantPrice: {
      amount: number;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: number;
      currencyCode: string;
    };
  };
}

function FullPageExtension() {
  const { i18n, query } = useApi<"customer-account.page.render">();
  const [wishlist, setWishlist] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [removeLoading, setRemoveLoading] = useState({id: null, loading: false})

  async function fetchWishlist() {
    setLoading(true);

    try {
      // Implement a server request to retrieve the wishlist for this customer
      // Then call the Storefront API to retrieve the details of the wishlisted products
      const data = await query<{ products: { nodes: Product[] }}>(
        `query ($first: Int!) {
          products(first: $first) {
            nodes {
              id
              title
              onlineStoreUrl
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
                maxVariantPrice {
                  amount
                  currencyCode
                }
              }
              featuredImage {
                url
              }
            }
          }
        }`,
        {
          variables: {first: 10},
        },
      );
      setLoading(false);
      setWishlist(data.data?.products?.nodes || [])
    } catch (error) {
      setLoading(false);
      console.log(error)
    }
  }

  async function deleteWishlistItem(id: string) {
    // Simulate a server request
    setRemoveLoading({loading: true, id});
    return new Promise<void>((resolve) => {
      setTimeout(() => {

      // Send a request to your server to delete the wishlist item
      setWishlist(wishlist.filter((item) => item.id !== id))

      setRemoveLoading({loading: false, id: null});
      resolve();
    }, 750)});
  }

  useEffect(() => {
    fetchWishlist();
  }, [])

  return (
  <Page title="Wishlist">
    <Grid columns={['fill', 'fill', 'fill']} rows="auto" spacing="loose">
      {loading && <ResourceItem loading>
        <BlockStack spacing="base">
          <SkeletonImage inlineSize="fill" aspectRatio={1} blockSize="fill" />
          <BlockStack spacing="none">
            <SkeletonText inlineSize="base" />
          </BlockStack>
          <SkeletonText inlineSize="small" />
        </BlockStack>
      </ResourceItem>}
      {!loading && wishlist.length > 0 && wishlist.map((product) => {
          return (
            <ResourceItem loading={loading} key={product.id} action={
              <>
                <Button
                  kind='primary'
                  to={product.onlineStoreUrl}
                >
                  View product
                </Button>
                <Button
                  kind='secondary'
                  loading={removeLoading.loading && product.id === removeLoading.id}
                  onPress={() => {
                    deleteWishlistItem(product.id)
                  }}
                >
                  Remove
                </Button>
              </>
            }>
              <BlockStack spacing="base">
              <Image source={product.featuredImage.url}></Image>
              <TextBlock emphasis="bold">{product.title}</TextBlock>
              <TextBlock appearance="subdued">
              {i18n.formatCurrency(product.priceRange.minVariantPrice.amount, {currency: product.priceRange.minVariantPrice.currencyCode})}
              </TextBlock>
              </BlockStack>
            </ResourceItem>
          )
        })
      }
      {!loading && wishlist.length === 0 && <TextBlock>No items in your wishlist.</TextBlock>}
      </Grid>
  </Page>
  );
}
