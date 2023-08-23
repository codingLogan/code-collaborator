export class TestSource implements RemoteSource {
  async getUser(): Promise<User> {
    return {
      name: 'Test User',
      id: '1',
      web_url: 'http://example.com/testuser',
    }
  }

  async getFollowedUsers(userID: string | number): Promise<User[]> {
    return [
      {
        name: 'Followed User2',
        id: '2',
        web_url: 'http://example.com/followeduser2',
      },
      {
        name: 'Followed User3',
        id: '3',
        web_url: 'http://example.com/followeduser3',
      },
    ]
  }

  async getUsersOpenMRs(authorID: string | number): Promise<PullRequest[]> {
    return [
      {
        title: 'Cool MR 1',
        web_url: 'http://example.com/mr1',
      },
      {
        title: 'Cool MR 2',
        web_url: 'http://example.com/mr2',
      },
    ]
  }

  async getData(): Promise<UserWithPullRequests[]> {
    const user = await this.getUser()
    const followedUsers = await this.getFollowedUsers(user.id)

    const fullData: UserWithPullRequests[] = followedUsers.map((user) => ({
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
}
