import { logError } from "$lib/error-utils";
import type { Supabase } from "$lib/supabase/supabase-client";

export async function activateVoucher(
  supabase: Supabase,
  userId: string,
  voucherCode: string
): Promise<string | undefined> {
  const { data: voucher, error: error1 } = await supabase
    .from("vouchers")
    .select()
    .eq("code", voucherCode)
    .maybeSingle();

  if (error1) {
    return logError(error1, "Can't activate voucher", "Fehler beim aktivieren des Gutscheins");
  }

  if (!voucher) {
    return logError(null, "Voucher not found", "Gutschein ungültig");
  }

  const { data: activatedVouchers, error: error2 } = await supabase
    .from("activated_vouchers")
    .select()
    .eq("voucher_code", voucherCode);

  if (error2) {
    return logError(error2, "Can't activate voucher", "Fehler beim aktivieren des Gutscheins");
  }

  if (activatedVouchers.length > 0 && !voucher.multi_use) {
    return logError(null, "Voucher already activated", "Gutschein wurde bereits eingelöst");
  }

  const alreadyActivated = activatedVouchers.find((v) => v.user_id === userId);
  if (alreadyActivated) {
    return logError(null, "Voucher already activated", "Gutschein wurde bereits eingelöst");
  }

  if (!voucher.start) {
    const { error: error3 } = await supabase
      .from("vouchers")
      .update({ start: new Date().toISOString() })
      .eq("code", voucherCode);

    if (error3) {
      return logError(error3, "Can't update vouchers start date", "Fehler beim aktivieren des Gutscheins");
    }
  }

  await supabase.from("activated_vouchers").insert({ user_id: userId, voucher_code: voucherCode });
}

export async function hasActiveVouchers(supabase: Supabase, userId: string): Promise<boolean> {
  const { count, error } = await supabase
    .from("active_vouchers_view")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) {
    return logError(error, "Can't check valid voucher", false);
  }

  return count != null && count > 0;
}
