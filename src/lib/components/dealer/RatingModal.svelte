<script lang="ts">
  import Modal from "$lib/components/ui/Modal.svelte";
  import RatingStars from "$lib/components/ui/RatingStars.svelte";
  import Textarea from "$lib/components/ui/Textarea.svelte";
  import { createEventDispatcher } from "svelte";

  export let open = false;
  export let stars = 3;
  export let ratingText = "";
  export let update = false;
  export let allowDelete = false;
  const dispatch = createEventDispatcher();

  const buttons = [
    { text: update ? "Ändern" : "Bewerten", warning: true, callback: ratingCreated },
    { text: "Löschen", callback: del },
    { text: "Abbrechen", callback: cancel }
  ];

  if (!allowDelete) {
    buttons.splice(1, 1);
  }

  function ratingCreated() {
    dispatch("create-or-update", { stars, rating_text: ratingText });
    ratingText = "";
    stars = 3;
    open = false;
  }

  function del() {
    dispatch("delete");
    open = false;
  }

  function cancel() {
    open = false;
  }
</script>

<Modal bind:open {buttons}>
  <div class="flex flex-col gap-3">
    <RatingStars bind:stars big />
    <Textarea label="Bewertungstext" bind:value={ratingText} />
  </div>
</Modal>
