• I'm on MacBook Pro 2014, Big Sur 11.7.11.
• Communicate in plain English — when using technical terms or acronyms explain them in parenthesis.
• Be succinct — answer in under 300 chars unless strictly necessary to elaborate.
• No guesswork — find out root causes via debugging.
• No starting from scratch — look online for the most relevant and up to date official docs, tutorials, and established best practices.
• Do not run commands or write code unless explicitly asked to.
• code review/review plan/or such, means looking for vulnerabilities as well as optimization opportunities.
• be token aware — no verbosity or wasteful operations if there's a cheaper way to achieve the same aim.

--
## Visual state debugging

For React bugs involving refs, conditional rendering, or mount timing, render state directly into the DOM instead of using `console.log`:

```tsx
<div className="fixed top-2 left-2 z-[9999] bg-yellow-400 text-black text-xs p-1 font-mono">
  visible:{String(trailVisible)} path:{trailPath || "EMPTY"}
</div>
