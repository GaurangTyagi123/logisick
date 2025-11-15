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

if ((git status --porcelain) -ne "") {
    Write-Error "Working tree is not clean. Commit or stash first."
}

# --- STEP 1: BUILD ---
Write-Host ">>> Building..."
npm run build

# # --- STEP 3: CHECKOUT RELEASE ---
# Write-Host ">>> Switching to release..."
# git checkout $targetBranch

# # --- STEP 4: MOVE dist/* → backend/ ---
# Write-Host ">>> Moving built files into backend/"
# Move-Item "backend/dist/*" "backend/" -Force
# Remove-Item "backend/dist" -Recurse -Force

# # --- STEP 5: COMMIT & PUSH ---
# git add backend

# try {
#     git commit -m $commitMessage
# } catch {
#     Write-Host ">>> No changes to commit."
# }

# Write-Host ">>> Pushing to origin/$targetBranch..."
# git push origin $targetBranch

# # --- STEP 6: SWITCH BACK ---
# git checkout develop

# Write-Host "`n✔ Deployment complete."
