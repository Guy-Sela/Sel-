**project specific**

## Visual state debugging

For React bugs involving refs, conditional rendering, or mount timing, render state directly into the DOM instead of using `console.log`:

```tsx
<div className="fixed top-2 left-2 z-[9999] bg-yellow-400 text-black text-xs p-1 font-mono">
  visible:{String(trailVisible)} path:{trailPath || "EMPTY"}
</div>
