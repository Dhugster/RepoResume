# 🖥️ RepoResume Desktop - Quick Start

## Build Your Executable (Windows)

### 1. Install Prerequisites

**Install Rust (one-time setup):**
```powershell
# Open PowerShell and run:
winget install Rustlang.Rustup
```

After installation, close and reopen PowerShell.

### 2. Build the Desktop App

```powershell
# From the project root
npm run build:desktop:windows
```

This will:
- ✅ Build the frontend
- ✅ Compile Rust backend
- ✅ Create a single executable (~5-8MB)
- ⏱️ Takes 2-5 minutes first time, faster after

### 3. Find Your Executable

```
desktop/src-tauri/target/release/repo-resume.exe
```

**That's it!** This is your complete application in a single file.

### 4. Run It

1. Double-click `repo-resume.exe`
2. Look for the GitHub icon in your system tray (bottom-right corner, near clock)
3. Right-click the icon → **Show Window**
4. Follow the GitHub OAuth setup

## What Happens When You Run It?

1. **App starts minimized** to system tray
2. **Backend server starts automatically** on localhost:3001
3. **Database created** in your AppData folder
4. **Tray icon appears** - your app is running!

## System Tray Controls

Right-click the tray icon:

- **Show Window** - Open the app
- **Analyze Repositories** - Scan all repos
- **Hide to Tray** - Minimize (keeps running)
- **Quit** - Close completely

## Resource Usage

- **Memory**: ~50MB total (vs 150MB+ for Electron apps)
- **CPU**: <2% when idle
- **Disk**: ~8MB executable + database

## Run on Startup

**Easy way:**
1. Press `Win + R`
2. Type: `shell:startup`
3. Create a shortcut to `repo-resume.exe`

Now it starts automatically when you login!

## Moving the Executable

You can move `repo-resume.exe` anywhere:
- Desktop
- Program Files
- USB drive (portable!)

It's self-contained and requires no installation.

## First-Time Setup

### Option 1: GitHub OAuth (Recommended)

1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - Name: `RepoResume Desktop`
   - Homepage: `http://localhost:3001`
   - Callback: `http://localhost:3001/api/auth/github/callback`
4. Copy Client ID & Secret
5. Create `.env` file in same folder as exe:
   ```
   GITHUB_CLIENT_ID=your_client_id
   GITHUB_CLIENT_SECRET=your_secret
   SESSION_SECRET=any-random-string-32-chars-long
   ```
6. Restart the app
7. Click "Login with GitHub" in the app

### Option 2: Personal Access Token (Simpler)

1. Go to https://github.com/settings/tokens
2. Generate new token (classic)
3. Select scopes: `repo`, `user`, `read:org`
4. Copy token
5. In app: Settings → Enter token

## Daily Use

**The app runs in the background:**

1. **Minimized to tray** - uses minimal resources
2. **Auto-syncs repositories** - checks for updates
3. **Notifies you** - when high-priority tasks found
4. **Always ready** - click tray icon to view tasks

**Quick access anytime:**
- Click tray icon to show/hide
- Or use keyboard shortcut: `Ctrl+Shift+R`

## Updating

When a new version is released:
1. Download new `repo-resume.exe`
2. Quit current app (right-click tray → Quit)
3. Replace old exe with new one
4. Run new version

Your data is preserved (stored separately in AppData).

## Troubleshooting

### Can't find tray icon?
- Look in the "hidden icons" area (up arrow near clock)
- Windows Settings → Taskbar → Select which icons appear

### Port 3001 already in use?
```powershell
# Find what's using it:
netstat -ano | findstr :3001

# Kill it:
taskkill /PID [number] /F
```

### Build failed?
Make sure Rust is installed:
```powershell
rustc --version
```

If not found, restart PowerShell after installing Rust.

### High memory usage?
- Settings → Reduce number of monitored repos
- Settings → Increase sync interval (e.g., 12 hours)

## Uninstall

1. Right-click tray icon → Quit
2. Delete `repo-resume.exe`
3. (Optional) Delete config folder:
   ```powershell
   Remove-Item -Recurse "$env:APPDATA\com.reporesume.app"
   ```

No registry entries, no leftovers!

## Next Steps

- Read **DESKTOP_BUILD_GUIDE.md** for advanced features
- Configure auto-sync intervals
- Set up desktop notifications
- Customize tray icon behavior

---

**Enjoy your lightweight, always-on GitHub task manager!** 🚀

**File size:** ~8MB  
**RAM usage:** ~50MB  
**Startup time:** <2 seconds

