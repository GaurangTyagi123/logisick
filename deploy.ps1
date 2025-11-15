$ErrorActionPreference = "Stop"

$templatesSrc = "backend/src/utils/emailTemplates"
$templatesDest = "backend/dist/src/utils"
$targetBranch = "release"
$commitMessage = "chore: deploy build from develop"

# --- SAFETY CHECKS ---
$currentBranch = (git rev-parse --abbrev-ref HEAD).Trim()
if ($currentBranch -ne "develop") {
    Write-Error "Run this only on 'develop'. Current: $currentBranch"
}

# --- STEP 1: BUILD ---
Write-Host ">>> Building..."
npm run build

# --- STEP 3: CHECKOUT RELEASE ---
Write-Host ">>> Switching to release..."
git checkout $targetBranch

try {
    git commit -m $commitMessage
} catch {
    Write-Host ">>> No changes to commit."
}

# Write-Host ">>> Pushing to origin/$targetBranch..."
git push origin $targetBranch

# # --- STEP 6: SWITCH BACK ---
git checkout develop

Write-Host "`Deployment complete."
