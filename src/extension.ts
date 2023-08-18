// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import { CollaboratorDataProvider } from './collaboratorDataProvider'
import { GitLabSource } from './gitlab'

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "collaborator" is now active!')

  const accessToken = String(
    vscode.workspace.getConfiguration().get('collaborator.gitlab-access-token')
  )

  const gitlabDomain = String(
    vscode.workspace.getConfiguration().get('collaborator.gitlab-domain')
  )

  // Configure tree data
  const dataSource = new GitLabSource(accessToken, gitlabDomain)
  const collaboratorProvider = new CollaboratorDataProvider(dataSource)
  vscode.window.createTreeView('collaborator', {
    treeDataProvider: collaboratorProvider,
  })

  vscode.commands.registerCommand('collaborator.refresh', () =>
    collaboratorProvider.refresh()
  )

  vscode.commands.registerCommand(
    'collaborator.open-link',
    (clickedItem: { url: string }) => {
      console.log('callback with args: ', clickedItem)
      vscode.env.openExternal(vscode.Uri.parse(clickedItem.url))
    }
  )
}

// This method is called when your extension is deactivated
export function deactivate() {}
