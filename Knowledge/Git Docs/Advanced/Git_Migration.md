Here is a clean, ready-to-share **Markdown migration guide** tailored exactly to your repo URLs and your team’s situation (where teammates do NOT have a `github` remote yet).

You can copy/paste this directly into your internal docs.

---

# 🛠️ Part One: Repository Migration Guide  
**Switching primary remote from GitLab to GitHub**

**Primary remote (new):**  
`https://github.com/TnT74K/Project-ReserveCenter.git`

**Mirror remote (old):**  
`https://gitlab.aranserver.com/SajadSK/reservecenter`

This guide explains how to update your local Git setup so that **GitHub becomes the new primary remote** and **GitLab becomes a secondary mirror**.

---

## 1. Check your current remotes

Run:

```
git remote -v
```

You should see something like:

```
origin  https://gitlab.aranserver.com/SajadSK/reservecenter (fetch)
origin  https://gitlab.aranserver.com/SajadSK/reservecenter (push)
```

Most teammates will *not* have a `github` remote yet.

---

## 2. Rename the old `origin` to `gitlab`

We want to keep the GitLab remote, but not as the primary remote.

Run:

```
git remote rename origin gitlab
```

Check again:

```
git remote -v
```

You should now see:

```
gitlab  https://gitlab.aranserver.com/SajadSK/reservecenter (fetch)
gitlab  https://gitlab.aranserver.com/SajadSK/reservecenter (push)
```

---

## 3. Add GitHub as the new `origin`

Run:

```
git remote add origin https://github.com/TnT74K/Project-ReserveCenter.git
```

---

## 4. Verify new remote configuration

```
git remote -v
```

Expected output:

```
origin  https://github.com/TnT74K/Project-ReserveCenter.git (fetch)
origin  https://github.com/TnT74K/Project-ReserveCenter.git (push)
gitlab  https://gitlab.aranserver.com/SajadSK/reservecenter (fetch)
gitlab  https://gitlab.aranserver.com/SajadSK/reservecenter (push)
```

---

## 5. Update and synchronize your local branches

Switch to your main branch (usually `main` or `master`):

```
git switch main
```

Fetch from GitHub:

```
git fetch origin
```

Pull latest updates:

```
git pull origin main --rebase
```

If you were working on another branch, switch back:

```
git switch your-branch-name
```

---

## 6. Push your branch to GitHub

Once remotes are updated:

```
git push --set-upstream origin your-branch-name
```

---

## 7. (Optional) Push changes to both GitHub and GitLab automatically

If you want your `git push` to publish to **both** remotes:

```
git remote set-url --add --push origin https://gitlab.aranserver.com/SajadSK/reservecenter
```

Check:

```
git remote get-url --push origin
```

You should see two URLs.  
Now `git push` publishes to **GitHub and GitLab** simultaneously.

---

## 8. Confirm everything works

Run:

```
git fetch
git push
```

If you see an error like *non-fast-forward*, fix with:

```
git pull --rebase
```

---

## 9. You’re ready to work on GitHub

From now on:

- Submit pull requests on **GitHub**
- Clone new copies from GitHub
- GitLab is now a **mirror** only
  
---

# 🌐 Part Two: Upstream cheatsheet
## ✅ PART 1 — What Is “Upstream”?

An **upstream branch** is the remote branch your local branch tracks.

It enables:
- `git pull` (without arguments)
- `git push` (without arguments)
- Ahead/behind tracking in `git status`

Example relationship:

```
local branch:  main
tracks:        origin/main
```

---

## 🔎 Verify Upstream

### ✅ 1. Show tracking info for all branches

```bash
git branch -vv
```

Example:

```
* main      a1b2c3d [origin/main] Update README
  dev       9f8e7d6 [gitlab/dev]  Add feature
```

Format:

```
[remote/branch]
```

---

### ✅ 2. Check upstream of current branch only

```bash
git rev-parse --abbrev-ref --symbolic-full-name @{u}
```

If not set:

```
fatal: no upstream configured
```

---

### ✅ 3. Quick status check

```bash
git status
```

Example:

```
Your branch is up to date with 'origin/main'.
```

---

## 🔄 Change Upstream of a Branch

---

### ✅ Change upstream of CURRENT branch

```bash
git branch --set-upstream-to=gitlab/main
```

---

### ✅ Change upstream of a SPECIFIC branch

```bash
git branch --set-upstream-to=gitlab/dev dev
```

Format:

```bash
git branch --set-upstream-to=<remote>/<branch> <local-branch>
```

---

### ✅ Set upstream when pushing (common method)

```bash
git push -u gitlab main
```

`-u` = `--set-upstream`

After this, plain `git push` works.

---

### ✅ Remove upstream

```bash
git branch --unset-upstream
```

---

### ✅ Change upstream for ALL local branches (if names match)

```bash
for b in $(git branch --format='%(refname:short)'); do
  git branch --set-upstream-to=gitlab/$b $b
done
```
