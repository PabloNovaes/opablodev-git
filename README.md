# @Git CLI

Interactive Git CLI extension for branch management, repository setup, and Pull Requests.

## Features

- **list** – List all branches and select one to checkout.
- **new** – Create a new branch and switch to it.
- **up** – Initialize a Git repository, optionally create or connect to a remote, add all files, commit, and push.
- **pr** – Create a Pull Request from the current branch to a selected base branch on GitHub (requires `gh` CLI).

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
- `@git pr` – Create a Pull Request from current branch to a selected base branch
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

### `pr` Command Details

The `pr` command will:

1. Detect the current branch as the source (`head`) branch.
2. List all other branches to select as the target (`base`) branch.
3. Prompt for a Pull Request title and description.
4. Ensure the branch is pushed to the remote (if not, push automatically).
5. Create a Pull Request on GitHub using the GitHub CLI (`gh pr create`).

## Requirements

- Node.js 14+
- Git
- GitHub CLI `gh` (required for creating remote repositories and Pull Requests)

## License

MIT License
