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
  import {
    formatDateWithTimeZone,
    getDateStringWithoutTimezone,
    getDateTimeStringWithoutTimezone,
    isBeforeNow
  } from "$lib/date-time.utils";
  import { getDealState } from "$lib/deal.utils";
  import { deleteDeal, upsertDeal } from "$lib/supabase/deal-service";
  import type { Deal } from "$lib/supabase/public-types";
  import {
    copyDealImages,
    deleteDealImages,
    deleteSpecificDealImages,
    saveDealImages
  } from "$lib/supabase/storage-service";
  import type { PageData } from "./$types";

  export let data: PageData;
  export let deal: Deal = data.deal;

  const supabase = $page.data.supabase;
  const userId = $page.data.userId!;

  const runtimes = {
    24: "1 Tag",
    48: "2 Tage",
    72: "3 Tage"
  };

  const nowDateTimeString = getDateTimeStringWithoutTimezone();

  let openErrorModal = false;
  let openDeleteModal = false;
  let createTemplate = false;
  let startDealImmediately = false;
  let individuallyTime = +deal.duration > 72;
  let individualEndDate = deal.id
    ? getDateStringWithoutTimezone(new Date(deal.start), +deal.duration * 60)
    : getDateStringWithoutTimezone(new Date(), 25 * 60);
  let costs = "4,99";
  let images: File[] = [];
  let imagePreviews: string[] = deal.id ? deal.imageUrls || [] : [];
  let fileInput: HTMLInputElement;
  let loading = false;
  let durationInDays = +deal.duration / 24;
  let helpText = "";
  let imageFilenamesToDelete: string[] = [];

  const disabled = !deal.template && ["active", "past"].includes(getDealState(deal));

  $: disableSave =
    deal.title.length === 0 || deal.description.length === 0 || isBeforeNow(deal.start) || durationInDays < 1;
  $: {
    deal.start && individualEndDate && individuallyTime;
    costs = (4.99 * durationInDays).toFixed(2).replace(".", ",");
  }

  $: {
    durationInDays = +deal.duration / 24;

    if (individuallyTime) {
      const startDate = deal.start.split("T")[0];
      const startTimestamp = Date.parse(startDate);
      const endTimestamp = Date.parse(individualEndDate);
      durationInDays = (endTimestamp - startTimestamp) / (60 * 60 * 1000) / 24;
    }
  }

  $: {
    if (deal.title.length === 0) {
      helpText = "Bitte des Titel-Feld ausfüllen";
    } else if (deal.description.length === 0) {
      helpText = "Bitte das Beschreibung-Feld ausfüllen";
    } else if (isBeforeNow(deal.start)) {
      helpText = "Der Deal darf nicht in der Vergangenheit starten";
    } else if (durationInDays < 1) {
      helpText = "Der Start muss vor dem Ende liegen";
    } else {
      helpText = "";
    }
  }

  $: {
    if (deal.start > individualEndDate) {
      individualEndDate = getDateStringWithoutTimezone(new Date(deal.start), 25 * 60);
    }
  }

  $: {
    if (startDealImmediately) {
      deal.start = getDateTimeStringWithoutTimezone(new Date(), 15);
    }
  }

  async function save() {
    const fromTemplate = deal.template;
    const fromTemplateId = deal.id;

    if (deal.template) {
      deal.template = false;
      deal.id = "";
    }

    deal.duration = durationInDays * 24;
    deal.start = formatDateWithTimeZone(deal.start);

    deal.dealer_id = userId;
    const [dealId, templateId] = await upsertDeal(supabase, deal, createTemplate);

    if (!dealId) {
      return;
    }

    if (fromTemplate) {
      await copyDealImages(supabase, userId, fromTemplateId, dealId);
    } else {
      await saveDealImages(supabase, userId, images, dealId);
    }

    if (templateId) {
      await saveDealImages(supabase, userId, images, templateId);
    }

    await deleteSpecificDealImages(supabase, userId, dealId, imageFilenamesToDelete);

    goto("/");
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
    const deletedImageFilename = imagePreviews
      .splice(index, 1)
      .filter((path: string) => path.startsWith("http"))
      .map((path: string) => path.split("/").pop()!);
    imageFilenamesToDelete.push(...deletedImageFilename);
    imagePreviews = [...imagePreviews];
    images.splice(index);
  }
</script>

<div class="flex flex-col gap-4 p-4">
  <Input label="Titel" bind:value={deal.title} {disabled} />
  <Textarea label="Beschreibung" bind:value={deal.description} {disabled} />
  <CategorySelect bind:value={deal.category_id} {disabled} />
  <Button on:click={() => fileInput.click()} disabled={disabled || imagePreviews.length >= 3}>
    Bild hinzufügen ({imagePreviews.length} / 3)
  </Button>
  <input bind:this={fileInput} on:change={pictureSelected} type="file" hidden />
  <div class="grid grid-cols-3 gap-2">
    {#each imagePreviews as imagePreview, index}
      <Picture url={imagePreview} showDelete={!disabled} fixedHeight={false} on:delete={() => deletePicture(index)} />
    {/each}
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
  <span>{deal.start.toString()}</span>
  <span class="text-red-600">{helpText}</span>
  <div class="grid grid-cols-2 pt-16">
    <div>
      <p class="text-lg font-bold">Kosten: {costs} €</p>
      <p class="pt-4 text-xs">{durationInDays} Tag{durationInDays > 1 ? "e" : ""} a 4,99 € pro Tag</p>
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
