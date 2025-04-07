
# HOW TO SET UP AND USE THE APP

---

##  What You Need (Only Once)

Before starting, install these two tools:

###  On **Windows**:
1. [Node.js](https://nodejs.org/en/download/) – download the Windows installer  
2. [Git for Windows](https://git-scm.com/download/win) – install with default settings  
3. Use **Command Prompt** or **Git Bash** (comes with Git) to run the app

###  On **Mac**:
1. [Node.js](https://nodejs.org/en/download/) – download the macOS installer  
2. Open **Terminal** (you can find it with Spotlight)

---

## 📁 Project Folder You’ll Get

You’ll receive a folder like this (probably as a ZIP file):

```
project-root/
├── backend/         ← handles Git commits + files
├── frontend/        ← the visual web app (React)
├── temp/            ← auto-created, don’t touch
└── your-repo/       ← the Git repo you want to browse
```

---

##  Setup Instructions (Once Per Device)

###  1. Start the Backend (Git data server)

1. Open **Terminal** or **Command Prompt**
2. Go to the backend folder:


```bash
cd path\to\project-root\backend
```

3. Install backend dependencies:

```bash
npm install
```

4. Start the backend server:

```bash
node index.js
```

 If it works, you'll see:

```
 Backend running on http://localhost:3001
```

>  If you get an error:  
> Open the file `backend/index.js`, and make sure the Git repo path is **correct and absolute**:  
```js
const git = simpleGit('C:/Users/you/Desktop/myrepo');
```

---

###  2. Start the Frontend (Web App)

1. Open **another Terminal window**
2. Go to the frontend folder:

```bash
cd path\to\project-root\frontend

```

3. Install frontend dependencies:

```bash
npm install
```

4. Start the React app:

```bash
npm start
```

 A browser tab will open to:
```
http://localhost:3000
```

---

##  How to Use the Web App

-  **Editor** → Select which commits you want to show
-  **Player** → View commit messages, file previews, and launch HTML games

 **Text files** show content  
 **Images** display directly  
 **.html** files have a **“Launch”** button to open them in a new tab

Your selected commits will be saved automatically (locally).

---

##  Common Problems

|  Problem                          |  Fix |
|------------------------------------|--------|
| `Cannot GET /commits`              | Make sure the **backend** is running |
| `404 on files`                     | That file doesn’t exist in that commit |
| `Port in use`                      | Restart your computer or change the port |
| Blank screen in browser            | Try restarting frontend with `npm start` again |
| Long errors when starting          | Double-check you ran `npm install` first |

---

##  Once Setup is Complete

Each time you want to run it:

```bash
cd backend
node index.js
```

In another terminal:

```bash
cd frontend
npm start
```

Then open:  
**http://localhost:3000** in your browser.

---