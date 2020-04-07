# open-in-diffusion extension

Open the current file in the Phabricator/Diffusion web UI.

To open a file, run the "Open In Diffusion: Open in Phabricator" command, & see file in your browser!

You can alternativly run the "Open In Diffusion: Copy Phabricator URL" command to put the url into the clipboard.

## Setup & Requirements

Are you a Visual Studio Code user with some repositories hosted by phabricator? Then this is a plugin for you!

For the commands to work: add the repository as a folder in the current vscode workspace.
Open In Diffusion works best when you've added your whole project as a folder in the workspace. For example, if your project is `~/code/my-project` then add either `~/code/my-project` or all of `~/code` to the workspace.

Working with multiple repositories within the same workspace is supported.

This extension relies on an `.arcconfig` file. It should be committed to the root of your repository. For example: `~/code/my-project/.arcconfig`. The config must include the fields `phabricator.uri` and `repository.callsign`:

```
{
  "phabricator.uri" : "https://phabricator.example.com/",
  "repository.callsign": "COOL",
}
```


## Reporting Bugs/Feature Requests

Open an issue or pull request on [github](https://github.com/ryan953/vscode-open-in-diffusion/issues).

## Publishing a new version

```
npx vsce login
npx vsce publish -p major|minor|patch
git push origin
```

See [Publishing Extension](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) for more.
