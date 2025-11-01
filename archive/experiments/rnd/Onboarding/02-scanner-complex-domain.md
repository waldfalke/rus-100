# Cookbook: Scanner Component (Complex Domain)

**Cynefin:** Complex  
**Complexity:** High  
**Precision:** Low - boundaries and invariants only, implementation emergent

---

## Contract

```yaml
id: CONTRACT-SCANNER-001
title: Barcode Scanner Component
type: component
description: Camera-based barcode scanner with auto-focus and zoom controls
cynefin_domain: complex

props:
  required:
    - name: onScan
      type: (barcode: string) => void
      description: Callback when barcode detected
    - name: onError
      type: (error: Error) => void
      description: Error handler
  
  optional:
    - name: supportedFormats
      type: BarcodeFormat[]
      description: Which barcode types to detect
    - name: scanInterval
      type: number
      description: How often to attempt detection (ms)

# NOTE: Complex domain - we do NOT specify exact implementation details

invariants:
  - "Scanner must request camera permission before accessing"
  - "Scanner must work on 95% of modern mobile devices"
  - "Scanner must handle camera access denial gracefully"
  - "Scanner must clean up camera stream on unmount"
  - "Detected barcode must be validated before callback"

constraints:
  performance:
    - "Detection latency < 500ms on average"
    - "No memory leaks from camera stream"
    - "Graceful degradation if camera unavailable"
  
  accessibility:
    - "Alternative input method (manual entry) available"
    - "Clear instructions for camera positioning"
  
  browser_support:
    - "Modern mobile browsers with camera API"
    - "Fallback for browsers without camera support"

dependencies:
  external:
    - "@zxing/library or similar barcode detection library"
  tokens:
    - color.error
    - color.success
  
scope:
  mutable:
    - components/Scanner/*
    - hooks/useScanner.ts
  invariant:
    - components/* (other components)
    - design-tokens/*.json

anti_patterns:
  - pattern: "Hardcoding focusDistance=0.20 or zoom=3"
    reason: "Complex domain - optimal values are device-dependent and emergent"
    alternative: "Implement adaptive algorithm that adjusts based on device capabilities"
  
  - pattern: "Assuming camera API works identically across devices"
    reason: "Browser implementations vary significantly"
    alternative: "Feature detection and progressive enhancement"
  
  - pattern: "Writing precise contract for focus/zoom behavior"
    reason: "Solution is emergent through experimentation"
    alternative: "Specify goals and invariants, discover implementation"

acceptance_criteria:
  - criterion: "Successfully scans EAN-13 barcode in good lighting"
    validation: manual
  
  - criterion: "Handles camera permission denial"
    validation: integration-test
  
  - criterion: "Cleans up resources on unmount"
    validation: unit-test
  
  - criterion: "Provides manual input fallback"
    validation: visual
  
  - criterion: "Works on 95% test devices"
    validation: manual
```

---

## Key Differences from Simple Domain

### 1. No Exact Implementation in Contract

**Simple domain (Button):**
```yaml
variants:
  - primary: "bg-primary text-white"
  - secondary: "bg-secondary text-white"
```

**Complex domain (Scanner):**
```yaml
invariants:
  - "Detection latency < 500ms on average"
# NO specification of HOW to achieve this
```

### 2. Goals Instead of Specs

**Contract says WHAT must be true, not HOW:**
- ✅ "Works on 95% of devices" (goal)
- ❌ "Use focusDistance=0.20" (premature specification)

### 3. Emergent Implementation

Implementation discovered through:
1. Device testing
2. Performance measurement
3. User feedback
4. Iteration

**Not** predetermined in contract.

---

## Implementation Approach

### Phase 1: Minimal Working Version

```typescript
// useScanner.ts - First iteration
export function useScanner(options: ScannerOptions) {
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Start with basic implementation
  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setIsScanning(true);
    } catch (error) {
      options.onError(error);
    }
  };

  return { isScanning, startScanning, videoRef };
}
```

**Contract validation:**
- ✅ Requests permission (invariant)
- ✅ Handles denial (invariant)
- ⚠️ Performance unknown (needs measurement)

### Phase 2: Add Detection

```typescript
// After experimentation, add barcode detection
const detectBarcode = useCallback(async () => {
  if (!videoRef.current) return;
  
  const codeReader = new BrowserMultiFormatReader();
  
  try {
    const result = await codeReader.decodeFromVideoElement(videoRef.current);
    if (result) {
      options.onScan(result.getText());
    }
  } catch (error) {
    // Detection failed, continue scanning
  }
}, [options.onScan]);
```

**Measure:** Is latency < 500ms? If not, optimize.

### Phase 3: Device-Specific Optimization

```typescript
// Discovered through testing: some devices need constraints
const getOptimalConstraints = () => {
  const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
  
  // Emergent knowledge from testing
  if (isMobile) {
    return {
      video: {
        facingMode: 'environment',
        width: { ideal: 1280 },
        height: { ideal: 720 },
      }
    };
  }
  
  return {
    video: { facingMode: 'environment' }
  };
};
```

**This is emergent - not in original contract.**

### Phase 4: Focus/Zoom (If Needed)

```typescript
// Only add if testing shows it's necessary
const applyOptimalSettings = async (stream: MediaStream) => {
  const track = stream.getVideoTracks()[0];
  const capabilities = track.getCapabilities();
  
  // Adaptive algorithm based on device capabilities
  if (capabilities.zoom) {
    const settings = track.getSettings();
    const currentZoom = settings.zoom || 1;
    
    // Learned through experimentation:
    // Zoom 2-3x works well for most devices
    if (currentZoom < 2) {
      await track.applyConstraints({
        advanced: [{ zoom: Math.min(3, capabilities.zoom.max) }]
      });
    }
  }
};
```

**Key point:** This emerged from testing, not specified upfront.

---

## Contract Evolution

### Version 1.0 (Initial)
```yaml
invariants:
  - "Detection latency < 500ms"
```

### Version 1.1 (After Testing)
```yaml
invariants:
  - "Detection latency < 500ms on devices with 2+ CPU cores"
  - "Detection latency < 1000ms on older devices"
  - "Fallback to manual input if camera unavailable"

lessons_learned:
  - "Low-end devices cannot achieve 500ms consistently"
  - "Manual input fallback essential for accessibility"
  - "Progressive enhancement better than one-size-fits-all"
```

**Contract updated based on reality, not initial assumptions.**

---

## Anti-Pattern Examples

### ❌ Wrong: Over-Specification

```yaml
# DON'T DO THIS in Complex domain
props:
  optional:
    - name: focusMode
      type: "'auto' | 'manual'"
      default: manual
    - name: focusDistance
      type: number
      default: 0.20  # ← Magic number from one device!
    - name: zoom
      type: number
      default: 3
      validation: "zoom <= 3"  # ← Arbitrary limit!
```

**Why wrong:** Assumes solution is known. In reality, optimal values are device-dependent.

### ✅ Correct: Boundaries

```yaml
# DO THIS instead
invariants:
  - "Scanner adapts focus/zoom to device capabilities"
  - "Scanner does not crash if focus/zoom unavailable"

constraints:
  performance:
    - "Detection works within 500ms on 95% devices"
```

**Why correct:** Specifies goals, allows implementation to emerge.

---

## Lessons from Real Implementation

### Discovery 1: Device Variance

**Initial assumption:** "Use focusDistance=0.20 for all devices"

**Reality:** iPhone, Samsung, Pixel have different camera APIs and capabilities.

**Solution:** Feature detection + adaptive constraints.

```typescript
// Emergent solution
const capabilities = track.getCapabilities();

if ('focusDistance' in capabilities) {
  // Use focusDistance
} else if ('focusMode' in capabilities) {
  // Use focusMode
} else {
  // No manual focus available
}
```

### Discovery 2: Performance Varies

**Initial assumption:** "Can scan at 60fps"

**Reality:** Low-end devices struggle at 30fps, high-end can do 60fps.

**Solution:** Adaptive scan interval.

```typescript
// Learned through profiling
const getOptimalScanInterval = () => {
  const cores = navigator.hardwareConcurrency || 2;
  
  if (cores >= 4) return 100;  // 10fps
  if (cores >= 2) return 200;  // 5fps
  return 300;  // 3fps
};
```

### Discovery 3: "Sometimes Works"

**Heuristic discovered:** Auto-focus "sometimes works" is actually:
- Works: zoom ≤ 3x
- Breaks: zoom > 3x

**This was found empirically, not theoretically.**

---

## Testing in Complex Domain

Unlike Simple domain, tests focus on:

1. **Invariants hold:**
   - Camera permission requested? ✓
   - Resources cleaned up? ✓
   - Errors handled? ✓

2. **Goals achieved:**
   - Works on 95% devices? (measure)
   - Latency < 500ms? (measure)

3. **Graceful degradation:**
   - Camera denied → manual input
   - Old browser → feature message
   - Poor lighting → instructions

**Not tested:** "Is focusDistance exactly 0.20?" - irrelevant.

---

## Contract Update Workflow

1. **Implement** based on goals and invariants
2. **Test** on real devices
3. **Measure** performance and success rate
4. **Learn** what actually works
5. **Update contract** with learnings
6. **Iterate**

Contract evolves as understanding deepens.

---

## Key Takeaways

### Simple vs Complex

| Aspect | Simple Domain | Complex Domain |
|--------|---------------|----------------|
| Contract | Precise specification | Goals + invariants |
| Implementation | Predetermined | Emergent |
| Variants | All listed | Discovered |
| Testing | All scenarios | Goals + invariants |
| Changes | Rare | Frequent (learning) |

### When to Use Complex Approach

- Solution is unknown upfront
- High variance in environments (devices, networks)
- Requires experimentation
- Performance optimization needed
- Integration with unpredictable external systems

### Mistakes to Avoid

1. **Over-specifying** in Complex domain (false precision)
2. **Under-specifying** in Simple domain (missed requirements)
3. **Not updating contract** after learnings
4. **Treating all problems as Complex** (some are Simple!)

---

**Summary:** Complex domain contracts define *what must be true* and *boundaries*, not *how to implement*. Solution emerges through experimentation and measurement.
