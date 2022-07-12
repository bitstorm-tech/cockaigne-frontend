<script>
  import LoadingSpinner from "./icons/LoadingSpinner.svelte";
</script>

<div class="toast">
  <div class="alert alert-success">
    <span><LoadingSpinner /><slot /></span>
  </div>
</div>
