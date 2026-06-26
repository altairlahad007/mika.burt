# Portfolio.jsx Deep Analysis

## 1. import.meta.glob() Path Resolution

### Glob Patterns Used
```javascript
const globPattern1 = import.meta.glob('../../assets/portfolio/**/*.{jpg,jpeg,png,webp}', { eager: true })
const globPattern2 = import.meta.glob('/src/assets/portfolio/**/*.{jpg,jpeg,png,webp}', { eager: true })
```

### What Vite Likely Returns on Windows
Based on the workspace at `d:\MikaBurt`:
- **Pattern 1** (relative): Vite resolves `../../assets/portfolio/` from `/src/components/Portfolio/`
  - Results in paths like: `../../assets/portfolio/AMONG THE HIDDEN/1ST SCULPTURE/1.jpeg`
  - OR with full paths: `d:/MikaBurt/src/assets/portfolio/AMONG THE HIDDEN/1ST SCULPTURE/1.jpeg`

- **Pattern 2** (absolute): The `/src/` might work or fail depending on Vite config
  - Typically resolves from project root

### ⚠️ CRITICAL ISSUE #1: Both glob patterns may return ZERO files
**Why?** On Windows, Vite's glob patterns sometimes struggle with:
- Backslashes vs forward slashes in the pattern itself
- Spaces in folder names might not be properly escaped in the glob

**Evidence:** The code picks whichever returns MORE results, but if BOTH return 0, `imageModules` would be empty.

---

## 2. parsePath() Function Analysis with Windows Paths & Spaces

### Current Implementation
```javascript
function parsePath(rawPath) {
  const decoded = decodeURIComponent(rawPath.replace(/\\/g, '/'))
  const marker = '/portfolio/'
  const idx = decoded.lastIndexOf(marker)
  
  if (idx !== -1) {
    const parts = decoded.slice(idx + marker.length).split('/').filter(p => p)
    return parts
  }
  // Fallback...
}
```

### Test Cases with Real Data

**Input 1:** Windows absolute path
```
d:\MikaBurt\src\assets\portfolio\AMONG THE HIDDEN\1ST SCULPTURE\1.jpeg
```
↓ After `replace(/\\/g, '/')`:
```
d:/MikaBurt/src/assets/portfolio/AMONG THE HIDDEN/1ST SCULPTURE/1.jpeg
```
↓ Find `/portfolio/` at index 30, extract from index 40:
```
AMONG THE HIDDEN/1ST SCULPTURE/1.jpeg
```
↓ Split by '/':
```
['AMONG THE HIDDEN', '1ST SCULPTURE', '1.jpeg']  ✓ Length: 3
```

**Input 2:** Relative path
```
../../assets/portfolio/MINIATURE FIGURES/BENDING HECTIC/1.jpeg
```
↓ No backslashes, already uses `/`
↓ Find `/portfolio/` at index 19, extract:
```
MINIATURE FIGURES/BENDING HECTIC/1.jpeg
```
↓ Split by '/':
```
['MINIATURE FIGURES', 'BENDING HECTIC', '1.jpeg']  ✓ Length: 3
```

### ✅ FINDING: parsePath() correctly handles spaces in folder names
- The function properly decodes URI components
- Spaces are preserved through the split

---

## 3. Nested Files Organization Logic

### Expected File Structure
```
src/assets/portfolio/
├── AMONG THE HIDDEN/           (nested - 3 levels deep)
│   ├── 1ST SCULPTURE/
│   │   ├── 1.jpeg
│   │   └── DISPLAY IMAGE.jpeg
│   ├── 2ND SCULPTURE/
│   │   ├── 1.jpeg
│   │   └── DISPLAY IMAGE.jpeg
│   └── 3RD SCULPTURE/
│       ├── 1.jpeg
│       └── DISPLAY IMAGE.jpeg
├── MINIATURE FIGURES/          (nested - 3 levels deep)
│   ├── BENDING HECTIC/
│   ├── RAKU 1/
│   └── ...
├── PORCELAIN/                  (nested - 3 levels deep)
│   ├── CONNECTION/
│   ├── HIDDEN SEEDS/
│   └── SILNENT SCREAM VASE/
└── DROP/                        (flat - 2 levels deep)
    ├── 1.jpeg
    └── DISPLAY IMAGE.jpeg
```

### Code Flow for AMONG THE HIDDEN

**Phase 1: Detect Nested Portfolios**
```javascript
const knownNested = ['AMONG THE HIDDEN', 'MINIATURE FIGURES', 'PORCELAIN']
knownNested.forEach(name => nestedNames.add(name))
```
✅ AMONG THE HIDDEN is in knownNested

**Phase 2: Build Portfolio Map**
```
For each file: /src/assets/portfolio/AMONG THE HIDDEN/1ST SCULPTURE/1.jpeg
  → parsePath returns: ['AMONG THE HIDDEN', '1ST SCULPTURE', '1.jpeg']
  → portfolioName = 'AMONG THE HIDDEN'
  → fileName = '1.jpeg'
  
  Check: nestedNames.has('AMONG THE HIDDEN') && parts.length >= 3
         ✅ TRUE && TRUE = YES
  
  → subFolderName = parts[1] = '1ST SCULPTURE'
  → Create pMap['AMONG THE HIDDEN'].subPortfolios['1ST SCULPTURE']
  → Push url to sub.images
```

**Phase 3: Finalize (Create subPortfolioList)**
```javascript
if (p.isNested) {  // p.isNested = true (set during creation)
  const subList = Object.values(p.subPortfolios).map(sub => {
    // Process each sub
    return sub
  })
  // subList should contain: [{ title: '1ST SCULPTURE', ... }, { title: '2ND SCULPTURE', ... }, ...]
  p.subPortfolioList = subList
}
```

### ✅ FINDING: Logic appears correct IF files are found
- Known nested portfolios are correctly identified
- Files with 3+ parts are correctly organized into subPortfolios
- subPortfolioList is created from subPortfolios

---

## 4. subPortfolioList Creation & Passage

### Data Structure Built

For AMONG THE HIDDEN in pMap:
```javascript
{
  title: 'AMONG THE HIDDEN',
  images: [],                    // Empty (flat files)
  displayImage: null,
  isNested: true,                // Set during portfolio creation
  subPortfolios: {
    '1ST SCULPTURE': {
      title: '1ST SCULPTURE',
      images: [url1, url2, ...],
      displayImage: url_display
    },
    '2ND SCULPTURE': {
      title: '2ND SCULPTURE',
      images: [url1, url2, ...],
      displayImage: url_display
    },
    '3RD SCULPTURE': {
      title: '3RD SCULPTURE',
      images: [url1, url2, ...],
      displayImage: url_display
    }
  },
  subPortfolioList: [           // ← Created in finalize
    { title: '1ST SCULPTURE', images: [...], displayImage: ... },
    { title: '2ND SCULPTURE', images: [...], displayImage: ... },
    { title: '3RD SCULPTURE', images: [...], displayImage: ... }
  ]
}
```

### SubPortfolioModal Rendering
```jsx
<SubPortfolioModal
  parent={subPortfolioParent}    // ← This object with subPortfolioList
  onSelectSub={(sub) => setSelectedPortfolio(sub)}
  onClose={() => setSubPortfolioParent(null)}
/>
```

SubPortfolioModal tries to render:
```jsx
{parent.subPortfolioList.map((sub, idx) => (
  // Card for each sub
))}
```

✅ This should work IF subPortfolioList exists

---

## 5. Root Cause Analysis: Why SubPortfolioModal Doesn't Render

### Scenario Analysis

**Scenario A: imageModules is empty**
- **Cause**: import.meta.glob() returns no files on Windows
- **Effect**: 
  - pMap would have no entries
  - portfolios array would be empty
  - No cards to click
  - SubPortfolioModal never triggered
- **Likelihood**: HIGH on Windows with spaces in paths

**Scenario B: AMONG THE HIDDEN exists but subPortfolioList is empty**
- **Cause**: Files are found but don't have 3+ path parts
- **Effect**: 
  - Portfolio card appears
  - Click triggers setSubPortfolioParent(portfolio)
  - SubPortfolioModal renders but grid is empty
  - OR SubPortfolioModal throws error trying to map undefined/empty array
- **Likelihood**: LOW (parsePath seems correct)

**Scenario C: AMONG THE HIDDEN not detected as nested**
- **Cause**: isNested = false due to flawed detection
- **Effect**: 
  - Portfolio card appears
  - Click triggers setSelectedPortfolio instead
  - PortfolioModal opens instead of SubPortfolioModal
- **Likelihood**: LOW (knownNested includes it)

**Scenario D: subPortfolioList exists but has wrong data**
- **Cause**: Subs weren't created properly in phase 2
- **Effect**: 
  - SubPortfolioModal renders but with wrong/missing data
- **Likelihood**: MEDIUM

---

## Critical Code Locations

1. **Glob patterns**: Lines 6-8
2. **parsePath function**: Lines 20-35
3. **Nested detection**: Lines 60-75
4. **Portfolio creation**: Lines 80-130
5. **Finalize + subPortfolioList creation**: Lines 135-170
6. **Click handler**: Lines 175-183
7. **SubPortfolioModal condition**: Lines 220-227

---

## Recommended Debugging Steps

1. Add `console.log(Object.keys(imageModules).length)` right after globPattern assignment
2. Add `console.log(Object.keys(imageModules).slice(0,5))` to see actual paths
3. Filter for AMONG-related paths and log their parsed results
4. Log the entire AMONG THE HIDDEN portfolio object after finalize
5. Check browser console for actual portfolio object shape when clicking

---

## Most Likely Root Cause

**PRIMARY**: `import.meta.glob()` is finding 0 files due to Windows path handling with spaces

**SECONDARY**: If files ARE found, everything should work correctly based on code logic

