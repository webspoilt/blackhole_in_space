# VAULT Messenger - Complete Build & Deployment Guide

## 🎯 Quick Build (5 Minutes)

### Prerequisites Check
```powershell
# Check .NET SDK version (must be 8.0+)
dotnet --version

# If not installed, download from: https://dotnet.microsoft.com/download/dotnet/8.0
```

### One-Command Build
```bash
# Navigate to project directory
cd vault-windows

# Build everything (this will restore packages, build, and publish)
dotnet publish VaultMessenger/VaultMessenger.csproj -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -p:IncludeNativeLibrariesForSelfExtract=true -o ./dist
```

**Output**: Executable will be in `dist/VaultMessenger.exe` (ready to distribute)

---

## 📦 Step-by-Step Build Process

### Step 1: Clone/Extract Project
```bash
# If from Git
git clone https://github.com/webspoilt/vault-windows.git
cd vault-windows

# If from ZIP
unzip VaultMessenger-Source-v1.0.0.zip
cd VaultMessenger-Source-v1.0.0
```

### Step 2: Configure Settings

Edit `VaultMessenger/appsettings.json`:

```json
{
  "Email": {
    "ApiKey": "YOUR_MAILGUN_KEY_HERE",
    "Domain": "YOUR_MAILGUN_DOMAIN_HERE"
  },
  "RelayServer": {
    "WebSocketUrl": "wss://your-server.com/v1/stream",
    "ApiUrl": "https://your-server.com/v1"
  }
}
```

### Step 3: Restore Dependencies
```bash
dotnet restore VaultMessenger.sln
```

### Step 4: Build Solution
```bash
# Debug build (for development)
dotnet build VaultMessenger.sln -c Debug

# Release build (optimized)
dotnet build VaultMessenger.sln -c Release
```

### Step 5: Run Application (Development)
```bash
dotnet run --project VaultMessenger/VaultMessenger.csproj
```

### Step 6: Publish for Distribution
```bash
# Create self-contained executable
dotnet publish VaultMessenger/VaultMessenger.csproj \
  -c Release \
  -r win-x64 \
  --self-contained true \
  -p:PublishSingleFile=true \
  -p:IncludeNativeLibrariesForSelfExtract=true \
  -p:EnableCompressionInSingleFile=true \
  -o ./publish/windows-x64

# Output: publish/windows-x64/VaultMessenger.exe (~80-100 MB)
```

---

## 🏗️ Advanced Build Options

### Multi-Architecture Build

#### For 64-bit Windows (Most Common)
```bash
dotnet publish -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -o ./publish/win-x64
```

#### For 32-bit Windows (Legacy Systems)
```bash
dotnet publish -c Release -r win-x86 --self-contained true -p:PublishSingleFile=true -o ./publish/win-x86
```

#### For ARM64 Windows (Surface Pro X, etc.)
```bash
dotnet publish -c Release -r win-arm64 --self-contained true -p:PublishSingleFile=true -o ./publish/win-arm64
```

### Framework-Dependent Build (Smaller Size)

**Requirements**: User must have .NET 8 Runtime installed

```bash
dotnet publish -c Release -r win-x64 --self-contained false -p:PublishSingleFile=true -o ./publish/framework-dependent

# Size: ~10-15 MB (vs 80-100 MB for self-contained)
```

### ReadyToRun Compilation (Faster Startup)
```bash
dotnet publish -c Release -r win-x64 --self-contained true \
  -p:PublishSingleFile=true \
  -p:PublishReadyToRun=true \
  -p:PublishTrimmed=false \
  -o ./publish/optimized
```

---

## 📦 Creating Installer

### Option 1: Inno Setup (Free, Open Source)

1. **Download Inno Setup**
   - Visit: https://jrsoftware.org/isdl.php
   - Download and install Inno Setup 6.x

2. **Create Installer Script**

Save as `installer.iss`:

```iss
#define MyAppName "VAULT Messenger"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "VAULT Systems"
#define MyAppURL "https://vault-messaging.com"
#define MyAppExeName "VaultMessenger.exe"

[Setup]
AppId={{A5B8C9D1-2E3F-4A5B-8C9D-1E2F3A4B5C6D}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={autopf}\{#MyAppName}
DefaultGroupName={#MyAppName}
AllowNoIcons=yes
LicenseFile=LICENSE.txt
OutputDir=installer
OutputBaseFilename=VaultMessenger-Setup-v{#MyAppVersion}
SetupIconFile=VaultMessenger\Assets\vault-icon.ico
Compression=lzma2/ultra64
SolidCompression=yes
WizardStyle=modern
PrivilegesRequired=lowest
ArchitecturesAllowed=x64
ArchitecturesInstallIn64BitMode=x64

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
Source: "publish\windows-x64\{#MyAppExeName}"; DestDir: "{app}"; Flags: ignoreversion
Source: "publish\windows-x64\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"
Name: "{group}\{cm:UninstallProgram,{#MyAppName}}"; Filename: "{uninstallexe}"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent
```

3. **Compile Installer**
```powershell
# From command line
"C:\Program Files (x86)\Inno Setup 6\ISCC.exe" installer.iss

# Or right-click installer.iss → Compile
```

4. **Output**
- Location: `installer/VaultMessenger-Setup-v1.0.0.exe`
- Size: ~85-105 MB
- Includes uninstaller

### Option 2: WiX Toolset (Industry Standard)

1. **Install WiX**
```powershell
dotnet tool install --global wix
```

2. **Create Product.wxs**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Wix xmlns="http://schemas.microsoft.com/wix/2006/wi">
  <Product Id="*" Name="VAULT Messenger" Language="1033" Version="1.0.0.0" 
           Manufacturer="VAULT Systems" UpgradeCode="A5B8C9D1-2E3F-4A5B-8C9D-1E2F3A4B5C6D">
    <Package InstallerVersion="200" Compressed="yes" InstallScope="perUser" />
    
    <MajorUpgrade DowngradeErrorMessage="A newer version is already installed." />
    <MediaTemplate EmbedCab="yes" />

    <Feature Id="ProductFeature" Title="VAULT Messenger" Level="1">
      <ComponentGroupRef Id="ProductComponents" />
    </Feature>

    <Directory Id="TARGETDIR" Name="SourceDir">
      <Directory Id="LocalAppDataFolder">
        <Directory Id="INSTALLFOLDER" Name="VAULT Messenger" />
      </Directory>
      <Directory Id="ProgramMenuFolder">
        <Directory Id="ApplicationProgramsFolder" Name="VAULT Messenger"/>
      </Directory>
    </Directory>

    <ComponentGroup Id="ProductComponents" Directory="INSTALLFOLDER">
      <Component Id="VaultMessenger.exe" Guid="*">
        <File Id="VaultMessenger.exe" Source="publish\windows-x64\VaultMessenger.exe" KeyPath="yes" />
      </Component>
    </ComponentGroup>
  </Product>
</Wix>
```

3. **Build MSI**
```powershell
wix build Product.wxs -out VaultMessenger-v1.0.0.msi
```

### Option 3: ClickOnce (Auto-Update)

```bash
# Create ClickOnce deployment
dotnet publish VaultMessenger/VaultMessenger.csproj \
  -c Release \
  -p:PublishProtocol=ClickOnce \
  -p:PublishUrl="https://releases.vault-messaging.com/" \
  -p:ApplicationVersion=1.0.0.0
```

---

## 🧪 Testing Build

### Automated Tests
```bash
# Run all tests
dotnet test VaultMessenger.Tests/VaultMessenger.Tests.csproj

# With detailed output
dotnet test --verbosity detailed

# Generate coverage report
dotnet test --collect:"XPlat Code Coverage" --results-directory ./coverage
```

### Manual Testing Checklist

After building, test these scenarios:

- [ ] Application launches successfully
- [ ] Registration with email verification works
- [ ] Login with credentials works
- [ ] Send/receive text messages
- [ ] Send image/file attachments
- [ ] Voice call initiation
- [ ] Settings persistence
- [ ] Auto-lock timeout
- [ ] Disappearing messages
- [ ] Contact management

---

## 🚀 Deployment Options

### Option 1: GitHub Releases

```bash
# Tag release
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# Create release on GitHub with:
# - VaultMessenger-Setup-v1.0.0.exe (installer)
# - VaultMessenger-Portable-v1.0.0.zip (portable version)
# - VaultMessenger-Source-v1.0.0.zip (source code)
```

### Option 2: Microsoft Store

1. Create Microsoft Partner Center account
2. Reserve app name "VAULT Messenger"
3. Create MSIX package:
```bash
dotnet publish -c Release -r win10-x64 -p:RuntimeIdentifier=win10-x64 -p:PublishSingleFile=false --self-contained true
```
4. Package with Windows Application Packaging Project
5. Submit to Store

### Option 3: Direct Download (Website)

Host these files on your website:
```
https://vault-messaging.com/downloads/
├── VaultMessenger-Setup-v1.0.0.exe (installer)
├── VaultMessenger-Portable-v1.0.0.zip (no install)
└── checksums.txt (SHA256 hashes)
```

Generate checksums:
```powershell
# PowerShell
Get-FileHash VaultMessenger-Setup-v1.0.0.exe -Algorithm SHA256
```

---

## 🔐 Code Signing (Optional but Recommended)

### Why Sign?
- Prevents "Unknown Publisher" warnings
- Builds user trust
- Required for some deployment channels

### Get Certificate

**Option 1: DigiCert/Sectigo** (Paid, ~$200/year)
- Trusted by Windows by default
- Best for commercial distribution

**Option 2: Let's Encrypt** (Free, but limited)
- Code signing certificates not available directly
- Consider alternatives like SignPath

**Option 3: Self-Signed** (Development Only)
```powershell
# Create self-signed certificate
$cert = New-SelfSignedCertificate -Type CodeSigningCert -Subject "CN=VAULT Systems" -CertStoreLocation Cert:\CurrentUser\My

# Export certificate
Export-Certificate -Cert $cert -FilePath VaultSystems.cer
```

### Sign Executable
```powershell
# Using signtool (Windows SDK required)
signtool sign /f MyCertificate.pfx /p PASSWORD /t http://timestamp.digicert.com VaultMessenger.exe

# Verify signature
signtool verify /pa VaultMessenger.exe
```

---

## 📊 Build Performance Tips

### Speed Up Builds

1. **Use Build Cache**
```bash
# Enable local cache
dotnet build -p:UseSharedCompilation=true
```

2. **Parallel Builds**
```bash
dotnet build -m:4  # Use 4 parallel builds
```

3. **Skip Tests During Build**
```bash
dotnet build -p:RunTests=false
```

### Reduce Output Size

1. **Enable Trimming** (⚠️ Test thoroughly!)
```bash
dotnet publish -c Release -r win-x64 --self-contained true \
  -p:PublishSingleFile=true \
  -p:PublishTrimmed=true \
  -p:TrimMode=link
```

2. **Compression**
```bash
# Already enabled in csproj:
<EnableCompressionInSingleFile>true</EnableCompressionInSingleFile>
```

---

## 🐛 Troubleshooting Build Issues

### Issue: "SDK not found"
```bash
# Solution: Install .NET 8 SDK
winget install Microsoft.DotNet.SDK.8
```

### Issue: "Package restore failed"
```bash
# Solution: Clear NuGet cache
dotnet nuget locals all --clear
dotnet restore --force
```

### Issue: "SQLCipher native library not found"
```bash
# Solution: Manually copy SQLitePCLRaw.lib.e_sqlcipher DLL
# It should be in: runtimes/win-x64/native/e_sqlcipher.dll
```

### Issue: "MaterialDesign themes not loading"
```bash
# Solution: Ensure these packages are installed:
dotnet add package MaterialDesignThemes --version 5.0.0
dotnet add package MaterialDesignColors --version 3.0.0
```

### Issue: "Single file publish fails"
```bash
# Solution: Use without embedding native libraries
dotnet publish -p:IncludeNativeLibrariesForSelfExtract=false -p:IncludeAllContentForSelfExtract=true
```

---

## 📝 Build Checklist

Before releasing:

### Pre-Build
- [ ] Update version in VaultMessenger.csproj
- [ ] Update CHANGELOG.md
- [ ] Configure appsettings.json
- [ ] Verify all dependencies are up-to-date
- [ ] Run security audit: `dotnet list package --vulnerable`

### Build
- [ ] Clean solution: `dotnet clean`
- [ ] Restore packages: `dotnet restore`
- [ ] Build release: `dotnet build -c Release`
- [ ] Run tests: `dotnet test`
- [ ] Publish executable: `dotnet publish -c Release`

### Post-Build
- [ ] Test on clean Windows machine
- [ ] Verify all features work
- [ ] Check antivirus doesn't flag (VirusTotal.com)
- [ ] Generate checksums
- [ ] Create installer
- [ ] Sign executable (if certificate available)
- [ ] Upload to distribution channel

---

## 💡 Next Steps

1. **Customize Branding**
   - Replace icon in `Assets/vault-icon.ico`
   - Update colors in `App.xaml`
   - Modify splash screen

2. **Configure Backend**
   - Deploy relay server (see README.md)
   - Set up Mailgun account
   - Update appsettings.json URLs

3. **Test Thoroughly**
   - Run on Windows 10 and 11
   - Test with real users
   - Collect feedback

4. **Distribute**
   - Create installer
   - Upload to GitHub Releases
   - Update website download links

---

**Need Help?**
- Issues: https://github.com/webspoilt/vault-windows/issues
- Discussions: https://github.com/webspoilt/vault-windows/discussions
- Email: dev@vault-messaging.com

Good luck with your build! 🚀
