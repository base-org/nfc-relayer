export type CartItem = {
  productId: string;
  quantity: string;
  variant: string;
};

export type CartPayload = {
  to: string;
  slicerId: number;
  cartParams: CartItem[];
};

export type RelayPayWithAuthorizationParams = {
  cart: any;
  totalUsdcPrice: bigint;
  buyer: string;
  chainId: number;
  signature: string;
  authorizationParams: {
    from: string;
    nonce: string;
    to: string;
    validAfter: bigint;
    validBefore: bigint;
    value: bigint;
  };
};

