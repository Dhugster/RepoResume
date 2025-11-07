# Icon Files

Place your icon files here. Required sizes:

## Required Files:
- `32x32.png` - Windows system tray (small)
- `128x128.png` - macOS/Linux
- `128x128@2x.png` - macOS retina
- `icon.icns` - macOS bundle icon
- `icon.ico` - Windows application icon
- `icon.png` - System tray icon

## Quick Setup:

### Option 1: Use Default (Simple GitHub Icon)
The build will work without custom icons using default Tauri icons.

### Option 2: Create Custom Icons

**Easy way - Use online converter:**
1. Create a single 512x512 PNG image
2. Go to https://icon.kitchen/ or https://www.appicon.co/
3. Upload your image
4. Download all sizes
5. Place files in this folder

**Manual way:**
1. Create a 512x512 PNG of your app icon
2. Use ImageMagick or similar to resize:
   ```bash
   convert icon-512.png -resize 32x32 32x32.png
   convert icon-512.png -resize 128x128 128x128.png
   ```

### Option 3: Use GitHub Logo

Download GitHub's logo:
- https://github.com/logos
- Use the mark (cat-octo) in monochrome for system tray
- Resize to required sizes

## File Formats:

- **PNG**: For all cross-platform icons
- **ICO**: Windows bundle (multi-resolution)
- **ICNS**: macOS bundle (multi-resolution)

## Default Build

If no icons are found, Tauri will use its default icon set. The app will still build and run fine, just with a generic icon.

## Testing Icons

After placing icons here:
```bash
cd desktop
npm run build
```

Check the generated exe/app to see your custom icon!

