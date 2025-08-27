<script lang="ts">
  import DebugPanel from './components/DebugPanel.svelte';

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  type Restaurant = {
    id?: string;
    name: string;
    city?: string;
    state?: string;
    cuisine?: string;
    rating?: number;
    website?: string;
    address?: string;
  };

  let userInput = $state<string>('');
  let sending = $state<boolean>(false);
  let error = $state<string>('');
  let assistant = $state<string>('');
  let restaurants = $state<Restaurant[]>([]);

  // Derived state for input validation
  let isValidInput = $derived(userInput.trim().length > 0);

  async function sendMessage(e?: Event) {
    e?.preventDefault?.();
    error = '';
    if (!isValidInput) return;
    
    sending = true;
    try {
      const res = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput.trim() }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Request failed with ${res.status}`);
      }
      const data = await res.json();
      assistant = (data?.assistant as string) || '';
      restaurants = Array.isArray(data?.restaurants)
        ? (data.restaurants as Restaurant[])
        : [];
    } catch (e) {
      error = (e as Error)?.message || 'Failed to send message';
    } finally {
      sending = false;
    }
  }
</script>

<main>
  <DebugPanel />

  <section class="chat">
    <form on:submit|preventDefault={sendMessage} aria-label="Send message">
      <input
        class="chat-input"
        type="text"
        placeholder="Type your message"
        bind:value={userInput}
        autocomplete="off"
      />
      <button class="chat-send" type="submit" disabled={sending || !isValidInput}>
        {sending ? 'Sending…' : 'Send'}
      </button>
    </form>

    {#if error}
      <p class="status error" role="alert">{error}</p>
    {/if}

    {#if assistant}
      <div class="assistant" aria-live="polite">{assistant}</div>
    {/if}

    {#if restaurants && restaurants.length > 0}
      <ul class="results" aria-live="polite">
        {#each restaurants as r}
          <li>
            <strong>{r.name}</strong>
            {#if r.city}
              <span> — {r.city}{#if r.state}, {r.state}{/if}</span>
            {/if}
            {#if r.cuisine}
              <span> · {r.cuisine}</span>
            {/if}
            {#if r.rating}
              <span> · {r.rating}★</span>
            {/if}
          </li>
        {/each}
      </ul>
    {/if}
  </section>
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
    min-height: 100vh;
    padding-top: 64px; /* space for debug bar */
    display: grid;
    place-items: center;
  }
  .chat { width: min(720px, 92vw); }
  .chat form {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 8px;
  }
  .chat-input {
    padding: 12px 14px;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
    background: #ffffff;
    color: #0f172a;
    box-shadow: 0 1px 2px rgba(0,0,0,0.04);
  }
  .chat-input::placeholder { color: #94a3b8; }
  .chat-send {
    padding: 12px 16px;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
    background: #ffffff;
    color: #0f172a;
    cursor: pointer;
    box-shadow: 0 1px 2px rgba(0,0,0,0.04);
  }
  .chat-send[disabled] { opacity: 0.7; cursor: not-allowed; }
  .status { margin: 12px 0 0; color: #fecaca; }
  .assistant { margin: 16px 0 0; font-size: 1.1rem; }
  .results { margin: 12px 0 0; padding-left: 20px; }
  .results li { margin: 6px 0; }
</style>
