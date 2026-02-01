#!/bin/bash
# Create minimal Xcode project file

cat > VaultMacOS.xcodeproj/project.pbxproj << 'PROJEOF'
// !$*UTF8*$!
{
	archiveVersion = 1;
	classes = {
	};
	objectVersion = 56;
	objects = {
		rootObject = "PROJECT_ROOT";
		mainGroup = "MAIN_GROUP";
	};
	rootObject = "PROJECT_ROOT";
}
PROJEOF

echo "✅ Xcode project file created"
echo "⚠️  Note: This is a minimal project file."
echo "   Open with Xcode and it will auto-configure."
