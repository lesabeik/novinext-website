$ErrorActionPreference = 'Stop'
$dest = Join-Path $PSScriptRoot 'assets\images'
New-Item -ItemType Directory -Force -Path $dest | Out-Null
Invoke-WebRequest -Uri 'https://novinext-platform-demo.lesabeik.chatgpt.site/assets/novinext-logo.jpg' -OutFile (Join-Path $dest 'novinext-logo.jpg')
Invoke-WebRequest -Uri 'https://novinext-platform-demo.lesabeik.chatgpt.site/assets/landing-original.png' -OutFile (Join-Path $dest 'landing-original.png')
Invoke-WebRequest -Uri 'https://novinext.com/wp-content/uploads/2024/01/novinext-logo.png' -OutFile (Join-Path $dest 'novinext-logo-wp.png')
Invoke-WebRequest -Uri 'https://novinext.com/wp-content/uploads/2024/01/molecular-analysis.png' -OutFile (Join-Path $dest 'molecular-analysis.png')
Invoke-WebRequest -Uri 'https://novinext.com/wp-content/uploads/2024/01/urine-sample-icon.png' -OutFile (Join-Path $dest 'urine-sample-icon.png')
Invoke-WebRequest -Uri 'https://novinext.com/wp-content/uploads/2024/01/molecular-markers-icon.png' -OutFile (Join-Path $dest 'molecular-markers-icon.png')
Invoke-WebRequest -Uri 'https://novinext.com/wp-content/uploads/2024/01/fluorescence-detection-icon.png' -OutFile (Join-Path $dest 'fluorescence-detection-icon.png')
Invoke-WebRequest -Uri 'https://novinext.com/wp-content/uploads/2024/01/analysis-icon.png' -OutFile (Join-Path $dest 'analysis-icon.png')
Write-Host 'NOVINEXT image assets downloaded to assets\images.'
