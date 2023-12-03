<script lang="ts">
  export let id = Math.random().toString();
  const name = "rating-" + id;
  export let stars = 0;
  export let disabled = false;
  export let showLabel = true;
</script>

<div>
  {#if showLabel}
    <label for={name} class="label">
      <span class="label-text text-xs">Bewertung</span>
    </label>
  {/if}
  <div id={name} class="rating rating-sm gap-2">
    <input type="radio" {name} class="mask mask-star" {disabled} bind:group={stars} value={1} />
    <input type="radio" {name} class="mask mask-star" {disabled} bind:group={stars} value={2} />
    <input type="radio" {name} class="mask mask-star" {disabled} bind:group={stars} value={3} />
    <input type="radio" {name} class="mask mask-star" {disabled} bind:group={stars} value={4} />
    <input type="radio" {name} class="mask mask-star" {disabled} bind:group={stars} value={5} />
  </div>
</div>
