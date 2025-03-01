import {
  Disposable,
  Webview,
  WebviewPanel,
  window,
  Uri,
  ViewColumn,
} from "vscode";
import * as vscode from "vscode";


import { getNonce, getUri } from "../utilities.js";
// import { getLLM } from "../llms/llm.js";

import {systemprompt } from "../llms/prompt.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getModel } from "../llms/llm.js";


function prettyPrint(message: string): string {
  return message
      .split(/\n\n+/)
      .map(paragraph => 
          paragraph.trim().split(/(.{1,100}(?:\s+|$))/g)
              .filter(Boolean)
              .map(line => line.trim())
              .join('\n')
      )
      .join('\n\n');
}


function extractBetweenTags(tag: string, inputString: string, strip: boolean = false): string[] {
  const regex = new RegExp(`<${tag}>(.+?)</${tag}>`, 'gs');
  let matches = [...inputString.matchAll(regex)].map(m => m[1]);
  return strip ? matches.map(e => e.trim()) : matches;
}

function removeEmptyTags(text: string): string {
  return text.replace(/\n<(\w+)>\s*<\/\1>\n/g, '');
}

function stripLastSentence(text: string): string {
  let sentences = text.split('. ');
  if (sentences[sentences.length - 1].startsWith("Let me know")) {
      sentences.pop();
      let result = sentences.join('. ');
      return result && !result.endsWith('.') ? result + '.' : result;
  }
  return text;
}

function extractPrompt(metapromptResponse: string): string {
  let betweenTags = extractBetweenTags("Instructions", metapromptResponse)[0];
  return betweenTags.slice(0, 1000) + stripLastSentence(removeEmptyTags(removeEmptyTags(betweenTags.slice(1000).trim()).trim()));
}



export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;
    console.log("in resolveWevview");
    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,
      
      localResourceRoots: [ vscode.Uri.joinPath(this._extensionUri, "out"),
        vscode.Uri.joinPath(this._extensionUri, "webview/fe_promptgenerator/build")],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    // console.log(webviewView.webview.html )
    webviewView.webview.onDidReceiveMessage(async (data) => {
      console.log("From rect")
      console.log(data)
      switch (data.type) {
        case "onInfo": {
          if (!data.value) {
            return;
          }
          vscode.window.showInformationMessage(data.value);
          break;
        }
        case "onError": {
          if (!data.value) {
            return;
          }
          vscode.window.showErrorMessage(data.value);
          break;
        }
        case "generate prompt": {
          if (!data.value) {
            return;
          }
          else {
            console.log(data.value.engine)
            const model = await getModel(data.value.engine, data.value.selectedmodel, data.value.apiKey);
            const systemprompt1 = systemprompt.replace("{TASK}", data.value.userprompt);
            
            const response = await model.invoke([{"role": "user", "content": systemprompt1}]);
            
            console.log(response.content);
            
            // Format the response using the helper functions
            // const formatted_response = prettyPrint(extractPrompt(response.content.toString()));
            
            this._view?.webview.postMessage({
              type: "response_llm", 
              value: response.content.toString()
            });
            break;
          }
        }
      }
    });
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    // const styleResetUri = webview.asWebviewUri(
    //   vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    // );

    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );



    const stylesUri = getUri(webview, this._extensionUri, [
      "webview/fe_promptgenerator",
      "build",
      "assets",
      "index.css",
    ]);
    // The JS file from the React build output
    const scriptUri = getUri(webview, this._extensionUri, [
      "webview/fe_promptgenerator",
      "build",
      "assets",
      "index.js",
    ]);


    // const styleMainUri = webview.asWebviewUri(
    //   vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.css")
    // );
  

    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="Content-Security-Policy" 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
          <link rel="stylesheet" type="text/css" href="${scriptUri}">
          <link rel="stylesheet" type="text/css" href="${stylesUri}">
          <title>Todo</title>
        </head>
        <body>
          <div id="root"></div>
          <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
        </body>
      </html>
    `;


  }
}