<script lang="ts">
  interface Props {
    label: string;
    placeholder: string;
    required?: boolean;
    value?: unknown;
    name: string;
  }

  const { label, placeholder, value, required, name }: Props = $props();

  let textareaRef: HTMLTextAreaElement;
  let lineNumbersRef: HTMLDivElement;
  let textValue = $derived(value?.toString() ?? "");

  function lineCount(text: string): number {
    if (!text) return 1;
    return text.split("\n").length;
  }

  function handleInput(event: Event) {
    textValue = (event.target as HTMLTextAreaElement).value;
  }

  function syncScroll() {
    if (lineNumbersRef && textareaRef) {
      lineNumbersRef.scrollTop = textareaRef.scrollTop;
    }
  }
</script>

<label class="flex flex-col space-y-3">
  <div class="flex space-x-1 leading-none font-medium text-black">
    <span
      >{label} <span class="text-sm text-red-600"> {required ? "*" : ""}</span>
    </span>
  </div>
  <div
    class="flex border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm shadow-gray-100"
  >
    <div
      bind:this={lineNumbersRef}
      class="bg-gray-100 border-r border-gray-200 py-3 px-2 overflow-hidden select-none font-mono text-sm text-gray-400 text-right"
    >
      {#each Array(lineCount(textValue)) as _, i}
        <div class="h-5.25 leading-5.25">{i + 1}</div>
      {/each}
    </div>
    <textarea
      bind:this={textareaRef}
      rows={4}
      class="flex-1 py-3 px-3 border-none outline-none resize-y font-mono text-sm leading-5.25 bg-transparent min-h-24 focus:ring-0 placeholder:text-gray-400"
      {placeholder}
      {name}
      oninput={handleInput}
      onscroll={syncScroll}>{value}</textarea
    >
  </div>
</label>
