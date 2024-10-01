import { ethers } from "ethers";

// TODO: Justin, can we separate helpers related to slice unto their own folder?
type Props = {
  txData: any;
  senderAddress?: string;
}

export async function formatTxDataResponse({ txData, senderAddress }: Props) {
  const { requiresSenderAddress, contractAbi, placeholderSenderAddress } = txData;

  let finalTxData = txData;
  if (requiresSenderAddress && contractAbi && placeholderSenderAddress && senderAddress) {
    // substitute all instances of the placeholder buyer address with the given buyer address
    finalTxData = {
      ...txData,
      paymentTx: {
        ...txData.paymentTx,
        data: await substituteSenderAddress({ contractAbi, data: txData.paymentTx.data, placeholderSenderAddress, senderAddress })
      }
    }
  }

  // omit the requiresSenderAddress, contractAbi, and placeholderSenderAddress fields
  // from the response
  const txDataReturned = {
    ...finalTxData,
    requiresSenderAddress: undefined,
    contractAbi: undefined,
    placeholderSenderAddress: undefined,
  }

  return txDataReturned
}

type SubstituteSenderAddressProps = {
  contractAbi: string;
  data: string;
  placeholderSenderAddress: string;
  senderAddress: string;
}

async function substituteSenderAddress({ contractAbi, data, placeholderSenderAddress, senderAddress  }: SubstituteSenderAddressProps) {
  // Create an interface from the ABI
  const iface = new ethers.utils.Interface(contractAbi);

  // Decode the call data to get the function name and parameters
  const decodedData = iface.parseTransaction({ data });

    // Function to recursively replace the placeholder in params
  const replaceInParams = (params: any[]): any => {
    // console.log({ params });
    return params.map((param: any) => {
        if (Array.isArray(param)) {
            // Recursively process each element in the array
            return replaceInParams(param);
        }
        
        const isAddress = ethers.utils.isAddress(param)
        const isEqualAddress = isAddress && param.toLowerCase() === placeholderSenderAddress.toLowerCase();

        return isEqualAddress ? senderAddress : param;
    });
  };

  // Replace placeholder addresses in the decoded parameters
  const updatedParams = replaceInParams(decodedData.args as any);

  // Encode the modified parameters back into call data
  const newCallData = iface.encodeFunctionData(decodedData.sighash, updatedParams);

  return newCallData;
}