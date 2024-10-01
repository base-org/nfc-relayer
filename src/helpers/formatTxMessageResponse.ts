
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
      message: {
        ...txMessage.rpcProxySubmissionParams.message,
        message: {
          ...txMessage.rpcProxySubmissionParams.message.message,
          from: senderAddress,
        }
      },
    }
  }

  return updatedTxMessage;
}