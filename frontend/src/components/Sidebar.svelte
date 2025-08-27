<script lang="ts">
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  type Restaurant = {
    id?: string;
    name: string;
    city?: string;
    state?: string;
    cuisine?: string;
  };

  type HealthResponse = {
    status: string;
  };

  type ActionEvent = {
    type: 'health' | 'health_error' | 'restaurants_loaded' | 'restaurants_error' | 'clear';
    status?: string;
    error?: string;
    restaurants?: Restaurant[];
  };

  interface Props {
    onaction?: (event: ActionEvent) => void;
  }

  let { onaction }: Props = $props();

  let healthStatus = $state<string>('');
  let restaurants = $state<Restaurant[]>([]);
  let listing = $state<boolean>(false);
  let listError = $state<string>('');
  let pinging = $state<boolean>(false);

  // Derived states for UI logic
  let hasRestaurants = $derived(restaurants.length > 0);
  let isLoading = $derived(pinging || listing);
  let hasHealthStatus = $derived(healthStatus.length > 0);
  let isHealthy = $derived(healthStatus.includes('Health: ok'));

  async function pingHealth() {
    healthStatus = '';
    listError = '';
    pinging = true;
    
    try {
      const res = await fetch(`${BACKEND_URL}/health`);
      const data: HealthResponse = await res.json();
      healthStatus = `Health: ${data.status}`;
      onaction?.({ type: 'health', status: data.status });
    } catch (e) {
      healthStatus = 'Health check failed';
      onaction?.({ type: 'health_error', error: (e as Error).message });
    } finally {
      pinging = false;
    }
  }

  async function listRestaurants() {
    listError = '';
    healthStatus = '';
    listing = true;
    
    try {
      const res = await fetch(`${BACKEND_URL}/restaurants`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Request failed with ${res.status}`);
      }
      const data = await res.json();
      restaurants = Array.isArray(data) ? data : [];
      if (restaurants.length === 0) {
        listError = 'No restaurants found.';
      }
      onaction?.({ type: 'restaurants_loaded', restaurants });
    } catch (err) {
      const errorMessage = (err as Error).message || 'Failed to load restaurants';
      listError = errorMessage;
      restaurants = [];
      onaction?.({ type: 'restaurants_error', error: errorMessage });
    } finally {
      listing = false;
    }
  }

  function clearResults() {
    healthStatus = '';
    listError = '';
    restaurants = [];
    onaction?.({ type: 'clear' });
  }
</script>

<aside class="sidebar" aria-label="Navigation panel">
  <div class="sidebar-header">
    <h2>Tools</h2>
  </div>

  <div class="sidebar-content">
    <div class="controls">
      <button type="button" on:click={pingHealth} disabled={pinging} class="control-button">
        <span class="button-icon">🔍</span>
        <span class="button-text">{pinging ? 'Pinging...' : 'Health Check'}</span>
      </button>
      
      <button type="button" on:click={listRestaurants} disabled={listing} class="control-button">
        <span class="button-icon">📋</span>
        <span class="button-text">{listing ? 'Loading...' : 'List All'}</span>
      </button>

      <button type="button" on:click={clearResults} class="control-button secondary">
        <span class="button-icon">🗑️</span>
        <span class="button-text">Clear</span>
      </button>
    </div>

    {#if hasHealthStatus}
      <div class="status-message" class:success={isHealthy}>
        {healthStatus}
      </div>
    {/if}

    {#if listError}
      <div class="status-message error">{listError}</div>
    {/if}

    {#if hasRestaurants}
      <div class="restaurants-section">
        <h3>All Restaurants</h3>
        <ul class="restaurant-list" aria-live="polite">
          {#each restaurants as restaurant}
            <li class="restaurant-item">
              <strong class="restaurant-name">{restaurant.name}</strong>
              {#if restaurant.city}
                <div class="restaurant-location">
                  {restaurant.city}{#if restaurant.state}, {restaurant.state}{/if}
                </div>
              {/if}
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </div>
</aside>

<style>
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 280px;
    background: #ffffff;
    border-right: 1px solid #e1e5e9;
    display: flex;
    flex-direction: column;
    z-index: 1000;
    box-shadow: 2px 0 12px rgba(0, 0, 0, 0.05);
  }

  .sidebar-header {
    padding: 20px 24px 16px;
    border-bottom: 1px solid #f3f4f6;
  }

  .sidebar-header h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #1a1a1a;
  }

  .sidebar-content {
    flex: 1;
    padding: 24px;
    overflow-y: auto;
  }

  .controls {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .control-button {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border: 1px solid #e1e5e9;
    border-radius: 8px;
    background: #ffffff;
    color: #1a1a1a;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
    text-align: left;
    width: 100%;
  }

  .control-button:hover:not([disabled]) {
    background: #f8f9fa;
    border-color: #d1d5db;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .control-button:active:not([disabled]) {
    transform: translateY(0);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .control-button.secondary {
    border-color: #f3f4f6;
    color: #6b7280;
  }

  .control-button.secondary:hover:not([disabled]) {
    background: #f9fafb;
    color: #374151;
  }

  .control-button[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .button-icon {
    font-size: 16px;
    filter: grayscale(1);
  }

  .button-text {
    flex: 1;
  }

  .status-message {
    margin-top: 16px;
    padding: 12px 16px;
    border-radius: 8px;
    background: #f8f9fa;
    color: #374151;
    font-size: 14px;
    border-left: 3px solid #d1d5db;
  }

  .status-message.success {
    background: #f0fdf4;
    color: #166534;
    border-left-color: #22c55e;
  }

  .status-message.error {
    background: #fef2f2;
    color: #dc2626;
    border-left-color: #ef4444;
  }

  .restaurants-section {
    margin-top: 32px;
  }

  .restaurants-section h3 {
    margin: 0 0 16px;
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
  }

  .restaurant-list {
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 300px;
    overflow-y: auto;
  }

  .restaurant-item {
    padding: 12px 0;
    border-bottom: 1px solid #f3f4f6;
  }

  .restaurant-item:last-child {
    border-bottom: none;
  }

  .restaurant-name {
    display: block;
    color: #1a1a1a;
    font-weight: 500;
    font-size: 14px;
  }

  .restaurant-location {
    color: #6b7280;
    font-size: 13px;
    margin-top: 2px;
  }

  @media (max-width: 768px) {
    .sidebar {
      width: 100%;
      height: auto;
      position: relative;
      box-shadow: none;
      border-right: none;
      border-bottom: 1px solid #e1e5e9;
    }

    .sidebar-content {
      padding: 16px;
    }

    .controls {
      flex-direction: row;
      flex-wrap: wrap;
    }

    .control-button {
      flex: 1;
      min-width: 0;
    }
  }
</style>