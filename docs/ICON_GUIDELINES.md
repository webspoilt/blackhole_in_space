# VAULT Icon Guidelines

## Source Files

The master icon file is located at:
- `desktop/macos/icons/icon_1024x1024.png` (1024x1024 source)

---

## macOS (ICNS)

### Required Sizes
| Filename | Size | Retina |
|----------|------|--------|
| `icon_16x16.png` | 16x16 | No |
| `icon_16x16@2x.png` | 32x32 | Yes |
| `icon_32x32.png` | 32x32 | No |
| `icon_32x32@2x.png` | 64x64 | Yes |
| `icon_128x128.png` | 128x128 | No |
| `icon_128x128@2x.png` | 256x256 | Yes |
| `icon_256x256.png` | 256x256 | No |
| `icon_256x256@2x.png` | 512x512 | Yes |
| `icon_512x512.png` | 512x512 | No |
| `icon_512x512@2x.png` | 1024x1024 | Yes |

### Build Command (macOS only)
```bash
# Create iconset folder
mkdir vault.iconset

# Scale source image to all sizes (using sips or ImageMagick)
sips -z 16 16 icon_1024x1024.png --out vault.iconset/icon_16x16.png
sips -z 32 32 icon_1024x1024.png --out vault.iconset/icon_16x16@2x.png
# ... repeat for all sizes

# Convert to ICNS
iconutil -c icns vault.iconset -o vault.icns
```

---

## Windows (ICO)

### Required Sizes
| Size | Purpose |
|------|---------|
| 16x16 | Small icon (taskbar, file explorer) |
| 32x32 | Standard icon |
| 48x48 | Large icon |
| 64x64 | Extra large |
| 128x128 | Jumbo icon |
| 256x256 | High-DPI / 4K displays |

### Build Command (using ImageMagick)
```bash
magick convert icon_1024x1024.png -define icon:auto-resize=256,128,64,48,32,16 vault.ico
```

---

## Linux

### Standard Locations
```
~/.local/share/icons/hicolor/16x16/apps/vault.png
~/.local/share/icons/hicolor/32x32/apps/vault.png
~/.local/share/icons/hicolor/48x48/apps/vault.png
~/.local/share/icons/hicolor/64x64/apps/vault.png
~/.local/share/icons/hicolor/128x128/apps/vault.png
~/.local/share/icons/hicolor/256x256/apps/vault.png
~/.local/share/icons/hicolor/512x512/apps/vault.png
```

### Desktop Entry
```ini
[Desktop Entry]
Name=VAULT
Exec=/opt/vault/vault
Icon=vault
Type=Application
Categories=Network;Security;
```

---

## Mobile Apps

### iOS (App Store)
| Size | Purpose |
|------|---------|
| 1024x1024 | App Store listing |
| 180x180 | iPhone @3x |
| 120x120 | iPhone @2x |
| 167x167 | iPad Pro |
| 152x152 | iPad @2x |
| 76x76 | iPad @1x |

### Android
| Folder | Size |
|--------|------|
| mipmap-mdpi | 48x48 |
| mipmap-hdpi | 72x72 |
| mipmap-xhdpi | 96x96 |
| mipmap-xxhdpi | 144x144 |
| mipmap-xxxhdpi | 192x192 |

---

## Notes

- The icon uses a **black background** with a **white shield/V** design
- Rounded corners are pre-baked for iOS-style display
- For platforms that auto-round (iOS), provide square icons and let the OS apply masking
