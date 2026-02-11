import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as userService from '../../http/services/user.service.ts';
import { db } from '../../../src/db/client.ts';

vi.mock('bcrypt', () => ({
  hash: vi.fn().mockResolvedValue('hashed_pass'),
  default: { hash: vi.fn().mockResolvedValue('hashed_pass') }
}));

vi.mock('../../../src/db/client', () => ({
  db: {
    insert: vi.fn(),
    select: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('User Service CRUD', () => {
  const mockUser = { id: 'b566ce5e-f6e3-4f77-bafb-bf9086b17132', name: 'John', email: 'john@example.com' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a user', async () => {
    const mockReturning = vi.fn().mockResolvedValue([mockUser]);
    const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });
    vi.mocked(db.insert).mockReturnValue({ values: mockValues } as any);

    const result = await userService.create({ ...mockUser, password: '123' });

    expect(db.insert).toHaveBeenCalled();
    expect(result[0].email).toBe(mockUser.email);
  });

  it('should find a user by email', async () => {
    // Drizzle select().from().where() chaining
    const mockWhere = vi.fn().mockResolvedValue([mockUser]);
    const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
    vi.mocked(db.select).mockReturnValue({ from: mockFrom } as any);

    const result = await userService.findByEmail('john@example.com');

    expect(db.select).toHaveBeenCalled();
    expect(result[0].email).toBe(mockUser.email);
  });

  it('should update a user', async () => {
    // Drizzle update().set().where().returning()
    const mockReturning = vi.fn().mockResolvedValue([mockUser]);
    const mockWhere = vi.fn().mockReturnValue({ returning: mockReturning });
    const mockSet = vi.fn().mockReturnValue({ where: mockWhere });
    vi.mocked(db.update).mockReturnValue({ set: mockSet } as any);

    const result = await userService.update('b566ce5e-f6e3-4f77-bafb-bf9086b17132', { name: 'John Updated' });

    expect(db.update).toHaveBeenCalled();
    expect(result[0].id).toBe('b566ce5e-f6e3-4f77-bafb-bf9086b17132');
  });

  it('should delete a user', async () => {
    // Drizzle delete().where().returning()
    const mockReturning = vi.fn().mockResolvedValue([ { id: 'b566ce5e-f6e3-4f77-bafb-bf9086b17132' } ]);
    const mockWhere = vi.fn().mockReturnValue({ returning: mockReturning });
    vi.mocked(db.delete).mockReturnValue({ where: mockWhere } as any);

    const result = await userService.remove('b566ce5e-f6e3-4f77-bafb-bf9086b17132');

    expect(db.delete).toHaveBeenCalled();
    expect(result[0].id).toBe('b566ce5e-f6e3-4f77-bafb-bf9086b17132');
  });
});