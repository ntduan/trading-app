export function CSP() {
  return (
    <meta
      httpEquiv="Content-Security-Policy"
      content="
        default-src 'self'; 
        script-src 'self' 'unsafe-inline'; 
        style-src 'self' 'unsafe-inline';
        connect-src *;
        object-src 'none'; 
        frame-src 'self' blob:;"
    />
  );
}
