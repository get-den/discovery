<script>
  import LoadingSpinner from './LoadingSpinner.svelte';
  
  export let value = '';
  export let placeholder = 'What are you looking for?';
  export let disabled = false;
  export let onSubmit = () => {};
  
  let focused = false;
  let inputElement;

  function handleSubmit(e) {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSubmit(value.trim());
  }

  function handleFocus() {
    focused = true;
  }

  function handleBlur() {
    focused = false;
  }

  function handleKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  export function focus() {
    inputElement?.focus();
  }
</script>

<form on:submit={handleSubmit} class="search-form">
  <div class="search-container" class:focused>
    <input
      bind:this={inputElement}
      bind:value
      on:focus={handleFocus}
      on:blur={handleBlur}
      on:keydown={handleKeydown}
      {placeholder}
      {disabled}
      autocomplete="off"
      class="search-input"
    />
    {#if value.length > 0}
      <button type="submit" {disabled} class="search-button" title="Search">
        {#if disabled}
          <LoadingSpinner size="sm" inline={true} />
        {:else}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12h14m-7-7 7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        {/if}
      </button>
    {/if}
  </div>
</form>

<style>
  .search-form {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
  }

  .search-container {
    position: relative;
    width: 100%;
    border: 1px solid #e1e5e9;
    border-radius: 24px;
    background: #ffffff;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
    transform: translateY(0);
  }

  .search-container.focused {
    border-color: #1a1a1a;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }

  .search-input {
    width: 100%;
    padding: 16px 24px;
    border: none;
    background: transparent;
    font-size: 16px;
    color: #1a1a1a;
    outline: none;
    border-radius: 24px;
  }

  .search-input::placeholder {
    color: #6b7280;
  }

  .search-button {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    width: 32px;
    height: 32px;
    border: none;
    background: #1a1a1a;
    color: #ffffff;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0;
    animation: slideIn 0.3s ease forwards;
  }

  .search-button:hover:not(:disabled) {
    background: #000000;
    transform: translateY(-50%) scale(1.05);
  }

  .search-button:active:not(:disabled) {
    transform: translateY(-50%) scale(0.95);
  }

  .search-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: translateY(-50%);
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-50%) scale(0.8);
    }
    to {
      opacity: 1;
      transform: translateY(-50%) scale(1);
    }
  }


  @media (max-width: 640px) {
    .search-input {
      padding: 14px 20px;
      font-size: 16px;
    }
  }
</style>