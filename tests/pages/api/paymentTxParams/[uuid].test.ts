import { NextApiRequest, NextApiResponse } from 'next';
import handler from '@pages/api/paymentTxParams/[uuid]';
import { getPrismaClient } from '@helpers/database';
import { mockConsoleOutput } from '@tests/testHelpers';

jest.mock('@/helpers/database', () => ({
  getPrismaClient: jest.fn(),
}));

mockConsoleOutput();

describe('GET /api/paymentTxParams/[uuid]', () => {
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
        findUnique: jest.fn(),
      },
    };
    (getPrismaClient as jest.Mock).mockReturnValue(mockPrismaClient);
  });

  it('should retrieve a payment transaction by UUID', async () => {
    mockReq.method = 'GET';
    mockReq.query = { uuid: 'test-uuid' };

    const mockPaymentTx = {
      uuid: 'test-uuid',
      toAddress: '0x1234567890123456789012345678901234567890',
      chainId: 1,
      amount: '1000000000000000000',
      contractId: 'contract123',
      data: { someData: 'value' },
    };

    mockPrismaClient.paymentTx.findUnique.mockResolvedValue(mockPaymentTx);

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockPaymentTx);
  });

  it('should return 404 when payment transaction is not found', async () => {
    mockReq.method = 'GET';
    mockReq.query = { uuid: 'non-existent-uuid' };

    mockPrismaClient.paymentTx.findUnique.mockResolvedValue(null);

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Not Found' });
  });

  it('should return 400 for invalid UUID', async () => {
    mockReq.method = 'GET';
    mockReq.query = { uuid: ['invalid-uuid'] };

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid UUID' });
  });

  it('should handle errors when retrieving a payment transaction', async () => {
    mockReq.method = 'GET';
    mockReq.query = { uuid: 'test-uuid' };

    mockPrismaClient.paymentTx.findUnique.mockRejectedValue(new Error('Database error'));

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Error retrieving payment transaction',
    });
  });

  it('should return 405 for non-GET methods', async () => {
    mockReq.method = 'POST';
    mockReq.query = { uuid: 'test-uuid' };

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(mockRes.setHeader).toHaveBeenCalledWith('Allow', ['GET']);
    expect(mockRes.status).toHaveBeenCalledWith(405);
    expect(mockRes.end).toHaveBeenCalledWith('Method POST Not Allowed');
  });
});