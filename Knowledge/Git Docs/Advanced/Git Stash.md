`git stash` is a way to **temporarily save** your local, uncommitted changes so you can switch branches or pull updates without committing half-finished work.

---

## 1. The basic idea

- You’re in the middle of something on branch `feature-a`
- You need to:
  - quickly switch to `main` to fix a bug, **or**
  - pull changes, **or**
  - test something clean
- Your working tree has uncommitted changes that would block these operations.

`git stash` lets you:

1. Save those changes aside (into a special stash stack)
2. Revert your working directory to a clean state
3. Do whatever you need (switch branch, pull, test, etc.)
4. Bring your changes back later

Think of it as a **stack of temporary commits** that are not in any branch.

---

## 2. The most common commands

### 2.1 Save your current changes

```bash
git stash
```

This:

- Saves:
  - modified tracked files
  - staged changes
- Reverts them from your working directory
- Leaves you with a **clean tree** as if you just checked out the branch

Add a message (highly recommended):

```bash
git stash push -m "WIP: refactoring user service"
# or modern equivalent
git stash save "WIP: refactoring user service"
```

Include **untracked files** (new files not yet added with `git add`):

```bash
git stash push -u -m "Work in progress with new files"
# -u == --include-untracked
```

Include **ignored files** too (rare, but possible):

```bash
git stash push -a -m "Include everything, even ignored"
# -a == --all
```

---

### 2.2 See what you’ve stashed

```bash
git stash list
```

Example output:

```bash
stash@{0}: On feature-a: WIP: refactoring user service
stash@{1}: On main: quick fix for logging
stash@{2}: On feature-b: experiment with regex
```

Each entry is like a little temporary branch.

To see what’s inside a stash:

```bash
git stash show stash@{0}
# summary of changes

git stash show -p stash@{0}
# full patch (diff)
```

If you omit the name, it uses the most recent: `stash@{0}`.

---

### 2.3 Apply or restore a stash

Bring your changes back **but keep the stash entry**:

```bash
git stash apply
# applies stash@{0} by default, but does NOT remove it from the stash list
```

Apply a specific stash:

```bash
git stash apply stash@{2}
```

Bring your changes back **and remove the stash entry**:

```bash
git stash pop
# applies stash@{0} and then deletes it from the list
```

Specific stash with `pop`:

```bash
git stash pop stash@{2}
```

If applying conflicts with current code, you’ll get merge conflicts you must resolve manually, just like merging.

---

### 2.4 Clean up stashes

Delete a specific stash:

```bash
git stash drop stash@{1}
```

Delete all stashes:

```bash
git stash clear
```

---

## 3. Useful patterns / real-world uses

### 3.1 Quickly switching branches

Scenario:

- You’re coding on `feature-a`
- Product asks you to hotfix something on `main`
- Your changes are incomplete – you don’t want to commit them

```bash
# On feature-a with local changes
git stash push -m "WIP: feature-a"

git checkout main
# do hotfix, commit, push, etc.

git checkout feature-a
git stash pop   # bring back the WIP changes
```

---

### 3.2 Pulling cleanly without committing WIP

If you have local modifications and need new remote changes:

```bash
git stash push -m "Before pulling latest main"
git pull
git stash pop
```

If you’re unlucky, you might get **conflicts** when popping — that just means your local WIP and the new pulled changes overlap; resolve like a normal merge conflict.

---

### 3.3 Splitting changes into multiple commits

Sometimes you’ve done too much in one go and want to break it into logical commits.

Pattern:

```bash
# You made a bunch of changes
git stash push -m "Big change set"

# Now your tree is clean.
# Use 'git stash apply' and commit piece by piece:

git stash apply stash@{0}
# Stage only a subset:
git add file1 file2 path/to/part-of-change
git commit -m "Part 1: something small"

# Now the rest of the changes are still unstaged.
# Repeat:
git add ...
git commit -m "Part 2: another piece"
```

If needed, you can re-stash remaining changes while you go.

---

### 3.4 Testing something quickly

You want to test a theory or debug with a totally clean tree:

```bash
git stash push -m "Before experimental debug"
# experiment, test, run scripts, etc.
# If you don't like what you did, just:
git reset --hard HEAD   # throw away experimental changes

git stash pop           # restore your original work
```

---

## 4. Variants and options worth knowing

### 4.1 Stashing only staged or only unstaged changes

Stash only what’s staged:

```bash
git stash push --staged -m "Only staged changes"
```

Stash only part of your modifications (using interactive add first):

```bash
git add -p   # stage only selected hunks
git stash push -m "Selected hunks only" --staged
```

Or stash **only** untracked files:

```bash
git stash push -u -m "Only untracked files"
# then optionally restore later and sort them out
```

---

### 4.2 Stash onto a different branch

You can stash on branch A, then apply on branch B. This is useful if:

- You started building a feature on the wrong branch
- Then realized it belongs to another branch

```bash
# accidentally started on main
git stash push -m "Feature X moving to correct branch"
git checkout feature-x
git stash pop
```

If file paths match, it often works cleanly. If not, you may get conflicts.

---

## 5. How it’s actually stored (mental model)

Internally, each stash entry is like:

- One commit for your local changes
- One commit for the state of the index (staged changes)
- One commit for untracked stuff (when included)

You don’t usually need to think about this, but it explains why:

- `git stash` can restore both staged and unstaged states
- You can treat a stash like a commit in some commands (like `git show`, `git diff`, etc.)

Example:

```bash
git diff stash@{0}^!   # diff of that stash
```

---

## 6. When to use `git stash` vs other options

### Good times to use `git stash`

- You **don’t** want to commit yet (work is messy/half-done), but you need a clean tree:
  - switching branches
  - pulling
  - running tests with a clean workspace
- You want a quick, temporary save for a short time

### When **not** to use it

- Long-lived work: if something will sit for hours/days, a **feature branch + normal commit** is more transparent.
- Sharing work with others: stash is local and hidden from collaborators.
- Complex long-term WIP: better to:
  - commit with `WIP` message, or
  - use a draft/“work in progress” branch

---

## 7. Minimal practical cheat sheet

```bash
# Save changes (tracked) and clean working dir
git stash

# Save including untracked files
git stash push -u -m "message"

# List all stashes
git stash list

# Inspect top stash
git stash show -p

# Apply latest stash (keep in stash list)
git stash apply

# Apply specific stash
git stash apply stash@{2}

# Apply and remove from list
git stash pop
git stash pop stash@{1}

# Delete one or all
git stash drop stash@{1}
git stash clear
```

---

If you tell me your typical workflow (solo dev vs team, use of feature branches, etc.), I can suggest a small set of `git stash` patterns tailored to how you work, so you’re not overwhelmed by options you don’t need.