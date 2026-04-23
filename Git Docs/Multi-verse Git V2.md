Here is a **clean, compact, practical Git multi‑remote + mirroring cheat sheet** you can keep with you.  
It includes real commands, examples, warnings, and best practices.

---

# Git Multi‑Remote & Mirror Cheat Sheet  
*(GitLab + GitHub setup)*



## 1. Check existing remotes

```
git remote -v
```

Example output:

```
origin  https://gitlab.example.com/project.git (fetch)
origin  https://gitlab.example.com/project.git (push)
github  https://github.com/user/project.git (fetch)
github  https://github.com/user/project.git (push)
```

---

## 2. Add GitHub as a second remote

```
git remote add github https://github.com/YourUser/YourRepo.git
```

Rename if needed:

```
git remote rename origin gitlab
```

---

## 3. Normal Push/Pull (Mode B — two‑way workflow)

### Push
```
git push origin main
git push github main
```

### Pull
```
git pull origin main
git pull github main
```

### Push all branches
```
git push github --all
```

### Push all tags
```
git push github --tags
```

**Use this mode when you want both remotes active for development.**

---

## 4. Mirror Push (Mode A — one‑way syncing)

### Full mirror (branches + tags + history)
```
git push --mirror github
```

**WARNING:**  
- Deletes branches on GitHub if not in local repo  
- Overwrites GitHub history  
- GitHub becomes an exact copy of what you have locally  

Use when:

- GitLab = primary
- GitHub = backup/mirror

---

## 5. Switching between Mode A and B (safe workflow)

Before mirroring, sync everything:

```
git fetch origin --all
git fetch github --all
```

Then:

```
git push --mirror github
```

This prevents accidental deletion of branches pushed on GitHub.

---

## 6. Branch management tips

### See all remote branches
```
git branch -a
```

### Track a branch from GitLab
```
git checkout -b feature-x origin/feature-x
```

### Push a new branch to GitHub
```
git push github feature-x
```

---

## 7. Tips & Best Practices

### 1. Pick a single "source of truth"
Recommended:

```
GitLab = primary
GitHub = mirror
```

Only push real changes to GitLab.  
Use `--mirror` to sync to GitHub.

### 2. If using GitHub for contributions → avoid mirroring
Use normal push/pull.

### 3. Don’t mix mirror & two‑way without fetching first
Always run:

```
git fetch --all
```

### 4. Mirror regularly or automate it
You can automate mirroring via:

- GitLab CI  
- GitHub Actions  
- a local bash script  
- cron job  

(I can generate any of these for you.)

### 5. Different usernames ≠ problem
Git only cares about commit email, not platform usernames.

---

## 8. Examples You Can Copy/Paste

### Example: Full two‑way workflow (Mode B)
```
git fetch --all
git pull origin main
git pull github main
git push origin main
git push github main
```

---

### Example: GitLab → GitHub mirroring (Mode A)
```
git push origin main
git fetch --all
git push --mirror github
```

---

### Example: Backup everything to GitHub
```
git push github --all
git push github --tags
```

---

## 9. Danger Zone (Things to Avoid)

- Don’t run `git push --mirror github` if people are pushing directly to GitHub  
- Don’t treat GitHub as read/write if you're mirroring from GitLab  
- Don’t forget `git fetch --all` before mirroring in a mixed workflow  

---

If you want, I can also generate:

- a **PDF version** of this cheat sheet  
- a **short version** you can keep on your phone  
- automation scripts to sync GitLab → GitHub  

Just tell me!