<script>
  import { browser } from '$app/environment';
  import { initializeDB } from '$lib/database';
  import '../app.css';
  import Header from './Header.svelte';
  import Sidebar from './Sidebar.svelte';
  import './styles.css';
  $: if (browser) initializeDB();
</script>

<div class="app w-full h-full">
  <Sidebar />
  <div class="grow flex flex-col">
    <Header />

    <main class="grow">
      <slot />
    </main>

    <footer>
      <p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p>
    </footer>
  </div>
</div>

<style lang="postcss">
  .app {
    display: flex;
    flex-direction: row;
  }

  main {
    @apply w-full px-16;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }

  footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 12px;
    @apply text-white;
  }

  footer a {
    font-weight: bold;
  }

  @media (min-width: 480px) {
    footer {
      padding: 12px 0;
    }
  }
</style>
