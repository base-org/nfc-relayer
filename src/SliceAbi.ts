

export const sliceAbi = [
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "buyer",
            "type": "address"
          },
          {
            "internalType": "uint128",
            "name": "slicerId",
            "type": "uint128"
          },
          {
            "internalType": "uint32",
            "name": "quantity",
            "type": "uint32"
          },
          {
            "internalType": "address",
            "name": "currency",
            "type": "address"
          },
          {
            "internalType": "uint32",
            "name": "productId",
            "type": "uint32"
          },
          {
            "internalType": "bytes",
            "name": "buyerCustomData",
            "type": "bytes"
          }
        ],
        "internalType": "struct PurchaseParams[]",
        "name": "purchases",
        "type": "tuple[]"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "recipient",
            "type": "address"
          },
          {
            "internalType": "uint128",
            "name": "slicerId",
            "type": "uint128"
          },
          {
            "internalType": "uint128",
            "name": "amount",
            "type": "uint128"
          },
          {
            "internalType": "address",
            "name": "currency",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          }
        ],
        "internalType": "struct ExtraCost[]",
        "name": "extraCosts",
        "type": "tuple[]"
      },
      {
        "internalType": "address",
        "name": "referrer",
        "type": "address"
      }
    ],
    "name": "payProducts",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "buyer",
            "type": "address"
          },
          {
            "internalType": "uint128",
            "name": "slicerId",
            "type": "uint128"
          },
          {
            "internalType": "uint32",
            "name": "quantity",
            "type": "uint32"
          },
          {
            "internalType": "address",
            "name": "currency",
            "type": "address"
          },
          {
            "internalType": "uint32",
            "name": "productId",
            "type": "uint32"
          },
          {
            "internalType": "bytes",
            "name": "buyerCustomData",
            "type": "bytes"
          }
        ],
        "internalType": "struct PurchaseParams[]",
        "name": "purchases",
        "type": "tuple[]"
      }
    ],
    "name": "payProducts",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "buyer",
            "type": "address"
          },
          {
            "internalType": "uint128",
            "name": "slicerId",
            "type": "uint128"
          },
          {
            "internalType": "uint32",
            "name": "quantity",
            "type": "uint32"
          },
          {
            "internalType": "address",
            "name": "currency",
            "type": "address"
          },
          {
            "internalType": "uint32",
            "name": "productId",
            "type": "uint32"
          },
          {
            "internalType": "bytes",
            "name": "buyerCustomData",
            "type": "bytes"
          }
        ],
        "internalType": "struct PurchaseParams[]",
        "name": "purchases",
        "type": "tuple[]"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "validAfter",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "validBefore",
            "type": "uint256"
          },
          {
            "internalType": "bytes32",
            "name": "nonce",
            "type": "bytes32"
          },
          {
            "internalType": "uint8",
            "name": "v",
            "type": "uint8"
          },
          {
            "internalType": "bytes32",
            "name": "r",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "s",
            "type": "bytes32"
          }
        ],
        "internalType": "struct PayWithAuthorizationParams",
        "name": "authorizationParams",
        "type": "tuple"
      }
    ],
    "name": "payWithAuthorization",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "buyer",
            "type": "address"
          },
          {
            "internalType": "uint128",
            "name": "slicerId",
            "type": "uint128"
          },
          {
            "internalType": "uint32",
            "name": "quantity",
            "type": "uint32"
          },
          {
            "internalType": "address",
            "name": "currency",
            "type": "address"
          },
          {
            "internalType": "uint32",
            "name": "productId",
            "type": "uint32"
          },
          {
            "internalType": "bytes",
            "name": "buyerCustomData",
            "type": "bytes"
          }
        ],
        "internalType": "struct PurchaseParams[]",
        "name": "purchases",
        "type": "tuple[]"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "validAfter",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "validBefore",
            "type": "uint256"
          },
          {
            "internalType": "bytes32",
            "name": "nonce",
            "type": "bytes32"
          },
          {
            "internalType": "uint8",
            "name": "v",
            "type": "uint8"
          },
          {
            "internalType": "bytes32",
            "name": "r",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "s",
            "type": "bytes32"
          }
        ],
        "internalType": "struct PayWithAuthorizationParams",
        "name": "authorizationParams",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "recipient",
            "type": "address"
          },
          {
            "internalType": "uint128",
            "name": "slicerId",
            "type": "uint128"
          },
          {
            "internalType": "uint128",
            "name": "amount",
            "type": "uint128"
          },
          {
            "internalType": "address",
            "name": "currency",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          }
        ],
        "internalType": "struct ExtraCost[]",
        "name": "extraCosts",
        "type": "tuple[]"
      },
      {
        "internalType": "address",
        "name": "referrer",
        "type": "address"
      }
    ],
    "name": "payWithAuthorization",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
]