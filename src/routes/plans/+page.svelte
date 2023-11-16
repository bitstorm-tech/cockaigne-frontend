<script lang="ts">
  import { goto, invalidateAll } from "$app/navigation";
  import { page } from "$app/stores";
  import Alert from "$lib/components/ui/Alert.svelte";
  import ButtonGroup from "$lib/components/ui/ButtonGroup.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import LoadingSpinner from "$lib/components/ui/icons/LoadingSpinner.svelte";
  import { activateVoucher, calculateVoucherValidDays } from "$lib/supabase/voucher-service";
  import PlanCard from "./PlanCard.svelte";

  export let data;

  type PlanType = "starter" | "exclusive" | "premium";
  type AboType = "starter" | "monthly" | "yearly";
  let chosenOption: AboType = "starter";
  let alertMessage = "";
  let voucherCode = "";
  let loading = false;

  const options = {
    starter: "Starter",
    monthly: "Monatsabo",
    yearly: "Jahresabo"
  };

  const actionStripeStarter = {
    text: "Abo abschließen",
    callback: () => doStripeRequest("starter")
  };

  const actionStripeExclusive = {
    text: "Abo abschließen",
    callback: () => doStripeRequest("exclusive")
  };

  const actionStripePremium = {
    text: "Abo abschließen",
    callback: () => doStripeRequest("premium")
  };

  const actionCode = {
    text: "Aktivieren",
    callback: async () => {
      const error = await activateVoucher($page.data.supabase, $page.data.userId || "", voucherCode);
      if (error) {
        alertMessage = error;
      } else {
        invalidateAll();
        alertMessage = "Gutschein erfolgreich aktiviert!";
      }
    }
  };

  async function doStripeRequest(plan: PlanType) {
    const formData = new FormData();
    formData.append("lookupKey", `cockaigne-${plan}-${chosenOption}`);
    const response = await fetch("/api/subscriptions", { method: "post", body: formData });

    if (response.ok) {
      const url = await response.text();
      await goto(url);
    }

    alertMessage = response.statusText;
  }

  function confirm() {
    alertMessage = "";
    loading = false;
  }
</script>

<section class="flex flex-col items-center gap-4 p-4">
  <h1>Preise & Abos</h1>
  {#if data.activeSubscription}
    <h2 class="text-red">Du hast bereits ein aktives Abo!</h2>
  {/if}
  <ButtonGroup {options} bind:value={chosenOption}></ButtonGroup>
  <span class="px-4 text-center" class:invisible={chosenOption === "starter"}>
    Spare weitere 10% beim Abschluss eines Jahresabos!
  </span>
  {#if chosenOption === "starter"}
    <PlanCard titleLeft="Starter" titleRight="4,99 € / Deal" showButton={false} hasActiveSubscription={false}>
      <ul>
        <li class="list-disc">
          <div class="flex items-baseline gap-2">
            Zahle pro Tagesdeal <div class="text-xs">(24 Std. Laufzeit)</div>
          </div>
        </li>
        <li class="list-disc">Kein Abo / keine Grundgebühr</li>
      </ul>
    </PlanCard>
    <PlanCard titleLeft="Gutschein aktivieren" action={actionCode} hasActiveSubscription={false} bind:loading>
      {#await data.lazy.activeVouchers}
        <LoadingSpinner />
      {:then activeVouchers}
        {#if activeVouchers.length > 0}
          <div class="text-sm">Bereits aktivierte Gutscheine:</div>
          <ul class="text-xs">
            {#each activeVouchers as voucher}
              <li>{voucher.code} - noch {calculateVoucherValidDays(voucher)} Tag(e) gültig</li>
            {/each}
          </ul>
        {/if}
      {/await}
      <div class="text-white">
        <Input bind:value={voucherCode} />
      </div>
    </PlanCard>
  {:else if chosenOption === "monthly"}
    <PlanCard
      titleLeft="Starter"
      titleRight="99,90 € / Monat"
      action={actionStripeStarter}
      hasActiveSubscription={data.activeSubscription}
      showButton={!data.activeSubscription}>
      <ul>
        <li class="list-disc">30 kostenlose Tagesdeals pro Monat</li>
        <li class="list-disc">Preisvorteil von ~33% je Deal</li>
        <li class="list-disc">Monatlich kündbar</li>
      </ul>
    </PlanCard>
    <PlanCard
      titleLeft="Exclusive"
      titleRight="249,90 € / Monat"
      action={actionStripeExclusive}
      hasActiveSubscription={data.activeSubscription}
      showButton={!data.activeSubscription}>
      >
      <ul>
        <li class="list-disc">90 kostenlose Tagesdeals pro Monat</li>
        <li class="list-disc">Preisvorteil von ~44% je Deal</li>
        <li class="list-disc">Einfache Statistikabfragen (coming soon)</li>
        <li class="list-disc">Monatlich kündbar</li>
      </ul>
    </PlanCard>
    <PlanCard
      titleLeft="Premium"
      titleRight="349,90 € / Monat"
      action={actionStripePremium}
      hasActiveSubscription={data.activeSubscription}
      showButton={!data.activeSubscription}>
      >
      <ul>
        <li class="list-disc">300 kostenlose Tagesdeals pro Monat</li>
        <li class="list-disc">Preisvorteil von ~76% je Deal</li>
        <li class="list-disc">Erweiterte Statistikabfragen (coming soon)</li>
        <li class="list-disc">Monatlich kündbar</li>
      </ul>
    </PlanCard>
  {:else}
    <PlanCard
      titleLeft="Starter"
      titleRight="1.099,90 € / Jahr"
      action={actionStripeStarter}
      hasActiveSubscription={data.activeSubscription}
      showButton={!data.activeSubscription}>
      >
      <ul>
        <li class="list-disc">30 kostenlose Tagesdeals pro Monat</li>
        <li class="list-disc">Preisvorteil von ~39% je Deal</li>
        <li class="list-disc">Kündbar zum Aboende</li>
      </ul>
    </PlanCard>
    <PlanCard
      titleLeft="Exclusive"
      titleRight="2.699,90 € / Jahr"
      action={actionStripeExclusive}
      hasActiveSubscription={data.activeSubscription}
      showButton={!data.activeSubscription}>
      >
      <ul>
        <li class="list-disc">90 kostenlose Tagesdeals pro Monat</li>
        <li class="list-disc">Preisvorteil von ~50% je Deal</li>
        <li class="list-disc">Einfache Statistikabfragen (coming soon)</li>
        <li class="list-disc">Kündbar zum Aboende</li>
      </ul>
    </PlanCard>
    <PlanCard
      titleLeft="Premium"
      titleRight="3.799,90 € / Jahr"
      action={actionStripePremium}
      hasActiveSubscription={data.activeSubscription}
      showButton={!data.activeSubscription}>
      >
      <ul>
        <li class="list-disc">300 kostenlose Tagesdeals pro Monat</li>
        <li class="list-disc">Preisvorteil von ~79% je Deal</li>
        <li class="list-disc">Erweiterte Statistikabfragen (coming soon)</li>
        <li class="list-disc">Kündbar zum Aboende</li>
      </ul>
    </PlanCard>
  {/if}
</section>
<Alert show={alertMessage?.length > 0} warning on:confirm={confirm}>
  {alertMessage}
</Alert>
