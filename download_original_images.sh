#!/usr/bin/env sh
set -eu
DEST="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)/assets/images"
mkdir -p "$DEST"
curl -L --fail --silent --show-error "https://novinext-platform-demo.lesabeik.chatgpt.site/assets/novinext-logo.jpg" -o "$DEST/novinext-logo.jpg"
curl -L --fail --silent --show-error "https://novinext-platform-demo.lesabeik.chatgpt.site/assets/landing-original.png" -o "$DEST/landing-original.png"
curl -L --fail --silent --show-error "https://novinext.com/wp-content/uploads/2024/01/novinext-logo.png" -o "$DEST/novinext-logo-wp.png"
curl -L --fail --silent --show-error "https://novinext.com/wp-content/uploads/2024/01/molecular-analysis.png" -o "$DEST/molecular-analysis.png"
curl -L --fail --silent --show-error "https://novinext.com/wp-content/uploads/2024/01/urine-sample-icon.png" -o "$DEST/urine-sample-icon.png"
curl -L --fail --silent --show-error "https://novinext.com/wp-content/uploads/2024/01/molecular-markers-icon.png" -o "$DEST/molecular-markers-icon.png"
curl -L --fail --silent --show-error "https://novinext.com/wp-content/uploads/2024/01/fluorescence-detection-icon.png" -o "$DEST/fluorescence-detection-icon.png"
curl -L --fail --silent --show-error "https://novinext.com/wp-content/uploads/2024/01/analysis-icon.png" -o "$DEST/analysis-icon.png"
echo "NOVINEXT image assets downloaded to assets/images."
