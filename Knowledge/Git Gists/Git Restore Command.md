# Q: What is `git restore` command?

`git restore` is a relatively new Git command (introduced in Git 2.23) meant to **restore files in your working directory or staging area to a previous state**. It was created to split responsibilities that used to be handled by the overloaded `git checkout`.

Think of it as: **“put this file back to how it was somewhere else.”**

There are two main things it can restore:

- Files in the **working directory**
- Files in the **staging area (index)**

---

## 1. Restore a file from the last commit (discard local changes)

If you edited a file and want to **throw away your changes**:

```bash
git restore file.txt
```

Effect:
- Working directory → restored to the version in **HEAD**
- Changes are **lost**

Example:
```
modified: app.js
```

Run:

```bash
git restore app.js
```

Now `app.js` returns to the last committed version.

---

## 2. Restore all files

Discard **all uncommitted changes**:

```bash
git restore .
```

This restores all tracked files in the current directory.

Important:  
It **does not delete untracked files**. For that you need:

```bash
git clean -fd
```

---

## 3. Unstage a file

If you added something to staging with `git add` but want to undo that:

```bash
git restore --staged file.txt
```

Equivalent to the old command:

```bash
git reset HEAD file.txt
```

Result:
- File removed from staging
- Working directory unchanged

---

## 4. Restore both staged and working changes

If you staged and modified a file and want to discard everything:

```bash
git restore --staged --worktree file.txt
```

This resets both:
- index
- working directory

to the last commit.

---

## 5. Restore from a specific commit

You can restore a file from **any commit**.

```bash
git restore --source <commit> file.txt
```

Example:

```bash
git restore --source HEAD~2 config.yml
```

Meaning:
- Take the version from **2 commits ago**
- Replace the working directory file

---

## 6. Restore a staged file to match working directory

If you staged something but want staging to match your working file:

```bash
git restore --staged --source=HEAD file.txt
```

---

## 7. Restore specific lines interactively

Interactive mode:

```bash
git restore -p file.txt
```

Git shows hunks and lets you decide which parts to revert.

Example prompt:

```
Discard this hunk? [y,n,q,a,d,e,?]
```

This is very useful when you want to revert **only some changes**.

---

## 8. Working directory vs staging area

Git has three main states:

1. **HEAD** → last commit
2. **Index (staging area)** → what will be committed
3. **Working directory** → your files

`git restore` moves files **between these states**.

Examples:

```
git restore file.txt
```
HEAD → Working Directory

```
git restore --staged file.txt
```
HEAD → Index

```
git restore --source <commit> file.txt
```
Commit → Working Directory

---

## Quick comparison

Old Git command | New equivalent
---|---
`git checkout -- file` | `git restore file`
`git reset HEAD file` | `git restore --staged file`
`git checkout commit -- file` | `git restore --source commit file`

---

## Important safety note

`git restore` **permanently discards changes** unless they were committed or stashed.

If unsure, stash first:

```bash
git stash
```

Then experiment safely.

---

If you want, I can also explain **the difference between `restore`, `reset`, `checkout`, and `revert`** — that’s one of the biggest sources of Git confusion.