
# Git Cherry-Pick Cheatsheet

`git cherry-pick` allows you to apply the changes introduced by existing commits from one branch onto your current branch. It is a powerful tool for hotfixing, backporting, or isolating specific feature commits without merging entire branches.

## Basic Usage

### Pick a single commit
Apply a specific commit to the current branch:
```bash
git cherry-pick <commit-hash>
```

### Pick a range of commits
Apply all commits from `A` (exclusive) to `B` (inclusive):
```bash
git cherry-pick <hash-A>..<hash-B>
```
*To include both A and B, use:* `git cherry-pick <hash-A>^..<hash-B>`

### Pick without committing immediately
Useful if you want to inspect or modify the changes before finalizing the commit:
```bash
git cherry-pick -n <commit-hash>
```
*(After this, you can stage files manually and then `git commit`)*

---

## Troubleshooting & Conflicts

If a conflict occurs, Git will pause the operation.

### 1. Resolve Conflicts
1. Open the conflicted files and fix the issues.
2. Stage the resolved files:
   ```bash
   git add <file-name>
   ```
3. Continue the process:
   ```bash
   git cherry-pick --continue
   ```

### 2. Skip a Commit
If the commit is already present on the branch, or you decide it’s no longer needed:
```bash
git cherry-pick --skip
```

### 3. Abort Completely
To return to the state before you started the cherry-pick:
```bash
git cherry-pick --abort
```

---

## Pro-Tips & Gotchas

*   **"The previous cherry-pick is now empty":**
    This happens if the changes in the commit you are picking are already present in the destination branch (usually due to a prior merge). Just run `git cherry-pick --skip` to finish.
*   **Keep Original Author:**
    Git naturally keeps the original author metadata, but you can explicitly ensure it:
    ```bash
    git cherry-pick -x <commit-hash>
    ```
    *(The `-x` flag appends a line to the commit message saying "cherry picked from commit...", which is great for audit trails.)*
*   **When to avoid it:**
    If you are moving a large chunk of work that has many dependencies on other commits, prefer `git merge` or `git rebase` to keep the branch history logically connected. Use `cherry-pick` for "surgical" operations.
```

***

**Quick Tip for your Team:** Since you are a Lead/Developer, you might want to encourage your team to use `git cherry-pick -x` as a standard practice. It leaves a "paper trail" in the commit log, which is invaluable for debugging why a specific change appeared in a branch later on.