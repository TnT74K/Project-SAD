# Using gitignore

`.gitignore` files use a small pattern-matching language. Once you know a few rules, you can write most ignore files yourself.

# **Basic Syntax**

## **Ignore a specific file**

```gitignore
secret.txt
```

Ignores:

```text
secret.txt
```

------

## **Ignore all files with an extension**

```gitignore
*.log
```

Ignores:

```text
error.log
app.log
debug.log
```

------

## **Ignore a specific folder**

```gitignore
build/
```

Ignores:

```text
build/
build/app.exe
build/temp/file.txt
```

The trailing `/` means “directory”.

------

## **Ignore all folders with a name**

```gitignore
bin/
```

Ignores every `bin` directory anywhere in the repository.

------

# **Wildcards**

## **`\*`** **— Any characters except** **`/`**

```gitignore
temp*
```

Matches:

```text
temp
temp1
temp_backup
```

------

## **`?`** **— Exactly one character**

```gitignore
file?.txt
```

Matches:

```text
file1.txt
fileA.txt
```

Does not match:

```text
file10.txt
```

------

## **Character ranges**

```gitignore
file[0-9].txt
```

Matches:

```text
file1.txt
file5.txt
```

------

# **Path Rules**

## **Ignore only in the repository root**

```gitignore
/config.json
```

Matches:

```text
config.json
```

Does not match:

```text
src/config.json
```

Leading `/` means “start from repository root”.

------

## **Ignore anywhere**

```gitignore
config.json
```

Matches:

```text
config.json
src/config.json
docs/config.json
```

------

## **Ignore files inside a specific directory**

```gitignore
logs/*.txt
```

Matches:

```text
logs/error.txt
```

Does not match:

```text
logs/archive/error.txt
```

------

## **Recursive matching with** **`\**`**

```gitignore
logs/**/*.txt
```

Matches:

```text
logs/error.txt
logs/archive/error.txt
logs/2026/june/error.txt
```

------

# **Exceptions (****`!`****)**

You can un-ignore files.

```gitignore
*.txt
!important.txt
```

All `.txt` files are ignored except:

```text
important.txt
```

------

Example:

```gitignore
docs/*
!docs/README.md
```

Ignore everything in `docs`, but keep `README.md`.

------

# **Comments**

```gitignore
# Ignore temporary files
*.tmp
```

Lines starting with `#` are comments.

------

# **Escaping Special Characters**

If a filename actually contains a special character:

```gitignore
\#notes.txt
```

Matches:

```text
#notes.txt
```

------

# **Common Real-World Example**

For a C# project:

```gitignore
# Build outputs
bin/
obj/

# User settings
*.user
*.suo

# Visual Studio
.vs/

# Logs
*.log

# macOS
.DS_Store

# JetBrains Rider
.idea/
```

# **Useful Commands**

See why a file is ignored:

```bash
git check-ignore -v MyFile.log
```

See tracked files:

```bash
git ls-files
```

Stop tracking a file that is already committed:

```bash
git rm --cached filename
```

------

A subtle but important rule: **`.gitignore`** **only affects untracked files.** If you’ve already committed a file, adding it to `.gitignore` won’t remove it from Git’s tracking until you use `git rm --cached`.