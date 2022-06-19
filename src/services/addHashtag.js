import { getHashtag, insertHashtags, linkHashtags } from "../repositories/hashtagRepository.js";
import chalk from "chalk";

export async function addHashtag(postId, arrayHashtag) {
    for (let hashtag of arrayHashtag) {
      const hashtags = await getHashtag("name", arrayHashtag);
      if (hashtags.rows.length === 0) {
        const insertionHashtag = await insertHashtags(hashtag, postId);
        const hashtagId = insertionHashtag.rows[0].id;
        await linkHashtags(postId, hashtagId);
      } else {
        const hashtagId = hashtags.rows[0].id;
        await linkHashtags(postId, hashtagId);
      }
    }
}
