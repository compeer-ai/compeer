<script lang="ts">
  interface Props {
    name: string;
    label: string;
    placeholder: string;
    required?: boolean;
    value?: unknown;
  }

  const { label, placeholder, name, value, required }: Props = $props();
</script>

<label class="flex flex-col space-y-3">
  <div class="flex space-x-1 leading-none font-medium text-black">
    <span
      >{label} <span class="text-sm text-red-600"> {required ? "*" : ""}</span>
    </span>
  </div>
  <textarea
    rows={4}
    {required}
    {name}
    class="appearance-none rounded-lg border border-gray-300 p-3 shadow-sm shadow-gray-100 placeholder:text-gray-400 focus:outline-0"
    {placeholder}>{value}</textarea
  >
</label>
