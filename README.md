# SuperPig: Framework-Agnostic PWA Mobile Frontend (`pig_ops_ui_mob`)

🔗 **Main System Repository:** [pig_ops](https://github.com)  
📱 **UI Core Context:** 195 Files | 101,324 Lines of Vanilla JavaScript | 50+ Custom Single Page App View States  
⚡ **Performance Target:** Zero-runtime-dependency execution built for low-latency, mobile-first agricultural environments.

This repository contains the mobile client engine for SuperPig. To maximize device execution speeds, eliminate framework runtime bloat, and maintain an ultra-lightweight asset footprint, the client interface is engineered as an installable **Progressive Web Application (PWA)** using pure native web APIs.

---

### 📂 Repository Structure & UI Topography

```text
~/projects/jsys/pig_ops_ui_mob/
├── build.py*                 # Custom Python build engine (Bundles src modules into production assets)
├── package.json              # System configuration and light utility management
├── package-lock.json         # Locked downstream dependency trees
├── node_modules/             # Local module storage (Strictly limited to light builder tools)
│
├── static/                   # Production-compiled public targets, logos, and optimized webroot hooks
└── src/                      # Source Code Core
    └── static/js/            # Asynchronous Frontend Execution Modules
        ├── app_core.js       # Base global execution matrix & state orchestrator
        ├── app.js            # Central runtime controller and event dispatcher
        ├── constants.js      # Strict lookup tables, state keys, and error constraints
        ├── pwa-handler.js    # Service Worker automation layer (Offline caching & PWA manifests)
        ├── utils.js          # Reusable DOM utility hooks and computational string extensions
        └── pages/            # 50+ Modular page components managing dynamic dashboard views
```

---

### ⚙️ Frontend Infrastructure & Build Automation

This frontend bypasses heavy corporate JavaScript build stacks (like Webpack or Vite) in favor of a lean, custom automation pipeline:

#### 📦 1. The Autonomous Pipeline & Python Bundling Engine (`build.py`)
To ensure high developer velocity and clean code isolation, the application is written across decoupled modules within the `src/` directory. Rather than relying on manual builds, `build.py` is fully integrated into the global host orchestration layer (`deploy.sh`). 

When code changes are pushed to production, executing the server's central deploy script triggers `./build.py` automatically. The script aggregates raw modules, compresses assets, and outputs exactly **2 highly optimized production JavaScript bundles** directly to the public `/static` layer, achieving instant zero-intervention build delivery.


#### 📡 2. Native PWA Offline Architecture (`pwa-handler.js`)
Agricultural tracking occurs in isolated environments with inconsistent connectivity. The application uses a robust Service Worker layer handled by `pwa-handler.js`. It forces edge devices to precache essential runtime dependencies, routes, and views, ensuring that farmers can calculate sow cycles and record breeding data even when completely offline.

#### 🧩 3. Zero-Framework Architecture Core
The system manipulates the browser's Document Object Model (DOM) using high-performance, native JavaScript APIs. By avoiding heavy framework abstraction layers (like React, Vue, or Angular), the application avoids heavy virtual-DOM calculations, making the application responsive on low-spec mobile hardware.

---

### 🚀 Production Deployment Flow

1. Source modifications are written inside the `src/` modules.
2. The compilation pipeline is invoked locally or via automation: `./build.py`
3. Bundled outputs are verified against the static serving layer controlled by the production Nginx reverse proxy configurations.

