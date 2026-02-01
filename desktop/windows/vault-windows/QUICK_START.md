# 🚀 VAULT Messenger - Quick Start Guide

## ⚡ Get Running in 5 Minutes

### Step 1: Prerequisites (2 minutes)

**Check if you have .NET SDK installed:**
```powershell
dotnet --version
```

**If not installed or version < 8.0:**
1. Download: https://dotnet.microsoft.com/download/dotnet/8.0
2. Run installer
3. Verify: `dotnet --version` (should show 8.0.x)

### Step 2: Configure (1 minute)

**Get Free Mailgun Account:**
1. Visit: https://signup.mailgun.com/new/signup
2. Sign up (NO credit card needed)
3. Copy API Key from dashboard
4. Copy sandbox domain (sandboxXXX.mailgun.org)

**Edit `VaultMessenger/appsettings.json`:**
```json
{
  "Email": {
    "ApiKey": "YOUR_KEY_HERE",
    "Domain": "YOUR_DOMAIN_HERE"
  }
}
```

### Step 3: Build & Run (2 minutes)

```bash
# Navigate to project
cd vault-windows

# Build and run
dotnet run --project VaultMessenger/VaultMessenger.csproj
```

**That's it! The app should launch** 🎉

---

## 📦 Create Distributable EXE

```bash
dotnet publish VaultMessenger/VaultMessenger.csproj -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -o ./dist
```

**Output:** `dist/VaultMessenger.exe` (~90MB, includes everything)

---

## 🆘 Troubleshooting

### "dotnet command not found"
- Install .NET 8 SDK from link above
- Restart terminal/PowerShell

### "Build failed"
- Run: `dotnet restore VaultMessenger.sln`
- Then: `dotnet build VaultMessenger.sln`

### "Email not sending"
- Check Mailgun API key is correct
- Verify you're using sandbox domain
- Add recipient to "Authorized Recipients" in Mailgun dashboard

### "Database error"
- Delete `vault.db` file if exists
- Restart application

---

## 📖 Full Documentation

- **README.md** - Complete feature list and documentation
- **BUILD_INSTRUCTIONS.md** - Detailed build & deployment guide
- **Development Plan** - https://www.genspark.ai/agents?id=6dc1dac6-376e-4eae-8425-54733c4ba0f1

---

## 🎯 Next Steps

1. **Customize** - Update branding, colors, icons
2. **Deploy Backend** - Set up relay server (see README.md)
3. **Test** - Try all features
4. **Distribute** - Create installer, share with users

Need help? Open an issue on GitHub!

**Happy Messaging! 🔒**
