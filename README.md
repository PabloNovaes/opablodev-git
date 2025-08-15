# @Git CLI

Interactive Git CLI extension for branch management and repository setup.

## Features

- **list** – List all branches and select one to checkout.
- **new** – Create a new branch and switch to it.
- **up** – Initialize a Git repository, optionally create or connect to a remote, add all files, commit, and push.

## Installation

### Global (recommended)

Install the CLI globally so you can use it anywhere:

    npm install -g @opablodev/git

### Temporary via npx

You can also run it without installing globally:

    npx @git

## Usage

Once installed globally or via npx, use the CLI commands like this:

- `@git list` – List all branches and select one to checkout
- `@git new` – Create a new branch and switch to it
- `@git up` – Initialize repository, add files, commit, and push
- `@git` – Opens interactive menu if no subcommand is provided

### `up` Command Details

The `up` command will:

1. Initialize a Git repository if none exists (`git init`).
2. Create a `.gitignore` file if it doesn’t exist (Node.js default).
3. Check if a remote repository exists:
   - If yes, user provides the remote URL.
   - If no, optionally create a GitHub repository (requires GitHub CLI `gh`) and link as remote.
4. Add all files (`git add .`).
5. Prompt for a commit type (`feat`, `fix`, `docs`, etc.) and a commit message, unless it's the initial commit.
6. Commit and push to `main` (or fallback to `master`).

## Requirements

- Node.js 14+
- Git
- GitHub CLI `gh` (only needed if you want to automatically create remote repositories)

## License

MIT License
