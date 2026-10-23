import { beforeEach, expect, test, vi } from 'vitest';
import { removeCartItems } from './removeCartItem.actions';
import { addToCartItem } from './addToCartItem.actions';

const boundary = vi.hoisted(() => ({ create: vi.fn(), revalidate: vi.fn() }));
vi.mock('server-only', () => ({}));
vi.mock('@/shared/lib/supabase', () => ({ createServerClient: boundary.create }));
vi.mock('next/cache', () => ({ revalidatePath: boundary.revalidate }));

const A = '11111111-1111-4111-8111-111111111111';
const B = '22222222-2222-4222-8222-222222222222';
const C = '33333333-3333-4333-8333-333333333333';
const OPTION = '44444444-4444-4444-8444-444444444444';
type Row = Record<string, unknown>;
let rows: Row[];
let user: { id: string } | null;
let authError: { name?: string; message?: string; status?: number } | null;
let profile: Row | null;
let dbError: { message: string } | null;
let writes: number;

// Stateful transport double: real action filters determine which rows are removed.
function query(table: string) {
    let operation = 'read';
    let payload: Row = {};
    const filters: ((row: Row) => boolean)[] = [];
    function execute() {
        if (table === 'users') return { data: profile, error: dbError };
        if (table === 'product_options') return { data: { stock: 10 }, error: dbError };
        if (dbError) return { data: null, error: dbError };
        const matched = rows.filter((row) => filters.every((filter) => filter(row)));
        if (operation === 'delete') {
            writes++;
            rows = rows.filter((row) => !matched.includes(row));
        } else if (operation === 'update') {
            writes++;
            matched.forEach((row) => Object.assign(row, payload));
        } else if (operation === 'insert') {
            writes++;
            const row = { id: C, deleted_at: null, ...payload };
            rows.push(row);
            return { data: [row], error: null };
        }
        return { data: matched, error: null };
    }
    const builder = {
        select: () => builder,
        eq: (key: string, value: unknown) => { filters.push((row) => row[key] === value); return builder; },
        in: (key: string, values: unknown[]) => { filters.push((row) => values.includes(row[key])); return builder; },
        is: (key: string, value: unknown) => { filters.push((row) => row[key] === value); return builder; },
        delete: () => { operation = 'delete'; return builder; },
        update: (value: Row) => { operation = 'update'; payload = value; return builder; },
        insert: (value: Row) => { operation = 'insert'; payload = value; return builder; },
        maybeSingle: async () => { const result = execute(); return { ...result, data: Array.isArray(result.data) ? result.data[0] ?? null : result.data }; },
        then: (resolve: (result: ReturnType<typeof execute>) => unknown) => Promise.resolve(execute()).then(resolve),
    };
    return builder;
}

beforeEach(() => {
    vi.clearAllMocks();
    user = { id: 'member-a' };
    authError = null;
    profile = { id: 'member-a', name: 'Test', deleted_at: null };
    dbError = null;
    writes = 0;
    rows = [
        { id: A, user_id: 'member-a', option_id: OPTION, quantity: 2, deleted_at: null },
        { id: B, user_id: 'member-b', option_id: OPTION, quantity: 3, deleted_at: null },
        { id: C, user_id: 'member-a', option_id: 'other-option', quantity: 1, deleted_at: null },
    ];
    boundary.create.mockReturnValue({ auth: { getUser: async () => ({ data: { user }, error: authError }) }, from: query });
});

test('physically removes requested owned rows while preserving other users and unselected rows', async () => {
    const result = await removeCartItems([A]);
    expect(result).toMatchObject({ success: true, removedIds: [A] });
    expect(rows.map((row) => row.id).sort()).toEqual([B, C].sort());
    expect(boundary.revalidate).toHaveBeenCalledWith('/cart');
    expect(boundary.revalidate).toHaveBeenCalledWith('/', 'layout');
});

test('bulk deletion removes every requested owned row', async () => {
    expect((await removeCartItems([A, C])).success).toBe(true);
    expect(rows.map((row) => row.id)).toEqual([B]);
});

test('valid uppercase UUIDs are normalized before ownership-checked deletion', async () => {
    const lower = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
    rows.push({ id: lower, user_id: 'member-a', deleted_at: null });
    expect(await removeCartItems([lower.toUpperCase()])).toMatchObject({ success: true, removedIds: [lower] });
    expect(rows.find((row) => row.id === lower)).toBeUndefined();
});

test.each([null, undefined, A, [], ['bad'], [new File(['id'], 'id.txt')], Array(51).fill(A)])(
    'rejects malformed or unbounded delete input before DB writes: %s', async (ids) => {
        expect((await removeCartItems(ids)).success).toBe(false);
        expect(writes).toBe(0);
    },
);

test('foreign IDs and zero returned deletions cannot report success', async () => {
    expect(await removeCartItems([B])).toMatchObject({ success: false, removedIds: [] });
    expect(rows).toHaveLength(3);
    expect(boundary.revalidate).not.toHaveBeenCalled();
});

test('partial concurrent deletion reports actual removed IDs and refreshes authoritative data', async () => {
    const result = await removeCartItems([A, B]);
    expect(result).toMatchObject({ success: false, removedIds: [A] });
    expect(result.message).toBeTruthy();
    expect(rows.map((row) => row.id).sort()).toEqual([B, C].sort());
    expect(boundary.revalidate).toHaveBeenCalledWith('/', 'layout');
});

test('missing auth cannot delete an existing owned row', async () => {
    user = null;
    expect((await removeCartItems([A])).success).toBe(false);
    expect(writes).toBe(0);
});

test.each([null, { id: 'member-a', deleted_at: '2026-01-01' }, { id: 'member-b', deleted_at: null }])(
    'rejects a missing, deleted or mismatched profile', async (value) => {
        profile = value;
        expect((await removeCartItems([A])).success).toBe(false);
        expect(writes).toBe(0);
    },
);

test('DB errors preserve rows and return sanitized failure', async () => {
    // Profile verification is healthy; only the cart transport fails.
    boundary.create.mockReturnValue({
        auth: { getUser: async () => ({ data: { user }, error: null }) },
        from: (table: string) => table === 'cart_items' ? (() => { dbError = { message: 'private database detail' }; return query(table); })() : query(table),
    });
    const result = await removeCartItems([A]);
    expect(result).toMatchObject({ success: false, removedIds: [] });
    expect(result.message).not.toContain('private');
    expect(rows).toHaveLength(3);
});

function addForm() { const data = new FormData(); data.set('optionID', OPTION); data.set('quantity', '2'); return data; }

test('a normal anonymous add is explicitly typed for guest storage without a DB write', async () => {
    user = null;
    authError = { name: 'AuthSessionMissingError' };
    expect(await addToCartItem({ success: false }, addForm())).toMatchObject({ success: true, mode: 'guest' });
    expect(writes).toBe(0);
});

test('auth service failure is not converted to a successful guest add', async () => {
    user = null;
    authError = { name: 'AuthRetryableFetchError', status: 503, message: 'private auth detail' };
    const result = await addToCartItem({ success: false }, addForm());
    expect(result.success).toBe(false);
    expect(result).not.toHaveProperty('mode', 'guest');
    expect(result.message).not.toContain('private');
    expect(writes).toBe(0);
});

test('member add updates owned DB quantity and invalidates the shared header', async () => {
    expect(await addToCartItem({ success: false }, addForm())).toMatchObject({ success: true, mode: 'member' });
    expect(rows.find((row) => row.id === A)?.quantity).toBe(4);
    expect(rows.find((row) => row.id === B)?.quantity).toBe(3);
    expect(boundary.revalidate).toHaveBeenCalledWith('/', 'layout');
});
