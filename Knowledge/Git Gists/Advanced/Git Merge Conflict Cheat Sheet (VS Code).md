# Git Merge Conflict Cheat Sheet (VS Code)

> **Golden Rule**
>
> **Current = The branch I'm standing on**
>
> **Incoming = The branch coming into mine**

------

## Step 1 — Ask yourself

```bash
git branch
```

The branch with `*` is **Current**.

Example:

```text
* backend
  main
```

Current = `backend`

------

## Scenario 1

I'm on `backend`

```bash
git checkout backend
git merge main
```

| Label in VS Code | Actually Means |
| ---------------- | -------------- |
| Current          | `backend`      |
| Incoming         | `main`         |

------

## Scenario 2

I'm on `main`

```bash
git checkout main
git merge backend
```

| Label in VS Code | Actually Means |
| ---------------- | -------------- |
| Current          | `main`         |
| Incoming         | `backend`      |

------

# VS Code Buttons

| Button            | Meaning                              |
| ----------------- | ------------------------------------ |
| ✅ Accept Current  | Keep **my current branch's** version |
| 📥 Accept Incoming | Keep **the merged branch's** version |
| 🤝 Accept Both     | Keep both versions                   |
| 🔍 Compare Changes | Show differences before deciding     |

------

# Visual Memory

```
            main
              │
              ▼
Incoming ─────────► Current (the branch I'm on)
```

or simply:

```
           You are HERE
                │
                ▼
Current ◄── Incoming
```

------

# Before resolving a conflict

Ask yourself:

1. **Which branch am I on?** (`git branch`)
2. **Which branch did I merge?**
3. Now you know:
   - Current = where I am
   - Incoming = what I merged

------

# Quick Examples

### On `feature`

```bash
git checkout feature
git merge main
Current  = feature
Incoming = main
```

------

### On `main`

```bash
git checkout main
git merge feature
Current  = main
Incoming = feature
```

------

# One-line Memory Trick

> **Current = Me. Incoming = Visitor.**