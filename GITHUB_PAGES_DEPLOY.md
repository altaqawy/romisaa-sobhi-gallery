# Romisaa Sobhi Gallery V3 — GitHub Pages deployment

## What this is
A static prototype with 10 HTML pages. The product names, prices, checkout and InstaPay/Vodafone Cash/Visa payment controls are demonstrative only. No payments are taken, and no orders are sent to a real seller.

## First deployment (repository owner)
1. Go to https://github.com/new and create a **public** repository, e.g. `romisaa-sobhi-gallery`.
2. Extract `Romisaa_GitHub_Pages_Ready.zip` on your computer.
3. In the new GitHub repository choose **Add file > Upload files**. Upload the **contents** of the extracted folder, not the ZIP itself. Make sure `index.html` and the `assets/` directory are at repository root, and commit to `main`.
4. Open **Settings > Pages**, select **Deploy from a branch** as Source, then **main** and **/(root)** as the branch/folder, and Save.
5. In the **Pages** settings, wait for GitHub to show the actual published site URL (typically `https://YOUR-USERNAME.github.io/romisaa-sobhi-gallery/`). Visit the URL and confirm assets, pages and cart interactions.

## Before accepting real orders
Verify every photo, product name, price and owner permission. Configure a real commerce backend, order database, shipping policy, consumer disclosure and secure payment gateway/server callbacks; remove the demo warning only after these are ready. Do not collect payment details directly through these static files.