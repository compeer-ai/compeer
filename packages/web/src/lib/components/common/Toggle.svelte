<script lang="ts">
  interface Props {
    label?: string;
    checked: boolean;
    onToggled?: (checked: boolean) => void;
    name?: string;
  }
  let { label, checked, name, onToggled }: Props = $props();
</script>

<label class="flex items-center space-x-3 h-5 cursor-pointer">
  <input
    type="checkbox"
    {name}
    class="sr-only peer"
    bind:checked
    onchange={() => onToggled?.(checked)}
  />
  <div
    class="relative w-9 h-5 shadow-sm shadow-gray-100 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-buffer after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"
  ></div>
  {#if label}
    <span class="select-none text-black font-medium">{label}</span>
  {/if}
</label>
