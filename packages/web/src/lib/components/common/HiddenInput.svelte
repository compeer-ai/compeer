<script lang="ts">
  interface Props {
    name: string;
    value: unknown;
  }

  let { name, value }: Props = $props();
</script>

<input type="hidden" {name} {value} />
