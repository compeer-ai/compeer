<script lang="ts">
  interface Props {
    label: string;
    placeholder: string;
    required?: boolean;
    value?: unknown;
    name: string;
  }

  let {
    label,
    name,
    value = $bindable(),
    placeholder,
    required,
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
    {placeholder}
    type="file"
    id={name}
    bind:value
    class="h-12 file:h-12 file:border-r file:border-gray-300 file:pr-3 file:mr-3 file:bg-gray-300/10 file:cursor-pointer cursor-pointer outline-0 appearance-none rounded-lg border border-gray-300 px-3 shadow-sm shadow-gray-100 placeholder:text-gray-400 text-left"
  />
</label>
