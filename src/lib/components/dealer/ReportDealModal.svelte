<script lang="ts">
  import { page } from "$app/stores";
  import Button from "$lib/components/ui/Button.svelte";
  import LoadingSpinner from "$lib/components/ui/icons/LoadingSpinner.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";
  import Textarea from "$lib/components/ui/Textarea.svelte";
  import { getReport, saveReport } from "$lib/supabase/report-service";

  export let open = false;
  export let dealName = "";
  export let dealId: string;

  let reason = "";
  let alreadyReported = false;
  let loading = false;

  async function onOpen() {
    loading = true;
    const userId = $page.data.userId;

    if (!userId) return;

    const report = await getReport($page.data.supabase, userId, dealId);
    alreadyReported = !!report;
    reason = report ? report.reason : "";
    loading = false;
  }

  function sendReport() {
    const userId = $page.data.userId;

    if (userId) {
      saveReport($page.data.supabase, userId, dealId, reason);
    }

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
