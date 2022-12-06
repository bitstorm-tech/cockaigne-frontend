<script lang="ts">
  import { goto } from "$app/navigation";
  import ConfirmDeleteDealModal from "$lib/components/dealer/ConfirmDeleteDealModal.svelte";
  import Picture from "$lib/components/dealer/pictures/Picture.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import ButtonGroup from "$lib/components/ui/ButtonGroup.svelte";
  import Checkbox from "$lib/components/ui/Checkbox.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";
  import Select from "$lib/components/ui/Select.svelte";
  import Textarea from "$lib/components/ui/Textarea.svelte";
  import type { Category } from "$lib/database/category/category.model";
  import { categoryStore } from "$lib/database/category/category.store";
  import type { Deal } from "$lib/database/deal/deal.model";
  import {
    dateToUnixTimestamp,
    extractTimeFromDateTimeString,
    getDateAsIsoString,
    getDateTimeAsIsoString
  } from "$lib/date-time.utils";
  import { getDealState } from "$lib/deal.service";
  import { fileToBase64 } from "$lib/file.utils";
  import { POST } from "$lib/http.service";

  export let data;
  export let deal: Deal = data;

  $: categories = Object.fromEntries($categoryStore.map((category: Category) => [+category.id, category.name]));

  const runtimes = {
    "24": "1 Tag",
    "48": "2 Tage",
    "72": "3 Tage"
  };

  const nowDateTimeString = getDateTimeAsIsoString();

  categoryStore.load();

  let openErrorModal = false;
  let openDeleteModal = false;
  let createTemplate = false;
  let startDealImmediately = false;
  let individuallyTime = +deal.duration > 72;
  let individualStartDateTime = deal.id > -1 ? deal.start : getDateTimeAsIsoString(new Date(), 60);
  let individualEndDate =
    deal.id > -1
      ? getDateAsIsoString(new Date(deal.start), +deal.duration * 60)
      : getDateAsIsoString(new Date(), 25 * 60);
  let costs = "4,99";
  let images: File[] = [];
  let imagePreviews: string[] = [];
  let fileInput;
  let loading = false;

  const disabled = !deal.template && ["active", "past"].includes(getDealState(deal));

  $: disableSave = deal.title.length === 0 || deal.description.length === 0;
  $: calculateCosts(), deal.duration, individualStartDateTime, individualEndDate, individuallyTime;

  async function save() {
    loading = true;

    if (deal.template) {
      deal.template = false;
      deal.id = -1;
    } else {
      deal.template = createTemplate;
    }

    if (individuallyTime) {
      deal.start = dateToUnixTimestamp(individualStartDateTime);
      deal.duration = getDuration();
    } else {
      const startDatetimeString = startDealImmediately ? getDateTimeAsIsoString() : deal.start;
      deal.start = dateToUnixTimestamp(startDatetimeString);
    }

    const imagesAsBase64: string[] = [];
    for (const image of images) {
      const base64 = (await fileToBase64(image)) as string;
      imagesAsBase64.push(base64);
    }

    const data = {
      deal,
      imagesAsBase64
    };

    const response = await fetch("/api/deals", POST(data));

    if (response.ok) {
      goto("/").then();
    } else if (response.status === 403) {
      goto("/login").then();
    } else {
      loading = false;
      openErrorModal = true;
    }
  }

  function getDuration(): number {
    if (individuallyTime) {
      const startTimestamp = dateToUnixTimestamp(individualStartDateTime);
      const endTime = extractTimeFromDateTimeString(individualStartDateTime as string);
      const endTimestamp = dateToUnixTimestamp(individualEndDate, endTime);
      return (endTimestamp - startTimestamp) / (60 * 60);
    }

    return +deal.duration;
  }

  function calculateCosts() {
    costs = (4.99 * (getDuration() / 24)).toFixed(2).replace(".", ",");
  }

  async function del() {
    const response = await fetch(`/api/deals/${deal.id}`, { method: "delete" });

    if (response.ok) {
      goto("/").then();
    } else if (response.status === 403) {
      goto("/login").then();
    } else {
      loading = false;
      openErrorModal = true;
    }
  }

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
</script>

<div class="flex flex-col gap-4 p-4">
  <Input label="Titel" bind:value={deal.title} {disabled} />
  <Textarea label="Beschreibung" bind:value={deal.description} {disabled} />
  <Select label="Kategorie" options={categories} bind:value={deal.category_id} {disabled} />
  {#if deal.id < 0}
    <Button on:click={() => fileInput.click()} disabled={imagePreviews.length >= 3}>
      Bild hinzufügen ({imagePreviews.length} / 3)
    </Button>
    <input bind:this={fileInput} on:change={pictureSelected} type="file" hidden />
  {/if}
  <div class="grid grid-cols-3 gap-2">
    {#if deal.id > 0}
      {#each deal.imageUrls as imageUrl}
        <Picture url={imageUrl} fixedHeight={false} />
      {/each}
    {:else}
      {#each imagePreviews as imagePreview, index}
        <Picture url={imagePreview} showDelete={true} fixedHeight={false} on:delete={() => deletePicture(index)} />
      {/each}
    {/if}
  </div>
  <Checkbox label="Individuelle Laufzeit" bind:checked={individuallyTime} {disabled} />
  {#if individuallyTime}
    <div class="flex flex-col gap-3">
      <Input
        type="datetime-local"
        min={nowDateTimeString}
        label="Start"
        bind:value={individualStartDateTime}
        {disabled}
      />
      <Input type="date" label="Ende" bind:value={individualEndDate} {disabled} />
    </div>
  {:else}
    <ButtonGroup label="Laufzeit" options={runtimes} bind:value={deal.duration} {disabled} />
    <div class="flex items-end gap-4">
      {#if startDealImmediately}
        <p class="text-xs">Dein Deal startet sofort wenn du auf "Erstellen" klickst!</p>
      {:else}
        <Input
          type="datetime-local"
          min="2022-12-02T14:27"
          label="Start"
          bind:value={deal.start}
          disabled={disabled || startDealImmediately}
        />
      {/if}
      <div class="w-52">
        <Checkbox label="Sofort starten" bind:checked={startDealImmediately} {disabled} />
      </div>
    </div>
  {/if}
  <div class="grid grid-cols-2 pt-16">
    <div class="flex flex-col justify-center">
      <div class="text-lg font-bold">Kosten: {costs} €</div>
    </div>
    <div class="flex flex-col gap-3">
      <Button warning on:click={save} disabled={disableSave || disabled} {loading}>
        {deal.id > 0 && !deal.template ? "Speichern" : "Erstellen"}
      </Button>
      {#if deal.id > 0 && !disabled}
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
<Modal bind:open={openErrorModal}>Ups, da ging was schief. Konnte den Deal leider nicht speichern!</Modal>
<ConfirmDeleteDealModal bind:open={openDeleteModal} dealTitle={deal.title} deleteFunction={del} />
