// src/svelte.d.ts
declare module "*.svelte" {
    const component: typeof import("svelte").SvelteComponent;
    export default component;
  }
  