<script context="module">
  export async function load({ session }) {
    if (session.isAuthenticated) {
      return {
        status: 302,
        redirect: session.isDealer ? "/dealer" : "/user"
      };
    }

    return {
      status: 302,
      redirect: "/login"
    };
  }
</script>
