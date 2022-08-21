<script lang="ts">
  import { goto } from "$app/navigation";
  import ConfirmDeleteDealModal from "$lib/components/dealer/ConfirmDeleteDealModal.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import ButtonGroup from "$lib/components/ui/ButtonGroup.svelte";
  import Checkbox from "$lib/components/ui/Checkbox.svelte";
  import DateTimeInput from "$lib/components/ui/DateTimeInput.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";
  import Select from "$lib/components/ui/Select.svelte";
  import Textarea from "$lib/components/ui/Textarea.svelte";
  import type { Deal } from "$lib/database/deal/deal.model";
  import { getDealState } from "$lib/deal.service";

  export let data;

  const runtimes = {
    "24": "24 Stunden",
    "48": "48 Stunden",
    "72": "72 Stunden"
  };
  const categories = {
    FOOD: "Essen & Trinken",
    TECH: "Technik",
    FASHION: "Mode"
  };

  let openErrorModal = false;
  let openDeleteModal = false;
  let createTemplate = false;
  let loading = false;

  export let deal: Deal = data;

  const disabled = !deal.template && ["active", "past"].includes(getDealState(deal));

  $: disableSave = deal.title.length === 0 || deal.description.length === 0;
  $: costs = 1 + +deal.duration / 24;

  async function save() {
    loading = true;

    if (deal.template) {
      deal.template = false;
      deal.id = -1;
    } else {
      deal.template = createTemplate;
    }

    const response = await fetch("/api/deals", {
      method: "post",
      body: JSON.stringify(deal)
    });

    if (response.ok) {
      goto("/").then();
    } else if (response.status === 403) {
      goto("/login").then();
    } else {
      loading = false;
      openErrorModal = true;
    }
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
</script>

<div class="flex flex-col gap-4 p-4">
  <Input label="Titel" bind:value={deal.title} {disabled} />
  <Textarea label="Beschreibung" bind:value={deal.description} {disabled} />
  <Select label="Kategorien" options={categories} bind:value={deal.category} {disabled} />
  <ButtonGroup label="Laufzeit" options={runtimes} bind:value={deal.duration} {disabled} />
  <DateTimeInput label="Start" bind:value={deal.start} {disabled} />
  <div class="text-xs">Kosten: {costs} €</div>
  <div class="flex justify-center gap-4 mt-6">
    <Button on:click={save} disabled={disableSave || disabled} {loading}>
      {deal.id > 0 && !deal.template ? "Speichern" : "Erstellen"}
    </Button>
    {#if deal.id > 0 && !disabled}
      <Button outline error on:click={() => (openDeleteModal = true)}>Löschen</Button>
    {/if}
    <a href="/deals/overview">
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
