
type Props = {
  txMessage: any;
  senderAddress?: string;
}

export function formatTxMessageResponse({ txMessage, senderAddress }: Props) {
  if (!senderAddress) return txMessage;

  const updatedTxMessage = {
    ...txMessage,
    message: {
      ...txMessage.message,
      message: {
        ...txMessage.message.message,
        from: senderAddress,
      },
    }
  }

  return updatedTxMessage;
}