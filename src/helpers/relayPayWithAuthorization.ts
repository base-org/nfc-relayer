import { generateCart, getStoreProducts, payWithAuthorization } from "@slicekit/core";
import { wagmiConfig } from "./constants";
import { CartItem } from "./sliceKitTypes";

type Props = {
  slicerId: number;
  cartParams: CartItem[];
  totalUsdcPrice: number;
  buyer: `0x${string}`;
  chainId: number;
  signature: `0x${string}`;
  authorizationParams: {
    from: `0x${string}`;
    nonce: `0x${string}`;
    to: string;
    validAfter: bigint;
    validBefore: bigint;
    value: bigint;
  };
}

export async function relayPayWithAuthorization({ 
  cartParams, 
  slicerId,
  totalUsdcPrice,
  buyer,
  chainId,
  signature,
  authorizationParams,
}: Props) {
  const { cartProducts: allProducts } = await getStoreProducts(wagmiConfig, { slicerId });
  const cart = generateCart({ cartParams, allProducts });

  return payWithAuthorization(wagmiConfig, {
    cart,
    totalUsdcPrice,
    buyer,
    chainId,
    signature,
    authorizationParams,
  })
}