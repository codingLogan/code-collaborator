import * as vscode from 'vscode'

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
  constructor() {}

  getTreeItem(element: CollaboratorItem): vscode.TreeItem {
    return element
  }

  getChildren(
    element?: CollaboratorItem
  ): vscode.ProviderResult<CollaboratorItem[]> {
    return [
      new CollaboratorItem('Test One', vscode.TreeItemCollapsibleState.None),
    ]
  }
}
