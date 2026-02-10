import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as pmService from '../../http/services/product_material.service.ts';
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

describe('Product Material Service CRUD', () => {
  const mockPM = { 
    id: '9d8c529c-5240-4728-9f98-0c13a3d82c7d', 
    product_id: '87f937ad-5954-4dbb-a331-0d63884690bc', 
    raw_material_id: '1712298c-9d92-44ce-834e-2412ad2a407d', 
    required_quantity: 10 
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(randomUUID).mockReturnValue('9d8c529c-5240-4728-9f98-0c13a3d82c7d');
  });

  it('should create a product material relationship', async () => {
    const mockReturning = vi.fn().mockResolvedValue([mockPM]);
    const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });
    vi.mocked(db.insert).mockReturnValue({ values: mockValues } as any);

    const result = await pmService.create({
      product_id: '87f937ad-5954-4dbb-a331-0d63884690bc',
      raw_material_id: '1712298c-9d92-44ce-834e-2412ad2a407d',
      required_quantity: 10,
      created_by: 'u1',
      updated_by: 'u1'
    });

    expect(db.insert).toHaveBeenCalled();
    expect(result[0].id).toBe('9d8c529c-5240-4728-9f98-0c13a3d82c7d');
  });

  it('should get product material by id', async () => {
    const mockWhere = vi.fn().mockResolvedValue([mockPM]);
    const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
    vi.mocked(db.select).mockReturnValue({ from: mockFrom } as any);

    const result = await pmService.get('9d8c529c-5240-4728-9f98-0c13a3d82c7d');

    expect(db.select).toHaveBeenCalled();
    expect(result[0].product_id).toBe('87f937ad-5954-4dbb-a331-0d63884690bc');
  });

  it('should get materials by product id', async () => {
    const mockWhere = vi.fn().mockResolvedValue([mockPM]);
    const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
    vi.mocked(db.select).mockReturnValue({ from: mockFrom } as any);

    const result = await pmService.getByProductId('87f937ad-5954-4dbb-a331-0d63884690bc');

    expect(db.select).toHaveBeenCalled();
    expect(result[0].product_id).toBe('87f937ad-5954-4dbb-a331-0d63884690bc');
  });

  it('should update a product material relationship', async () => {
    const mockReturning = vi.fn().mockResolvedValue([mockPM]);
    const mockWhere = vi.fn().mockReturnValue({ returning: mockReturning });
    const mockSet = vi.fn().mockReturnValue({ where: mockWhere });
    vi.mocked(db.update).mockReturnValue({ set: mockSet } as any);

    const result = await pmService.update('9d8c529c-5240-4728-9f98-0c13a3d82c7d', {
      required_quantity: 20,
      updated_by: 'u1'
    });

    expect(db.update).toHaveBeenCalled();
    expect(result[0].id).toBe('9d8c529c-5240-4728-9f98-0c13a3d82c7d');
  });

  it('should remove a product material relationship', async () => {
    const mockReturning = vi.fn().mockResolvedValue([mockPM]);
    const mockWhere = vi.fn().mockReturnValue({ returning: mockReturning });
    vi.mocked(db.delete).mockReturnValue({ where: mockWhere } as any);

    const result = await pmService.remove('9d8c529c-5240-4728-9f98-0c13a3d82c7d');

    expect(db.delete).toHaveBeenCalled();
    expect(result[0].id).toBe('9d8c529c-5240-4728-9f98-0c13a3d82c7d');
  });
});