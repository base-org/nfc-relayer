import { NextApiRequest, NextApiResponse } from 'next';
import handler from '@pages/api/paymentTxParams/[uuid]';
import { getPrismaClient } from '@helpers/database';
import { mockConsoleOutput } from '@tests/testHelpers';

jest.mock('@/helpers/database', () => ({
  getPrismaClient: jest.fn(),
}));

mockConsoleOutput();

const run = async (method: string, query: any) => {
  const mockReq: Partial<NextApiRequest> = { method, query };
  const mockRes: Partial<NextApiResponse> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    setHeader: jest.fn(),
    end: jest.fn(),
  };
  const mockPrismaClient = {
    paymentTx: {
      findUnique: jest.fn(),
    },
  };
  (getPrismaClient as jest.Mock).mockReturnValue(mockPrismaClient);

  await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

  return { mockReq, mockRes, mockPrismaClient };
};

describe('GET /api/paymentTxParams/[uuid]', () => {
  it('should retrieve a payment transaction by UUID', async () => {
    const mockPaymentTx = {
      uuid: 'test-uuid',
      toAddress: '0x1234567890123456789012345678901234567890',
      chainId: 1,
      amount: '1000000000000000000',
      contractId: 'contract123',
      data: { someData: 'value' },
    };

    const { mockRes, mockPrismaClient } = await run('GET', { uuid: 'test-uuid' });
    mockPrismaClient.paymentTx.findUnique.mockResolvedValue(mockPaymentTx);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockPaymentTx);
  });

  it('should return 404 when payment transaction is not found', async () => {
    const { mockRes, mockPrismaClient } = await run('GET', { uuid: 'non-existent-uuid' });
    mockPrismaClient.paymentTx.findUnique.mockResolvedValue(null);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Not Found' });
  });

  it('should return 400 for invalid UUID', async () => {
    const { mockRes } = await run('GET', { uuid: ['invalid-uuid'] });

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid UUID' });
  });

  it('should handle errors when retrieving a payment transaction', async () => {
    const { mockRes, mockPrismaClient } = await run('GET', { uuid: 'test-uuid' });
    mockPrismaClient.paymentTx.findUnique.mockRejectedValue(new Error('Database error'));

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Error retrieving payment transaction',
    });
  });

  it('should return 405 for non-GET methods', async () => {
    const { mockRes } = await run('POST', { uuid: 'test-uuid' });

    expect(mockRes.setHeader).toHaveBeenCalledWith('Allow', ['GET']);
    expect(mockRes.status).toHaveBeenCalledWith(405);
    expect(mockRes.end).toHaveBeenCalledWith('Method POST Not Allowed');
  });
});