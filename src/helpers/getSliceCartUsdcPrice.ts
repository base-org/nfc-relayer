import { wagmiConfig } from "./constants";
import { CartItem } from "./sliceKitTypes";
import {
  generateCart,
  getStoreProducts,
  getTotalPrices,
} from '@slicekit/core';

type Props = {
  slicerId: number;
  cartParams: CartItem[];
}

export async function getSliceCartUsdcPrice({ slicerId, cartParams }: Props) {
  // construct the cart using the slicekit to calculate the total amount
  const { cartProducts: allProducts } = await getStoreProducts(wagmiConfig, {
    slicerId,
  });

  console.log({ cartParams });

  const cart = generateCart({
    cartParams,
    allProducts,
  });

  console.log({ cart });

  const totalPrices = getTotalPrices({
    cart,
    ethUsd: BigInt(1), // unused for products in just usdc
  });

  const totalUsdcPrice = totalPrices.find((price) => price.currency.symbol === 'USDC')?.total;
  console.log({ totalUsdcPrice, totalPrices });

  if (totalUsdcPrice === undefined) {
    throw new Error('Failed to calculate total USDC price');
  }

  return totalUsdcPrice;
}