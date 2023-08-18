// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import http from './http'
import { CollaboratorDataProvider } from './collaboratorDataProvider'

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

  vscode.window.createTreeView('collaborator', {
    treeDataProvider: new CollaboratorDataProvider(),
  })

  http.get(`https://${gitlabDomain}/api/v4/user`, accessToken).then(
    (user) => {
      console.log({ user })

      http
        .get(
          `https://${gitlabDomain}/api/v4/users/${user.id}/following`,
          accessToken
        )
        .then(
          (happyUsers) => {
            console.log(JSON.stringify(happyUsers, null, 2))
          },
          (sadUsersMessage) => {
            console.log({ sadUsersMessage })
          }
        )
    },
    (sadQuery) => {
      console.log({ sadQuery })
    }
  )

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'collaborator.helloWorld',
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage(
        'Hello World from Collaborator - the git helper!'
      )
    }
  )

  context.subscriptions.push(disposable)

  disposable = vscode.commands.registerCommand('collaborator.time', () => {
    vscode.window.showWarningMessage(new Date().toDateString())
  })
}

// This method is called when your extension is deactivated
export function deactivate() {}
