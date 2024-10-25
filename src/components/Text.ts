import {
  QLabel,
  QLabelSignals,
  QWidget,
  TextInteractionFlag
} from "@vixen-js/core";
import { setViewProps, ViewProps } from "./View";
import { VWidget } from "./Config";
import { throwUnsupported } from "../utils/helpers";

export interface TextProps extends ViewProps<QLabelSignals> {
  children?: string | number | Array<string | number>;
  wordWrap?: boolean;
  scaledContents?: boolean;
  openExternalLinks?: boolean;
  textInteractionFlags?: TextInteractionFlag;
}

export const setTextProps = (
  widget: VText,
  newProps: TextProps,
  oldProps: TextProps
) => {
  const setter: TextProps = {
    set children(text: string | number | Array<string | number>) {
      text = Array.isArray(text) ? text.join("") : text;
      widget.setText(text);
    },
    set wordWrap(wordWrap: boolean) {
      widget.setWordWrap(wordWrap);
    },
    set scaledContents(scaled: boolean) {
      widget.setProperty("scaledContents", scaled);
    },
    set openExternalLinks(openExternalLinks: boolean) {
      widget.setProperty("openExternalLinks", openExternalLinks);
    },
    set textInteractionFlags(textInteractionFlags: TextInteractionFlag) {
      widget.setProperty("textInteractionFlags", textInteractionFlags);
    }
  };
  Object.assign(setter, newProps);
  setViewProps(widget, newProps, oldProps);
};

export class VText extends QLabel implements VWidget {
  setProps(newProps: TextProps, oldProps: TextProps): void {
    setTextProps(this, newProps, oldProps);
  }

  appendInitialChild(_child: QWidget<any>): void {
    throwUnsupported(this);
  }

  appendChild(_child: QWidget<any>): void {
    throwUnsupported(this);
  }
  insertBefore(_child: QWidget<any>, _beforeChild: QWidget<any>): void {
    throwUnsupported(this);
  }
  removeChild(_child: QWidget<any>): void {
    throwUnsupported(this);
  }
}
