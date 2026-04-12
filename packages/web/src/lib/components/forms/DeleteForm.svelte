<script lang="ts">
  import type { RemoteForm } from "@sveltejs/kit";
  import HiddenInput from "../common/HiddenInput.svelte";
  import Form from "../common/Form.svelte";
  import type { Snippet } from "svelte";

  interface Props {
    remote: RemoteForm<any, any>;
    toastMessage: string;
    onSuccess?: () => void;
    id: unknown;
    name?: string;
    children?: Snippet;
  }

  let {
    id,
    remote,
    name = "id",
    onSuccess,
    toastMessage,
    children,
  }: Props = $props();
</script>

<Form {remote} {onSuccess} submitButtonTitle="Confirm" {toastMessage}>
  <HiddenInput value={id} {name} />
  {@render children?.()}
</Form>
