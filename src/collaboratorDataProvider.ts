import * as vscode from 'vscode'
import { GitLabSource } from './gitlab'

class CollaboratorItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState)
  }
}

export class CollaboratorDataProvider
  implements vscode.TreeDataProvider<CollaboratorItem>
{
  dataSource: GitLabSource
  constructor(dataSource: GitLabSource) {
    this.dataSource = dataSource
  }

  getTreeItem(element: CollaboratorItem): vscode.TreeItem {
    return element
  }

  getChildren(element?: CollaboratorItem): Thenable<CollaboratorItem[]> {
    return this.dataSource.getFollowedUsers().then(
      (resolved) =>
        resolved.map(
          (followedUser) =>
            new CollaboratorItem(
              followedUser.name,
              vscode.TreeItemCollapsibleState.None
            )
        ),
      (rejected) => {
        return [
          new CollaboratorItem(
            'No collaborators were found',
            vscode.TreeItemCollapsibleState.None
          ),
        ]
      }
    )
  }

  private _onDidChangeTreeData: vscode.EventEmitter<
    CollaboratorItem | undefined | null | void
  > = new vscode.EventEmitter<CollaboratorItem | undefined | null | void>()

  readonly onDidChangeTreeData: vscode.Event<
    CollaboratorItem | undefined | null | void
  > = this._onDidChangeTreeData.event

  refresh(): void {
    this._onDidChangeTreeData.fire()
  }
}
