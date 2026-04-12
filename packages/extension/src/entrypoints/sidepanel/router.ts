import { createRouter } from "sv-router";
import NoCapture from "./views/NoCapture.svelte";
import Selection from "./views/Selection.svelte";
import Success from "./views/Sucess.svelte";

export const { p, navigate, isActive, route } = createRouter({
  "/": NoCapture,
  "/capture": {
    "/selection": Selection,
    "/success": Success,
  },
});
