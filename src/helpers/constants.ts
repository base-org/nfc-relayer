import { createConfig } from '@wagmi/core';
import { base } from '@wagmi/core/chains';
import { http } from 'viem';

// Create a Wagmi config, and get the relayed slice data
export const wagmiConfig = createConfig({
  chains: [base],
  transports: {
    '8453': http('https://base-rpc.publicnode.com'),
  },
});
