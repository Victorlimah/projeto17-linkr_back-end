import { repostPost, countReposts, getUserIdByPublication } from "../repositories/repostRepository.js"

export async function RepostPublication(req, res) {
  const {url, description, reposterName, publicationId} = req.body

  try {
      const searchUserId = await getUserIdByPublication(publicationId)
      const userId = searchUserId.rows[0].id

      await repostPost(url, description, userId, publicationId, reposterName)
      return res.sendStatus(200)
  } catch(e) {
      console.log(e, "Erro no RepostPublication")
      return res.sendStatus(500)
  }
}

export async function getRepostsAmount(req, res) {
  const {publicationid} = req.headers

  try {
    const repostsAmount = await countReposts(publicationid)
    res.status(200).send(repostsAmount.rows[0])
  } catch(e) {
    console.log(e, "Erro no getRepostsAmount")
    return res.sendStatus(500)
  }
}