<script lang="ts">
	import { page } from "$app/state";

  interface Props {
    title?: string;
    description?: string;
    ogImage?: string;
    type?: "website" | "article" | "profile";
    siteName?: string;
    locale?: string;
    twitterSite?: string;
    twitterCreator?: string;
    keywords?: string;
    publishedTime?: string;
    author?: string;
  }

  const url = page.url;
  const defaultOgImage = new URL("/og_image.png", page.url.origin)
  const {
    title = "Compeer",
    description = "Compeer: the open-source and confirgurable context layer for agents",
    ogImage: image = defaultOgImage.toString(),
    type = "website",
    siteName = "Compeer",
    locale = "en_US",
    twitterSite,
    twitterCreator,
    keywords,
    publishedTime,
    author,
  }: Props = $props();
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  {#if keywords}
    <meta name="keywords" content={keywords} />
  {/if}
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={image} />
  <meta property="og:type" content={type} />
  <meta property="og:site_name" content={siteName} />
  <meta property="og:locale" content={locale} />
<meta property="og:url" content={url.toString()} />
  {#if publishedTime}
    <meta property="article:published_time" content={publishedTime} />
  {/if}
  {#if author}
    <meta property="article:author" content={author} />
  {/if}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={image} />
  {#if twitterSite}
    <meta name="twitter:site" content={twitterSite} />
  {/if}
  {#if twitterCreator}
    <meta name="twitter:creator" content={twitterCreator} />
  {/if}
  {#if url}
    <link rel="canonical" href={url.href} />
  {/if}
</svelte:head>
