import { extractJwt } from "$lib/jwt.service";

export async function post({ request, url }) {
  try {
    const jwt = await extractJwt(request);

    if (!jwt) {
      return {
        status: 403
      };
    }

    const id = url.searchParams.get("id");
    if (!id) {
      console.warn("Can't like deal -> missing deal id");
      return {
        status: 400
      };
    }

    // const deals = await getDealsCollection();
    // const likerId = new ObjectId(jwt.sub);
    // const dealId = new ObjectId(id);
    // const deal = await deals.findOne<Deal>({ _id: dealId });
    // const likes = deal.likes as ObjectId[];
    // const alreadyLiked = likes.some((objectId) => objectId.equals(likerId));
    // let likesCount = likes.length;
    //
    // if (alreadyLiked) {
    //   likesCount -= 1;
    //   await deals.updateOne({ _id: dealId }, { $pull: { likes: likerId } });
    // } else {
    //   likesCount += 1;
    //   await deals.updateOne({ _id: dealId }, { $push: { likes: likerId } });
    // }
    //
    // deal.likes = likesCount;
    // return {
    //   status: 200,
    //   body: deal
    // };
  } catch (error) {
    console.error("Can't post like:", error);
    return {
      status: 500
    };
  }
}
