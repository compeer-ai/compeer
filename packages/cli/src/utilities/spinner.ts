import yoctoSpinner from "yocto-spinner";

export function spinner(title: string) {
  return yoctoSpinner({ text: title });
}
