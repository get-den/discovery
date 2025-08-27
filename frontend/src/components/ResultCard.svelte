<script lang="ts">
  type Restaurant = {
    id?: string;
    name: string;
    city?: string;
    state?: string;
    cuisine?: string;
    rating?: number;
  };

  type Result = {
    type: 'success' | 'assistant' | 'restaurants' | 'error';
    message?: string;
    data?: any[] | Restaurant[];
  };

  interface Props {
    result?: Result | null;
  }

  let { result = null }: Props = $props();

  // Derived states for UI logic
  let hasResult = $derived(result !== null);
  let isSuccess = $derived(result?.type === 'success');
  let isAssistant = $derived(result?.type === 'assistant' && !!result?.message);
  let isRestaurants = $derived(result?.type === 'restaurants' && Array.isArray(result?.data) && result.data.length > 0);
  let isError = $derived(result && !isSuccess && !isAssistant && !isRestaurants);
</script>

{#if hasResult}
  <div class="result-section">
    {#if isSuccess}
      <div class="result-card">
        <h3>Result</h3>
        <pre class="result-data">{JSON.stringify(result.data, null, 2)}</pre>
      </div>
    {:else if isAssistant}
      <div class="assistant-card">
        <div class="assistant-message">{result.message}</div>
      </div>
    {:else if isRestaurants}
      <div class="restaurants-card">
        <h3>Restaurants</h3>
        <ul class="restaurant-list">
          {#each result.data as restaurant}
            <li class="restaurant-item">
              <strong class="restaurant-name">{restaurant.name}</strong>
              {#if restaurant.city}
                <span class="restaurant-location">
                  — {restaurant.city}{#if restaurant.state}, {restaurant.state}{/if}
                </span>
              {/if}
              {#if restaurant.cuisine}
                <span class="restaurant-cuisine">· {restaurant.cuisine}</span>
              {/if}
              {#if restaurant.rating}
                <span class="restaurant-rating">· {restaurant.rating}★</span>
              {/if}
            </li>
          {/each}
        </ul>
      </div>
    {:else if isError}
      <div class="error-card">
        <p>{result.message || 'Something went wrong'}</p>
      </div>
    {/if}
  </div>
{/if}

<style>
  .result-section {
    margin-top: 32px;
    width: 100%;
    opacity: 0;
    transform: translateY(20px);
    animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  @keyframes slideUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .result-card,
  .assistant-card,
  .restaurants-card {
    border: 1px solid #e1e5e9;
    border-radius: 12px;
    padding: 24px;
    background: #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .result-card h3,
  .restaurants-card h3 {
    margin: 0 0 16px;
    font-size: 18px;
    font-weight: 600;
    color: #1a1a1a;
  }

  .result-data {
    background: #f8f9fa;
    border: 1px solid #e1e5e9;
    border-radius: 8px;
    padding: 16px;
    font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
    font-size: 14px;
    color: #1a1a1a;
    overflow: auto;
    margin: 0;
    white-space: pre-wrap;
  }

  .assistant-message {
    font-size: 16px;
    line-height: 1.6;
    color: #1a1a1a;
  }

  .restaurant-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .restaurant-item {
    padding: 12px 0;
    border-bottom: 1px solid #f3f4f6;
  }

  .restaurant-item:last-child {
    border-bottom: none;
  }

  .restaurant-name {
    color: #1a1a1a;
    font-weight: 600;
  }

  .restaurant-location,
  .restaurant-cuisine,
  .restaurant-rating {
    color: #6b7280;
    font-size: 14px;
  }

  .error-card {
    border: 1px solid #fecaca;
    border-radius: 12px;
    padding: 16px 24px;
    background: #fef2f2;
    color: #dc2626;
  }

  .error-card p {
    margin: 0;
  }
</style>