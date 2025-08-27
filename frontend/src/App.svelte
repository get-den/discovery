<script lang="ts">
  import DebugPanel from './components/DebugPanel.svelte';
  import { type Restaurant } from '@shared/types'

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

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
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
    background: #fafaf9;
    color: #1f2937;
  }
  main {
    min-height: 100vh;
    padding: 80px 20px 40px;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .chat { 
    width: 100%;
    max-width: 680px;
    margin: 0 auto;
  }
  
  .chat form {
    position: relative;
    margin-bottom: 32px;
  }
  
  .chat-input {
    width: 100%;
    padding: 18px 60px 18px 20px;
    border-radius: 28px;
    border: 1.5px solid #e5e7eb;
    background: #ffffff;
    color: #1f2937;
    font-size: 16px;
    line-height: 1.5;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04);
    transition: all 0.2s ease;
    outline: none;
    box-sizing: border-box;
  }
  
  .chat-input:focus {
    border-color: #3b82f6;
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.15), 0 2px 4px rgba(0, 0, 0, 0.04);
  }
  
  .chat-input::placeholder { 
    color: #9ca3af;
    font-weight: 400;
  }
  
  .chat-send {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    padding: 8px 16px;
    border-radius: 20px;
    border: none;
    background: #3b82f6;
    color: white;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
  }
  
  .chat-send:hover:not(:disabled) {
    background: #2563eb;
    box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
  }
  
  .chat-send:disabled { 
    opacity: 0.6; 
    cursor: not-allowed;
    background: #9ca3af;
    box-shadow: none;
  }
  
  .status { 
    margin: 16px 0;
    padding: 12px 16px;
    border-radius: 12px;
    background: #fef2f2;
    color: #dc2626;
    border: 1px solid #fecaca;
  }
  
  .assistant { 
    margin: 24px 0;
    padding: 20px;
    background: white;
    border-radius: 16px;
    font-size: 16px;
    line-height: 1.6;
    border: 1px solid #e5e7eb;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }
  
  .results { 
    margin: 24px 0;
    list-style: none;
    padding: 0;
  }
  
  .results li { 
    margin: 12px 0;
    padding: 16px 20px;
    background: white;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
    line-height: 1.5;
  }
</style>
