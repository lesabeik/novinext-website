NOVINEXT static HTML export

Entry file:
- index.html

Included:
- Public NOVINEXT website sections
- Technology / Clinical need / For patients / Development stage / Contact / Platform / FAQ / Privacy hash routes
- Public patient dashboard preview and its subpages
- Public clinician dashboard preview and its subpages
- Public admin dashboard preview and its subpages
- Sign-in and registration routes as static HTML views
- CSS and JavaScript are local
- index.html is the first/main page

Images:
The current ChatGPT Site projection exposes image URLs but does not provide raw image bytes through the file-export interface used to build this ZIP.
To keep the exact original image files rather than recreating or altering them, this package includes:
- assets/asset-manifest.json
- download_original_images.bat
- download_original_images.ps1
- download_original_images.sh

On Windows, double-click:
download_original_images.bat

That downloads the exact original site image binaries into:
assets/images/

The HTML also contains the original source URLs as fallback values, so the site can still display those images online before the download script is run.

Static-export limitation:
Account authentication, Supabase operations, email sign-in, database writes, approvals and other backend actions cannot operate as a purely static HTML package. The visible pages/routes are included as static views; backend functionality requires reconnecting the original application logic and Supabase configuration.
