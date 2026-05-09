Here’s the clean, practical difference between **backup** and **sync** when dealing with Git repos:

---

## Backup
A **backup** means you want another remote to contain **everything that exists in your local clone**, so that if your main remote disappears, you still have all your data.

Characteristics:

- **One‑directional**: from your local repo → backup remote  
- Does **not** care what the backup remote currently has  
- Your local repo is the “source of truth”
- No automatic updates from the backup remote back into your local repo
- Uses commands like:
  - `git push --mirror backup`
  - or `git push --all backup` + `git push --tags backup`

In other words:  
**Backup = push your current local state to a safe place.**

---

## Sync
A **sync** means you want **two locations to stay identical**, and they may both change over time.

Characteristics:

- **Two‑directional**: differences must be resolved both ways
- Requires **fetching** and possibly merging or rebasing
- You must make the two repositories agree
- Uses commands like:
  - `git fetch`
  - `git pull`
  - resolving merge conflicts
  - `git push`

In other words:  
**Sync = keep two copies matched, even if both may receive changes.**

---

## Put simply

**Backup**
- I push to another remote to save my current repo.
- Backup never changes the original.
- Backup remote should not have independent work.

**Sync**
- Two repos influence each other.
- Both can have changes.
- You need to pull, merge, push.

---

## So in your case (just backup)
If you run:

```
git fetch --all --prune
git push --mirror backup
```

…you are **not syncing**.  
You are simply *updating the backup remote to match your local repo*, which usually represents your origin after the fetch.

---

If you want, tell me your exact setup (origin, backup remote names, and what you want backed up), and I can give you a safe, copy‑and‑paste command set.