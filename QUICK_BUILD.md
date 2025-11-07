# 🚀 Quick Build Guide - Windows

## Method 1: Automated Script (Easiest!)

**Just double-click:**
```
build-desktop.bat
```

This script will:
1. ✅ Check if Node.js and Rust are installed
2. ✅ Install all dependencies automatically
3. ✅ Build the desktop executable
4. ✅ Show you where to find the .exe file

**That's it!** The executable will be at:
```
desktop\src-tauri\target\release\repo-resume.exe
```

---

## Method 2: Manual Steps

### Prerequisites Check

**1. Install Node.js (if not installed):**
- Download from: https://nodejs.org/
- Version 18 or higher required
- Verify: `node --version`

**2. Install Rust (if not installed):**
- Download from: https://rustup.rs/
- Run `rustup-init.exe`
- **Important:** Restart PowerShell/CMD after installation
- Verify: `rustc --version`

### Build Steps

```powershell
# 1. Navigate to project folder
cd C:\Users\Owner\AgeisTask\AgeisTask

# 2. Install all dependencies (one-time)
.\install-all.bat

# 3. Build desktop app
npm run build:desktop:windows
```

---

## Troubleshooting

### Error: "Cannot find package '@vitejs/plugin-react'"

**Solution:**
```powershell
cd frontend
npm install
cd ..
```

### Error: "Rust not found"

**Solution:**
1. Install Rust from https://rustup.rs/
2. **Restart your terminal/PowerShell**
3. Verify: `rustc --version`
4. Try building again

### Error: "Visual C++ Build Tools required"

**Solution:**
```powershell
# Install via winget
winget install Microsoft.VisualStudio.2022.BuildTools

# Or download from:
# https://visualstudio.microsoft.com/downloads/
```

### Build Takes Too Long?

**First build:** 5-10 minutes (compiling Rust)
**Subsequent builds:** 1-2 minutes

This is normal! Rust compilation is slow the first time.

### Port 3001 Already in Use?

```powershell
# Find what's using it
netstat -ano | findstr :3001

# Kill the process (replace PID with actual number)
taskkill /PID [PID] /F
```

---

## What Gets Built?

After successful build, you'll have:

```
desktop/src-tauri/target/release/
├── repo-resume.exe          ← Your executable! (~5-8MB)
└── (other build artifacts)
```

**The .exe file is:**
- ✅ Self-contained (no installer needed)
- ✅ Portable (copy anywhere)
- ✅ Ready to run (double-click)

---

## Running Your App

1. **Double-click** `repo-resume.exe`
2. **Look for icon** in system tray (bottom-right, near clock)
3. **Right-click icon** → Show Window
4. **Login** with GitHub OAuth

---

## Next Steps After Build

### Add to Startup (Optional)

**Easy way:**
1. Press `Win + R`
2. Type: `shell:startup`
3. Create shortcut to `repo-resume.exe`

Now it starts automatically when you login!

### First-Time Setup

1. **GitHub OAuth:**
   - Go to https://github.com/settings/developers
   - Create OAuth App
   - Callback URL: `http://localhost:3001/api/auth/github/callback`
   - Copy Client ID & Secret
   - Create `.env` file (see SETUP_GUIDE.md)

2. **Or use Personal Token:**
   - Generate token at https://github.com/settings/tokens
   - Enter in app Settings

---

## File Sizes

| Component | Size |
|-----------|------|
| Executable | ~5-8MB |
| Total with dependencies | ~50MB |
| RAM usage (running) | ~50MB |

**Much smaller than Electron apps!** (which are 100-200MB)

---

## Need Help?

- 📖 **Full Guide:** DESKTOP_BUILD_GUIDE.md
- 🚀 **Quick Start:** DESKTOP_QUICKSTART.md
- 🐛 **Issues:** Check error messages above

---

**Happy Building!** 🎉

