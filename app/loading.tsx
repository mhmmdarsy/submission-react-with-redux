export default function Loading() {
  return (
    <>
      <div className="navbar-loading" aria-hidden="true">
        <div className="navbar-loading-bar" />
      </div>
      <main className="center-loading">
        <p>Loading page...</p>
      </main>
    </>
  );
}
