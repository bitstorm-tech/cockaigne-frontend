<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import ConfirmDeleteDealModal from "$lib/components/dealer/ConfirmDeleteDealModal.svelte";
  import Picture from "$lib/components/dealer/pictures/Picture.svelte";
  import Alert from "$lib/components/ui/Alert.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import ButtonGroup from "$lib/components/ui/ButtonGroup.svelte";
  import CategorySelect from "$lib/components/ui/CategorySelect.svelte";
  import Checkbox from "$lib/components/ui/Checkbox.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import Textarea from "$lib/components/ui/Textarea.svelte";
  import { getDateAsIsoString, getDateTimeAsIsoString } from "$lib/date-time.utils";
  import { getDealState } from "$lib/deal.utils";
  import { deleteDeal, upsertDeal } from "$lib/supabase/deal-service";
  import type { Deal } from "$lib/supabase/public-types";
  import { deleteDealImages, saveDealImages } from "$lib/supabase/storage-service";
  import type { PageData } from "./$types";

  export let data: PageData;
  export let deal: Deal = data.deal;

  const supabase = $page.data.supabase;

  const runtimes = {
    "24": "1 Tag",
    "48": "2 Tage",
    "72": "3 Tage"
  };

  const nowDateTimeString = getDateTimeAsIsoString();

  let openErrorModal = false;
  let openDeleteModal = false;
  let createTemplate = false;
  let startDealImmediately = false;
  let individuallyTime = +deal.duration > 72;
  let individualEndDate = deal.id
    ? getDateAsIsoString(new Date(deal.start), +deal.duration * 60)
    : getDateAsIsoString(new Date(), 25 * 60);
  let costs = "4,99";
  let images: File[] = [];
  let imagePreviews: string[] = [];
  let fileInput: HTMLInputElement;
  let loading = false;

  const disabled = !deal.template && ["active", "past"].includes(getDealState(deal));

  $: disableSave = deal.title.length === 0 || deal.description.length === 0;
  $: {
    deal.start && individualEndDate && individuallyTime;
    const durationInDays = getDurationInDays();
    costs = (4.99 * durationInDays).toFixed(2).replace(".", ",");
  }

  async function save() {
    if (deal.template) {
      deal.template = false;
      deal.id = "";
    }

    deal.duration = getDurationInDays() * 24;
    deal.start = formatDateWithTimeZone(deal.start);

    deal.dealer_id = $page.data.session.user.id;
    const dealId = await upsertDeal($page.data.supabase, deal, createTemplate);

    if (!dealId) {
      return;
    }

    await saveDealImages($page.data.supabase, $page.data.session.user.id, images, dealId);

    goto("/");
  }

  function getDurationInDays(): number {
    if (individuallyTime) {
      const startDate = deal.start.split("T")[0];
      const startTimestamp = Date.parse(startDate);
      const endTimestamp = Date.parse(individualEndDate);
      return (endTimestamp - startTimestamp) / (60 * 60 * 1000) / 24;
    }

    return +deal.duration / 24;
  }

  async function del() {
    const error = await deleteDeal(supabase, deal.dealer_id, deal.id);

    if (!error) {
      await deleteDealImages(supabase, deal.dealer_id, deal.id);
      await goto("/");
    }

    openErrorModal = true;
  }

  // @ts-ignore
  function pictureSelected(event) {
    const file = event.target.files[0] as File;

    if (!file) {
      return;
    }

    const URL = window.URL || window.webkitURL;
    imagePreviews = [...imagePreviews, URL.createObjectURL(file)];
    images.push(file);
  }

  function deletePicture(index: number) {
    imagePreviews.splice(index, 1);
    imagePreviews = [...imagePreviews];
    images.splice(index);
  }

  function formatDateWithTimeZone(start: string): string {
    throw new Error("Function not implemented.");
  }
</script>

<div class="flex flex-col gap-4 p-4">
  <Input label="Titel" bind:value={deal.title} {disabled} />
  <Textarea label="Beschreibung" bind:value={deal.description} {disabled} />
  <CategorySelect bind:value={deal.category_id} {disabled} />
  {#if !deal.id}
    <Button on:click={() => fileInput.click()} disabled={imagePreviews.length >= 3}>
      Bild hinzufügen ({imagePreviews.length} / 3)
    </Button>
    <input bind:this={fileInput} on:change={pictureSelected} type="file" hidden />
  {/if}
  <div class="grid grid-cols-3 gap-2">
    {#if deal.id}
      {#each deal.imageUrls || [] as imageUrl}
        <Picture url={imageUrl} fixedHeight={false} />
      {/each}
    {:else}
      {#each imagePreviews as imagePreview, index}
        <Picture url={imagePreview} showDelete={true} fixedHeight={false} on:delete={() => deletePicture(index)} />
      {/each}
    {/if}
  </div>
  <div class="flex gap-4">
    <Checkbox label="Individuelle Laufzeit" bind:checked={individuallyTime} {disabled} />
    <Checkbox label="Sofort starten" bind:checked={startDealImmediately} {disabled} />
  </div>
  {#if startDealImmediately}
    <p class="py-7">Dein Deal startet sofort wenn du auf "Erstellen" klickst!</p>
  {:else}
    <Input
      type="datetime-local"
      min={nowDateTimeString}
      label="Start"
      bind:value={deal.start}
      disabled={disabled || startDealImmediately}
    />
  {/if}
  {#if individuallyTime}
    <Input type="date" min={deal.start} label="Ende" bind:value={individualEndDate} {disabled} />
  {:else}
    <div class="py-2">
      <ButtonGroup label="Laufzeit" options={runtimes} bind:value={deal.duration} {disabled} />
    </div>
  {/if}
  <div class="grid grid-cols-2 pt-16">
    <div>
      <p class="text-lg font-bold">Kosten: {costs} €</p>
      <p class="pt-4 text-xs">{`${getDurationInDays()} Tag(e) a 4,99 € pro Tag`}</p>
    </div>
    <div class="flex flex-col gap-3">
      <Button warning on:click={save} disabled={disableSave || disabled} {loading}>
        {deal.id && !deal.template ? "Speichern" : "Erstellen"}
      </Button>
      {#if deal.id && !disabled}
        <Button error on:click={() => (openDeleteModal = true)}>Löschen</Button>
      {/if}
      <Button small on:click={() => goto("/")}>Abbrechen</Button>
      {#if !deal.template}
        <div class="flex justify-center">
          <Checkbox label="Zusätzlich als Vorlage speichern" bind:checked={createTemplate} {disabled} />
        </div>
      {/if}
    </div>
  </div>
</div>
<Alert bind:show={openErrorModal}>Ups, da ging was schief. Konnte den Deal leider nicht speichern oder löschen!</Alert>
<ConfirmDeleteDealModal bind:open={openDeleteModal} dealTitle={deal.title} deleteFunction={del} />
