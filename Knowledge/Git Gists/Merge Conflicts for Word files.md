# Git Merge Conflict Cheat Sheet (.docx and other binary files)

## **Check what’s happening**

```bash
git status
```

Shows which files have conflicts.

------

## **Keep** **my** **version (current branch)**

```bash
git checkout --ours path/to/file.docx
git add path/to/file.docx
git commit
```

or (modern Git)

```bash
git restore --source=HEAD path/to/file.docx
git add path/to/file.docx
git commit
```

------

## **Keep** **their** **version (incoming branch)**

```bash
git checkout --theirs path/to/file.docx
git add path/to/file.docx
git commit
```

or (modern Git)

```bash
git restore --source=MERGE_HEAD path/to/file.docx
git add path/to/file.docx
git commit
```

------

## **Cancel the merge completely**

```bash
git merge --abort
```

Returns your repository to the state before the merge started.

------

## **Replace one file with the version from another branch (no merge required)**

```bash
git restore --source=main path/to/file.docx
git add path/to/file.docx
git commit -m "Replace file with version from main"
```

------

## **Make my branch exactly match another branch**

⚠️ This discards commits unique to your current branch.

```bash
git reset --hard main
```

Or to match the remote:

```bash
git fetch origin
git reset --hard origin/main
```

------

## **Pull changes from** **`main`** **into my branch**

```bash
git switch my-branch
git pull origin main
```

If a binary file conflicts:

- Keep your version:

```bash
git checkout --ours path/to/file.docx
```

- Keep `main`’s version:

```bash
git checkout --theirs path/to/file.docx
```

Then:

```bash
git add path/to/file.docx
git commit
```

------

## **Quick Memory Trick**

| **You want to keep…**             | **Command**                  |
| --------------------------------- | ---------------------------- |
| **Your current branch’s version** | `git checkout --ours file`   |
| **The branch you’re merging in**  | `git checkout --theirs file` |

A simple way to remember it is:

- **ours** = “what I already had checked out”
- **theirs** = “what is coming in from the merge”

This distinction is especially useful when you’re on a feature branch and merging `main` into it.