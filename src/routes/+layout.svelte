<script lang="ts">
  import { invalidate } from "$app/navigation";
  import { page } from "$app/stores";
  import Footer from "$lib/components/nav/Footer.svelte";
  import Navbar from "$lib/components/nav/Navbar.svelte";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import "../tailwind.css";

  export let data;
  const supabase = data.supabase;
  const session = data.session;
  const hideNavigation = ["/login", "/registration", "/confirm", "/activate"].includes($page.url.pathname);
  const duration = 150;

  onMount(() => {
    const { data } = supabase.auth.onAuthStateChange((_, _session) => {
      if (_session?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth");
      }
    });

    return () => data.subscription.unsubscribe();
  });
</script>

{#if !hideNavigation}
  <Navbar />
{/if}
{#key data.pathname}
  <div class="pb-16" in:fade={{ duration, delay: duration }} out:fade={{ duration }}>
    <slot />
  </div>
{/key}
{#if !hideNavigation}
  <Footer />
{/if}
