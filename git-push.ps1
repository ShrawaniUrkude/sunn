Set-Location "C:\Users\shraw\Desktop\sun\sunn"

# Remove any merge state
if (Test-Path .git\MERGE_HEAD) {
    Remove-Item .git\MERGE_HEAD -Force
}

# Add all changes
git add .

# Commit changes
$env:GIT_EDITOR = "powershell -Command exit"
git commit -m "Fix leaderboard API endpoint and update dependencies"

# Push to GitHub
git push origin main --force

Write-Host "Done! Changes pushed to GitHub."
