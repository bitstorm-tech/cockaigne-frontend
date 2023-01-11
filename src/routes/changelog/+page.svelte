<script lang="ts">
  import changelog from "$lib/resources/changelog.json";

  const dates = Object.keys(changelog);
</script>

<section class="p-5">
  <h1 class="pb-6 text-center">Was gibt es Neues?</h1>
  {#each dates as date}
    <h2 class="mt-5">{date}</h2>
    <ul class="pl-4">
      {#each changelog[date] as item}
        <li class="list-disc">{item}</li>
      {/each}
    </ul>
  {/each}
</section>
