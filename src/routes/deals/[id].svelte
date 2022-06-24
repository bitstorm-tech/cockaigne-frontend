<script lang="ts" context="module">
  export async function load({ params, fetch }: LoadEvent) {
    if (params.id.toLowerCase() === "new") {
      return {
        props: {}
      };
    }

    const response = await fetch(`/api/deals/${params.id}`);
    const deal = await response.json();

    deal.start = deal.start.substring(0, 16);
    deal.duration = deal.duration.toString();

    return {
      props: {
        deal
      }
    };
  }
</script>

<script lang="ts">
  import { goto } from "$app/navigation";
  import ConfirmDeleteDealModal from "$lib/components/dealer/ConfirmDeleteDealModal.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import ButtonGroup from "$lib/components/ui/ButtonGroup.svelte";
  import DateTimeInput from "$lib/components/ui/DateTimeInput.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";
  import Select from "$lib/components/ui/Select.svelte";
  import Textarea from "$lib/components/ui/Textarea.svelte";
  import type { Deal } from "$lib/database/deal/deal.model";
  import type { LoadEvent } from "@sveltejs/kit";

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
  let loading = false;

  export let deal: Deal = {
    id: -1,
    account_id: -1,
    start: new Date().toISOString().substring(0, 16),
    title: "",
    description: "",
    duration: "24",
    category: "FOOD"
  };

  $: disabled = deal.title.length === 0 || deal.description.length === 0;
  $: costs = 1 + +deal.duration / 24;

  async function save() {
    loading = true;

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
  <Input label="Titel" bind:value={deal.title} />
  <Textarea label="Beschreibung" bind:value={deal.description} />
  <Select label="Kategorien" options={categories} bind:value={deal.category} />
  <ButtonGroup label="Laufzeit" options={runtimes} bind:value={deal.duration} />
  <DateTimeInput label="Start" bind:value={deal.start} />
  <div class="text-xs">Kosten: {costs} €</div>
  <div class="flex justify-center gap-4 mt-6">
    <Button on:click={save} {disabled} {loading}>Speichern</Button>
    {#if deal.id > 0}
      <Button outline error on:click={() => (openDeleteModal = true)}>Löschen</Button>
    {/if}
    <a href="/deals/overview">
      <Button outline>Abbrechen</Button>
    </a>
  </div>
</div>
<Modal bind:open={openErrorModal}>Ups, da ging was schief. Konnte den Deal leider nicht speichern!</Modal>
<ConfirmDeleteDealModal bind:open={openDeleteModal} dealTitle={deal.title} deleteFunction={del} />
