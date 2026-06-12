# Complete Git Remote Management Cheatsheet (CGRMC)

Here is your complete Git Remote Management Cheatsheet, updated to include the specific commands for managing distinct push and fetch URLs. 

### 🗄️ 1. Managing Remotes (`git remote`)
Manage the connections to other repositories.

| Command                         | Description                                                  |
| :------------------------------ | :----------------------------------------------------------- |
| `git remote`                    | List all configured remote names.                            |
| `git remote -v`                 | List all remotes with their fetch and push URLs.             |
| `git remote add <name> <url>`   | Add a new remote repository (e.g., `git remote add upstream <url>`). |
| `git remote remove <name>`      | Remove a remote connection.                                  |
| `git remote rename <old> <new>` | Rename a remote.                                             |
| `git remote show <name>`        | Show detailed information about a specific remote.           |
| `git remote prune <name>`       | Delete local tracking branches that no longer exist on the remote. |

### 🔗 2. Managing Push & Fetch URLs Specifically
By default, Git uses the same URL for fetching and pushing. You can separate them or add multiple push URLs to push to multiple repositories at once.

| Command                                           | Description                                                  |
| :------------------------------------------------ | :----------------------------------------------------------- |
| `git remote set-url <name> <url>`                 | Change the main URL for a remote (changes both fetch and push if no separate push URL is set). |
| `git remote set-url --push <name> <url>`          | Set a **specific push URL**, distinct from the fetch URL.    |
| `git remote set-url --add --push <name> <url>`    | **Add an additional push URL**. If you do this multiple times, one `git push` will push to *all* configured URLs simultaneously. |
| `git remote set-url --delete --push <name> <url>` | Remove a specific push URL from the list.                    |

### ⬇️ 3. Fetching & Pulling (`git fetch` / `git pull`)
Download data from a remote repository.

| Command                      | Description                                                  |
| :--------------------------- | :----------------------------------------------------------- |
| `git fetch <remote>`         | Download commits, files, and refs from a remote, without merging. |
| `git fetch --all`            | Fetch updates from *all* configured remotes.                 |
| `git fetch -p`               | Fetch and automatically prune dead remote-tracking branches. |
| `git pull <remote> <branch>` | Fetch and immediately merge the remote branch into your current branch. |
| `git pull --rebase`          | Fetch and rebase your local commits on top of the remote branch. |

### ⬆️ 4. Pushing (`git push`)
Upload local repository content to a remote.

| Command                               | Description                                                  |
| :------------------------------------ | :----------------------------------------------------------- |
| `git push <remote> <branch>`          | Push a local branch to a remote.                             |
| `git push -u <remote> <branch>`       | Push and set upstream tracking (use `-u` the first time).    |
| `git push --force-with-lease`         | Safely force push (fails if someone else has pushed to the remote recently). |
| `git push -f`                         | Force push to overwrite the remote history (use with caution!). |
| `git push --all <remote>`             | Push all local branches to the remote.                       |
| `git push --tags`                     | Push all local tags to the remote repository.                |
| `git push <remote> --delete <branch>` | Delete a specific branch on the remote repository.           |

### 🪞 5. Mirroring & Cloning (`git clone` / `git push --mirror`)
Create exact duplicates of a repository (useful for migrations and backups).

| Command                      | Description                                                  |
| :--------------------------- | :----------------------------------------------------------- |
| `git clone --bare <url>`     | Clone a repo without a working directory (standard for servers). |
| `git clone --mirror <url>`   | Clone a complete, exact copy of a repo (includes all refs, notes, and configurations). |
| `git push --mirror <remote>` | Push an exact replica of the local repo to a remote (overwrites everything on the target). |

---

### 💡 Quick Workflows

**Pushing to multiple remotes at once (e.g., GitHub and GitLab):**
```bash
git remote add origin <github-url>
git remote set-url --add --push origin <github-url>
git remote set-url --add --push origin <gitlab-url>
# Now 'git push origin main' pushes to both platforms automatically.
```

**Migrating a Repository (Exact Copy):**
```bash
git clone --mirror https://github.com/old-repo.git
cd old-repo.git
git push --mirror https://github.com/new-repo.git
```