## `git push origin --all`
- To upload all the branches created locally, all at once.
- Warning: if some branches are beyond your local repo, you'll face an error.

## `git branch -d feature/xyz`
- To delete a branch.

## `git push --mirror gitlab`
- To mirror the second remote added.
- This ***OVERRIDES*** everything on the second remote.
- Use git push --mirror gitlab only when:

  - you want a full resync
  - you want to force GitLab to match GitHub exactly
  - you understand it may delete branches on GitLab

## `git fetch --all`
- To be in sync with everything on remotes.
## `git push origin my-new-branch`
- First, checkout to the new branch, then enter this command.
- To upload a new branch on remote.
## `git fetch --all --prune`
- downloads the latest commits from every remote

- updates remote‑tracking branches like origin/main

- does not merge anything into your local branches

- removes remote branches that no longer exist (--prune)
## `git branch -vv`

It shows you all your branches with:
- their current commit
- which remote branch they track
- whether they are ahead or behind
- the last commit message

## `git remote -v`
It shows all git remote addresses

## `git push --all -u origin` 
It sets the upstream to `origin` for all branches on local git.

## `git push --all gitlab
This is the safe mirror option for most teams.

If you only want to push:
- all branches
- all tags
- but not delete anything on GitLab