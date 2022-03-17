<script lang="ts">
  export let label: string;
  export let id = label;
  export let checked = false;
</script>

<div class="flex items-center mt-4">
  <div class="w-5 h-5 shadow-inner outline-none bg-dark cursor-pointer" on:click={() => (checked = !checked)}>
    <input {id} type="checkbox" class="opacity-0 absolute cursor-pointer" />
    {#if checked}
      <svg class="fill-current w-5" viewBox="-5 -5 30 30">
        <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
      </svg>
    {/if}
  </div>
  <label for={id} class="select-none cursor-pointer pl-1 text-xs">{label}</label>
</div>
