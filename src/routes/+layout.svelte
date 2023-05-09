<script lang="ts">
  import { afterNavigate, beforeNavigate, invalidate } from "$app/navigation";
  import { page } from "$app/stores";
  import Footer from "$lib/components/nav/Footer.svelte";
  import Navbar from "$lib/components/nav/Navbar.svelte";
  import LoadingSpinner from "$lib/components/ui/icons/LoadingSpinner.svelte";
  import { onMount } from "svelte";
  import { blur } from "svelte/transition";
  import "../tailwind.css";

  let loading = false;

  export let data;
  const supabase = data.supabase;
  const session = data.session;

  onMount(() => {
    const { data } = supabase.auth.onAuthStateChange((_, _session) => {
      if (_session?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth");
      }
    });

    return () => data.subscription.unsubscribe();
  });

  beforeNavigate(() => {
    loading = true;
  });
  afterNavigate(() => {
    loading = false;
  });
</script>

{#if $page.data.session?.user}
  <Navbar />
{/if}
{#if loading}
  <div class="-mt-16 flex h-full items-center justify-center">
    <LoadingSpinner size={6} />
  </div>
{:else}
  <div class="pb-16" in:blur>
    <slot />
  </div>
{/if}
{#if $page.data.session?.user}
  <Footer />
{/if}
