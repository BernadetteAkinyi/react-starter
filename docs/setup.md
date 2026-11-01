# Setup

Get your computer ready before Week 1. Budget 45–60 minutes.

---

## 1. Install Node.js

React tooling runs on Node.js. Use **Node 20.19 or newer**; this course is tested
on **Node 24**.

### Recommended: use `nvm`

`nvm` lets you switch Node versions per project.

**macOS / Linux:**

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
# close and reopen the terminal, then:
nvm install 24
nvm use 24
```

**Windows:** install [nvm-windows](https://github.com/coreybutler/nvm-windows),
then:

```powershell
nvm install 24
nvm use 24
```

### Alternative: installer

Download the LTS installer from [nodejs.org](https://nodejs.org). Accept the
defaults.

### Verify

```bash
node -v   # v24.x.x (or v20.19+)
npm -v    # 10.x or newer
```

If `node -v` fails, close and reopen your terminal. If it still fails, reinstall
and make sure "Add to PATH" is enabled.

---

## 2. Install Git

Check whether Git is already installed:

```bash
git --version
```

If not:

- **Windows:** [Git for Windows](https://git-scm.com/download/win)
- **macOS:** `xcode-select --install` or [git-scm.com](https://git-scm.com/download/mac)
- **Linux:** `sudo apt install git` (Debian/Ubuntu) or your package manager

Set your identity once:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

Use the same email as your GitHub account.

---

## 3. Create a GitHub account and authenticate

If you do not have an account, create one at [github.com](https://github.com).

The easiest way to push code is **GitHub CLI**:

```bash
# macOS
brew install gh

# Windows
winget install --id GitHub.cli

# Ubuntu/Debian
sudo apt install gh

gh auth login
```

Choose **GitHub.com → HTTPS → Login with a web browser**.

If you cannot install GitHub CLI, use
[SSH keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
or a [personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)
with VS Code's Git integration.

---

## 4. Install VS Code

Download [Visual Studio Code](https://code.visualstudio.com/) and install it.

Install these extensions (Extensions view: `Ctrl/Cmd + Shift + X`):

| Extension | Why |
| --- | --- |
| ESLint | Shows code problems as you type |
| Prettier | Formats code consistently |
| Vitest | Runs and debugs tests from the editor |

Optional but useful:

- **React Developer Tools** — browser extension for Chrome/Firefox
- **Error Lens** — shows errors inline
- **GitLens** — richer Git history

Enable format on save:

1. Open Settings (`Ctrl/Cmd + ,`).
2. Search for `format on save`.
3. Tick **Editor: Format On Save**.
4. Set **Editor: Default Formatter** to **Prettier**.

---

## 5. Clone the course repository

The instructor will add you as a collaborator. Accept the invitation, then:

```bash
cd ~/Desktop          # or wherever you keep projects
git clone https://github.com/ejao-000/react-starter.git
cd react-starter
```

> If you are working from a fork, clone your fork instead, and add the original
> as `upstream`:
>
> ```bash
> git remote add upstream https://github.com/ejao-000/react-starter.git
> ```

---

## 6. Install dependencies and run the app

```bash
npm install
npm run dev
```

You should see:

```text
  VITE v8.x  ready in ... ms

  ➜  Local:   http://localhost:5173/
```

Open the URL. You should see the TaskFlow starter: a cream background, the
headline "Make room for what matters.", and four sample tasks.

### The four commands you will use all course

```bash
npm run dev     # start the development server
npm test        # run tests once
npm run lint    # find code-quality problems
npm run build   # create a production build in dist/
```

Run all three checks before every pull request:

```bash
npm run lint && npm test && npm run build
```

---

## 7. Tour the starter

Open `src/` in VS Code. The important files:

```text
src/
├── main.jsx              # Starts React and mounts <App />
├── App.jsx               # Page layout and sample data
├── components/
│   ├── Header.jsx
│   ├── TaskList.jsx
│   └── TaskItem.jsx
├── data/
│   └── seedTasks.js      # Temporary hard-coded tasks
├── test/
│   └── setup.js          # Adds jest-dom matchers
├── App.test.jsx
└── styles.css
```

Trace the data:

1. `App.jsx` imports `seedTasks`.
2. `App` passes `tasks={seedTasks}` to `TaskList`.
3. `TaskList` maps over the array and renders one `TaskItem` per task.
4. `TaskItem` receives a single `task` prop.

That is the core of React: **data flows down through props; UI is a function of
that data.**

---

## 8. Open the React DevTools

Install the React Developer Tools browser extension, open the app, and open your
browser DevTools. You should see a **Components** tab and a **Profiler** tab.

Select `<App />` and inspect its props and hooks. You will use this constantly in
Weeks 2–5 to see state change.

---

## 9. Deploy accounts (for Week 8)

Create a free account on one of these now, so deployment is not a blocker later:

- [Vercel](https://vercel.com/signup) — recommended
- [Netlify](https://app.netlify.com/signup)

Sign in with GitHub. No payment details are required.

---

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `node: command not found` | Node is not on your PATH. Reopen the terminal; reinstall if needed. |
| `npm ERR! code ENOENT` | You are in the wrong folder. `cd react-starter` first. |
| `Port 5173 is in use` | Run `npm run dev -- --port 5174`, or stop the other server. |
| `EACCES` permission errors on macOS/Linux | Do not use `sudo npm`. Fix npm's prefix or use `nvm`. |
| Blank page after starting | Open the browser console. Read the first error, not the last. |
| `Module not found` | Check the import path and file extension; restart the dev server. |
| Weird errors after pulling | `rm -rf node_modules package-lock.json && npm install` |
| Git asks for a password | GitHub no longer accepts passwords. Use `gh auth login` or an SSH key. |
| Tests fail only in CI | Run `npm ci` locally, then lint, test, and build. Check the exact Node version. |

Still stuck? Follow the debugging steps in
[`docs/faq.md`](faq.md), then ask in the cohort channel with:

1. The exact error message.
2. The file and line number.
3. What you expected and what happened.
4. What you already tried.

---

## Checklist before Week 1

- [ ] `node -v` shows v20.19+ or newer
- [ ] `git --version` works
- [ ] GitHub account is authenticated (`gh auth status`)
- [ ] VS Code is installed with ESLint and Prettier
- [ ] `npm install` completes without errors
- [ ] `npm run dev` opens TaskFlow at `localhost:5173`
- [ ] `npm test` passes (2 tests)
- [ ] React DevTools shows the Components tab
- [ ] You can explain what `App` passes to `TaskList`

Welcome. You are ready.
