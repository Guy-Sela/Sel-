  <script>
    // #region agent log
    function logDebug(message, data) {
      fetch('http://127.0.0.1:7242/ingest/5ebad5ab-ee66-4a15-a5dc-b510049d514c', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: 'session-witness.html',
          message,
          data,
          timestamp: Date.now(),
          sessionId: 'debug-session'
        })
      }).catch(() => {});
    }
    // #endregion
  </script>

