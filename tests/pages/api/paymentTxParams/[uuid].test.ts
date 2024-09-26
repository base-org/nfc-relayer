import { NextApiRequest, NextApiResponse } from 'next';
import handler from '@pages/api/paymentTxParams/[uuid]';
import { getPrismaClient } from '@helpers/database';
import { mockConsoleOutput } from '@tests/testHelpers';

jest.mock('@/helpers/database', () => ({
  getPrismaClient: jest.fn(),
}));

mockConsoleOutput();

type Params = {
  method?: string;
  query?: any;
  response?: Record<string, unknown> | null;
  shouldFail?: boolean;
};

const run = async ({ method, query, response, shouldFail = false }: Params = {}) => {
  const mockReq: Partial<NextApiRequest> = { method, query };
  const mockRes: Partial<NextApiResponse> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    setHeader: jest.fn(),
    end: jest.fn(),
  };
  const mockPrismaClient = {
    contactlessPaymentTxOrMsg: {
      findUnique: shouldFail
        ? jest.fn().mockRejectedValue(new Error('Database error'))
        : jest.fn().mockResolvedValue(response),
    },
  };
  (getPrismaClient as jest.Mock).mockReturnValue(mockPrismaClient);

  await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

  return { mockReq, mockRes, mockPrismaClient };
};

const mockPaymentTx = {
  uuid: 'test-uuid',
  toAddress: '0x1234567890123456789012345678901234567890',
  chainId: 1,
  value: '1000000000000000000',
  contractAddress: 'contract123',
};

describe('GET /api/paymentTxParams/[uuid]', () => {
  it('should retrieve a payment transaction by UUID', async () => {
    const { mockRes } = await run({
      method: 'GET',
      query: { uuid: 'test-uuid' },
      response: mockPaymentTx,
    });

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockPaymentTx);
  });

  it('should return 500 when payment transaction is not found', async () => {
    const { mockRes } = await run({
      method: 'GET',
      query: { uuid: 'non-existent-uuid' },
      response: null,
    });

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Error retrieving payment transaction: Payment transaction or message not found',
    });
  });

  it('should return 400 for invalid UUID', async () => {
    const { mockRes } = await run({ method: 'GET', query: { uuid: ['invalid-uuid'] } });

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid UUID' });
  });

  it('should handle errors when retrieving a payment transaction', async () => {
    const { mockRes } = await run({
      method: 'GET',
      query: { uuid: 'test-uuid' },
      shouldFail: true,
    });

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Error retrieving payment transaction: Database error',
    });
  });

  it('should return 405 for non-GET methods', async () => {
    const { mockRes } = await run({ method: 'POST', query: { uuid: 'test-uuid' } });

    expect(mockRes.setHeader).toHaveBeenCalledWith('Allow', ['GET']);
    expect(mockRes.status).toHaveBeenCalledWith(405);
    expect(mockRes.end).toHaveBeenCalledWith('Method POST Not Allowed');
  });

  it('should return 400 for invalid sender address', async () => {
    const { mockRes } = await run({
      method: 'GET',
      query: {
        uuid: 'test-uuid',
        senderAddress: 'invalid-address'
      },
      response: mockPaymentTx,
    });

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid sender address' });
  });
});
