import { CartItem } from "./sliceKitTypes";
import {
  generateCart,
  getStoreProducts,
  getTotalPrices,
} from '@slicekit/core';
import { createConfig } from '@wagmi/core';
import { base } from '@wagmi/core/chains';
import { http } from 'viem';

// Create a Wagmi config, and get the relayed slice data
const config = createConfig({
  chains: [base],
  transports: {
    '8453': http('https://base-rpc.publicnode.com'),
  },
});

type Props = {
  slicerId: number;
  cartParams: CartItem[];
}

export async function getSliceCartUsdcPrice({ slicerId, cartParams }: Props) {
  // construct the cart using the slicekit to calculate the total amount
  const { cartProducts: allProducts } = await getStoreProducts(config, {
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