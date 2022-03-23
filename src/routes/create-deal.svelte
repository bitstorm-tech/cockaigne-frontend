<script>
  import Input from "$lib/components/ui/Input.svelte";
  import Textarea from "$lib/components/ui/Textarea.svelte";
  import ButtonGroup from "$lib/components/ui/ButtonGroup.svelte";
  import Select from "$lib/components/ui/Select.svelte";
  import Button from "$lib/components/ui/Button.svelte";

  const runtimes = ["24 h", "48 h"];
  let startDate = new Date().toISOString().substring(0, 16);
</script>

<div class="flex flex-col gap-4 p-4">
  <Input label="Titel" />
  <Textarea label="Beschreibung" />
  <Select label="Kategorien" />
  <ButtonGroup label="Laufzeit" buttons={runtimes} />
  <Input label="Start" type="datetime-local" bind:value={startDate} />
  <div class="flex justify-around">
    <Button>Speichern</Button>
    <Button outline href="/">Abbrechen</Button>
  </div>
</div>
