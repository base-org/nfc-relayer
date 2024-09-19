import { NextApiRequest, NextApiResponse } from 'next';
import handler from '@pages/api/paymentTxParams/index';
import { getPrismaClient } from '@helpers/database';
import { mockConsoleOutput } from '@tests/testHelpers';

jest.mock('@/helpers/database', () => ({
  getPrismaClient: jest.fn(),
}));

mockConsoleOutput();

type Params = {
  method?: string;
  body?: any;
  shouldFail?: boolean;
}

const run = async ({ method, body, shouldFail = false }: Params = {}) => {
  const mockReq: Partial<NextApiRequest> = { method, body };
  const mockRes: Partial<NextApiResponse> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    setHeader: jest.fn(),
    end: jest.fn(),
  };
  const mockPrismaClient = {
    paymentTx: {
      create: shouldFail ? jest.fn().mockRejectedValue(new Error('Database error')) : jest.fn().mockResolvedValue({
        uuid: 'generated-uuid',
        ...body,
      }),
    },
  };
  (getPrismaClient as jest.Mock).mockReturnValue(mockPrismaClient);

  await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

  return { mockReq, mockRes, mockPrismaClient };
};

describe('POST /api/paymentTxParams', () => {
  it('should create a new payment transaction', async () => {
    const body = {
      toAddress: '0x1234567890123456789012345678901234567890',
      chainId: 1,
      amount: '1000000000000000000',
      contractId: 'contract123',
      data: { someData: 'value' },
    };

    const { mockRes } = await run({ method: 'POST', body });

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Payment relay stored successfully',
      uuid: 'generated-uuid',
    });
  });

  it('should handle errors when creating a payment transaction', async () => {
    const body = {
      toAddress: '0x1234567890123456789012345678901234567890',
      chainId: 1,
      amount: '1000000000000000000',
      contractId: 'contract123',
    };

    const { mockRes } = await run({ method: 'POST', body, shouldFail: true });

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Error storing payment transaction params: Database error',
    });
  });

  it('should return 405 for non-POST methods', async () => {
    const { mockRes } = await run({ method: 'GET', body: {} });

    expect(mockRes.setHeader).toHaveBeenCalledWith('Allow', ['POST']);
    expect(mockRes.status).toHaveBeenCalledWith(405);
    expect(mockRes.end).toHaveBeenCalledWith('Method GET Not Allowed');
  });
});