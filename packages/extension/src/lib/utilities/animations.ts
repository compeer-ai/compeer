import { animate } from "motion/mini";

function fadeIn(element: HTMLElement, predicate: boolean = true) {
  if (predicate) {
    element.style.opacity = "0";
    element.style.filter = "blur(1px)";

    animate(
      element,
      {
        opacity: 1,
        filter: "blur(0px)",
      },
      { duration: 0.15, ease: "easeOut" }
    );
  }
}

function growToWidth(element: HTMLElement, width: string) {
  element.style.width = "0px";
  animate(
    element,
    { width },
    {
      duration: 0.25,
      ease: "easeOut",
    }
  );
}

function fadeInForward(element: HTMLElement, predicate: boolean = true) {
  if (predicate) {
    element.style.opacity = "0";
    element.style.transform = "scale(.99)";
    element.style.filter = "blur(2px)";

    animate(
      element,
      {
        opacity: 1,
        transform: "scale(1)",
        filter: "blur(0px)",
      },
      { duration: 0.15, ease: "easeOut" }
    );
  }
}

function fadeInForwardOnScroll(element: HTMLElement) {
  element.style.opacity = "0";
  element.style.transform = "scale(.99)";
  element.style.filter = "blur(2px)";

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        animate(
          element,
          {
            opacity: 1,
            transform: "scale(1)",
            filter: "blur(0px)",
          },
          { duration: 0.15, delay: 0.2, ease: "easeOut" }
        );
        observer.unobserve(element);
      }
    },
    { threshold: 0.5 }
  );

  observer.observe(element);

  return {
    destroy() {
      observer.disconnect();
    },
  };
}

function fadeOut(element: HTMLElement, predicate: boolean = true) {
  if (predicate) {
    element.style.opacity = "1";
    element.style.transform = "scale(1)";
    element.style.filter = "blur(0px)";

    animate(
      element,
      {
        opacity: 0,
        transform: "scale(.99)",
        filter: "blur(2px)",
      },
      { duration: 0.15, ease: "easeOut" }
    );
  }
}

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
    { duration: 0.15, ease: "easeOut" }
  );
}

export const animations = {
  fadeInForward,
  fadeOut,
  fadeIn,
  fadeOutRightLeft,
  fadeInForwardOnScroll,
  growToWidth,
};
