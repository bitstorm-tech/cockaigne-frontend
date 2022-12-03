<script lang="ts">
  import Modal from "$lib/components/ui/Modal.svelte";
  import RatingStars from "$lib/components/ui/RatingStars.svelte";
  import Textarea from "$lib/components/ui/Textarea.svelte";
  import { createEventDispatcher } from "svelte";

  export let open = false;
  let stars = 3;
  let ratingText = "";
  const dispatch = createEventDispatcher();

  const buttons = [
    { text: "Abbrechen", callback: cancel },
    { text: "Bewerten", callback: ratingCreated }
  ];

  function ratingCreated() {
    dispatch("create", { stars, rating_text: ratingText });
    cancel();
  }

  function cancel() {
    open = false;
    ratingText = "";
    stars = 3;
  }
</script>

<Modal bind:open {buttons}>
  <div class="flex flex-col gap-3">
    <RatingStars bind:stars />
    <Textarea label="Bewertungstext" bind:value={ratingText} />
  </div>
</Modal>
