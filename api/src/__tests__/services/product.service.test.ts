import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as productService from '../../http/services/product.service.ts';
import { db } from '../../../src/db/client.ts';
import { randomUUID } from 'node:crypto';

vi.mock('../../../src/db/client', () => ({
  db: {
    insert: vi.fn(),
    select: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('node:crypto', () => ({
  randomUUID: vi.fn(),
}));

describe('Product Service CRUD', () => {
  const mockProduct = { 
    id: 'f29faac1-c3aa-4e8a-b3f9-4bddc6d5b1a0', 
    name: 'Mesa de Madeira', 
    value: 500, 
    createdBy: 'user-1' 
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(randomUUID).mockReturnValue('f29faac1-c3aa-4e8a-b3f9-4bddc6d5b1a0');
  });

  // --- TESTE DE CRIAÇÃO ---
  it('should create a product', async () => {

    const mockReturning = vi.fn().mockResolvedValue([mockProduct]);

    const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });

    vi.mocked(db.insert).mockReturnValue({ values: mockValues } as any);

    const result = await productService.create({
      name: 'Mesa de Madeira',
      value: 500,
      created_by: 'user-1',
      updated_by: 'user-1'
    });

    expect(db.insert).toHaveBeenCalled();
    expect(result[0].name).toBe('Mesa de Madeira');
  });

  it('should get all products', async () => {
    const mockFrom = vi.fn().mockResolvedValue([mockProduct]);
    vi.mocked(db.select).mockReturnValue({ from: mockFrom } as any);

    const result = await productService.getAll();

    expect(db.select).toHaveBeenCalled();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('f29faac1-c3aa-4e8a-b3f9-4bddc6d5b1a0');
  });

  it('should update a product', async () => {
    const mockReturning = vi.fn().mockResolvedValue([mockProduct]);
    const mockWhere = vi.fn().mockReturnValue({ returning: mockReturning });
    const mockSet = vi.fn().mockReturnValue({ where: mockWhere });
    vi.mocked(db.update).mockReturnValue({ set: mockSet } as any);

    const result = await productService.update('f29faac1-c3aa-4e8a-b3f9-4bddc6d5b1a0', { 
      name: 'Mesa Atualizada',
      updated_by: 'user-1'
    });

    expect(db.update).toHaveBeenCalled();
    expect(result[0].id).toBe('f29faac1-c3aa-4e8a-b3f9-4bddc6d5b1a0');
  });

  it('should delete a product', async () => {
    const mockReturning = vi.fn().mockResolvedValue([mockProduct]);
    const mockWhere = vi.fn().mockReturnValue({ returning: mockReturning });
    vi.mocked(db.delete).mockReturnValue({ where: mockWhere } as any);

    const result = await productService.remove('f29faac1-c3aa-4e8a-b3f9-4bddc6d5b1a0');

    expect(db.delete).toHaveBeenCalled();
    expect(result[0].id).toBe('f29faac1-c3aa-4e8a-b3f9-4bddc6d5b1a0');
  });
});