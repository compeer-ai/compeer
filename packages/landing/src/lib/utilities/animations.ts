import { animate } from "motion/mini";

function fadeOutRightLeft(element: HTMLElement, predicate: boolean = true) {
  element.style.opacity = "0";
  element.style.transform = "translateX(8px) scale(0.99)";
  element.style.filter = "blur(2px)";

  animate(
    element,
    {
      opacity: 1,
      transform: "translateX(0px) scale(1)",
      filter: "blur(0px)",
    },
    { duration: 0.12, ease: "easeOut" },
  );

  return {
    destroy() {},
  };
}


export const animations = {
  fadeOutRightLeft,
};
