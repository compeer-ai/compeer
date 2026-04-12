import { random } from "./random";

export function delay<T>(promise: Promise<T>, ms?: number): Promise<T> {
  if (!ms) {
    ms = random.choice(550, 700, 675, 600);
  }
  return new Promise((resolve) => {
    setTimeout(() => resolve(promise), ms);
  });
}
