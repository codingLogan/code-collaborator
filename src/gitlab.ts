import http from './http'

export class GitLabSource implements RemoteSource {
  accessToken: string
  gitlabDomain: string
  constructor(accessToken: string, gitlabDomain: string) {
    this.accessToken = accessToken
    this.gitlabDomain = gitlabDomain
  }

  async getUser(): Promise<User> {
    return http.get(
      `https://${this.gitlabDomain}/api/v4/user`,
      this.accessToken
    )
  }

  async getUsersOpenMRs(authorID: string | number): Promise<PullRequest[]> {
    return http.get(
      `https://${this.gitlabDomain}/api/v4/merge_requests?author_id=${authorID}&state=opened&scope=all`,
      this.accessToken
    )
  }

  async getFollowedUsers(userID: string | number): Promise<User[]> {
    // Real Data
    const users = await http.get(
      `https://${this.gitlabDomain}/api/v4/users/${userID}/following`,
      this.accessToken
    )

    return users.sort(this.nameSort)
  }

  async getData(): Promise<UserWithPullRequests[]> {
    const user = await this.getUser()
    const followedUsers = await this.getFollowedUsers(user.id)

    const fullData: {
      id: string
      name: string
      web_url: string
      children: { title: string; web_url: string }[]
    }[] = followedUsers.map((user) => ({
      ...user,
      children: [],
    }))

    let i = 0
    for (i = 0; i < followedUsers.length; i++) {
      const userMRs = await this.getUsersOpenMRs(followedUsers[i].id)
      fullData[i].children = [...userMRs]
    }

    return fullData
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
