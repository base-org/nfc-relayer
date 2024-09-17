# NFC Relayer for ERC-XXXXX

## Project Description

This project is an early implementation of ERC-XXXXX, a proposed Ethereum Request for Comments (ERC) standard that aims to facilitate NFC (Near Field Communication) message transmission for cryptocurrency transactions.

## Setup

### Prerequisites

- Node.js (v14 or later)
- Yarn
- A PostgreSQL database to store the payment transactions. Feel free to swap for any other DB supported by Prisma.

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/amhedcb/nfc-relayer.git
   cd nfc-relayer
   ```

2. Install dependencies:

   ```
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:

   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/nfc_relayer
   DATABASE_URL_POOLED=postgresql://username:password@localhost:5432/nfc_relayer?pool=5
   ```

4. Set up the database:
   ```
   yarn prisma migrate dev
   ```

## Testing

Run the test suite:

```
yarn test
```

## Running the Project

Start the development server:

```
yarn dev
```

The server will start on `http://localhost:3000` by default.

## API Usage

### Create a Payment Transaction

**Endpoint:** `POST /api/paymentTxParams`

**cURL Example for POST:**
```bash
  curl -X POST http://localhost:3000/api/paymentTxParams \
    -H "Content-Type: application/json" \
    -d '{
    "toAddress": "0x1234567890123456789012345678901234567890",
    "chainId": 1,
    "amount": "1000000000000000000",
    "contractId": "contract123",
    "data": {"someData": "value"}
  }'
```

**cURL Example for GET:**

```bash
curl -X GET http://localhost:3000/api/paymentTxParams/[uuid] \
  -H "Content-Type: application/json"
```