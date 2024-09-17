import { NextApiRequest, NextApiResponse } from 'next';
import handler from '@pages/api/paymentTxParams/index';
import { getPrismaClient } from '@helpers/database';
import { mockConsoleOutput } from '@tests/testHelpers';

jest.mock('@/helpers/database', () => ({
  getPrismaClient: jest.fn(),
}));

mockConsoleOutput();

describe('POST /api/paymentTxParams', () => {
  let mockReq: Partial<NextApiRequest>;
  let mockRes: Partial<NextApiResponse>;
  let mockPrismaClient: any;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      setHeader: jest.fn(),
      end: jest.fn(),
    };
    mockPrismaClient = {
      paymentTx: {
        create: jest.fn(),
      },
    };
    (getPrismaClient as jest.Mock).mockReturnValue(mockPrismaClient);
  });

  it('should create a new payment transaction', async () => {
    mockReq.method = 'POST';
    mockReq.body = {
      toAddress: '0x1234567890123456789012345678901234567890',
      chainId: 1,
      amount: '1000000000000000000',
      contractId: 'contract123',
      data: { someData: 'value' },
    };

    mockPrismaClient.paymentTx.create.mockResolvedValue({
      uuid: 'generated-uuid',
      ...mockReq.body,
    });

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Payment relay stored successfully',
      uuid: 'generated-uuid',
    });
  });

  it('should handle errors when creating a payment transaction', async () => {
    mockReq.method = 'POST';
    mockReq.body = {
      toAddress: '0x1234567890123456789012345678901234567890',
      chainId: 1,
      amount: '1000000000000000000',
      contractId: 'contract123',
    };

    mockPrismaClient.paymentTx.create.mockRejectedValue(new Error('Database error'));

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Error storing payment transaction params',
    });
  });

  it('should return 405 for non-POST methods', async () => {
    mockReq.method = 'GET';

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(mockRes.setHeader).toHaveBeenCalledWith('Allow', ['POST']);
    expect(mockRes.status).toHaveBeenCalledWith(405);
    expect(mockRes.end).toHaveBeenCalledWith('Method GET Not Allowed');
  });
});