<script>
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  let name = '';
  let submitting = false;
  let message = '';
  let created = null;

  async function submitRestaurant(e) {
    e.preventDefault();
    message = '';
    created = null;
    if (!name.trim()) {
      message = 'Please enter a restaurant name.';
      return;
    }
    submitting = true;
    try {
      const res = await fetch(`${BACKEND_URL}/restaurants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Request failed with ${res.status}`);
      }
      const data = await res.json();
      created = data;
      message = 'Created!';
      name = '';
    } catch (err) {
      message = err.message || 'Something went wrong';
    } finally {
      submitting = false;
    }
  }
  async function pingHealth() {
    message = '';
    try {
      const res = await fetch(`${BACKEND_URL}/health`);
      const data = await res.json();
      message = `Health: ${data.status}`;
    } catch (e) {
      message = 'Health check failed';
    }
  }
</script>

<main>
  <h1>Mock Frontend</h1>
  <p style="opacity:0.8">Temporary input that calls backend</p>

  <form on:submit|preventDefault={submitRestaurant} aria-label="Create restaurant">
    <input
      placeholder="Enter restaurant name"
      bind:value={name}
      disabled={submitting}
      autocomplete="off"
    />
    <button disabled={submitting} type="submit">{submitting ? 'Submitting…' : 'Create'}</button>
    <button type="button" on:click={pingHealth} disabled={submitting}>Ping health</button>
  </form>

  {#if message}
    <p role="status">{message}</p>
  {/if}

  {#if created}
    <pre>{JSON.stringify(created, null, 2)}</pre>
  {/if}
</main>

<style>
  :global(html, body) {
    height: 100%;
    margin: 0;
    padding: 0;
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu,
      Cantarell, Noto Sans, Helvetica, Arial, 'Apple Color Emoji',
      'Segoe UI Emoji';
    background: #0f172a;
    color: #e2e8f0;
  }
  main {
    display: grid;
    gap: 16px;
    place-items: start center;
    min-height: 100vh;
    padding-top: 10vh;
  }
  h1 { font-weight: 700; margin: 0; }
  form { display: flex; gap: 8px; }
  input { padding: 8px 10px; border-radius: 6px; border: 1px solid #334155; background: #0b1224; color: #e2e8f0; }
  button { padding: 8px 12px; border-radius: 6px; border: 1px solid #334155; background: #1e293b; color: #e2e8f0; cursor: pointer; }
  button[disabled] { opacity: 0.6; cursor: not-allowed; }
  pre { background: #0b1224; padding: 12px; border-radius: 8px; border: 1px solid #334155; max-width: 80ch; overflow: auto; }
  p[role="status"] { margin: 0; }
</style>
