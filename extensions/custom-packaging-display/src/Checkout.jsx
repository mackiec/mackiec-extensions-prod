import { useEffect, useState, useRef } from 'react';
import {
  reactExtension,
  useAttributes,
  useSettings,
  useApi,
  BlockSpacer,
  BlockStack,
  Grid,
  Heading,
  Image,
  Text,
  View,
  InlineStack,
} from "@shopify/ui-extensions-react/checkout";

// Set up the extension target
export const CustomPackagingDisplay = reactExtension(
  "purchase.checkout.block.render",
  () => <Extension />
);

function Extension() {
  // Get settings and attributes
  const {
    title,
    text_size,
    option1_name,
    option1_image,
    option2_name,
    option2_image,
    option3_name,
    option3_image,
    packaging_section_title,
    samples_section_title,
    section_title_size,
    packaging_name_size,
    product_title_size,
    info_text_size,
    gift_message_section_title,
  } = useSettings();

  const attributes = useAttributes();
  const { query } = useApi();
  const [sampleProductImages, setSampleProductImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchedIdsRef = useRef('');

  // Find the sample products attribute
  const sampleProductsAttribute = attributes.find(
    (attr) => attr.key === "_sample_products"
  );

  // For debugging
  console.log("All attributes:", attributes);
  console.log("Sample products attribute:", sampleProductsAttribute);

  // Parse product IDs
  const sampleProductIds = sampleProductsAttribute
    ? sampleProductsAttribute.value.split(',').map(id => id.trim())
    : [];
  
  console.log("Sample product IDs:", sampleProductIds);

  // Add a timeout to prevent infinite loading
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.log("Loading timeout reached");
        setIsLoading(false);
        setError("Loading timed out. Please refresh to try again.");
      }
    }, 10000); // 10 seconds timeout
    
    return () => clearTimeout(timeoutId);
  }, [isLoading]);

  // Function to fetch product images
  const fetchProductImages = async (ids) => {
    if (!ids || ids.length === 0) {
      setIsLoading(false);
      return;
    }

    try {
      // Convert IDs to Shopify GraphQL global IDs if they're not already
      const globalIds = ids.map(id => {
        if (id.startsWith('gid://')) return id;
        return `gid://shopify/Product/${id}`;
      });

      console.log("Querying with global IDs:", globalIds);
      
      const { data, errors } = await query(
        `query GetProductImages($ids: [ID!]!) {
          nodes(ids: $ids) {
            ... on Product {
              id
              title
              featuredImage {
                url
                altText
              }
            }
          }
        }`,
        {
          variables: { ids: globalIds },
        }
      );
      
      console.log("Query response:", { data, errors });

      if (errors) {
        console.error('GraphQL errors:', errors);
        setError('Failed to fetch product images');
        setIsLoading(false);
        return;
      }

      // Validate the response structure
      if (!data) {
        console.error('Invalid response structure - no data:', data);
        setError('Invalid response from API');
        setIsLoading(false);
        return;
      }

      // Based on the console output, we need to handle the specific structure
      let productImages = [];
      
      // First try the standard nodes array structure
      if (data.nodes && Array.isArray(data.nodes)) {
        console.log("Processing nodes array");
        productImages = data.nodes
          .filter(node => node && node.featuredImage && node.featuredImage.url)
          .map(node => ({
            id: node.id,
            title: node.title,
            imageUrl: node.featuredImage.url,
            altText: node.featuredImage.altText || node.title
          }));
      } 
      
      // If that didn't work, try to extract from the structure shown in the console output
      if (productImages.length === 0) {
        console.log("Trying to extract from console output structure");
        
        // The console output shows data with numbered keys (0, 1)
        if (typeof data === 'object') {
          // Try to find any objects with featuredImage property
          const extractedImages = [];
          
          // Recursive function to find featuredImage in nested objects
          const findFeaturedImages = (obj, path = '') => {
            if (!obj || typeof obj !== 'object') return;
            
            // If this object has a featuredImage with a url, add it
            if (obj.featuredImage && obj.featuredImage.url) {
              extractedImages.push({
                id: obj.id || `unknown-${path}`,
                title: obj.title || 'Unknown Product',
                imageUrl: obj.featuredImage.url,
                altText: obj.featuredImage.altText || obj.title || 'Product Image'
              });
              return;
            }
            
            // Otherwise search through all properties
            Object.keys(obj).forEach(key => {
              findFeaturedImages(obj[key], `${path}-${key}`);
            });
          };
          
          findFeaturedImages(data);
          
          if (extractedImages.length > 0) {
            console.log("Found images through deep search:", extractedImages);
            productImages = extractedImages;
          }
        }
      }

      console.log("Processed product images:", productImages);
      setSampleProductImages(productImages);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching product images:', err);
      setError('Failed to fetch product images');
      setIsLoading(false);
    }
  };

  // Fetch product images using Storefront API (only once per unique set of IDs)
  useEffect(() => {
    // Create a string representation of the IDs to compare
    const currentIdsString = sampleProductIds.sort().join(',');
    
    // Only fetch if we haven't fetched these exact IDs before
    if (currentIdsString !== fetchedIdsRef.current) {
      console.log("New product IDs detected, fetching images");
      
      if (sampleProductIds.length > 0) {
        setIsLoading(true);
        setError(null);
        fetchProductImages(sampleProductIds);
        // Store the IDs we've fetched
        fetchedIdsRef.current = currentIdsString;
      } else {
        // Make sure we're not stuck in loading state if there are no IDs
        setIsLoading(false);
        console.log("No sample product IDs found, skipping API call");
      }
    } else {
      console.log("Using cached product images for IDs:", currentIdsString);
    }
    
    // No need to include query in dependencies as it would cause unnecessary re-renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sampleProductIds]);

  // Find the packaging attribute
  const packagingAttribute = attributes.find(
    (attr) => attr.key === "_packaging_option"
  );

  // If no attribute found, show a message
  if (!packagingAttribute) {
    return (
      <s-section>
        {title && <Heading>{title}</Heading>}
        {title && <BlockSpacer spacing="loose" />}
        <Grid columns={["1fr", "2fr"]} spacing="base">
          {/* First grid item - No packaging selected message */}
          <View padding="base" border="base" cornerRadius="base">
            <BlockStack spacing="tight" alignment="center">
              <BlockStack spacing="none" alignment="center" inlineAlignment="start">
                <Text size={info_text_size || text_size || "base"} appearance="subdued">
                  No packaging option selected
                </Text>
              </BlockStack>
            </BlockStack>
          </View>
          
          {/* Second grid item - Sample Products (wider) */}
          <View padding="base" border="base" cornerRadius="base">
            <BlockStack spacing="tight" alignment="center">
              {isLoading ? (
                <BlockStack spacing="none" alignment="center" inlineAlignment="start">
                  <Text size={info_text_size || text_size || "base"} appearance="subdued">Loading sample products...</Text>
                </BlockStack>
              ) : error ? (
                <BlockStack spacing="none" alignment="center" inlineAlignment="start">
                  <Text size={info_text_size || text_size || "base"} appearance="critical">{error}</Text>
                </BlockStack>
              ) : sampleProductImages.length > 0 ? (
                <>
                  {/* Section title */}
                  <Text size={section_title_size || text_size || "medium"} emphasis="bold" alignment="start">
                    {samples_section_title || "Sample Products"}
                  </Text>
                  
                  {/* Product titles in fixed height container */}
                  <View blockSize="50px" padding="none">
                    <Grid columns={["1fr", "1fr"]} spacing="base">
                      {sampleProductImages.slice(0, 2).map((product) => (
                        <View key={`title-${product.id}`} padding="none">
                          <BlockStack spacing="none" alignment="center" inlineAlignment="start">
                            <Text size={packaging_name_size || text_size || "medium"} emphasis="bold" truncate>
                              {product.title}
                            </Text>
                          </BlockStack>
                        </View>
                      ))}
                    </Grid>
                  </View>
                  
                  {/* Product images */}
                  <Grid columns={["1fr", "1fr"]} spacing="base">
                    {sampleProductImages.slice(0, 2).map((product) => (
                      <View key={`image-${product.id}`} padding="tight">
                        <BlockStack spacing="none" alignment="center">
                          <View 
                            inlineSize="40px"
                            blockSize="40px"
                            overflow="hidden"
                            padding="none"
                          >
                            <Image
                              source={product.imageUrl}
                              alt={product.altText}
                              fit="contain"
                              inlineSize="100%"
                              blockSize="100%"
                              maxInlineSize="30px"
                              maxBlockSize="30px"
                              borderRadius="base"
                            />
                          </View>
                        </BlockStack>
                      </View>
                    ))}
                  </Grid>
                </>
              ) : (
                  <BlockStack spacing="none" alignment="center" inlineAlignment="start">
                    <Text size={info_text_size || text_size || "base"} appearance="subdued">
                      No sample products selected
                    </Text>
                  </BlockStack>
              )}
            </BlockStack>
          </View>
        </Grid>
        
        {/* Third grid item - Gift Message */}
        <BlockSpacer spacing="base" />
        <View padding="base" border="base" cornerRadius="base">
          <BlockStack spacing="tight" alignment="center">
            {/* Find the gift message attribute */}
            {(() => {
              const giftMessageAttribute = attributes.find(
                (attr) => attr.key === "_gift_message"
              );
              
              if (giftMessageAttribute && giftMessageAttribute.value) {
                return (
                  <>
                    <BlockStack spacing="none" alignment="center" inlineAlignment="start">
                      <Text size={section_title_size || text_size || "medium"} emphasis="bold">
                        {gift_message_section_title || "Gift Message"}
                      </Text>
                    </BlockStack>
                    <View blockSize="50px" padding="none">
                      <BlockStack spacing="none" alignment="center" inlineAlignment="start">
                        <Text size={info_text_size || text_size || "base"}>
                          {giftMessageAttribute.value}
                        </Text>
                      </BlockStack>
                    </View>
                  </>
                );
              } else {
                return (
                  <BlockStack spacing="none" alignment="center" inlineAlignment="start">
                    <Text size={info_text_size || text_size || "base"} appearance="subdued">
                      No gift message provided
                    </Text>
                  </BlockStack>
                );
              }
            })()}
          </BlockStack>
        </View>
      </s-section>
    );
  }

  // Find the matching option
  const selectedValue = packagingAttribute.value;
  let selectedImage = null;

  if (selectedValue === option1_name && option1_image) {
    selectedImage = option1_image;
  } else if (selectedValue === option2_name && option2_image) {
    selectedImage = option2_image;
  } else if (selectedValue === option3_name && option3_image) {
    selectedImage = option3_image;
  }

  // Display the image if found
  return (
    <s-section>
      {title && <Heading>{title}</Heading>}
      {title && <BlockSpacer spacing="loose" />}
      <Grid columns={["1fr", "2fr"]} spacing="base">
        {/* First grid item - Current packaging display */}
        <View padding="base" border="base" cornerRadius="base">
          <BlockStack spacing="tight" alignment="center">
            {/* Section title */}
            <BlockStack spacing="none" alignment="center" inlineAlignment="start">
              <Text size={section_title_size || text_size || "medium"} emphasis="bold">
                {packaging_section_title || "Selected Packaging"}
              </Text>
            </BlockStack>
            
            {selectedImage ? (
              <>
                {/* Fixed height container for product title */}
                <View blockSize="50px" padding="none">
                  <BlockStack spacing="none" alignment="center" inlineAlignment="start">
                    <Text size={packaging_name_size || text_size || "medium"} emphasis="bold">
                      {selectedValue}
                    </Text>
                  </BlockStack>
                </View>
                
                {/* Image container */}
                <View inlineSize="100px" blockSize="100px" overflow="hidden" padding="small">
                  <Image
                    source={selectedImage}
                    alt={`${selectedValue} packaging`}
                    fit="contain"
                    inlineSize="fill"
                    borderRadius="base"
                  />
                </View>
              </>
            ) : (
              <Text size={info_text_size || text_size || "base"} appearance="subdued">
                No matching packaging option found for "{selectedValue}"
              </Text>
            )}
          </BlockStack>
        </View>
        
        {/* Second grid item - Sample Products (wider) */}
        <View padding="base" border="base" cornerRadius="base">
          <BlockStack spacing="tight" alignment="center">
            {isLoading ? (
              <Text size={info_text_size || text_size || "base"} appearance="subdued">Loading sample products...</Text>
            ) : error ? (
              <Text size={info_text_size || text_size || "base"} appearance="critical">{error}</Text>
            ) : sampleProductImages.length > 0 ? (
              <>
                {/* Section title */}
                <BlockStack spacing="none" alignment="center" inlineAlignment="start">
                  <Text size={section_title_size || text_size || "medium"} emphasis="bold">
                    {samples_section_title || "Sample Products"}
                  </Text>
                </BlockStack>
                
                {/* Product titles in fixed height container */}
                <View blockSize="50px" padding="none">
                  <Grid columns={["1fr", "1fr"]} spacing="base">
                    {sampleProductImages.slice(0, 2).map((product) => (
                      <View key={`title-${product.id}`} padding="none">
                        <BlockStack spacing="none" alignment="center" inlineAlignment="start">
                          <Text size={packaging_name_size || text_size || "medium"} emphasis="bold" truncate>
                            {product.title}
                          </Text>
                        </BlockStack>
                      </View>
                    ))}
                  </Grid>
                </View>
                
                {/* Product images */}
                <Grid columns={["1fr", "1fr"]} spacing="base">
                  {sampleProductImages.slice(0, 2).map((product) => (
                    <View key={`image-${product.id}`} padding="tight">
                      <BlockStack spacing="none" alignment="center">
                        <View 
                          inlineSize="40px"
                          blockSize="40px"
                          overflow="hidden"
                          padding="none"
                        >
                          <Image
                            source={product.imageUrl}
                            alt={product.altText}
                            fit="contain"
                            inlineSize="100%"
                            blockSize="100%"
                            maxInlineSize="30px"
                            maxBlockSize="30px"
                            borderRadius="base"
                          />
                        </View>
                      </BlockStack>
                    </View>
                  ))}
                </Grid>
              </>
            ) : (
              <Text size={info_text_size || text_size || "base"} appearance="subdued">
                No sample products selected
              </Text>
            )}
          </BlockStack>
        </View>
      </Grid>
      
        {/* Third grid item - Gift Message */}
        <BlockSpacer spacing="base" />
        <View padding="base" border="base" cornerRadius="base">
          <BlockStack spacing="tight" alignment="center">
            {/* Find the gift message attribute */}
            {(() => {
              const giftMessageAttribute = attributes.find(
                (attr) => attr.key === "_gift_message"
              );
              
              if (giftMessageAttribute && giftMessageAttribute.value) {
                return (
                  <>
                    {/* Section title */}
                    <BlockStack spacing="none" alignment="center" inlineAlignment="start">
                      <Text size={section_title_size || text_size || "medium"} emphasis="bold">
                        {gift_message_section_title || "Gift Message"}
                      </Text>
                    </BlockStack>
                    
                    {/* Fixed height container for message */}
                    <View blockSize="50px" padding="none">
                      <BlockStack spacing="none" alignment="center" inlineAlignment="start">
                        <Text size={info_text_size || text_size || "base"}>
                          {giftMessageAttribute.value}
                        </Text>
                      </BlockStack>
                    </View>
                  </>
                );
              } else {
                return (
                  <BlockStack spacing="none" alignment="center" inlineAlignment="start">
                    <Text size={info_text_size || text_size || "base"} appearance="subdued">
                      No gift message provided
                    </Text>
                  </BlockStack>
                );
              }
            })()}
          </BlockStack>
        </View>
    </s-section>
  );
}
