<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "$lib/components/ui/Button.svelte";
  import ButtonGroup from "$lib/components/ui/ButtonGroup.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";
  import Select from "$lib/components/ui/Select.svelte";
  import Textarea from "$lib/components/ui/Textarea.svelte";
  import { Category, Deal, Duration } from "$lib/deal.model";

  const runtimes = {
    "24h": "24 Stunden",
    "48h": "48 Stunden"
  };
  const categories = {
    food: "Essen & Trinken",
    technic: "Technik",
    fashion: "Mode"
  };

  let openModal = false;
  let loading = false;
  let startDate = new Date().toISOString().substring(0, 16);
  let title = "";
  let description = "";
  let duration: Duration = "24h";
  let category: Category = "food";
  $: disabled = title.length === 0 || description.length === 0;

  async function save() {
    loading = true;
    const deal: Deal = {
      startDate: new Date(startDate),
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
  <Input label="Start" type="datetime-local" bind:value={startDate} />
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
