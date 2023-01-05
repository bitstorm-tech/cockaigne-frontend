<script lang="ts">
  import Button from "$lib/components/ui/Button.svelte";
  import LoadingSpinner from "$lib/components/ui/icons/LoadingSpinner.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";
  import Textarea from "$lib/components/ui/Textarea.svelte";
  import type { Report } from "$lib/database/report/report.model";
  import { POST } from "$lib/http.utils";

  export let open = false;
  export let dealName = "";
  export let dealId = -1;

  let reason = "";
  let alreadyReported = false;
  let loading = false;

  async function onOpen() {
    loading = true;
    const response = await fetch("/api/reports?dealId=" + dealId);
    const report: Report = await response.json();
    alreadyReported = report?.reason?.length > 0;
    reason = alreadyReported ? report.reason : "";
    loading = false;
  }

  function sendReport() {
    const report: Report = {
      deal_id: dealId,
      reason,
      reporter_id: -1
    };

    fetch("/api/reports", POST(report));
    open = false;
  }
</script>

<Modal bind:open openCallback={onOpen}>
  <h2 class="break-words">Du willst den Deal <i>{dealName}</i> melden?</h2>
  {#if loading}
    <div class="flex justify-around py-4">
      <LoadingSpinner size={3} />
    </div>
  {:else if alreadyReported}
    <div class="flex flex-col gap-3">
      <span class="text-xs">Du hast den Deal bereits mit folgender Nachricht gemeldet:</span>
      <span>{reason}</span>
    </div>
  {:else}
    <Textarea label="Sag uns, was an dem Deal nicht passt" bind:value={reason} />
  {/if}
  <div class="modal-action">
    <Button disabled={reason.length === 0 || alreadyReported} on:click={sendReport}>Melden</Button>
  </div>
</Modal>
