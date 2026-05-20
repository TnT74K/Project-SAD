Here is a clean, ready-to-share **Markdown migration guide** tailored exactly to your repo URLs and your team’s situation (where teammates do NOT have a `github` remote yet).

You can copy/paste this directly into your internal docs.

---

# 🛠️ Repository Migration Guide  
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
