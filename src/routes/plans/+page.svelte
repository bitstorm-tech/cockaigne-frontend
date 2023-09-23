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

  let monthOrYear = 0;
  let alertMessage = "";
  let voucherCode = "";

  const options = {
    0: "Monatsabo",
    1: "Jahresabo (2 Monate geschenkt!)"
  };

  const pricesPerMonth = [
    ["99,99", "269,99", "749,99"],
    ["79,99", "224,99", "624,99"]
  ];

  const pricesPerYaear = [
    ["", "", ""],
    ["799,90", "2249,90", "6249,90"]
  ];

  const pricePerDealDay = [
    ["3,99", "2,75", "1,25"],
    ["3,33", "2,29", "1,04"]
  ];

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
  <ButtonGroup {options} bind:value={monthOrYear}></ButtonGroup>
  <PlanCard title="Starter" showButton={false}>
    <ul>
      <li class="list-disc">Keine monatlichen Gebühren</li>
      <li class="list-disc">
        Jeder Deal-Tag<span class="inline-block align-top">*</span> kostet 4,99 €
      </li>
    </ul>
  </PlanCard>
  <PlanCard
    title="Basic"
    pricePerMonth={pricesPerMonth[monthOrYear][0]}
    pricePerYear={pricesPerYaear[monthOrYear][0]}
    action={action1}
  >
    <ul>
      <li class="list-disc">25 kostenlose Deal-Tage<span class="inline-block align-top">*</span></li>
      <li class="list-disc">Entspricht ungefähr {pricePerDealDay[monthOrYear][0]} € pro Deal-Tag</li>
    </ul>
  </PlanCard>
  <PlanCard
    title="Exclusive"
    pricePerMonth={pricesPerMonth[monthOrYear][1]}
    pricePerYear={pricesPerYaear[monthOrYear][1]}
    action={action2}
  >
    <ul>
      <li class="list-disc">99 kostenlose Deal-Tage<span class="inline-block align-top">*</span></li>
      <li class="list-disc">Entspricht ungefähr {pricePerDealDay[monthOrYear][1]} € pro Deal-Tag</li>
    </ul>
  </PlanCard>
  <PlanCard
    title="Premium"
    pricePerMonth={pricesPerMonth[monthOrYear][2]}
    pricePerYear={pricesPerYaear[monthOrYear][2]}
    action={action3}
  >
    <ul>
      <li class="list-disc">600 kostenlose Deal-Tage<span class="inline-block align-top">*</span></li>
      <li class="list-disc">Entspricht ungefähr {pricePerDealDay[monthOrYear][2]} € pro Deal-Tag</li>
    </ul>
  </PlanCard>

  <PlanCard title="Gutschein aktivieren" action={actionCode}>
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
    <Input bind:value={voucherCode} />
  </PlanCard>
</section>
<Alert show={alertMessage?.length > 0} warning on:confirm={() => (alertMessage = "")}>{alertMessage}</Alert>
