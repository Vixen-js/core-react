import {
  QLabel,
  QLabelSignals,
  QWidget,
  TextInteractionFlag
} from "@vixen-js/core";
import { setViewProps, ViewProps } from "./View";
import { ComponentConfig, registerComponent, VWidget } from "./Config";
import { throwUnsupported } from "../utils/helpers";
import { AppContainer } from "../reconciler";
import { Fiber } from "react-reconciler";

type TextSignals = ViewProps & Partial<QLabelSignals>;
export interface TextProps extends TextSignals {
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
  static tagName = "text";
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

class TextConfig extends ComponentConfig {
  tagName = VText.tagName;
  shouldSetTextContent(_nextProps: TextProps): boolean {
    return true;
  }
  createInstance(
    newProps: TextProps,
    _rootInstance: AppContainer,
    _context: any,
    _workInProgress: Fiber
  ): VText {
    const widget = new VText();
    widget.setProps(newProps, {});
    return widget;
  }
  commitMount(
    instance: VText,
    newProps: TextProps,
    _internalInstanceHandle: any
  ): void {
    if (newProps.visible !== false) {
      instance.show();
    }
    return;
  }
  finalizeInitialChildren(
    _instance: VText,
    _newProps: TextProps,
    _rootContainerInstance: AppContainer,
    _context: any
  ): boolean {
    return true;
  }
  commitUpdate(
    instance: VText,
    _updatePayload: any,
    oldProps: TextProps,
    newProps: TextProps
  ): void {
    instance.setProps(newProps, oldProps);
  }
}

export const Text = registerComponent<TextProps>(new TextConfig());
