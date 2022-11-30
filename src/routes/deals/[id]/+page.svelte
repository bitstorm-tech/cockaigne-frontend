<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import ConfirmDeleteDealModal from "$lib/components/dealer/ConfirmDeleteDealModal.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import ButtonGroup from "$lib/components/ui/ButtonGroup.svelte";
  import Checkbox from "$lib/components/ui/Checkbox.svelte";
  import DateTimeInput from "$lib/components/ui/DateTimeInput.svelte";
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
  import { POST } from "$lib/http.service";

  export let data;
  export let deal: Deal = data;

  $: categories = Object.fromEntries($categoryStore.map((category: Category) => [+category.id, category.name]));

  const runtimes = {
    "24": "24 Stunden",
    "48": "48 Stunden",
    "72": "72 Stunden"
  };

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
  let costs = 1;
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
      deal.start = dateToUnixTimestamp(deal.start);
    }
    const response = await fetch("/api/deals", POST(deal));

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
    costs = getDuration() / 24;
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

  function setStartDate(event: unknown) {
    if (event.target.checked) {
      deal.start = getDateTimeAsIsoString();
    }
  }
</script>

<div class="flex flex-col gap-4 p-4">
  <Input label="Titel" bind:value={deal.title} {disabled} />
  <Textarea label="Beschreibung" bind:value={deal.description} {disabled} />
  <Select label="Kategorie" options={categories} bind:value={deal.category_id} {disabled} />
  <Checkbox label="Individuelle Laufzeit" bind:checked={individuallyTime} {disabled} />
  {#if individuallyTime}
    <div class="flex gap-3">
      <DateTimeInput label="Start" bind:value={individualStartDateTime} {disabled} />
      <Input type="date" label="Ende" bind:value={individualEndDate} {disabled} />
    </div>
  {:else}
    <ButtonGroup label="Laufzeit" options={runtimes} bind:value={deal.duration} {disabled} />
    <div class="flex items-end gap-4">
      <DateTimeInput label="Start" bind:value={deal.start} disabled={disabled || startDealImmediately} />
      <div class="w-52">
        <Checkbox label="Sofort starten" bind:checked={startDealImmediately} on:change={setStartDate} />
      </div>
    </div>
  {/if}
  <div class="text-xs">Kosten: {costs} €</div>
  <div class="flex justify-center gap-4 mt-6">
    <Button warning on:click={save} disabled={disableSave || disabled} {loading}>
      {deal.id > 0 && !deal.template ? "Speichern" : "Erstellen"}
    </Button>
    {#if deal.id > 0 && !disabled}
      <Button outline error on:click={() => (openDeleteModal = true)}>Löschen</Button>
    {/if}
    <a href={"/deals/overview/" + $page.data.user.id}>
      <Button outline>Abbrechen</Button>
    </a>
  </div>
  {#if !deal.template}
    <div class="flex justify-center">
      <Checkbox label="Zusätzlich als Vorlage speichern" bind:checked={createTemplate} {disabled} />
    </div>
  {/if}
</div>
<Modal bind:open={openErrorModal}>Ups, da ging was schief. Konnte den Deal leider nicht speichern!</Modal>
<ConfirmDeleteDealModal bind:open={openDeleteModal} dealTitle={deal.title} deleteFunction={del} />
