export async function load({ locals: { getSession, isDealer } }) {
  return {
    session: await getSession(),
    isDealer: await isDealer()
  };
}

// export async function load({ cookies }: RequestEvent) {
//   const accessToken = cookies.get("my-access-token");
//   const refreshToken = cookies.get("my-refresh-token");

//   if (accessToken && refreshToken) {
//     const { error, data } = await supabase.auth.setSession({
//       access_token: accessToken,
//       refresh_token: refreshToken
//     });

//     if (data) {
//       return {
//         user: {
//           isAuthenticated: true,
//           isDealer: data.session?.user.user_metadata.isDealer,
//           id: data.session?.user.id
//         }
//       };
//     }

//     console.log("Error while set session:", error);
//   }

//   return {
//     user: {
//       isAuthenticated: false
//     }
//   };
// }
