export type LoadingParams =
  | 'refreshing'
  | 'loading_more'
  | 'contact_us'
  | 'rating'
  | 'search'
  | undefined;

export type LoaderParams = {
  isLoading: boolean;
  loadingType?: LoadingParams;
};

export type CartItemParams = {
  product_id: number;
  quantity: number;
  product_variation_combination_id?: number | null;
  uuid?: string;
};

export type UpdateCartItemParams = {
  cart_item_id: number;
  quantity: number;
  product_variation_combination_id?: number | null;
};

export type AddToCartParams = {
  items: CartItemParams[];
};

export type CartApiItemParams = {
  id: number;
  user_id: number;
  product_id: number;
  coupon_code_id: any;
  product_variation_combination_id: number | null;
  price: string;
  discounted_price: string;
  quantity: number;
  total_price: string;
  status: number;
  product: {
    id: number;
    product_image: string | null;
    thumbnail: string | null;
    product_name: string;
    slug: string;
    price: number | string;
    discount: number;
    discounted_price: string;
    is_favourite: number | boolean | null;
    status: string;
    thumbnail_url: any;
  };
  product_variation_combination: {
    id: number;
    price: number | string;
    discounted_price: null;
    status: string;
    product_variation_combination_detail: {
      id: number;
      product_variation_id: number;
      product_variation_combination_id: number;
      product_variation_option_id: number;
    }[];
  } | null;
  coupon_code: any;
};

export type NotificationListParams = {
  category_id: number;
  created_at: string;
  description: string;
  id: number;
  image: any;
  image_url: any;
  notification_type: string;
  order_id: number;
  seller_store_address_id: number;
  seller_store_id: number;
  thumbnail: any;
  title: string;
  user_id: number;
  thumbnail_url: any;
};

export type PaymentItemParams = {
  label: string;
  value: boolean;
  id: number;
  enum: string;
  img: any;
};

export type randomData = {
  gmp: any;
  gp: string;
};
