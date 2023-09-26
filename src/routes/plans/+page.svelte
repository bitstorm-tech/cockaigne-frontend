<script>
  import { invalidateAll } from "$app/navigation";
  import { page } from "$app/stores";
  import Alert from "$lib/components/ui/Alert.svelte";
  import ButtonGroup from "$lib/components/ui/ButtonGroup.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import LoadingSpinner from "$lib/components/ui/icons/LoadingSpinner.svelte";
  import { activateVoucher, calculateVoucherValidDays } from "$lib/supabase/voucher-service";
  import PlanCard from "./PlanCard.svelte";

  export let data;

  $: console.log(chosenOption);

  let chosenOption = "starter";
  let alertMessage = "";
  let voucherCode = "";

  const options = {
    starter: "Starter",
    monthly: "Monatsabo",
    yearly: "Jahresabo *"
  };

  // const pricesPerMonth = [
  //   ["", "", ""],
  //   ["99,99", "269,99", "749,99"],
  //   ["79,99", "224,99", "624,99"]
  // ];
  //
  // const pricesPerYear = [
  //   ["", "", ""],
  //   ["", "", ""],
  //   ["799,90", "2249,90", "6249,90"]
  // ];
  //
  // const pricePerDealDay = [
  //   ["", "", ""],
  //   ["3,99", "2,75", "1,25"],
  //   ["3,33", "2,29", "1,04"]
  // ];

  const action1 = {
    text: "Abo abschließen",
    callback: () => {}
  };

  const action2 = {
    text: "Abo abschließen",
    callback: () => {}
  };

  const action3 = {
    text: "Abo abschließen",
    callback: () => {}
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
</script>

<section class="flex flex-col items-center gap-4 p-4">
  <h1>Preise & Abos</h1>
  <ButtonGroup {options} bind:value={chosenOption}></ButtonGroup>
  <span>*) spare 20% (zwei Monate geschenkt!)</span>
  {#if chosenOption === "starter"}
    <PlanCard titleLeft="Starter" titleRight="4,99 € / Deal" showButton={false}>
      <ul>
        <li class="list-disc">
          <div class="flex items-baseline gap-2">
            Zahle pro Tagesdeal <div class="text-xs">(24 Std. Laufzeit)</div>
          </div>
        </li>
        <li class="list-disc">Kein Abo / keine Grundgebühr</li>
      </ul>
    </PlanCard>
    <PlanCard titleLeft="Gutschein aktivieren" action={actionCode}>
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
    <PlanCard titleLeft="Starter" titleRight="99,90 € / Monat" action={action1}>
      <ul>
        <li class="list-disc">30 kostenlose Tagesdeals pro Monat<span class="inline-block align-top">**</span></li>
        <li class="list-disc">Preisvorteil von ~33% je Deal</li>
        <li class="list-disc">Monatlich kündbar</li>
      </ul>
    </PlanCard>
    <PlanCard titleLeft="Exclusive" titleRight="249,90 € / Monat" action={action2}>
      <ul>
        <li class="list-disc">90 kostenlose Tagesdeals pro Monat<span class="inline-block align-top">**</span></li>
        <li class="list-disc">Preisvorteil von ~44% je Deal</li>
        <li class="list-disc">Einfache Statistikabfragen (coming soon)</li>
        <li class="list-disc">Monatlich kündbar</li>
      </ul>
    </PlanCard>
    <PlanCard titleLeft="Premium" titleRight="349,90 € / Monat" action={action3}>
      <ul>
        <li class="list-disc">300 kostenlose Tagesdeals pro Monat<span class="inline-block align-top">**</span></li>
        <li class="list-disc">Preisvorteil von ~76% je Deal</li>
        <li class="list-disc">Erweiterte Statistikabfragen (coming soon)</li>
        <li class="list-disc">Monatlich kündbar</li>
      </ul>
    </PlanCard>
  {:else}
    <PlanCard titleLeft="Starter" titleRight="1.099,90 € / Jahr" action={action1}>
      <ul>
        <li class="list-disc">30 kostenlose Tagesdeals pro Monat<span class="inline-block align-top">**</span></li>
        <li class="list-disc">Preisvorteil von ~39% je Deal</li>
        <li class="list-disc">Kündbar zum Aboende</li>
      </ul>
    </PlanCard>
    <PlanCard titleLeft="Exclusive" titleRight="2.699,90 € / Jahr" action={action2}>
      <ul>
        <li class="list-disc">90 kostenlose Tagesdeals pro Monat<span class="inline-block align-top">**</span></li>
        <li class="list-disc">Preisvorteil von ~50% je Deal</li>
        <li class="list-disc">Einfache Statistikabfragen (coming soon)</li>
        <li class="list-disc">Kündbar zum Aboende</li>
      </ul>
    </PlanCard>
    <PlanCard titleLeft="Premium" titleRight="3.799,90 € / Jahr" action={action3}>
      <ul>
        <li class="list-disc">300 kostenlose Tagesdeals pro Monat<span class="inline-block align-top">**</span></li>
        <li class="list-disc">Preisvorteil von ~79% je Deal</li>
        <li class="list-disc">Erweiterte Statistikabfragen (coming soon)</li>
        <li class="list-disc">Kündbar zum Aboende</li>
      </ul>
    </PlanCard>
  {/if}
</section>
<Alert show={alertMessage?.length > 0} warning on:confirm={() => (alertMessage = "")}>{alertMessage}</Alert>
