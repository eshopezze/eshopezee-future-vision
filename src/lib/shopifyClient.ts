/**
 * Shopify Storefront GraphQL Client
 * Handles direct API calls to Shopify's Storefront API
 */

const SHOPIFY_STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ACCESS_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_ACCESS_TOKEN) {
  console.error('Missing Shopify credentials in environment variables');
}

const SHOPIFY_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`;

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

/**
 * Execute a GraphQL query against Shopify Storefront API
 */
async function shopifyFetch<T>(query: string): Promise<T> {
  const response = await fetch(SHOPIFY_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
  }

  const json: GraphQLResponse<T> = await response.json();

  if (json.errors) {
    throw new Error(`GraphQL error: ${json.errors[0]?.message || 'Unknown error'}`);
  }

  if (!json.data) {
    throw new Error('No data returned from Shopify API');
  }

  return json.data;
}

interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  compareAtPriceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  featuredImage: {
    url: string;
    altText: string | null;
  } | null;
  variants: {
    edges: Array<{
      node: {
        id: string;
        price: {
          amount: string;
        };
        compareAtPrice: {
          amount: string;
        } | null;
      };
    }>;
  };
}

interface CollectionData {
  collection: {
    title: string;
    products: {
      edges: Array<{
        node: Product;
      }>;
    };
  } | null;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

interface AllProductsData {
  products: {
    edges: Array<{
      cursor: string;
      node: Product;
    }>;
    pageInfo: PageInfo;
  };
}

export interface PaginatedProducts {
  products: FormattedProduct[];
  pageInfo: PageInfo;
}

export interface FormattedProduct {
  id: string;
  variantId: string;
  name: string;
  handle: string;
  description: string;
  price: number;
  originalPrice: number | null;
  image: string | null;
  rating: number;
  reviews: number;
}

export interface ShopifyPage {
  id: string;
  title: string;
  handle: string;
  body: string;
  bodySummary: string;
}

export interface CollectionInfo {
  id: string;
  title: string;
  handle: string;
  image?: {
    url: string;
    altText: string | null;
  } | null;
}

export interface CartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: {
      title: string;
      handle: string;
      featuredImage: {
        url: string;
      } | null;
    };
    price: {
      amount: string;
    };
    compareAtPrice: {
      amount: string;
    } | null;
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  lines: CartLine[];
  totalQuantity: number;
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
    subtotalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
}

export interface ShopifyAddress {
  id: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2: string | null;
  city: string;
  province: string;
  zip: string;
  country: string;
  phone: string | null;
}

export interface ShopifyOrder {
  id: string;
  orderNumber: number;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  subtotalPrice?: {
    amount: string;
    currencyCode: string;
  };
  totalTax?: {
    amount: string;
    currencyCode: string;
  };
  totalShippingPrice?: {
    amount: string;
    currencyCode: string;
  };
  shippingAddress?: ShopifyAddress;
  successfulFulfillments?: Array<{
    trackingCompany?: string;
    trackingInfo: Array<{
      number: string;
      url: string;
    }>;
  }>;
  lineItems: {
    edges: Array<{
      node: {
        title: string;
        quantity: number;
        variant: {
          image: {
            url: string;
          } | null;
          product?: {
            featuredImage?: {
              url: string;
            };
          };
        } | null;
      };
    }>;
  };
}

export interface ShopifyCustomer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  addresses?: {
    edges: Array<{ node: ShopifyAddress }>;
  };
  orders?: {
    edges: Array<{ node: ShopifyOrder }>;
  };
}

interface AllCollectionsData {
  collections: {
    edges: Array<{
      node: CollectionInfo;
    }>;
  };
}

/**
 * Fetch products from a Shopify collection by handle
 */
export async function fetchCollectionProducts(handle: string): Promise<{
  collectionTitle: string;
  products: FormattedProduct[];
}> {
  const query = `{
    collection(handle: "${handle}") {
      title
      products(first: 20) {
        edges {
          node {
            id
            title
            handle
            description
            availableForSale
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
            compareAtPriceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            featuredImage {
              url
              altText
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  price {
                    amount
                  }
                  compareAtPrice {
                    amount
                  }
                }
              }
            }
          }
        }
      }
    }
  }`;

  const data = await shopifyFetch<CollectionData>(query);

  if (!data.collection) {
    return {
      collectionTitle: 'Collection',
      products: [],
    };
  }

  const products: FormattedProduct[] = data.collection.products.edges.map((edge) => {
    const p = edge.node;
    const variant = p.variants?.edges[0]?.node;

    return {
      id: p.id,
      variantId: variant?.id || p.id,
      name: p.title,
      handle: p.handle,
      description: p.description,
      price: parseFloat(variant?.price?.amount || p.priceRange.minVariantPrice.amount),
      originalPrice: variant?.compareAtPrice ? parseFloat(variant.compareAtPrice.amount) : null,
      image: p.featuredImage?.url || null,
      rating: 4.5, // Shopify Storefront API doesn't provide ratings by default
      reviews: Math.floor(Math.random() * 100) + 10, // Mock reviews
    };
  });

  return {
    collectionTitle: data.collection.title,
    products,
  };
}

interface ProductDetailData {
  product: {
    id: string;
    title: string;
    handle: string;
    description: string;
    availableForSale: boolean;
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
      maxVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    compareAtPriceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    collections: {
      edges: Array<{
        node: {
          handle: string;
          title: string;
        };
      }>;
    };
    images: {
      edges: Array<{
        node: {
          url: string;
          altText: string | null;
        };
      }>;
    };
    options: Array<{
      name: string;
      values: string[];
    }>;
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          availableForSale: boolean;
          price: {
            amount: string;
            currencyCode: string;
          };
          compareAtPrice: {
            amount: string;
            currencyCode: string;
          } | null;
          selectedOptions: Array<{
            name: string;
            value: string;
          }>;
        };
      }>;
    };
  } | null;
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: number;
  compareAtPrice: number | null;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
}

export interface ProductOption {
  name: string;
  values: string[];
}

export interface DetailedProduct {
  id: string;
  name: string;
  handle: string;
  description: string;
  price: number;
  originalPrice: number | null;
  images: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
  category: string;
  features: string[];
  variants: ProductVariant[];
  options: ProductOption[];
  collection?: {
    handle: string;
    title: string;
  };
}

/**
 * Fetch detailed product information by handle
 */
export async function fetchProductByHandle(handle: string): Promise<DetailedProduct | null> {
  const query = `{
    product(handle: "${handle}") {
      id
      title
      handle
      description
      availableForSale
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
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      collections(first: 1) {
        edges {
          node {
            handle
            title
          }
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      options {
        name
        values
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
  }`;

  const data = await shopifyFetch<ProductDetailData>(query);

  if (!data.product) {
    return null;
  }

  const p = data.product;
  const variant = p.variants?.edges[0]?.node;

  // Extract images
  const images = p.images.edges.map(edge => edge.node.url);

  // Parse description for features (simple extraction)
  const features = p.description
    .split('\n')
    .filter(line => line.trim().length > 0)
    .slice(0, 6)
    .map(line => line.replace(/^[•\-*]\s*/, '').trim());

  return {
    id: p.id,
    name: p.title,
    handle: p.handle,
    description: p.description,
    price: parseFloat(variant?.price?.amount || p.priceRange.minVariantPrice.amount),
    originalPrice: variant?.compareAtPrice ? parseFloat(variant.compareAtPrice.amount) : null,
    images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'],
    rating: 4.5, // Shopify doesn't provide ratings by default
    reviews: Math.floor(Math.random() * 200) + 50, // Mock reviews
    inStock: p.availableForSale,
    category: 'Products', // Shopify doesn't expose product type in Storefront API easily
    features: features.length > 0 ? features : [
      'High quality product',
      'Fast shipping available',
      'Customer satisfaction guaranteed'
    ],
    variants: p.variants.edges.map(edge => ({
      id: edge.node.id,
      title: edge.node.title,
      availableForSale: edge.node.availableForSale,
      price: parseFloat(edge.node.price.amount),
      compareAtPrice: edge.node.compareAtPrice ? parseFloat(edge.node.compareAtPrice.amount) : null,
      selectedOptions: edge.node.selectedOptions || [],
    })),
    options: p.options || [],
    collection: p.collections.edges[0]?.node,
  };
}

/**
 * Fetch all products with pagination
 */
export async function fetchAllProducts(first: number = 12, after: string | null = null): Promise<PaginatedProducts> {
  const query = `{
    products(first: ${first}${after ? `, after: "${after}"` : ''}) {
      edges {
        cursor
        node {
          id
          title
          handle
          description
          availableForSale
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          featuredImage {
            url
            altText
          }
          variants(first: 1) {
            edges {
              node {
                id
                price {
                  amount
                }
                compareAtPrice {
                  amount
                }
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }`;

  const data = await shopifyFetch<AllProductsData>(query);
  const p = data.products;

  return {
    products: p.edges.map(edge => {
      const node = edge.node;
      const variant = node.variants.edges[0]?.node;
      return {
        id: node.id,
        variantId: variant?.id || node.id,
        name: node.title,
        handle: node.handle,
        description: node.description,
        price: parseFloat(variant?.price?.amount || node.priceRange.minVariantPrice.amount),
        originalPrice: variant?.compareAtPrice ? parseFloat(variant.compareAtPrice.amount) :
          node.compareAtPriceRange?.minVariantPrice ? parseFloat(node.compareAtPriceRange.minVariantPrice.amount) : null,
        image: node.featuredImage?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
        rating: 4.5,
        reviews: Math.floor(Math.random() * 100) + 10,
      };
    }),
    pageInfo: p.pageInfo,
  };
}

/**
 * Fetch all collections for category navigation
 */
export async function fetchAllCollections(): Promise<CollectionInfo[]> {
  const query = `{
    collections(first: 20) {
      edges {
        node {
          id
          title
          handle
          image {
            url
            altText
          }
        }
      }
    }
  }`;

  const data = await shopifyFetch<AllCollectionsData>(query);
  return data.collections.edges.map(edge => edge.node);
}
/**
 * Search for both products and collections using basic keyword matching
 */
export async function searchProductsAndCollections(searchTerm: string): Promise<{
  products: FormattedProduct[];
  collections: CollectionInfo[];
}> {
  const query = `{
    productSearch: search(query: "${searchTerm}", first: 10, types: [PRODUCT]) {
      edges {
        node {
          ... on Product {
            id
            title
            handle
            description
            featuredImage {
              url
              altText
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  price {
                    amount
                  }
                  compareAtPrice {
                    amount
                  }
                }
              }
            }
          }
        }
      }
    }
    collectionSearch: collections(first: 10, query: "title:*${searchTerm}*") {
      edges {
        node {
          id
          title
          handle
          image {
            url
            altText
          }
        }
      }
    }
  }`;

  const data = await shopifyFetch<{
    productSearch: {
      edges: Array<{
        node: any;
      }>;
    };
    collectionSearch: {
      edges: Array<{
        node: CollectionInfo;
      }>;
    };
  }>(query);

  const products: FormattedProduct[] = [];
  const collections: CollectionInfo[] = [];

  // specific types are safer now
  if (data?.productSearch?.edges) {
    data.productSearch.edges.forEach((edge) => {
      const node = edge.node;
      const variant = node.variants?.edges[0]?.node;
      products.push({
        id: node.id,
        variantId: variant?.id || node.id,
        name: node.title,
        handle: node.handle,
        description: node.description || '',
        price: parseFloat(variant?.price?.amount || node.priceRange.minVariantPrice.amount),
        originalPrice: variant?.compareAtPrice ? parseFloat(variant.compareAtPrice.amount) : null,
        image: node.featuredImage?.url || null,
        rating: 4.5,
        reviews: Math.floor(Math.random() * 50) + 5,
      });
    });
  }

  if (data?.collectionSearch?.edges) {
    data.collectionSearch.edges.forEach((edge) => {
      const node = edge.node;
      collections.push({
        id: node.id,
        title: node.title,
        handle: node.handle,
        image: node.image ? { url: node.image.url, altText: node.image.altText } : null,
      });
    });
  }

  return { products, collections };
}

/**
 * Cart Mutations & Queries
 */

const CART_FRAGMENT = `
  id
  checkoutUrl
  totalQuantity
  lines(first: 100) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            price {
              amount
            }
            compareAtPrice {
              amount
            }
            product {
              title
              handle
              featuredImage {
                url
              }
            }
          }
        }
      }
    }
  }
  cost {
    totalAmount {
      amount
      currencyCode
    }
    subtotalAmount {
      amount
      currencyCode
    }
  }
`;

export async function createShopifyCart(variantId: string, quantity: number = 1): Promise<ShopifyCart> {
  const query = `
    mutation {
      cartCreate(input: {
        lines: [
          {
            quantity: ${quantity},
            merchandiseId: "${variantId}"
          }
        ]
      }) {
        cart {
          ${CART_FRAGMENT}
        }
      }
    }
  `;

  const data = await shopifyFetch<{ cartCreate: { cart: any } }>(query);
  const cart = data.cartCreate.cart;
  return formatShopifyCart(cart);
}

export async function getShopifyCart(cartId: string): Promise<ShopifyCart | null> {
  const query = `
    query {
      cart(id: "${cartId}") {
        ${CART_FRAGMENT}
      }
    }
  `;

  const data = await shopifyFetch<{ cart: any }>(query);
  if (!data.cart) return null;
  return formatShopifyCart(data.cart);
}

export async function addLinesToCart(cartId: string, variantId: string, quantity: number = 1): Promise<ShopifyCart> {
  const query = `
    mutation {
      cartLinesAdd(cartId: "${cartId}", lines: [
        {
          quantity: ${quantity},
          merchandiseId: "${variantId}"
        }
      ]) {
        cart {
          ${CART_FRAGMENT}
        }
      }
    }
  `;

  const data = await shopifyFetch<{ cartLinesAdd: { cart: any } }>(query);
  return formatShopifyCart(data.cartLinesAdd.cart);
}

export async function updateCartLines(cartId: string, lineId: string, quantity: number): Promise<ShopifyCart> {
  const query = `
    mutation {
      cartLinesUpdate(cartId: "${cartId}", lines: [
        {
          id: "${lineId}",
          quantity: ${quantity}
        }
      ]) {
        cart {
          ${CART_FRAGMENT}
        }
      }
    }
  `;

  const data = await shopifyFetch<{ cartLinesUpdate: { cart: any } }>(query);
  return formatShopifyCart(data.cartLinesUpdate.cart);
}

export async function removeCartLines(cartId: string, lineIds: string[]): Promise<ShopifyCart> {
  const query = `
    mutation {
      cartLinesRemove(cartId: "${cartId}", lineIds: ${JSON.stringify(lineIds)}) {
        cart {
          ${CART_FRAGMENT}
        }
      }
    }
  `;

  const data = await shopifyFetch<{ cartLinesRemove: { cart: any } }>(query);
  return formatShopifyCart(data.cartLinesRemove.cart);
}
function formatShopifyCart(cart: any): ShopifyCart {
  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    cost: cart.cost,
    lines: cart.lines.edges.map((edge: any) => edge.node)
  };
}

/**
 * Customer Authentication & Profile
 */

export async function createCustomerAccessToken(email: string, password: string): Promise<string> {
  const query = `
    mutation {
      customerAccessTokenCreate(input: {
        email: "${email}",
        password: "${password}"
      }) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          message
        }
      }
    }
  `;

  const data = await shopifyFetch<{ customerAccessTokenCreate: any }>(query);
  const result = data.customerAccessTokenCreate;

  if (result.customerUserErrors.length > 0) {
    throw new Error(result.customerUserErrors[0].message);
  }

  return result.customerAccessToken.accessToken;
}

export async function createCustomer(input: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<string> {
  const query = `
    mutation {
      customerCreate(input: {
        firstName: "${input.firstName}",
        lastName: "${input.lastName}",
        email: "${input.email}",
        password: "${input.password}"
      }) {
        customer {
          id
        }
        customerUserErrors {
          message
        }
      }
    }
  `;

  const data = await shopifyFetch<{ customerCreate: any }>(query);
  const result = data.customerCreate;

  if (result.customerUserErrors.length > 0) {
    throw new Error(result.customerUserErrors[0].message);
  }

  return result.customer.id;
}

export async function getCustomer(accessToken: string): Promise<ShopifyCustomer | null> {
  const query = `
    query {
      customer(customerAccessToken: "${accessToken}") {
        id
        firstName
        lastName
        email
        phone
        addresses(first: 10) {
          edges {
            node {
              id
              firstName
              lastName
              address1
              address2
              city
              province
              zip
              country
              phone
            }
          }
        }
        orders(first: 10, sortKey: PROCESSED_AT, reverse: true) {
          edges {
            node {
              id
              orderNumber
              processedAt
              financialStatus
              fulfillmentStatus
              totalPrice {
                amount
                currencyCode
              }
              subtotalPrice {
                amount
                currencyCode
              }
              totalTax {
                amount
                currencyCode
              }
              totalShippingPrice {
                amount
                currencyCode
              }
              shippingAddress {
                firstName
                lastName
                address1
                address2
                city
                province
                zip
                country
              }
              successfulFulfillments {
                trackingCompany
                trackingInfo {
                  number
                  url
                }
              }
              lineItems(first: 20) {
                edges {
                  node {
                    title
                    quantity
                    variant {
                      image {
                        url
                      }
                      product {
                        featuredImage {
                          url
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{ customer: any }>(query);
  return data.customer;
}

/**
 * Link Cart to Customer
 */
export async function updateCartBuyerIdentity(cartId: string, customerAccessToken: string): Promise<ShopifyCart> {
  const query = `
    mutation {
      cartBuyerIdentityUpdate(cartId: "${cartId}", buyerIdentity: {
        customerAccessToken: "${customerAccessToken}"
      }) {
        cart {
          ${CART_FRAGMENT}
        }
        userErrors {
          message
        }
      }
    }
  `;

  const data = await shopifyFetch<{ cartBuyerIdentityUpdate: any }>(query);
  const result = data.cartBuyerIdentityUpdate;

  if (result.userErrors && result.userErrors.length > 0) {
    throw new Error(result.userErrors[0].message);
  }

  return formatShopifyCart(result.cart);
}

/**
 * Address Management
 */
export async function createCustomerAddress(accessToken: string, address: Omit<ShopifyAddress, 'id'>): Promise<ShopifyAddress> {
  const query = `
    mutation {
      customerAddressCreate(customerAccessToken: "${accessToken}", address: {
        firstName: "${address.firstName}",
        lastName: "${address.lastName}",
        address1: "${address.address1}",
        address2: "${address.address2 || ""}",
        city: "${address.city}",
        province: "${address.province}",
        zip: "${address.zip}",
        country: "${address.country}",
        phone: "${address.phone || ""}"
      }) {
        customerAddress {
          id
          firstName
          lastName
          address1
          address2
          city
          province
          zip
          country
          phone
        }
        customerUserErrors {
          message
        }
      }
    }
  `;

  const data = await shopifyFetch<{ customerAddressCreate: any }>(query);
  const result = data.customerAddressCreate;

  if (result.customerUserErrors.length > 0) {
    throw new Error(result.customerUserErrors[0].message);
  }

  return result.customerAddress;
}

export async function deleteCustomerAddress(accessToken: string, addressId: string): Promise<void> {
  const query = `
    mutation {
      customerAddressDelete(id: "${addressId}", customerAccessToken: "${accessToken}") {
        deletedCustomerAddressId
        customerUserErrors {
          message
        }
      }
    }
  `;

  const data = await shopifyFetch<{ customerAddressDelete: any }>(query);
  const result = data.customerAddressDelete;

  if (result.customerUserErrors.length > 0) {
    throw new Error(result.customerUserErrors[0].message);
  }
}

export async function updateCustomerAddress(accessToken: string, addressId: string, address: Partial<Omit<ShopifyAddress, 'id'>>): Promise<ShopifyAddress> {
  const query = `
    mutation {
      customerAddressUpdate(customerAccessToken: "${accessToken}", id: "${addressId}", address: {
        ${address.firstName ? `firstName: "${address.firstName}",` : ""}
        ${address.lastName ? `lastName: "${address.lastName}",` : ""}
        ${address.address1 ? `address1: "${address.address1}",` : ""}
        ${address.address2 !== undefined ? `address2: "${address.address2 || ""}",` : ""}
        ${address.city ? `city: "${address.city}",` : ""}
        ${address.province ? `province: "${address.province}",` : ""}
        ${address.zip ? `zip: "${address.zip}",` : ""}
        ${address.country ? `country: "${address.country}",` : ""}
        ${address.phone !== undefined ? `phone: "${address.phone || ""}",` : ""}
      }) {
        customerAddress {
          id
          firstName
          lastName
          address1
          address2
          city
          province
          zip
          country
          phone
        }
        customerUserErrors {
          message
        }
      }
    }
  `;

  const data = await shopifyFetch<{ customerAddressUpdate: any }>(query);
  const result = data.customerAddressUpdate;

  if (result.customerUserErrors.length > 0) {
    throw new Error(result.customerUserErrors[0].message);
  }

  return result.customerAddress;
}

/**
 * Pages - Fetch content pages from Shopify
 */

interface PageData {
  page: {
    id: string;
    title: string;
    handle: string;
    body: string;
    bodySummary: string;
  } | null;
}

interface PagesData {
  pages: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        handle: string;
        bodySummary: string;
      };
    }>;
  };
}

/**
 * Fetch a single page by its handle
 */
export async function fetchPageByHandle(handle: string): Promise<ShopifyPage | null> {
  const query = `{
    page(handle: "${handle}") {
      id
      title
      handle
      body
      bodySummary
    }
  }`;

  const data = await shopifyFetch<PageData>(query);

  if (!data.page) {
    return null;
  }

  return data.page;
}

/**
 * Fetch all available pages
 */
export async function fetchAllPages(): Promise<ShopifyPage[]> {
  const query = `{
    pages(first: 50) {
      edges {
        node {
          id
          title
          handle
          bodySummary
        }
      }
    }
  }`;

  const data = await shopifyFetch<PagesData>(query);

  return data.pages.edges.map(edge => ({
    ...edge.node,
    body: '', // Body not fetched in list view for performance
  }));
}

/**
 * Policies - Fetch shop policies (Privacy, Terms, Refund, Shipping)
 */

export interface ShopPolicy {
  id: string;
  title: string;
  body: string;
  url: string;
}

type PolicyType = 'privacyPolicy' | 'termsOfService' | 'refundPolicy' | 'shippingPolicy';

interface ShopPolicyData {
  shop: {
    [key in PolicyType]?: {
      id: string;
      title: string;
      body: string;
      url: string;
    } | null;
  };
}

/**
 * Fetch a specific shop policy by type
 */
export async function fetchShopPolicy(policyType: PolicyType): Promise<ShopPolicy | null> {
  const query = `{
    shop {
      ${policyType} {
        id
        title
        body
        url
      }
    }
  }`;

  const data = await shopifyFetch<ShopPolicyData>(query);

  const policy = data.shop[policyType];

  if (!policy) {
    return null;
  }

  return policy;
}
