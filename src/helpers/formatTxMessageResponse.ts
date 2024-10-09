import { getSliceCartUsdcPrice } from './getSliceCartUsdcPrice';

type Props = {
  txMessage: any;
  senderAddress?: string;
}

export async function formatTxMessageResponse({ txMessage, senderAddress }: Props) {
  if (!senderAddress) return txMessage;

  let value = txMessage.rpcProxySubmissionParams.typedData.message.value;
  if (txMessage.additionalPayload.cartParams && txMessage.additionalPayload.slicerId) {
    // construct the cart using the slicekit to calculate the total amount
    value = await getSliceCartUsdcPrice({ cartParams: txMessage.additionalPayload.cartParams, slicerId: txMessage.additionalPayload.slicerId });
  }

  const updatedTxMessage = {
    ...txMessage,
    rpcProxySubmissionParams: {
      ...txMessage.rpcProxySubmissionParams,
      typedData: {
        ...txMessage.rpcProxySubmissionParams.typedData,
        message: {
          ...txMessage.rpcProxySubmissionParams.typedData.message,
          from: senderAddress,
          value: String(value),
        }
      },
    }
  }

  return updatedTxMessage;
}