import { ethers } from "ethers";

// TODO: Justin, can we separate helpers related to slice unto their own folder?
type Props = {
  txData: any;
  buyerAddress?: string;
}

export async function formatTxDataResponse({ txData, buyerAddress }: Props) {
  const { requiresBuyerAddress, contractAbi, placeholderBuyerAddress } = txData;

  let finalTxData = txData;
  if (requiresBuyerAddress && contractAbi && placeholderBuyerAddress && buyerAddress) {
    // substitute all instances of the placeholder buyer address with the given buyer address
    finalTxData = {
      ...txData,
      paymentTx: {
        ...txData.paymentTx,
        data: await substituteBuyerAddress({ contractAbi, data: txData.paymentTx.data, placeholderBuyerAddress, buyerAddress })
      }
    }
  }

  // omit the requiresBuyerAddress, contractAbi, and placeholderBuyerAddress fields
  // from the response
  const txDataReturned = {
    ...finalTxData,
    requiresBuyerAddress: undefined,
    contractAbi: undefined,
    placeholderBuyerAddress: undefined,
  }

  return txDataReturned
}

type SubstituteBuyerAddressProps = {
  contractAbi: string;
  data: string;
  placeholderBuyerAddress: string;
  buyerAddress: string;
}

async function substituteBuyerAddress({ contractAbi, data, placeholderBuyerAddress, buyerAddress  }: SubstituteBuyerAddressProps) {
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
        const isEqualAddress = isAddress && param.toLowerCase() === placeholderBuyerAddress.toLowerCase();

        return isEqualAddress ? buyerAddress : param;
    });
  };

  // Replace placeholder addresses in the decoded parameters
  const updatedParams = replaceInParams(decodedData.args as any);

  // Encode the modified parameters back into call data
  const newCallData = iface.encodeFunctionData(decodedData.sighash, updatedParams);

  return newCallData;
}