
import * as vscode from 'vscode';
import { SidebarProvider } from './sidebars/promptPanel.js'



export function activate(context: vscode.ExtensionContext) {

	const sidebarprovider = new SidebarProvider(context.extensionUri)

	context.subscriptions.push(vscode.window.registerWebviewViewProvider("prompt-sidebar1",sidebarprovider))

	console.log('Congratulations, your extension "prompt-generator" is now active!');


	const disposable = vscode.commands.registerCommand('prompt-generator.helloWorld', () => {
	
		// sidebarprovider._view?.webview.postMessage({
		// 	 type: 'health', value: "hello from extension" 
		// });
		vscode.window.showInformationMessage('Hello World from prompt-generator!');
	});

	context.subscriptions.push(disposable);
}


export function deactivate() {}

