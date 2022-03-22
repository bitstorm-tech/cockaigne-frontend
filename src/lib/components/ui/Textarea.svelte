<script lang="ts">
  export let label: string;
  export let id = label?.toLowerCase();
  export let placeholder = "";
  export let value = "";
</script>

<!--<div class="w-full">-->
<!--  <label class="pl-1 text-xs">-->
<!--    {label}-->
<!--    <textarea class="textarea textarea-bordered" />-->
<!--    <input-->
<!--      class="p-2 w-full border rounded-md hover:border-primary focus:border-primary focus:outline-none"-->
<!--      {id}-->
<!--      {placeholder}-->
<!--      on:input={setValue}-->
<!--      {value}-->
<!--    />-->
<!--  </label>-->
<!--</div>-->

<div class="form-control">
  <label class="label">
    <span class="label-text text-xs">{label}</span>
  </label>
  <textarea
    {id}
    class="textarea textarea-bordered h-40 focus:border-primary focus:outline-none"
    {placeholder}
    {value}
  />
</div>
