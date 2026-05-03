# MIDAI — AI MIDI Plugin UI

A DAW VST plugin interface prototype built with React 19, Tailwind CSS v4, and Framer Motion.

## Upload to GitHub + GitHub Pages (manual)

### 1 — Upload to GitHub

1. Go to [github.com/new](https://github.com/new) and create a new **public** repo (e.g. `midai-plugin`)
2. Click **uploading an existing file**
3. Drag the entire project folder — **excluding `node_modules`** — into the upload area
4. Commit directly to `main`

> **What to include:** everything you see in Finder except the `node_modules` folder.  
> The `docs/` folder contains the pre-built app and must be included.

### 2 — Enable GitHub Pages

1. In your repo go to **Settings → Pages**
2. Under *Build and deployment → Source* select **Deploy from a branch**
3. Branch: `main` — Folder: `/docs`
4. Click **Save**

Your live URL will appear at the top of the Pages settings within ~60 seconds:
```
https://YOUR_USERNAME.github.io/midai-plugin/
```

---

## Local development

```bash
npm install
npm run dev       # http://localhost:5173
```

## Rebuild for Pages

```bash
npm run build     # outputs to docs/
```

Commit the updated `docs/` folder and push — GitHub Pages updates automatically.

---

## Stack

- React 19
- Tailwind CSS v4
- Framer Motion
- Lucide React
- Vite 8
