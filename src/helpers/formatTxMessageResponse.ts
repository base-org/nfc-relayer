
type Props = {
  txMessage: any;
  senderAddress?: string;
}

export function formatTxMessageResponse({ txMessage, senderAddress }: Props) {
  if (!senderAddress) return txMessage;

  const updatedTxMessage = {
    ...txMessage,
    rpcProxySubmissionParams: {
      ...txMessage.rpcProxySubmissionParams,
      typedData: {
        ...txMessage.rpcProxySubmissionParams.typedData,
        message: {
          ...txMessage.rpcProxySubmissionParams.typedData.message,
          from: senderAddress,
        }
      },
    }
  }

  return updatedTxMessage;
}