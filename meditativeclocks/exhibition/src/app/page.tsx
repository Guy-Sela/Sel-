export default function Home() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-josefin tracking-widest">SELÀ</h1>
        <p className="text-sm text-muted-foreground uppercase tracking-widest animate-pulse">
          Loading Exhibition...
        </p>
        <script
          dangerouslySetInnerHTML={{
            __html: `var path = window.location.pathname;
if (path.endsWith('/index.html')) {
  path = path.slice(0, -'/index.html'.length);
}
if (path.endsWith('/')) {
  path = path.slice(0, -1);
}
window.location.href = path + '/conceptual-timing/';`,
          }}
        />
      </div>
    </div>
  );
}
