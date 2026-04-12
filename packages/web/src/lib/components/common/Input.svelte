<script lang="ts">
  interface Props {
    label: string;
    placeholder: string;
    required?: boolean;
    value?: unknown;
    type?: string;
    name: string;
  }

  let {
    label,
    name,
    value = $bindable(),
    placeholder,
    required,
    type = "text",
  }: Props = $props();
</script>

<label for={name} class="flex flex-col space-y-3">
  <div class="space-x-1 flex font-medium text-black">
    <span
      >{label} <span class="text-sm text-red-600"> {required ? "*" : ""}</span>
    </span>
  </div>
  <input
    {name}
    {required}
    {type}
    {placeholder}
    id={name}
    bind:value
    class="h-12 outline-0 appearance-none rounded-lg border border-gray-300 px-3 shadow-sm shadow-gray-100 placeholder:text-gray-400"
  />
</label>
