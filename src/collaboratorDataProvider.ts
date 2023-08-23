import * as vscode from 'vscode'
import { GitLabSource } from './gitlab'
import path = require('node:path')

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

class PullRequestItem extends CollaboratorItem {
  constructor(public readonly label: string, public readonly url: string) {
    super(
      label,
      url,
      vscode.TreeItemCollapsibleState.None,
      'pull-request',
      undefined
    )
    this.iconPath = {
      light: path.join(__filename, '..', '..', 'src/resources/light/mr.svg'),
      dark: path.join(__filename, '..', '..', 'src/resources/dark/mr.svg'),
    }
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
                  (mr) => new PullRequestItem(mr.title, mr.web_url)
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
