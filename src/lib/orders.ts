import { getSupabaseAdmin, type OrderRow } from "./supabase";
import type { Order } from "./constants";

function rowToOrder(row: OrderRow): Order {
  return {
    id: row.id,
    packageId: row.package_id as Order["packageId"],
    formData: row.form_data,
    status: row.status,
    createdAt: row.created_at,
    paidAt: row.paid_at ?? undefined,
    stripeSessionId: row.stripe_session_id ?? undefined,
  };
}

export async function saveOrder(order: Order): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("orders").insert({
    id: order.id,
    package_id: order.packageId,
    form_data: order.formData,
    status: order.status,
    created_at: order.createdAt,
    paid_at: order.paidAt ?? null,
    stripe_session_id: order.stripeSessionId ?? null,
  });

  if (error) {
    throw new Error(`Errore salvataggio ordine: ${error.message}`);
  }
}

export async function getOrder(id: string): Promise<Order | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Errore lettura ordine: ${error.message}`);
  }

  return data ? rowToOrder(data as OrderRow) : null;
}

export async function updateOrder(
  id: string,
  updates: Partial<Order>
): Promise<Order | null> {
  const existing = await getOrder(id);
  if (!existing) return null;

  const patch: Record<string, unknown> = {};
  if (updates.packageId !== undefined) patch.package_id = updates.packageId;
  if (updates.formData !== undefined) patch.form_data = updates.formData;
  if (updates.status !== undefined) patch.status = updates.status;
  if (updates.paidAt !== undefined) patch.paid_at = updates.paidAt;
  if (updates.stripeSessionId !== undefined) {
    patch.stripe_session_id = updates.stripeSessionId;
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("orders")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Errore aggiornamento ordine: ${error.message}`);
  }

  return data ? rowToOrder(data as OrderRow) : null;
}
