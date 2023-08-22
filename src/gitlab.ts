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

  async getUsersOpenMRs(
    authorID: string | number
  ): Promise<{ title: string; web_url: string }[]> {
    return await http.get(
      `https://${this.gitlabDomain}/api/v4/merge_requests?state=opened&author_id=${authorID}`,
      this.accessToken
    )
  }

  async getFollowedUsers(
    userID: string | number
  ): Promise<{ id: string; name: string; web_url: string }[]> {
    // Mock data
    const users = [{ id: '1', name: 'Name', web_url: 'http://github.com' }]

    // Real Data
    // const users = await http.get(
    //   `https://${this.gitlabDomain}/api/v4/users/${userID}/following`,
    //   this.accessToken
    // )

    return users.sort(this.nameSort)
  }

  async getData(): Promise<
    {
      id: string
      name: string
      web_url: string
      children: { title: string; web_url: string }[]
    }[]
  > {
    // Real Data
    // const user = await this.getUser()
    // const followedUsers = await this.getFollowedUsers(user.id)

    // const fullData: {
    //   id: string
    //   name: string
    //   web_url: string
    //   children: { title: string; web_url: string }[]
    // }[] = followedUsers.map((user) => ({
    //   ...user,
    //   children: [],
    // }))

    // let i = 0
    // for (i = 0; i < followedUsers.length; i++) {
    //   const userMrs = await this.getUsersOpenMRs(followedUsers[i].id)
    //   fullData[i].children = userMrs
    // }

    // return fullData

    // Mock Data
    return Promise.resolve([
      {
        id: '1',
        name: 'Name1',
        web_url: 'http://github.com/name1',
        children: [{ title: 'MR1', web_url: 'http://github.com/mr1' }],
      },
      {
        id: '1',
        name: 'Name2',
        web_url: 'http://github.com/name2',
        children: [
          { title: 'MR2', web_url: 'http://github.com/mr2' },
          { title: 'MR3', web_url: 'http://github.com/mr3' },
        ],
      },
    ])
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
