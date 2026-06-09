Yes, that configuration is valid.

Your git remote -v output means:

gitlab  https://gitlab.aranserver.com/SajadSK/reservecenter.git (fetch)
gitlab  https://gitlab.aranserver.com/SajadSK/reservecenter.git (push)
origin  https://github.com/SSK8K/Project-SAD.git (fetch)
origin  https://github.com/SSK8K/Project-SAD.git (push)
origin  https://gitlab.aranserver.com/SajadSK/reservecenter.git (push)

What happens now?

When you run:

git push origin

Git will push to both:

1. GitHub (Project-SAD.git)
2. GitLab (reservecenter.git)

because origin has two push URLs configured.

When you run:

git fetch origin
git pull origin main

Git will only fetch from:

https://github.com/SSK8K/Project-SAD.git

because there is only one fetch URL for origin.

⸻

How to view push URLs only

git remote get-url --all --push origin

Example output:

https://github.com/SSK8K/Project-SAD.git
https://gitlab.aranserver.com/SajadSK/reservecenter.git

⸻

How to change a push URL

Replace an existing push URL:

git remote set-url --push origin https://new-url.git

⚠️ This replaces all current push URLs with one URL.

⸻

How to add another push URL

git remote set-url --add --push origin https://another-url.git

⸻

How to remove a push URL

git remote set-url --delete --push origin https://gitlab.aranserver.com/SajadSK/reservecenter.git

⸻

A cleaner setup

Since you already have a separate gitlab remote, many developers prefer:

origin -> GitHub
gitlab -> GitLab

Then:

git push origin main

pushes only to GitHub, and

git push gitlab main

pushes only to GitLab.

Your current setup is perfectly fine if your goal is to mirror every push to both services automatically. Just remember that if one server is unavailable or rejects the push, Git will report an error for that destination.