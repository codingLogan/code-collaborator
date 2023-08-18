import http from './http'

export class GitLabSource {
  accessToken: string
  gitlabDomain: string
  constructor(accessToken: string, gitlabDomain: string) {
    this.accessToken = accessToken
    this.gitlabDomain = gitlabDomain
  }

  async getUser(): Promise<{ id: string }> {
    return await http.get(
      `https://${this.gitlabDomain}/api/v4/user`,
      this.accessToken
    )
  }

  async getFollowedUsers(): Promise<
    { id: string; name: string; web_url: string }[]
  > {
    const user = await this.getUser()
    const users = await http.get(
      `https://${this.gitlabDomain}/api/v4/users/${user.id}/following`,
      this.accessToken
    )

    return users.sort(this.nameSort)
  }

  nameSort(a: { name: string }, b: { name: string }) {
    if (a.name > b.name) {
      return 1
    }

    if (a.name < b.name) {
      return -1
    }

    return 0
  }
}
