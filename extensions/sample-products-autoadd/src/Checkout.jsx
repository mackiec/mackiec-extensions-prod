import { 
  reactExtension, 
  useAttributes, 
  useApplyCartLinesChange, 
  useCartLines,
  useApi,
  View 
} from "@shopify/ui-extensions-react/checkout";
import { useEffect, useRef, useState } from "react";

export default reactExtension("purchase.checkout.block.render", () => <Extension />);

function Extension() {
  // Get attributes, cart lines, and API hooks
  const attributes = useAttributes();
  const cartLines = useCartLines();
  const applyCartLinesChange = useApplyCartLinesChange();
  const { query } = useApi();
  
  // Use a ref to track if we've already processed the products
  const processedRef = useRef(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Find sample products attribute
  const sampleProductsAttribute = attributes.find(attr => attr.key === "_sample_products");
  
  // Parse product IDs
  const sampleProductIds = sampleProductsAttribute
    ? sampleProductsAttribute.value.split(',').map(id => id.trim()).filter(Boolean)
    : [];
  
  // Get the IDs of products already in the cart
  const existingProductIds = cartLines.map(line => {
    // Extract the product ID from the merchandise
    const productId = line.merchandise.product.id;
    return productId;
  });
  
  console.log("Existing product IDs in cart:", existingProductIds);
  console.log("Sample product IDs to add:", sampleProductIds);
    
  // Add sample products to cart automatically when the extension loads
  useEffect(() => {
    // Only run once and if there are products to add
    if (processedRef.current || isProcessing || sampleProductIds.length === 0) return;
    
    const addSampleProductsToCart = async () => {
      setIsProcessing(true);
      try {
        // Process each product ID
        for (const productId of sampleProductIds) {
          // Convert to global ID if needed
          const productGlobalId = productId.startsWith('gid://') 
            ? productId 
            : `gid://shopify/Product/${productId}`;
          
          // Check if this product is already in the cart
          const isProductInCart = existingProductIds.some(id => {
            // Need to normalize the IDs for comparison
            // If the existing ID is a full gid:// format, extract just the numeric part
            const normalizedExistingId = id.includes('/Product/') 
              ? id.split('/Product/')[1] 
              : id;
            
            const normalizedProductId = productGlobalId.includes('/Product/') 
              ? productGlobalId.split('/Product/')[1] 
              : productId;
              
            return normalizedExistingId === normalizedProductId;
          });
          
          if (isProductInCart) {
            console.log(`Product ${productId} is already in the cart, skipping`);
            continue;
          }
          
          // Get the first variant ID for this product
          try {
            console.log(`Fetching variant for product ${productId}`);
            const { data, errors } = await query(
              `query GetProductVariant($id: ID!) {
                product(id: $id) {
                  variants(first: 1) {
                    nodes {
                      id
                    }
                  }
                }
              }`,
              {
                variables: { id: productGlobalId },
              }
            );
            
            if (errors) {
              console.error(`GraphQL errors for product ${productId}:`, errors);
              continue;
            }
            
            if (!data?.product?.variants?.nodes?.length) {
              console.error(`No variants found for product ${productId}`);
              continue;
            }
            
            const variantId = data.product.variants.nodes[0].id;
            console.log(`Found variant ID for product ${productId}: ${variantId}`);
            
            // Add to cart if not already present
            console.log(`Adding product ${productId} (variant ${variantId}) to cart`);
            const result = await applyCartLinesChange({
              type: "addCartLine",
              merchandiseId: variantId,
              quantity: 1
            });
            
            if (result.type === "error") {
              console.error(`Failed to add product ${productId} to cart:`, result.message);
            } else {
              console.log(`Successfully added product ${productId} to cart`);
            }
          } catch (variantError) {
            console.error(`Error fetching variant for product ${productId}:`, variantError);
            continue;
          }
        }
      } catch (error) {
        console.error("Error adding sample products to cart:", error);
      } finally {
        // Mark as processed so we don't try again
        processedRef.current = true;
        setIsProcessing(false);
      }
    };
    
    addSampleProductsToCart();
  }, [sampleProductIds, existingProductIds, applyCartLinesChange, query, isProcessing]);
  
  // Return an empty view (no visible UI)
  return <View />;
}
