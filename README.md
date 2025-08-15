# @Git CLI

A simple Git CLI extension to manage branches and initialize repositories interactively.

## Features

- **list**: List all branches and select one to checkout.
- **new**: Create a new branch and switch to it.
- **up**: Initialize a Git repository, optionally create or connect to a remote, add all files, commit, and push.

## Installation

You can install the CLI globally via npm:
npm install -g @opablodev/git

Or run it temporarily using npx:
npx @git

## Usage

Once installed or via npx, use the CLI like this:

- `@git list` – List all branches and select one to checkout
- `@git new` – Create a new branch and switch to it
- `@git up` – Initialize repository, add files, commit, and push
- `@git` – Opens interactive menu if no subcommand is provided

### `up` Command Details

The `up` command will:

1. Initialize a Git repository if none exists (`git init`).
2. Create a `.gitignore` file if it doesn’t exist (Node.js default).
3. Ask if a remote repository already exists:
   - If yes, user provides URL.
   - If no, optionally create a GitHub repository (requires GitHub CLI `gh`) and link as remote.
4. Add all files (`git add .`).
5. Prompt for a commit type (feat, fix, docs, etc.) and a commit message.
6. Commit and push to `main` (or `master` fallback).

## Requirements

- Node.js 14+
- Git
- GitHub CLI `gh` if you want the CLI to create remote repositories automatically.

## License

MIT License
