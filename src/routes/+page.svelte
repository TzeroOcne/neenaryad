<script>
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
  <h1>Tzero Ocne</h1>
  <p>👋 Hello, I'm Tzero Ocne! Welcome to on of my app.</p>
  <h2>About Me</h2>
  <p>
    I'm a free programmer. What does "free programmer" means?
    It just mean that I do programming stuff whenever I'm free.
    I'm passionate about some maybe stuff that I'll add probably
    later and enjoy another stuff.
  </p>
</section>

<style lang="postcss">
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 0.6;
    @apply text-[#b143ff];
  }

  h1 {
    @apply font-bold;
  }

  h2 {
    @apply font-bold;
  }
</style>
