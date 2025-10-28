# Project Build & Configuration Summary

This document summarizes the steps taken to diagnose and fix build errors, configure the project for local development and production deployment, and establish a CI/CD pipeline.

### 1. Initial Setup and Build Failure
- **Dependency Installation:** The first step was to run `yarn install` to install all project dependencies, as they were missing.
- **Initial Build Errors:** The initial `yarn build` failed due to ESLint configuration issues, stemming from incompatible versions of ESLint plugins.

### 2. Build and Linting Fixes
- **ESLint Compatibility:** Resolved ESLint errors by installing specific, compatible versions of `eslint-plugin-vue` and `vue-eslint-parser`. The `.eslintrc.js` file was then updated to correctly resolve TypeScript module paths and disable problematic rules.
- **Code Quality:** Fixed an ESLint warning in `src/hooks/useZhengma.ts` by naming an anonymous function.
- **Webpack Configuration:** Suppressed webpack performance warnings about asset size by increasing the size limits in `vue.config.js`, acknowledging the current bundle size is acceptable.

### 3. Deployment Workflow (Local & Remote)
- **Local Deployment:** Diagnosed and fixed a local serving issue (`Uncaught SyntaxError: Unexpected token '<'`) caused by an incorrect `publicPath` for a local production build. Clarified the correct workflow:
    - `yarn serve`: For local development (serves from `/`).
    - `yarn build`: For production builds (assets prefixed with `/zhengma/`).
- **Git Configuration:** The `docs` build directory was being tracked by Git. It was removed from the Git index (`git rm -r --cached docs`) to allow the `.gitignore` file to correctly ignore it.
- **GitHub Actions CI/CD:** The GitHub Pages deployment was failing due to an incorrect Jekyll-based build process. This was fixed by:
    1.  Replacing the workflow with a new `.github/workflows/main.yml` file tailored for a Node.js/Vue.js project.
    2.  Updating the repository settings to use **GitHub Actions** as the deployment source.
    3.  Updating all actions (`actions/checkout@v4`, `actions/setup-node@v4`, etc.) to their latest major versions to resolve a deprecation error from a transitive dependency.

### 4. Project Documentation
- **README Update:** The `README.md` file was updated to include instructions for project setup (`yarn install`) and the primary development/build commands (`yarn serve`, `yarn build`).

---

## Technical Deep Dive: Resolving Dependency Conflicts

The core of the initial build failure was a version mismatch between the project's ESLint-related packages.

- **Environment:** Node.js `v22.14.0`, Vue CLI `v5.0.9`.
- **Problem:** `package.json` contained ESLint configurations with peer dependency requirements for older versions of `eslint-plugin-vue`, but `yarn install` fetched the latest, incompatible version.
- **Solution:**
    1.  **Diagnosis:** Warnings during `yarn install` about incorrect peer dependencies pointed directly to the package conflicts.
    2.  **Targeted Installation:** We manually installed a known compatible version of the plugin (`yarn add eslint-plugin-vue@^9.2.0 --dev`).
    3.  **Configuration Tuning:** We updated `.eslintrc.js` to properly configure the import resolver for TypeScript, which was the final step to make the linter run successfully.
