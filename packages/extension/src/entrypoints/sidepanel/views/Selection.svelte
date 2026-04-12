<script lang="ts">
  import Loading from "../../../lib/components/common/Loading.svelte";
  import Logo from "../../../lib/components/common/Logo.svelte";
  import ProjectSelection from "../../../lib/components/common/ProjectSelection.svelte";
  import { captureHandler } from "../../../lib/handlers/captureHandler";
  import { projectHandler } from "../../../lib/handlers/projectHandler";
  import { animations } from "../../../lib/utilities/animations";
  import { delay } from "../../../lib/utilities/delay";
  import { navigate } from "../router";

  let content = $state<string | undefined>();
  let highlight = $state<boolean | undefined>();

  onMount(async () => {
    const data = await browser.storage.local.get<{
      content?: string;
      highlight?: boolean;
    }>();
    if (data.content && data.highlight) {
      content = data.content;
      highlight = data.highlight;
    }
  });
</script>

<main class="overflow-y-auto p-5 text-base" use:animations.fadeInForward>
  <nav class="border-b border-gray-300 py-4 px-5">
    <Logo />
  </nav>
  {#await delay(projectHandler.read())}
    <Loading />
  {:then projects}
    <ProjectSelection
      {projects}
      onSelect={async (project) => {
        if (highlight) {
          await captureHandler.createTextCapture(content!!, project.id);
        } else {
          await captureHandler.createUrlCapture(content!!, project.id);
        }
      }}
      onFinish={() => navigate("/capture/success")}
    />
  {/await}
</main>
