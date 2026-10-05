# Cloudinary Camera Filters

## Requirements

* **Node.js 24 LTS** (minimum 22.22.1). Run `nvm use` to pick up the version in `.nvmrc`.
* **Yarn 1** (classic)
* A **Cloudinary account** with these add-ons enabled:
  * **Advanced Facial Attribute Detection**: used to place face filters (unicorn, Vader, etc.). Without it, set `NEXT_PUBLIC_CLOUDINARY_ADV_FACE="false"` to fall back to built-in face detection (placement is less precise).
  * **Cloudinary AI Background Removal**: used for the Backgrounds filters. Without it, background uploads fail and that tab stays in its loading state.
* The filter, badge, and background images uploaded to the `cloudycam-assets` folder in that account (e.g. `cloudycam-assets/unicorn-mask`, `cloudycam-assets/white-1x1`, `cloudycam-assets/transparent-1x1`). See `src/data/filters.js`, `src/data/events.js`, and `src/lib/cloudinary.js` for the full list of public IDs.

## Getting Started

* Install dependencies

```
yarn install
```

* Set up environment variables in `.env.local`

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="<Your Cloud Name>"
CLOUDINARY_API_KEY="<Your Cloudinary API Key>"
CLOUDINARY_API_SECRET="<Your Cloudinary API Secret>"

# Optional
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="<Upload preset applied to every upload>"
NEXT_PUBLIC_CLOUDINARY_ADV_FACE="false" # if the Advanced Facial Attribute Detection add-on isn't enabled
NEXT_PUBLIC_GA_ID="<Google Analytics ID>"
NEXT_PUBLIC_URL="<Public URL used for share links, defaults to the current origin>"
```

* Start up app

```
yarn dev
```

The camera only works in a secure context: `http://localhost` or `https://`. Opening the dev server on a LAN IP address over plain http blocks camera access in every browser.
