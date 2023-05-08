<script lang="ts">
  import Input from "$lib/components/ui/Input.svelte";
  import type { Account } from "$lib/supabase/public-types";

  export let account: Account;

  let loading = false;
</script>

<div class="grid grid-cols-3 gap-3">
  <div class="col-span-2">
    <Input label="Straße" bind:value={account.street} />
  </div>
  <Input label="Hausnummer" bind:value={account.house_number} />
</div>
<div class="grid grid-cols-3 gap-3">
  <div class="col-span-2">
    <Input label="Ort" bind:value={account.city} />
  </div>
  <Input label="PLZ" bind:value={account.zip} />
</div>
