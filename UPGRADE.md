# CloudyCam upgrade (October 2026)

## What changed

* **Security:** the audit went from 175 issues (32 critical) to 1, a dev-only lint dependency with no fix published yet. Most issues came from the old Next.js and Cloudinary packages.
* **API routes:** they no longer trust the browser. Before, anyone could overwrite the filter images or upload anything to the account.
* **Camera:** works on more webcams and phones, turns off when you leave the page, and shows clear errors with a "Try again" button.
* **Overlays:** generated in Cloudinary's current layer format by `src/lib/layers.js`. All filters keep the same settings.
* **Bugs fixed:**
  * "Start Over" could bring back the old photo.
  * The 5-second timer could fire after you left the page.
  * Loading animations got stuck or ran forever.
  * Links rendered one `<a>` inside another.
  * Event galleries could mix up photos between events.

## New versions

* Node.js 24 (minimum 22.22.1)
* Next.js 16 and React 19
* Cloudinary packages:
  * `next-cloudinary` 6
  * `cloudinary` 2
  * `@cloudinary/url-gen` 1.22
* `swr` 2, `react-icons` 5, `react-tabs` 6
* Sass updated to the new module syntax, so there are no build warnings
* ESLint 9 and Prettier 3. ESLint 10 isn't supported by Next.js yet.
* Removed `react-webcam` and the deprecated `crypto` package

## Setup requirements

* Run `nvm use` to switch to Node 24.
* The Cloudinary account needs these add-ons:
  * **Advanced Facial Attribute Detection**, for face filters. Without it, set `NEXT_PUBLIC_CLOUDINARY_ADV_FACE="false"`.
  * **AI Background Removal**, for the Backgrounds tab.
* Upload the filter images to the `cloudycam-assets` folder.
* Use `localhost` or `https`. The camera is blocked on plain `http`.

## Still to check

These need the migrated assets and a Cloudinary account:

* Uploads and background removal work.
* Filters sit correctly on faces. The base photo layer now uses `fl_relative` instead of `fl_region_relative`.
* The camera works in Chrome, Firefox, Safari, iOS Safari and Android Chrome but we will need to come back to this after assets have been migrated.

## Possible next steps

* Switch background removal to the on-the-fly `e_background_removal` transformation. This removes the second upload but changes billing.
* Move to ESLint 10 once Next.js supports it.
