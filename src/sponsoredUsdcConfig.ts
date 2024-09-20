/**
 * Defines which EVM chains + deployed USDC contracts for which we allow gas to be sponsored
 */
export type SponsoredUsdcConfig = {
  chainId: number;
  fiatTokenAddress: string; // See https://github.com/centrehq/centre-tokens/blob/master/contracts/v2/FiatTokenV2.sol
  fiatTokenUtilAddress?: string; // See https://github.com/centrehq/centre-tokens/blob/master/contracts/v2/FiatTokenUtil.sol
  domainSeparator: string; // See https://eips.ethereum.org/EIPS/eip-712
  rpc: string // Endpoint for the chain's RPC
};

/**
 * @see {@link https://developers.circle.com/developer/docs/supported-chains-and-currencies#introduction-to-chains-and-currencies Circle's docs for all deployed contract addresses}
 */
export const sponsoredUsdcMapping: SponsoredUsdcConfig[] = [
  {
    chainId: 137,
    fiatTokenAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    fiatTokenUtilAddress: '0xF930d7a3a0BF475c2C1D2A3b3Ef93BCCeD69d331',
    domainSeparator: '0x294369e003769a2d4d625e8a9ebebffa09ff70dd7c708497d8b56d2c2d199a19',
    rpc: 'https://polygon-mainnet.infura.io/v3/' + process.env.INFURA_API_KEY!
  },
  {
    chainId: 84531,
    fiatTokenAddress: '0x31D3A7711a74b4Ec970F50c3eaf1ee47ba803A95',
    fiatTokenUtilAddress: '0xecdbe0e6e21a0c07962c01c97f87861a84703fc2',
    domainSeparator: '0x8f448364e6b5c1f2ca4229f5fe41edf4538ce7c144d5d771f7fcd34f5d90ab93',
    rpc: 'https://goerli.base.org'
  },
  {
    chainId: 8453,
    fiatTokenAddress: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
    domainSeparator: '0xcaa2ce1a5703ccbe253a34eb3166df60a705c561b44b192061e28f2a985be2ca',
    rpc: 'https://mainnet.base.org'
  }
];
