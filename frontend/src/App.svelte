<script>
  import DebugPanel from './components/DebugPanel.svelte';

  // Main app minimalist input (no backend wiring yet)
  let userInput = '';
  function sendMessage(e) {
    e?.preventDefault?.();
    // Intentionally left without functionality for now
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
      <button class="chat-send" type="submit">Send</button>
    </form>
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
</style>
