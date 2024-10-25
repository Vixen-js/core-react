import { Option } from "@vixen-js/core";

export interface DialogOption<T = Option> {
  option: T;
  on: boolean;
}
