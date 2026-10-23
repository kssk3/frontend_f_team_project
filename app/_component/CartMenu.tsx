import { connection } from 'next/server';
import { getCartActor } from '@/domains/cart/queries/getCartActor.query';
import { getMemberCartItems } from '@/domains/cart/queries/getCartItems.query';
import { countCartQuantity } from '@/domains/cart/utils/cartItem.utils';
import CartBadge from '@/domains/cart/components/CartBadge';

export default async function CartMenu() {
    await connection();
    const actor = await getCartActor();
    if (actor.kind !== 'member') return <CartBadge actor={actor.kind} />;
    const items = await getMemberCartItems(actor.userId).catch(() => null);
    if (!items) return <CartBadge actor="error" />;
    return <CartBadge actor="member" quantity={countCartQuantity(items)} />;
}
