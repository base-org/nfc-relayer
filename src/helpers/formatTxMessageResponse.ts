
type Props = {
  txMessage: any;
  buyerAddress?: string;
}

export function formatTxMessageResponse({ txMessage, buyerAddress }: Props) {
  if (!buyerAddress) return txMessage;

  const updatedTxMessage = {
    ...txMessage,
    message: {
      ...txMessage.message,
      message: {
        ...txMessage.message.message,
        from: buyerAddress,
      },
    }
  }

  return updatedTxMessage;
}