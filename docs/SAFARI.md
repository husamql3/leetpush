# Running LeetPush on Safari (macOS)

LeetPush ships with a macOS Xcode project that wraps the Chrome web extension
code in a native Safari Web Extension app.

The project references the extension files **directly from the repo root**
(`manifest.json`, `background.js`, `content-script.js`, `style.css`, `images/`,
and the built popup in `dist/`), so any change you make to the Chrome extension
is picked up automatically by the Safari build — no separate copy to maintain.

```
Safari Version/LeetPushSafari/
├── LeetPushSafari.xcodeproj
├── LeetPushSafari/               ← app target (launcher UI)
└── LeetPushSafari Extension/     ← Swift extension host; the web extension
                                     files (manifest, scripts, popup) come
                                     from the repo root, not this folder
```

## Prerequisites

Building the project requires:

- macOS 14.5 (Sonoma) or later, the minimum macOS version to run [Xcode 16](https://apps.apple.com/app/xcode/id497799835)
- Xcode 16 or later — the project uses synchronized (buildable) folders,
  which were introduced in Xcode 16; earlier releases (Xcode 15.x, the last
  version supporting macOS 13) cannot open this project
- Node.js (or [Bun](https://bun.sh) — the repo ships a `bun.lock`) to build the
  extension popup

> **Note:** macOS 13 (Ventura) is *not* sufficient to build the project. The
> minimum deployment target is covered separately below.

> The Xcode project sets `MACOSX_DEPLOYMENT_TARGET = 13.0` for both the launcher
> app and the Safari extension, so the **built app's minimum supported macOS
> version is 13.0 (Ventura)**. This is separate from the macOS version needed
> to *build* the project (macOS 14.5+ with Xcode 16, as listed above).
> Keep these two targets aligned if you change it.

## Steps

### 1. Build the extension popup

The popup is a Vite app in `popup/` that builds to `dist/` at the repo root
(`dist/index.html` is what the manifest's `action.default_popup` points to):

```bash
cd popup
npm install       # or: bun install
npm run build     # or: bun run build
```

You should now have a `dist/` folder at the repo root. If you skip this step the
extension still builds, but clicking the toolbar button will do nothing.

### 2. Allow unsigned extensions (do this first!)

Locally built apps are not notarized, so Safari will reject the extension
until you tell it to allow unsigned ones. Do this **before** running the
app:

1. Open Safari → **Settings → Advanced** and enable **Show features for web
   developers** (this reveals the Develop menu).
2. Go to **Safari → Settings → Developer** and enable **Allow unsigned
   extensions**, then confirm. Safari may ask for your password or an iCloud
   code. (On Safari 16 and earlier, this option is under **Develop → Allow
   Unsigned Extensions** instead.)

> This permission is reset every time Safari quits. You must re-enable
> **Allow unsigned extensions** after fully quitting and reopening Safari during
> development, otherwise the extension will not appear.

### 3. Run the app

1. Open `Safari Version/LeetPushSafari/LeetPushSafari.xcodeproj` in Xcode.
2. Select the **`LeetPushSafari`** scheme and press **⌘R**. The app launches.
3. Enable the extension in Safari:
   - **Safari → Settings → Extensions**
   - Select **LeetPush** and tick **Enable**.

### 4. Grant site permissions

In Safari → **Settings → Extensions → LeetPush**, set the permission for
websites to **Always Allow** (or at minimum allow `leetcode.com`), so the
content script and the GitHub API calls can run.


## Troubleshooting

- **Popup is blank / button does nothing** — make sure `dist/index.html`
  exists (re-run the popup build in `popup/`) and that you rebuilt the Xcode
  target afterwards.
- **Content script not running** — check that the extension is enabled and has
  **Always Allow** permission for leetcode.com in Safari's extension settings.
- **Xcode shows a red `dist` folder reference** — that is the built popup; run
  the popup build from step 1.

### 5. Configure Code Signing & Permanent Installation

To prevent Safari from unloading the extension or requiring you to re-enable unsigned extensions on every reboot, sign the app locally and place it in `/Applications`:

1. Open `LeetPushSafari.xcodeproj` in Xcode.
2. Select the root **LeetPushSafari** project node in the left sidebar.
3. Under **TARGETS**, select **LeetPushSafari** (parent app):
   - Go to **Signing & Capabilities**.
   - Check **Automatically manage signing**.
   - Under **Team**, select your **Personal Team** (sign in via **Xcode → Settings → Accounts** if empty).
4. Under **TARGETS**, select **LeetPushSafari Extension**:
   - Go to **Signing & Capabilities**.
   - Check **Automatically manage signing**.
   - Set **Team** to the **exact same Personal Team**.
   - Ensure its Bundle Identifier is nested under the parent app (e.g., `com.domain.LeetPushSafari.Extension`).

   > If you change the extension's Bundle Identifier, also update
   > `extensionBundleIdentifier` at the top of
   > `LeetPushSafari/LeetPushSafari/ViewController.swift` to the same value. The
   > launcher uses it to check the extension's status and open its settings; a
   > mismatch leaves the status incorrect and the settings button targeting the
   > wrong extension.

5. Press `⌘B` to build the project.
6. In Xcode's left sidebar navigator, right-click `LeetPushSafari.app` under **Products** → **Show in Finder**.
7. Drag `LeetPushSafari.app` into `/Applications`.
8. Double-click `LeetPushSafari.app` from `/Applications` once to register it with macOS Launch Services.
