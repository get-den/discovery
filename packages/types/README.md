@shared/types

Shared TypeScript types for the Restaurant monorepo.

Usage

- Backend (Node/Express, TS commonjs):
  
  import type { Restaurant, RestaurantList } from '@shared/types';
  
  const list: RestaurantList = [
    { id: '1', name: 'Pasta Place' }
  ];

- Frontend (Svelte/Vite):
  
  import type { Restaurant } from '@shared/types';
  
  export let data: Restaurant[] = [];

Note: always use `import type` so bundlers erase the import at runtime.

Dev

This package is types-only. You can optionally build .d.ts files for IDEs:

    npm -w @shared/types run build

In the repo root, install dependencies with workspaces enabled:

    npm install
