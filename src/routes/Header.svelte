<script>
  import github from '$lib/images/github.svg';
  import logo from '$lib/images/neenaryad.svg';
  import { showSidebar } from '$lib/store/layout';
  import { Button } from 'flowbite-svelte';
  import { Icon } from 'flowbite-svelte-icons';
  import './header.css';

  const toggleSidebar = () => {
    showSidebar.update((val) => !val);
  };
</script>

<header>
  <div class="corner w-fit">
    <Button id="header-button" class="m-0 px-4 py-2 w-fit" on:click={toggleSidebar}>
      <div id="header-icon" class="mr-4">
        <Icon
          id="header-icon-menu"
          name="bars-solid"
          class="text-nnry-900 w-8 h-8 object-contain absolute"
        />
        <img id="header-icon-brand" src={logo} alt="Neenaryad" class="w-8 h-8 object-contain" />
      </div>
      <div class="text-nnry-900 font-bold leading-4">Neenaryad</div>
    </Button>
  </div>

  <div class="corner">
    <a href="https://github.com/sveltejs/kit">
      <img src={github} alt="GitHub" />
    </a>
  </div>
</header>

<style lang="postcss">
  header {
    display: flex;
    justify-content: space-between;
  }

  .corner {
    height: 3em;
  }
</style>
