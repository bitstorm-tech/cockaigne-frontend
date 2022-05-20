<script lang="ts" context="module">
  export async function load({ params, fetch }) {
    if (params.id.toLowerCase() === "new") {
      return {
        props: {}
      };
    }

    const response = await fetch(`/api/deals/${params.id}`);
    const deal = await response.json();

    return {
      props: deal
    };
  }
</script>

<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "$lib/components/ui/Button.svelte";
  import ButtonGroup from "$lib/components/ui/ButtonGroup.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";
  import Select from "$lib/components/ui/Select.svelte";
  import Textarea from "$lib/components/ui/Textarea.svelte";

  const runtimes = {
    ONE_DAY: "24 Stunden",
    TWO_DAYS: "48 Stunden"
  };
  const categories = {
    FOOD: "Essen & Trinken",
    TECH: "Technik",
    FASHION: "Mode"
  };

  let openModal = false;
  let loading = false;
  export let id: string;
  export let start = new Date().toISOString().substring(0, 16);
  export let title = "";
  export let description = "";
  export let duration = "ONE_DAY";
  export let category = "FOOD";
  $: disabled = title.length === 0 || description.length === 0;

  async function save() {
    loading = true;
    const deal = {
      id,
      start,
      title,
      description,
      duration,
      category
    };

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
      openModal = true;
    }
  }
</script>

<div class="flex flex-col gap-4 p-4">
  <Input label="Titel" bind:value={title} />
  <Textarea label="Beschreibung" bind:value={description} />
  <Select label="Kategorien" options={categories} bind:value={category} />
  <ButtonGroup label="Laufzeit" options={runtimes} bind:value={duration} />
  <Input label="Start" type="datetime-local" bind:value={start} />
  <div class="flex justify-center gap-4 mt-6">
    <Button on:click={save} {disabled} {loading}>Speichern</Button>
    <a href="/">
      <Button outline>Abbrechen</Button>
    </a>
  </div>
</div>
<Modal open={openModal} on:close={() => (openModal = false)}>
  Ups, da ging was schief. Konnte den Deal leider nicht speichern!
</Modal>
