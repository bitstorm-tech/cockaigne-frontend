<script context="module">
  export async function load({ session }) {
    if (session.isAuthenticated) {
      return {
        status: 302,
        redirect: session.isDealer ? `/dealer/${session.id}` : `/user/${session.id}`
      };
    }

    return {
      status: 302,
      redirect: "/login"
    };
  }
</script>
