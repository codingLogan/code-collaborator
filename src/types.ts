type User = {
  id: string
  name: string
  web_url: string
}

type UserWithPullRequests = {
  id: string
  name: string
  web_url: string
  children: PullRequest[]
}

type PullRequest = {
  title: string
  web_url: string
}

interface RemoteSource {
  getUser(): Promise<User>
  getFollowedUsers(userID: string | number): Promise<User[]>
  getUsersOpenMRs(authorID: string | number): Promise<PullRequest[]>
  getData(): Promise<UserWithPullRequests[]>
}
