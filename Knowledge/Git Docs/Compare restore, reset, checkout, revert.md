# Explain the difference between `restore`, `reset`, `checkout`, and `revert`:

These four commands overlap conceptually, which is why Git feels confusing at first.

A good mental model:

Command | Main purpose
---|---
`restore` | Restore files
`reset` | Move/reset branch or staging
`checkout` | Switch branches or inspect commits
`revert` | Undo via a new commit

The key difference is:
- Some commands rewrite history
- Some only affect local files
- Some are safe for shared branches
- Some are dangerous

---

# 1. `git restore`
“Make files look like another version.”

Used for:
- Discarding local changes
- Unstaging files
- Restoring specific files from commits

Examples:

Discard local edits:
```bash
git restore app.js
```

Unstage:
```bash
git restore --staged app.js
```

Restore from older commit:
```bash
git restore --source HEAD~1 app.js
```

Affects:
- Working directory
- Staging area

Does NOT:
- Change commit history
- Move branches

Safe for beginners.

---

# 2. `git reset`
“Move HEAD and optionally modify staging/files.”

This is the dangerous/powerful one.

There are 3 common modes:

---

## A. Soft reset
```bash
git reset --soft HEAD~1
```

Effect:
- Removes last commit
- Keeps changes staged

Useful for:
- Redoing a commit message
- Combining commits

Visual:

Before:
```text
A -- B -- C (HEAD)
```

After:
```text
A -- B (HEAD)
```

But changes from `C` are still staged.

---

## B. Mixed reset (default)
```bash
git reset HEAD~1
```

Effect:
- Removes commit
- Keeps file changes
- Unstages them

Very common.

---

## C. Hard reset
```bash
git reset --hard HEAD~1
```

Effect:
- Deletes commit
- Deletes staged changes
- Deletes working changes

Dangerous.

---

## Reset can also unstage files

Old style:
```bash
git reset HEAD file.txt
```

Modern equivalent:
```bash
git restore --staged file.txt
```

---

## Main concept of reset

`reset` primarily changes:
- HEAD
- current branch pointer
- staging area

Sometimes working files too (`--hard`).

---

# 3. `git checkout`
Historically overloaded.

It used to do:
- branch switching
- file restoring
- detached HEAD navigation

Examples:

Switch branches:
```bash
git checkout main
```

Create branch:
```bash
git checkout -b feature
```

Restore file (old style):
```bash
git checkout -- app.js
```

Inspect old commit:
```bash
git checkout <commit>
```

Because this command did too many things, Git introduced:
- `git switch`
- `git restore`

Modern replacements:

Old | New
---|---
`git checkout main` | `git switch main`
`git checkout -b x` | `git switch -c x`
`git checkout -- file` | `git restore file`

You can still use checkout, but newer commands are clearer.

---

# 4. `git revert`
“Undo a commit safely by making another commit.”

This is the safe way to undo shared history.

Example:

History:
```text
A -- B -- C
```

Run:
```bash
git revert C
```

Result:
```text
A -- B -- C -- D
```

Where `D` reverses the changes from `C`.

Important:
- History is preserved
- No commits removed
- Safe for pushed branches

---

# When to use what

## I edited a file and want to discard changes
```bash
git restore file.txt
```

---

## I staged something accidentally
```bash
git restore --staged file.txt
```

---

## I want to move to another branch
```bash
git switch branch-name
```

---

## I want to undo my last local commit
```bash
git reset --soft HEAD~1
```
or
```bash
git reset HEAD~1
```

---

## I want to completely erase local commits/changes
```bash
git reset --hard
```

Be careful.

---

## I already pushed a bad commit
Use:
```bash
git revert <commit>
```

NOT:
```bash
git reset
```

on shared branches.

---

# Rule of thumb

Situation | Command
---|---
Undo local file edits | `restore`
Undo commits locally | `reset`
Switch branches | `switch`
Undo published commits safely | `revert`

---

# The dangerous one

The command most likely to destroy work:

```bash
git reset --hard
```

Because it can permanently remove:
- commits
- staged changes
- working changes

Use `git stash` first if unsure.

---

# Practical examples

## “Oops I edited the wrong file”
```bash
git restore file.txt
```

---

## “Oops I committed too early”
```bash
git reset --soft HEAD~1
```

---

## “Oops I pushed broken code”
```bash
git revert HEAD
git push
```

---

## “Oops I applied stash on wrong branch”
```bash
git stash
git switch correct-branch
git stash pop
```

---

# One final mental model

Think of Git as 3 layers:

```text
Commit history (HEAD)
        ↓
Staging area (index)
        ↓
Working directory
```

Command | Primarily affects
---|---
`restore` | working tree / staging
`reset` | HEAD / staging
`checkout/switch` | branch/HEAD
`revert` | commit history via new commit

That mental model makes Git much easier to reason about.