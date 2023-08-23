import * as vscode from 'vscode'
import { GitLabSource } from './gitlab'

/*

Collaborators
  User1 
    MR1
    MR2
  User2
    MR1
    MR2

*/

class CollaboratorItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly url: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly contextValue: string,
    public readonly children?: CollaboratorItem[] | undefined
  ) {
    super(label, collapsibleState)
  }
}

export class CollaboratorDataProvider
  implements vscode.TreeDataProvider<CollaboratorItem>
{
  dataSource: RemoteSource
  constructor(dataSource: RemoteSource) {
    this.dataSource = dataSource
  }

  getTreeItem(element: CollaboratorItem): vscode.TreeItem {
    return element
  }

  getChildren(
    element?: CollaboratorItem
  ): Thenable<CollaboratorItem[]> | vscode.ProviderResult<CollaboratorItem[]> {
    // If there is no parent element to reference
    if (!element) {
      return this.dataSource.getData().then(
        (resolved) => {
          return resolved.map(
            (followedUser) =>
              new CollaboratorItem(
                followedUser.name,
                followedUser.web_url,
                vscode.TreeItemCollapsibleState.Collapsed,
                'user',
                followedUser.children.map(
                  (mr) =>
                    new CollaboratorItem(
                      mr.title,
                      mr.web_url,
                      vscode.TreeItemCollapsibleState.None,
                      'pull-request'
                    )
                )
              )
          )
        },
        (rejected) => {
          return [
            new CollaboratorItem(
              'No collaborators were found',
              '',
              vscode.TreeItemCollapsibleState.None,
              'error'
            ),
          ]
        }
      )
    } else {
      return Promise.resolve(element?.children)
    }
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
