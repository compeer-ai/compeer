<script lang="ts">
  import { page } from "$app/state";
  import classNames from "classnames";
  import Logo from "./Logo.svelte";
  import { Home, Settings2 } from "@lucide/svelte";
  import Icon from "./Icon.svelte";

  function isActive(pathname: typeof page.url.pathname) {
    return page.url.pathname === pathname;
  }
</script>

<div class="w-100 flex flex-col justify-between">
  <div class=" space-y-7"  data-sveltekit-preload-data="hover">
    <div class="border-b border-gray-300 px-7 h-18 items-center flex">
      <a href={`/`}>
        <Logo />
      </a>
    </div>
    <div class="space-y-3 flex flex-col px-7 font-medium">
      <a href={`/`}>
        <div
          class={classNames(
            "space-x-2 flex items-center hover:text-black transition ease-in-out cursor-pointer",
            {
              "text-black": isActive(`/`),
            },
          )}
        >
          <Icon icon={Home} size={15} strokeWidth={2} />
          <span>Home</span>
        </div>
      </a>
      <a href={`/settings`}>
        <div
          class={classNames(
            "space-x-2 flex items-center hover:text-black transition ease-in-out cursor-pointer",
            {
              "text-black": isActive(`/settings`),
            },
          )}
        >
          <Icon icon={Settings2} size={15} strokeWidth={2} />
          <span>Settings</span>
        </div>
      </a>
    </div>
  </div>
</div>
