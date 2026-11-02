# itadimaigal — GitHub Actions CI/CD demo

The working example from Professor SK's video **"GitHub Actions: Complete CI/CD from Scratch"**.

It is a tiny Node.js web API (a shopping-cart total with a premium discount) with tests, a Dockerfile,
and a full set of GitHub Actions workflows you can copy into your own projects.

## What's inside

```
src/cart.js                 business logic
src/server.js               HTTP API: GET /health, GET /total?prices=100,200&sale=1,0&premium=true
test/*.test.js              7 tests using Node's built-in test runner (no dependencies)
scripts/build.js            builds a static status page into dist/
Dockerfile                  container image for the API
.github/workflows/
  01-hello.yml              your first workflow: triggers, runners, contexts
  02-ci.yml                 CI: matrix tests (2 OS x 2 Node versions), caching, artifacts, job summary
  reusable-test.yml         a reusable workflow (workflow_call)
  03-cd.yml                 CD: Docker image to ghcr.io, GitHub Pages deploy, SSH deploy with approval
  04-nightly.yml            scheduled run (cron) that calls the reusable workflow
```

## Run it locally

Needs Node.js 22 or newer.

```bash
npm ci
npm test
npm start          # http://localhost:3000/health
npm run build      # writes dist/index.html
```

## Run it on GitHub (10 minutes)

1. Create a new **public** repository on GitHub (public repos get free Actions minutes on standard runners).
2. Push this folder to it:
   ```bash
   git init -b main
   git add .
   git commit -m "GitHub Actions demo"
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
3. Open the **Actions** tab. `01 Hello Actions`, `02 CI` and `03 CD` start on their own.
4. **GitHub Pages** (one time): Settings → Pages → Build and deployment → Source: **GitHub Actions**.
   Then re-run `03 CD` (Actions → 03 CD → Run workflow). The `pages` job prints your site's URL.
5. **Docker image**: after `03 CD` finishes, the image appears under your profile → Packages,
   as `ghcr.io/<you>/<repo>:<commit sha>`.

### Optional: deploy to your own server with an approval gate

The `production` job is skipped until you configure it.

1. A Linux server with Docker installed and SSH access.
2. Create an SSH key pair just for deployments and add the **public** key to the server's
   `~/.ssh/authorized_keys`.
3. Settings → Environments → **New environment** named `production`.
   Tick **Required reviewers** and add yourself, so every production deploy waits for your approval.
   (Required reviewers are free on public repositories; private ones need a paid plan.)
4. In the `production` environment add the secret `DEPLOY_SSH_KEY` — the **private** key.
   Then under Settings → Secrets and variables → Actions → **Variables** (repository variables,
   because the job's `if:` is checked before it enters the environment) add:
   - `DEPLOY_HOST` — the server's IP or domain
   - `DEPLOY_USER` — the SSH user
5. Let the server pull the image: either make the package public (Packages → package settings →
   Change visibility) or run `docker login ghcr.io` on the server with a personal access token
   that has `read:packages`.
6. Push to `main`. After the Docker job, the run pauses with **Review deployments** — approve it, and
   the job deploys and smoke-tests `http://<DEPLOY_HOST>/health`.

### Protect main

Settings → Branches → Add branch ruleset (or classic branch protection) for `main`:
require a pull request, and require the `02 CI` test checks to pass before merging.

## Try it yourself

- Break a test (change `290` to `300` in `test/cart.test.js`), push to a branch, open a pull request,
  and watch CI block the merge. Fix it and watch it turn green.
- Add Node `26` to the matrix in `02-ci.yml`.
- Run `04 Nightly` by hand from the Actions tab.

## Keep in mind

- Action versions (`actions/checkout@v4` and so on) were current when this was made. GitHub
  updates them; check each action's page for the latest major version.
- Free minutes, storage and pricing for private repositories change over time; see GitHub's
  Actions billing page for current numbers.
- Never put passwords or keys in workflow files. Use repository or environment **secrets**.
