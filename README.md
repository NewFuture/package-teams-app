# package-teams-app

Package Microsoft Teams App Manifest

## usage

```sh
npx package-teams-app [manifestfolder] [output folder]
```

You can run `npm i package-teams-app -g` or `yarn global add package-teams-app` to install it global.

## details

### cli options

#### package

Pacakge your manifest folder. (default name is `manifest`)

```sh
package-teams-app [inputFolder] [outputFile]
```

#### `--init`

Init an template manifest folder.

```sh
package-teams-app --init [initDir]
```

#### `--help`

Print help messages.

```sh
package-teams-app --help
```

### Examples:

```
package-teams-app manifest
package-teams-app manifest build/download.zip
package-teams-app --init manifest
```

### Env order:

- `.env.${NODE_ENV}.local`
- `.env.local`
- `.env.${NODE_ENV}`
- `.env`
