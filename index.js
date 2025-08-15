#!/usr/bin/env node
const { execSync } = require('child_process');
const inquirer = require('inquirer');
const fs = require('fs');

function validateRepo() {
    try {
        execSync('git rev-parse --git-dir', { stdio: 'pipe' });
        return true;
    } catch {
        return false;
    }
}

async function listBranches() {
    const branches = execSync('git branch --format="%(refname:short)"', { encoding: 'utf-8' })
        .split('\n').map(b => b.trim()).filter(Boolean);

    if (branches.length === 0) {
        console.log('No branches found.');
        return;
    }

    const { branch } = await inquirer.prompt([
        { type: 'list', name: 'branch', message: 'Select a branch:', choices: branches }
    ]);

    execSync(`git checkout "${branch}"`, { stdio: 'inherit' });
    console.log(`✅ Checked out to branch: ${branch}`);
}

async function createBranch() {
    const { newBranch } = await inquirer.prompt([
        { type: 'input', name: 'newBranch', message: 'Enter the name of the new branch:' }
    ]);

    execSync(`git checkout -b "${newBranch}"`, { stdio: 'inherit' });
    console.log(`✅ Branch "${newBranch}" created and checked out`);
}

async function up() {
    const repoInitialized = validateRepo();
    let isInitialCommit = false;
    let remoteConfigured = false;

    // ------------------ Initialize repository ------------------
    if (!repoInitialized) {
        console.log('🔹 Git repository not found. Initializing...');
        execSync('git init', { stdio: 'inherit' });

        // Create default .gitignore if it doesn't exist
        if (!fs.existsSync('.gitignore')) {
            const defaultGitignore = `
node_modules/
dist/
.env
.DS_Store
*.log
coverage/
`;
            fs.writeFileSync('.gitignore', defaultGitignore.trim());
            console.log('✅ .gitignore created');
        }

        // Initial commit
        console.log('🔹 Creating initial commit...');
        execSync('git add .', { stdio: 'inherit' });
        execSync('git commit -m "chore: initial commit"', { stdio: 'inherit' });
        isInitialCommit = true;
    }

    // ------------------ Check existing remote ------------------
    try {
        const existingRemote = execSync('git config --get remote.origin.url', { encoding: 'utf-8' }).trim();
        if (existingRemote) {
            console.log(`🔹 Remote already configured: ${existingRemote}`);
            remoteConfigured = true;
        }
    } catch {
        // No remote configured
        remoteConfigured = false;
    }

    // ------------------ Remote handling ------------------
    if (!remoteConfigured) {
        const { hasRemote } = await inquirer.prompt([
            { type: 'confirm', name: 'hasRemote', message: 'Do you already have a remote repository?', default: false }
        ]);

        if (hasRemote) {
            const { remoteUrl } = await inquirer.prompt([
                { type: 'input', name: 'remoteUrl', message: 'Enter the remote repository URL:' }
            ]);

            try {
                execSync(`git remote add origin "${remoteUrl}"`, { stdio: 'inherit' });
                remoteConfigured = true;
            } catch {
                console.warn('⚠ Remote already exists or could not be added. Skipping.');
            }
        } else {
            // Try to get project name from package.json
            let defaultName = 'my-project';
            if (fs.existsSync('package.json')) {
                const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
                if (pkg.name) defaultName = pkg.name.replace(/^@/, '').replace("/", "-");
            }

            const { repoName } = await inquirer.prompt([
                { type: 'input', name: 'repoName', message: 'Enter repository name:', default: defaultName }
            ]);

            const sanitizedName = repoName; // remove @ if user typed
            console.log(`🔹 Creating remote repository "${sanitizedName}"...`);

            try {
                execSync(`gh repo create "${sanitizedName}" --public --source=. --remote=origin`, { stdio: 'inherit' });
                remoteConfigured = true;
            } catch (err) {
                console.warn('⚠ Failed to create remote repository. You may not have permission or gh is not authenticated.');
            }
        }
    }

    // ------------------ Add, Commit ------------------
    console.log('🔹 Adding all files...');
    execSync('git add .', { stdio: 'inherit' });

    if (!isInitialCommit) {
        const commitTypes = ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'other'];
        const { commitType } = await inquirer.prompt([
            { type: 'list', name: 'commitType', message: 'Select commit type:', choices: commitTypes }
        ]);

        const { commitMessage } = await inquirer.prompt([
            { type: 'input', name: 'commitMessage', message: 'Enter commit message:' }
        ]);

        execSync(`git commit -m "${commitType}: ${commitMessage}"`, { stdio: 'inherit' });
    } else {
        console.log('🔹 Skipping commit prompts for initial commit.');
    }

    // ------------------ Push if remote exists ------------------
    if (remoteConfigured) {
        console.log('🔹 Pushing to remote...');
        try {
            execSync('git push -u origin main', { stdio: 'inherit' });
            console.log('✅ Push completed!');
        } catch {
            try {
                execSync('git push -u origin master', { stdio: 'inherit' });
                console.log('✅ Push completed to master!');
            } catch {
                console.warn('⚠ Failed to push. Check remote repository and permissions.');
            }
        }
    } else {
        console.log('⚠ No remote configured. Skipping push.');
    }
}


async function menu() {
    const { action } = await inquirer.prompt([
        { type: 'list', name: 'action', message: 'Choose an action:', choices: ['list', 'new', 'up', 'exit'] }
    ]);

    if (action === 'list') await listBranches();
    else if (action === 'new') await createBranch();
    else if (action === 'up') await up();
    else process.exit(0);
}

(async () => {
    const subcommand = process.argv[2];

    switch (subcommand) {
        case 'list': await listBranches(); break;
        case 'new': await createBranch(); break;
        case 'up': await up(); break;
        default: await menu(); break;
    }
})();
