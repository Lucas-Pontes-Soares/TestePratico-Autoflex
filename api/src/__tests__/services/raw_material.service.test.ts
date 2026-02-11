import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as rawMaterialService from '../../http/services/raw_material.service.ts';
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

describe('Raw Material Service CRUD', () => {
  const mockMaterial = { 
    id: 'fc617c5f-1bf7-4227-a642-01c6b7fae471', 
    name: 'Iron Ore', 
    stock_quantity: 100, 
    createdBy: 'user-1' 
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(randomUUID).mockReturnValue('fc617c5f-1bf7-4227-a642-01c6b7fae471');
  });

  it('should create a raw material', async () => {
    const mockReturning = vi.fn().mockResolvedValue([mockMaterial]);
    const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });
    vi.mocked(db.insert).mockReturnValue({ values: mockValues } as any);

    const result = await rawMaterialService.create({
      name: 'Iron Ore',
      stock_quantity: 100,
      created_by: 'user-1',
      updated_by: 'user-1'
    });

    expect(db.insert).toHaveBeenCalled();
    expect(result[0].name).toBe('Iron Ore');
  });

  it('should get all raw materials', async () => {
    const mockFrom = vi.fn().mockResolvedValue([mockMaterial]);
    vi.mocked(db.select).mockReturnValue({ from: mockFrom } as any);

    const result = await rawMaterialService.getAll();

    expect(db.select).toHaveBeenCalled();
    expect(result).toHaveLength(1);
  });

  it('should get a single raw material by id', async () => {
    const mockWhere = vi.fn().mockResolvedValue([mockMaterial]);
    const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
    vi.mocked(db.select).mockReturnValue({ from: mockFrom } as any);

    const result = await rawMaterialService.get('fc617c5f-1bf7-4227-a642-01c6b7fae471');

    expect(db.select).toHaveBeenCalled();
    expect(result[0].id).toBe('fc617c5f-1bf7-4227-a642-01c6b7fae471');
  });

  it('should update a raw material', async () => {
    const mockReturning = vi.fn().mockResolvedValue([mockMaterial]);
    const mockWhere = vi.fn().mockReturnValue({ returning: mockReturning });
    const mockSet = vi.fn().mockReturnValue({ where: mockWhere });
    vi.mocked(db.update).mockReturnValue({ set: mockSet } as any);

    const result = await rawMaterialService.update('fc617c5f-1bf7-4227-a642-01c6b7fae471', {
      name: 'Refined Iron',
      updated_by: 'user-1'
    });

    expect(db.update).toHaveBeenCalled();
    expect(result[0].id).toBe('fc617c5f-1bf7-4227-a642-01c6b7fae471');
  });

  it('should remove a raw material', async () => {
    const mockReturning = vi.fn().mockResolvedValue([mockMaterial]);
    const mockWhere = vi.fn().mockReturnValue({ returning: mockReturning });
    vi.mocked(db.delete).mockReturnValue({ where: mockWhere } as any);

    const result = await rawMaterialService.remove('fc617c5f-1bf7-4227-a642-01c6b7fae471');

    expect(db.delete).toHaveBeenCalled();
    expect(result[0].id).toBe('fc617c5f-1bf7-4227-a642-01c6b7fae471');
  });
});