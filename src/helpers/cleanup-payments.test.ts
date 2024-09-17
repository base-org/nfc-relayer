/* eslint-disable @typescript-eslint/no-explicit-any */
import { cleanupOldPayments } from '@helpers/cleanup-payments';
import { getPrismaClient } from '@helpers/database';

jest.mock('./database', () => ({
  getPrismaClient: jest.fn(),
}));

describe('cleanupOldPayments', () => {
  let mockPrismaClient: jest.Mocked<any> = null;
  let mockDeleteMany: jest.Mock;

  beforeEach(() => {
    mockDeleteMany = jest.fn();
    mockPrismaClient = {
      paymentTx: {
        deleteMany: mockDeleteMany,
      },
      $disconnect: jest.fn(),
    };
    (getPrismaClient as jest.Mock).mockReturnValue(mockPrismaClient);
  });

  it('should delete old payment transactions', async () => {
    mockDeleteMany.mockResolvedValue({ count: 5 });

    const result = await cleanupOldPayments();

    expect(result).toBe(5);
    expect(mockDeleteMany).toHaveBeenCalledWith({
      where: {
        createdAt: {
          lt: expect.any(Date),
        },
      },
    });
    expect(mockPrismaClient.$disconnect).toHaveBeenCalled();
  });

  it('should handle errors and disconnect from the database', async () => {
    const error = new Error('Database error');
    mockDeleteMany.mockRejectedValue(error);

    await expect(cleanupOldPayments()).rejects.toThrow('Database error');
    expect(mockPrismaClient.$disconnect).toHaveBeenCalled();
  });
});