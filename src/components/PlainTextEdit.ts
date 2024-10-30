import { QPlainTextEdit, QPlainTextEditSignals, QWidget } from "@vixen-js/core";
import { setViewProps, ViewProps } from "./View";
import {
  ComponentConfig,
  registerComponent,
  VComponent,
  VProps,
  VWidget
} from "./Config";
import { throwUnsupported } from "../utils/helpers";
import { Fiber } from "react-reconciler";
import { AppContainer } from "../reconciler";

export interface PlainTextEditProps extends ViewProps<QPlainTextEditSignals> {
  text?: string;
  readOnly?: boolean;
  placeholder?: string;
}

const setPlainTextEditProps = (
  widget: VPlainTextEdit,
  newProps: PlainTextEditProps,
  oldProps: PlainTextEditProps
) => {
  const setter: PlainTextEditProps = {
    set text(text: string) {
      widget.setPlainText(text);
    },
    set readOnly(readOnly: boolean) {
      widget.setReadOnly(readOnly);
    },
    set placeholder(placeholder: string) {
      widget.setPlaceholderText(placeholder);
    }
  };
  Object.assign(setter, newProps);
  setViewProps(widget, newProps, oldProps);
};

export class VPlainTextEdit extends QPlainTextEdit implements VWidget {
  static tagName = "plaintext-edit";
  setProps(newProps: VProps, oldProps: VProps): void {
    setPlainTextEditProps(this, newProps, oldProps);
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

class PlainTextEditConfig extends ComponentConfig {
  tagName = VPlainTextEdit.tagName;
  shouldSetTextContent(_nextProps: VProps): boolean {
    return true;
  }

  createInstance(
    props: VProps,
    _root: AppContainer,
    _context?: any,
    _worInProgress?: Fiber
  ): VComponent {
    const widget = new VPlainTextEdit();
    widget.setProps(props, {});
    return widget;
  }

  commitMount(
    _instance: VPlainTextEdit,
    _newProps: VProps,
    _internalInstanceHandle: any
  ): void {
    if (_newProps.visible !== false) {
      _instance.show();
    }
  }

  commitUpdate(
    instance: VComponent,
    _updatePayload: any,
    oldProps: VProps,
    newProps: VProps,
    _root: AppContainer
  ): void {
    instance.setProps(newProps, oldProps);
  }
}

export const PlainTextEdit = registerComponent<PlainTextEditProps>(
  new PlainTextEditConfig()
);
