<script lang="ts">
  import { showSidebar } from '$lib/store/layout';
  import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
  import './sidebar.css';
</script>

<div id="sidebar-root" class:show={$showSidebar} class="min-w-[256px]">
  <Sidebar class="w-full h-full">
    <SidebarWrapper class="rounded-none h-full dark:bg-nnrygray-700">
      <SidebarGroup id="sidebar-group">
        <SidebarItem label="Home" href="/" />
        <SidebarItem label="Category" href="/category" />
        <SidebarItem label="Tag" href="/tag" />
        <SidebarItem label="Entry" href="/entry" />
        <SidebarItem label="Bookmark" href="/bookmark" />
      </SidebarGroup>
    </SidebarWrapper>
  </Sidebar>
</div>
