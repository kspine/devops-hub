export const PRODUCTION_COMMANDS = {
  clearUnityCache: {
    curl: `# Clear Unity Accelerator Local Cache directory
curl -X DELETE "http://10.128.24.112:5000/cache/clear?ttl=0" \\
  -H "X-Accelerator-Admin: true"
# Clean local cache storage
rm -rf ~/Library/Unity/AssetStore-5.x`,
    powershell: `# Request Accelerator purge via REST API and clear local cache path
Invoke-RestMethod -Method Delete -Uri "http://10.128.24.112:5000/cache/clear?ttl=0" -Headers @{"X-Accelerator-Admin"="true"}
Remove-Item -Recurse -Force "$env:LOCALAPPDATA/Unity/AssetStore-5.x"`
  }
};
