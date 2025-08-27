<script>
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  let message = '';
  let restaurants = [];
  let listing = false;
  let listError = '';
  let pinging = false;

  async function pingHealth() {
    message = '';
    listError = '';
    pinging = true;
    try {
      const res = await fetch(`${BACKEND_URL}/health`);
      const data = await res.json();
      message = `Health: ${data.status}`;
    } catch (e) {
      message = 'Health check failed';
    } finally {
      pinging = false;
    }
  }

  async function listRestaurants() {
    listError = '';
    message = '';
    listing = true;
    try {
      const res = await fetch(`${BACKEND_URL}/restaurants`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Request failed with ${res.status}`);
      }
      restaurants = await res.json();
      if (!Array.isArray(restaurants)) restaurants = [];
      if (restaurants.length === 0) listError = 'No restaurants found.';
    } catch (err) {
      listError = err.message || 'Failed to load restaurants';
      restaurants = [];
    } finally {
      listing = false;
    }
  }
</script>

<aside class="debug" aria-label="Debug panel">
  <div class="controls">
    <button type="button" on:click={pingHealth} disabled={pinging}>
      {pinging ? 'Pinging…' : 'Ping health'}
    </button>
    <button type="button" on:click={listRestaurants} disabled={listing}>
      {listing ? 'Loading…' : 'List restaurants'}
    </button>
  </div>

  {#if message}
    <p class="status">{message}</p>
  {/if}

  {#if listError}
    <p class="status error">{listError}</p>
  {/if}

  {#if restaurants && restaurants.length > 0}
    <ul class="list" aria-live="polite">
      {#each restaurants as r}
        <li>
          <strong>{r.name}</strong>
          {#if r.city}
            <span> — {r.city}{#if r.state}, {r.state}{/if}</span>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</aside>

<style>
  .debug {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    box-sizing: border-box;
    padding: 8px 12px;
    background: rgba(2, 6, 23, 0.9);
    color: #e2e8f0;
    border-bottom: 1px solid #334155;
    backdrop-filter: saturate(180%) blur(10px);
  }
  .controls {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: center;
  }
  button {
    padding: 6px 10px;
    border-radius: 6px;
    border: 1px solid #334155;
    background: #1e293b;
    color: #e2e8f0;
    cursor: pointer;
  }
  button[disabled] { opacity: 0.6; cursor: not-allowed; }
  .status { margin: 6px 0 0; font-size: 0.9rem; }
  .status.error { color: #fecaca; }
  .list {
    margin: 8px 0 0;
    padding-left: 20px;
    max-height: 200px;
    overflow: auto;
  }
  .list li { margin: 4px 0; }
</style>

