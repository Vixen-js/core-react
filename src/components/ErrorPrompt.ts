import { QErrorMessage, QErrorMessageSignals, QWidget } from "@vixen-js/core";
import { DialogProps, setDialogProps } from "./Dialog";
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

type ErrorPromptSignals = DialogProps & Partial<QErrorMessageSignals>;
export interface ErrorPromptProps extends ErrorPromptSignals {
  message: string;
}

const setErrorPromptProps = (
  widget: VErrorPrompt,
  newProps: ErrorPromptProps,
  oldProps: ErrorPromptProps
) => {
  const setter: ErrorPromptProps = {
    set message(message: string) {
      widget.showMessage(message);
      widget.close();
    }
  };
  Object.assign(setter, newProps);
  setDialogProps(widget, newProps, oldProps);
};

export class VErrorPrompt extends QErrorMessage implements VWidget {
  static tagName = "error-prompt";
  setProps(newProps: ErrorPromptProps, oldProps: ErrorPromptProps): void {
    setErrorPromptProps(this, newProps, oldProps);
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

class ErrorPromptConfig extends ComponentConfig {
  tagName = VErrorPrompt.tagName;
  shouldSetTextContent(_nextProps: VProps): boolean {
    return false;
  }
  createInstance(
    props: ErrorPromptProps,
    _root: AppContainer,
    _context?: any,
    _worInProgress?: Fiber
  ): VComponent {
    const widget = new VErrorPrompt();
    widget.setProps(props, {} as any);
    return widget;
  }
  commitMount(
    _instance: VErrorPrompt,
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

export const ErrorPrompt = registerComponent<ErrorPromptProps>(
  new ErrorPromptConfig()
);
