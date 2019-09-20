const vscode = require('vscode');

async function getRepoRootOfFile(workspace, document) {
  // const workspaceFolder = workspace.getWorkspaceFolder(document.uri);
  // const rootPath = workspaceFolder.uri.path;
  const foundFiles = await workspace.findFiles('**/.arcconfig');
  const argconfigDirs = foundFiles
    .map((file) => file.path.replace(/\/.arcconfig$/, ''))
    .filter((dir) => document.uri.path.startsWith(dir))
  argconfigDirs.sort((a, b) => a.split('/').length - b.split('/').length)
  return argconfigDirs[0]; //pick the shortest number of segments (top of tree)
}

function readFilePath(workspace, path) {
  return workspace.fs
    .readFile(vscode.Uri.file(path))
    .then((buf) => String.fromCharCode.apply(null, new Uint16Array(buf)));
}

function removeLeadingSlash(path) {
  return path.replace(/^\//, '');
}

function removeTrailingSlash(path) {
  return path.replace(/\/$/, '');
}

function getDiffusionDomain(arcconfig) {
  return arcconfig['phabricator.uri'];
}

function getProjectCallsign(arcconfig) {
  // TODO: hit the api and try to find the repo based on the git-remote url
  // Rely on settings via: `vscode.workspace.getConfiguration('open-in-diffusion')`
  return arcconfig['repository.callsign'];
}

function documentToProjectFile(document, rootPath) {
  return document.fileName.replace(rootPath, '');
}

function selectionToUrlRange(selection) {
  return selection.isSingleLine
    ? `$${selection.start.line + 1}`
    : `$${selection.start.line + 1}-${selection.end.line + 1}`;
}

async function assembleUrl(activeEditor, workspace) {
  const repoRootPath = await getRepoRootOfFile(workspace, activeEditor.document)
  const arcconfig = JSON.parse(await readFilePath(workspace, `${repoRootPath}/.arcconfig`));
  const domain = removeTrailingSlash(getDiffusionDomain(arcconfig));
  const callsign = removeLeadingSlash(removeTrailingSlash(getProjectCallsign(arcconfig)));
  const projectFile = removeLeadingSlash(documentToProjectFile(activeEditor.document, repoRootPath));
  const lineRange = selectionToUrlRange(activeEditor.selection);
  return `${domain}/diffusion/${callsign}/browse/master/${projectFile}${lineRange}`;
}

module.exports = {
  activate: function(context) {
    context.subscriptions.push(
      vscode.commands.registerCommand('open-in-diffusion.copy-phabricator-url', async () => {
        const url = await assembleUrl(vscode.window.activeTextEditor, vscode.workspace);

        await Promise.all([
          vscode.env.clipboard.writeText(url),
          vscode.window.showInformationMessage(`Copied ${url}`),
        ]);
      })
    );

    context.subscriptions.push(
      vscode.commands.registerCommand('open-in-diffusion.open-in-phabricator', async () => {
        const url = await assembleUrl(vscode.window.activeTextEditor, vscode.workspace);

        await vscode.env.openExternal(vscode.Uri.parse(url));
      })
    );
  },
};