# RepoResume Desktop - Build Guide

## 🖥️ Desktop Application

RepoResume Desktop is a lightweight system tray application that runs in the background with minimal resources (~5-10MB RAM).

### Features
- ✅ Runs in system tray (Windows notification area)
- ✅ Minimize to tray - keeps running in background
- ✅ Low resource usage (Tauri vs Electron: 5MB vs 100MB)
- ✅ Single executable file
- ✅ Auto-start on system boot (optional)
- ✅ Background repository monitoring
- ✅ Desktop notifications for tasks
- ✅ Quick access from tray icon

## Prerequisites

### Windows
1. **Node.js 18+** - https://nodejs.org/
2. **Rust** - https://rustup.rs/
   ```powershell
   # Install Rust
   winget install Rustlang.Rustup
   # or download from rustup.rs
   ```
3. **Visual Studio Build Tools** (C++ tools)
   ```powershell
   # Install via winget
   winget install Microsoft.VisualStudio.2022.BuildTools
   ```

### macOS
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Xcode Command Line Tools
xcode-select --install
```

### Linux (Ubuntu/Debian)
```bash
# Install dependencies
sudo apt update
sudo apt install -y \
  libwebkit2gtk-4.0-dev \
  build-essential \
  curl \
  wget \
  file \
  libssl-dev \
  libgtk-3-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

## Quick Build

### 1. Install Dependencies

```bash
cd desktop
npm install
```

### 2. Build Desktop App

**Windows:**
```bash
npm run build:windows
```

**macOS:**
```bash
npm run build:mac
```

**Linux:**
```bash
npm run build:linux
```

### 3. Find Your Executable

The built application will be in:
- **Windows**: `desktop/src-tauri/target/release/repo-resume.exe` (~5-8MB)
- **macOS**: `desktop/src-tauri/target/release/bundle/dmg/RepoResume.app`
- **Linux**: `desktop/src-tauri/target/release/bundle/appimage/repo-resume.AppImage`

## Development Mode

Run in development mode (with hot reload):

```bash
cd desktop
npm run dev
```

This will:
1. Start the frontend dev server
2. Start the backend API server
3. Launch the Tauri desktop app
4. Enable hot reload for instant changes

## First Run Setup

### 1. Run the Executable

Double-click `repo-resume.exe` (Windows) or open the app bundle (macOS/Linux)

### 2. Initial Configuration

The app will:
1. Start minimized to system tray
2. Show tray icon (look for GitHub icon in notification area)
3. Start backend server automatically on `localhost:3001`
4. Wait for you to configure GitHub OAuth

### 3. GitHub OAuth Setup

**Option A: Use Desktop Redirect (Recommended)**

1. Go to https://github.com/settings/developers
2. Create new OAuth App:
   - **Application name**: RepoResume Desktop
   - **Homepage URL**: `http://localhost:3001`
   - **Callback URL**: `http://localhost:3001/api/auth/github/callback`
3. Copy Client ID and Secret
4. Right-click tray icon → Show Window
5. Login with GitHub

**Option B: Use Personal Access Token**

1. Go to https://github.com/settings/tokens
2. Generate new token (classic)
3. Select scopes: `repo`, `user:email`, `read:org`
4. Copy token
5. Right-click tray icon → Show Window → Settings → Paste token

## System Tray Features

Right-click the tray icon for quick actions:

- **Show Window** - Open main application window
- **Analyze Repositories** - Trigger analysis for all repos
- **Hide to Tray** - Minimize window to tray
- **Quit** - Exit application completely

## Auto-Start on Boot

### Windows

**Method 1: Task Scheduler (Recommended)**
```powershell
# Run PowerShell as Administrator
$action = New-ScheduledTaskAction -Execute "C:\Path\To\repo-resume.exe"
$trigger = New-ScheduledTaskTrigger -AtLogon
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries
Register-ScheduledTask -TaskName "RepoResume" -Action $action -Trigger $trigger -Settings $settings
```

**Method 2: Startup Folder**
1. Press `Win + R`
2. Type `shell:startup`
3. Create shortcut to `repo-resume.exe`

### macOS
```bash
# Create LaunchAgent
cat > ~/Library/LaunchAgents/com.reporesume.app.plist << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.reporesume.app</string>
    <key>ProgramArguments</key>
    <array>
        <string>/Applications/RepoResume.app/Contents/MacOS/repo-resume</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <false/>
</dict>
</plist>
EOF

# Load the agent
launchctl load ~/Library/LaunchAgents/com.reporesume.app.plist
```

### Linux
```bash
# Create autostart entry
mkdir -p ~/.config/autostart
cat > ~/.config/autostart/reporesume.desktop << EOF
[Desktop Entry]
Type=Application
Name=RepoResume
Exec=/path/to/repo-resume.AppImage
Hidden=false
NoDisplay=false
X-GNOME-Autostart-enabled=true
EOF
```

## Configuration

### Settings Location

Configuration is stored in:
- **Windows**: `%APPDATA%\com.reporesume.app\`
- **macOS**: `~/Library/Application Support/com.reporesume.app/`
- **Linux**: `~/.config/com.reporesume.app/`

### Database Location

SQLite database (if using local DB):
- **Windows**: `%APPDATA%\com.reporesume.app\database.sqlite`
- **macOS**: `~/Library/Application Support/com.reporesume.app/database.sqlite`
- **Linux**: `~/.config/com.reporesume.app/database.sqlite`

## Resource Usage

Typical resource usage:

| Component | RAM | CPU (Idle) | CPU (Active) |
|-----------|-----|------------|--------------|
| Tauri App | 5-10MB | <1% | 2-5% |
| Backend | 40-60MB | <1% | 10-20% |
| **Total** | **~50MB** | **<2%** | **15-25%** |

Compare to Electron: 150-200MB RAM minimum

## Keyboard Shortcuts

Global shortcuts (works even when window is hidden):

- `Ctrl+Shift+R` - Show/Hide main window
- `Ctrl+Shift+A` - Trigger repository analysis
- `Ctrl+Shift+Q` - Quick task view

## Notifications

Desktop notifications will appear for:
- ✅ Analysis complete
- 🔴 Critical/security tasks found
- ⚠️ High-priority tasks
- 📊 Daily summary (if enabled)

Configure in Settings → Notifications

## Background Monitoring

When minimized to tray, the app will:

1. **Auto-sync repositories** (configurable interval: 15min - 24hrs)
2. **Monitor for changes** via GitHub webhooks (if configured)
3. **Analyze on schedule** (daily/weekly)
4. **Send notifications** for critical issues
5. **Update health metrics** in background

CPU usage stays <1% when idle in tray.

## Updating the App

### Manual Update
1. Download new version
2. Close current app (Quit from tray)
3. Replace executable
4. Run new version

### Auto-Update (Future Feature)
The app will check for updates and prompt you to install.

## Building Custom Icons

To customize the tray icon:

1. Create icon files:
   - `32x32.png` - Windows small
   - `128x128.png` - macOS/Linux
   - `icon.ico` - Windows
   - `icon.icns` - macOS

2. Place in `desktop/src-tauri/icons/`

3. Rebuild:
   ```bash
   npm run build:windows
   ```

## Troubleshooting

### App Won't Start

**Check if backend is already running:**
```bash
# Windows
netstat -ano | findstr :3001

# Mac/Linux
lsof -i :3001
```

Kill process if needed and restart app.

### Tray Icon Not Showing

**Windows:**
- Check taskbar settings: Settings → Personalization → Taskbar → Select which icons appear
- Enable "RepoResume"

**Linux:**
- Install AppIndicator support:
  ```bash
  sudo apt install libayatana-appindicator3-1
  ```

### High Memory Usage

1. Check number of monitored repositories (Settings → Repositories)
2. Reduce sync frequency (Settings → Sync Interval)
3. Disable unused features (Settings → Background Tasks)

### Database Issues

Reset database (WARNING: deletes all local data):

**Windows:**
```powershell
Remove-Item "$env:APPDATA\com.reporesume.app\database.sqlite"
```

**macOS/Linux:**
```bash
rm ~/Library/Application\ Support/com.reporesume.app/database.sqlite
# or
rm ~/.config/com.reporesume.app/database.sqlite
```

## Advanced Configuration

### Custom Backend Port

Edit config file:
```json
{
  "backend": {
    "port": 3001,
    "host": "localhost"
  }
}
```

### Remote Backend

Connect to remote server instead of bundled backend:

1. Settings → Advanced → Remote Backend
2. Enter URL: `https://your-server.com`
3. Restart app

### Proxy Configuration

For corporate proxies:

```bash
# Set environment variables
export HTTP_PROXY=http://proxy.company.com:8080
export HTTPS_PROXY=http://proxy.company.com:8080
```

Then start the app.

## Performance Tips

1. **Reduce Repository Count**: Monitor only active projects
2. **Increase Sync Interval**: Set to 6-12 hours for rarely-changed repos
3. **Disable Unused Features**: Turn off notifications if not needed
4. **Use Filters**: Focus on specific file types or directories
5. **Periodic Cleanup**: Clear old completed tasks monthly

## Uninstalling

### Windows
1. Quit app from system tray
2. Delete executable
3. Optional: Delete config folder:
   ```powershell
   Remove-Item -Recurse "$env:APPDATA\com.reporesume.app"
   ```

### macOS
1. Quit app
2. Move app to Trash
3. Optional: Remove config:
   ```bash
   rm -rf ~/Library/Application\ Support/com.reporesume.app
   ```

### Linux
1. Quit app
2. Delete AppImage
3. Optional: Remove config:
   ```bash
   rm -rf ~/.config/com.reporesume.app
   ```

## Build from Source

Full build process:

```bash
# 1. Clone repository
git clone <your-repo>
cd AgeisTask

# 2. Install all dependencies
npm install
cd backend && npm install
cd ../frontend && npm install
cd ../desktop && npm install
cd ..

# 3. Build frontend
cd frontend
npm run build
cd ..

# 4. Build desktop app
cd desktop
npm run build:windows  # or build:mac / build:linux

# 5. Find executable
# Windows: desktop/src-tauri/target/release/repo-resume.exe
# Copy to desired location
```

## Distribution

To distribute to others:

1. Build release version
2. Test on clean system
3. Create installer (optional):
   - Windows: Use Inno Setup
   - macOS: Bundle in DMG
   - Linux: AppImage is portable

4. Sign executable (recommended for production)

## CI/CD Build

GitHub Actions workflow for automated builds:

```yaml
name: Build Desktop App

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    strategy:
      matrix:
        os: [windows-latest, macos-latest, ubuntu-latest]
    runs-on: ${{ matrix.os }}
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
      
      - name: Install dependencies
        run: |
          cd desktop
          npm install
      
      - name: Build
        run: |
          cd desktop
          npm run build
      
      - name: Upload artifact
        uses: actions/upload-artifact@v3
        with:
          name: repo-resume-${{ matrix.os }}
          path: desktop/src-tauri/target/release/bundle/
```

## FAQ

**Q: Can I run multiple instances?**
A: No, only one instance can run at a time (backend port conflict).

**Q: Does it work offline?**
A: Viewing cached data yes, but syncing/analyzing requires internet.

**Q: Can I use with GitHub Enterprise?**
A: Yes, configure custom GitHub URL in Settings → Advanced.

**Q: How do I backup my data?**
A: Copy the database file from the config folder.

**Q: Can I use multiple GitHub accounts?**
A: Currently one account per app instance. Run separate instances in different directories.

## Support

- 📖 Documentation: README.md, USER_GUIDE.md
- 🐛 Issues: GitHub Issues
- 💬 Discord: [Community Server]

---

**Enjoy your lightweight, always-running GitHub task manager!** 🚀

**Executable size:** ~5-8MB  
**RAM usage:** ~50MB total  
**CPU usage (idle):** <2%

