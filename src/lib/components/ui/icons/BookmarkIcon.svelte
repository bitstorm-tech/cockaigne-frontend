<script lang="ts">
  export let outline = false;
  export let size = 1.5;
  const style = `height: ${size}rem; width: ${size}rem`;
</script>

{#if outline}
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 93.22094 127.76471" {style}>
    <defs>
      <style>
        .bcc85fd1-05b0-4ef6-a7ef-7a1c7ebfa948 {
          fill: #dbdce6;
        }
      </style>
    </defs>
    <path
      class="bcc85fd1-05b0-4ef6-a7ef-7a1c7ebfa948"
      d="M82.99824,8.04034V116.60327L50.17471,92.5639a5.00009,5.00009,0,0,0-5.90889.00019L11.44255,116.606V8.04034H82.99824m5-5H6.44254V122.93005a1.86384,1.86384,0,0,0,1.71384,2.01111,1.55388,1.55388,0,0,0,1.211-.61737l37.853-27.726L85.067,124.316a1.557,1.557,0,0,0,1.21366.61877,1.868,1.868,0,0,0,1.71756-2.0155V3.04034Z" />
  </svg>
{:else}
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 93.22094 127.76471" {style}>
    <defs>
      <style>
        .aedf13c5-f6c9-4aaa-95ae-39b7bd000530 {
          fill: #dbdce6;
        }
      </style>
    </defs>
    <path
      class="aedf13c5-f6c9-4aaa-95ae-39b7bd000530"
      d="M85.067,124.316,47.22038,96.59777l-37.853,27.726c-1.06242,1.29917-2.92485.41171-2.92485-1.39371V3.04033H87.99823V122.91922C87.99823,124.72858,86.13174,125.618,85.067,124.316Z" />
  </svg>
{/if}
