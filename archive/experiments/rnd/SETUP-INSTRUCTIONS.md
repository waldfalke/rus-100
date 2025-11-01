# Setup Instructions for contract-driven-methodology Repository

**Status:** Ready for Git initialization  
**Date:** 2025-01-10

---

## ✅ Files Created

Already created in `d:\Dev\contract-driven-methodology\`:

- ✅ LICENSE (MIT)
- ✅ CHANGELOG.md (v1.0.0 documented)
- ✅ .gitignore (Node, OS, IDE files)
- ✅ .github/workflows/validate.yml (CI validation)
- ✅ package.json (metadata + validation scripts)

---

## 📋 Manual Steps Required

### **1. Copy Structure from rus-100/rnd/**

Copy these directories/files to `d:\Dev\contract-driven-methodology\`:

```
FROM: d:\Dev\rus100\rnd\

✓ Onboarding/
✓ distilled-methodology/
✓ examples/
✓ README.md
✓ RND-INDEX.md
✓ SCALING-METHODOLOGY.md
✓ CONTRACT-METHODOLOGY-REPOSITORY.yml
```

### **2. Restructure e2e-testing-field-manual**

```
CREATE: d:\Dev\contract-driven-methodology\field-manuals\

COPY: d:\Dev\rus100\rnd\e2e-testing-field-manual\
TO:   d:\Dev\contract-driven-methodology\field-manuals\e2e-testing\
```

### **3. Update Internal Links**

Files to update after moving e2e-testing-field-manual → field-manuals/e2e-testing:

- `RND-INDEX.md` — update all `e2e-testing-field-manual/` → `field-manuals/e2e-testing/`
- `README.md` — update links
- `Onboarding/03-e2e-testing-complicated-domain.md` — update references

---

## 🔧 Git Initialization

After manual copying complete, run:

```bash
cd d:\Dev\contract-driven-methodology

# Initialize Git
git init

# Add files
git add .

# Initial commit
git commit -m "feat: initial methodology extraction from rus-100

- CORE methodology (distilled-methodology/)
- Training materials (Onboarding/)
- E2E testing field manual (field-manuals/e2e-testing/)
- Navigation hub (RND-INDEX.md)
- Validation infrastructure (.github/workflows/)

Validated on: rus-100 project
Status: Production-ready v1.0.0"

# Tag v1.0.0
git tag -a v1.0.0 -m "Release v1.0.0 - Initial extraction"

# Create GitHub repo (via GitHub UI or CLI)
# Then push:
git remote add origin https://github.com/YOUR_ORG/contract-driven-methodology.git
git branch -M main
git push -u origin main --tags
```

---

## ✅ Verification Checklist

After Git push, verify:

- [ ] Repository accessible on GitHub
- [ ] README.md displays correctly
- [ ] RND-INDEX.md links work
- [ ] GitHub Actions workflow runs (check Actions tab)
- [ ] Tag v1.0.0 visible in Releases
- [ ] CHANGELOG.md displays correctly
- [ ] All directories present: Onboarding/, distilled-methodology/, field-manuals/, examples/

---

## 🔗 Integration with rus-100

After repo is on GitHub, in rus-100 project:

```bash
cd d:\Dev\rus100

# Remove old rnd/
git rm -r rnd/

# Add as submodule
git submodule add https://github.com/YOUR_ORG/contract-driven-methodology.git rnd

# Commit
git add .gitmodules rnd
git commit -m "chore: migrate methodology to standalone repo

Methodology now in: github.com/YOUR_ORG/contract-driven-methodology
Version: v1.0.0 (locked via submodule)

Benefits:
- Reusable across projects
- Versioned updates
- Bidirectional knowledge flow"

# Verify
git submodule update --init
cd rnd && git log --oneline -5
```

---

## 📊 Success Criteria

Repository is ready when:

1. ✅ `git clone <url>` works
2. ✅ All links in RND-INDEX.md resolve (no 404s)
3. ✅ GitHub Actions CI passes
4. ✅ No rus-100 specific paths in grep: `grep -r "rus100" . --exclude-dir=".git"`
5. ✅ Can add as submodule to test project
6. ✅ Navigation works: README.md → RND-INDEX.md → Onboarding/

---

## 🎯 Next Steps After Setup

1. Update `package.json` — replace YOUR_ORG with actual org name
2. Create GitHub repo with proper description
3. Add topics: `contract-driven-development`, `methodology`, `frontend`, `e2e-testing`
4. Enable GitHub Pages (optional) for documentation
5. Announce to team
6. Integrate in rus-100 as submodule (see above)
7. Test on new project to validate reusability

---

**Ready:** Structure prepared, manual copy needed → Git init → push → integrate

**Time estimate:** 15-20 minutes for all steps
