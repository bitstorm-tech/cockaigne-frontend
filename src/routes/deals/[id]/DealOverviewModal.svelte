<script lang="ts">
  import Modal from "$lib/components/ui/Modal.svelte";
  import { formatDate, formatDateWithTimeZone } from "$lib/date-time.utils";
  import { calcDealEnd } from "$lib/deal.utils";
  import type { Deal } from "$lib/supabase/public-types";
  import { createEventDispatcher } from "svelte";

  export let open = false;
  export let deal: Deal;
  export let costs: string;
  export let startDealImmediately: boolean;
  export let durationInDays: number;
  export let hasActiveVouchers = false;

  let startDate: string;
  let endDate: string;
  let startDateAsDate: Date;

  const dispatch = createEventDispatcher();

  function calculateDates() {
    startDateAsDate = new Date();
    const dealStart = formatDateWithTimeZone(startDealImmediately ? startDateAsDate.toISOString() : deal.start);
    startDate = formatDate(dealStart);
    endDate = calcDealEnd(dealStart, durationInDays);
  }

  const buttons = [
    {
      text: "Jetzt starten",
      callback: () => {
        open = false;
        dispatch("startDeal", startDealImmediately ? startDateAsDate.toISOString() : deal.start);
      },
      warning: true
    },
    {
      text: "Nochmal überarbeiten",
      callback: () => (open = false)
    }
  ];
</script>

<Modal bind:open {buttons} openCallback={calculateDates}>
  <h2>Das Wichtigste zusammengefasst</h2>
  <div class="grid grid-cols-4 py-10">
    <div>Start:</div>
    <div class="col-span-3">{startDate}</div>
    <div>Ende:</div>
    <div class="col-span-3">{endDate}</div>
    <div>Dauer:</div>
    <div class="col-span-3">{durationInDays} Tag{durationInDays > 1 ? "e" : ""}</div>
  </div>
  <hr class="my-6" />
  <div class="flex gap-2 text-xl">
    <div>Kosten:</div>
    <div class:line-through={hasActiveVouchers}>{costs} €</div>
    {#if hasActiveVouchers}
      <div>0 € (Gutschein aktiv)</div>
    {/if}
  </div>
</Modal>
