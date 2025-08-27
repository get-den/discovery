<script>
  export let size = 'md';
  export let inline = false;
</script>

<div class="spinner-container" class:inline>
  <div class="spinner" class:sm={size === 'sm'} class:lg={size === 'lg'}></div>
</div>

<style>
  .spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }

  .spinner-container.inline {
    display: inline-flex;
    padding: 0;
  }

  .spinner {
    width: 24px;
    height: 24px;
    border: 2px solid #e1e5e9;
    border-top: 2px solid #1a1a1a;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .spinner.sm {
    width: 16px;
    height: 16px;
    border-width: 1.5px;
  }

  .spinner.lg {
    width: 32px;
    height: 32px;
    border-width: 3px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>