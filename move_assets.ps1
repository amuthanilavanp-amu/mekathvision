$source = "C:\Users\DELL\.gemini\antigravity\brain\6b665304-1fe3-471f-aa0e-553422c18d4b"
$dest = "d:\maketh vision\public\assets"

if (-not (Test-Path $dest)) {
    New-Item -ItemType Directory -Force -Path $dest
}

Get-ChildItem -Path $source -Filter "*.png" | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination $dest -Force
    Write-Host "Copied $($_.Name) to assets"
}
