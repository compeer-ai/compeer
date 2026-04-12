<script lang="ts">
  interface Props {
    brand: string;
    alt: string;
    height: number;
    width: number;
  }

  const { brand, alt, height, width }: Props = $props();
</script>

<img
  src={`https://simpleicons.org/icons/${brand}.svg`}
  {alt}
  {height}
  {width}
/>
