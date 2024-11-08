import {
  FlexLayout,
  FocusReason,
  QDialog,
  QDialogSignals,
  QFont,
  QWidget
} from "@vixen-js/core";
import { setViewProps, ViewProps } from "./View";
import {
  ComponentConfig,
  registerComponent,
  VComponent,
  VProps,
  VWidget
} from "./Config";
import { AppContainer, Ctx } from "../reconciler";
import { Fiber } from "react-reconciler";
import { addNewEventListener, cleanEventListener } from "../utils/helpers";

type DialogSignals = ViewProps & Partial<QDialogSignals>;
export interface DialogProps extends DialogSignals {
  open?: boolean;
  font?: QFont;
  focus?: FocusReason;
  modal?: boolean;
  result?: number;
  reject?: boolean;
  enableSizeGrip?: boolean;
}

export const setDialogProps = (
  widget: VDialog,
  newProps: DialogProps,
  oldProps: DialogProps
) => {
  const setter: DialogProps = {
    set open(open: boolean) {
      if (open) {
        widget.open();
      } else {
        widget.close();
      }
    },
    set font(font: QFont) {
      widget.setFont(font);
    },
    set focus(focus: FocusReason) {
      widget.setFocus(focus);
    },
    set modal(modal: boolean) {
      widget.setModal(modal);
    },
    set reject(_reject: boolean) {
      if (_reject) {
        widget.reject();
      }
    },
    set result(result: number) {
      widget.setResult(result);
    },
    set enableSizeGrip(enableSizeGrip: boolean) {
      widget.setSizeGripEnabled(enableSizeGrip);
    },
    // Event Listeners
    set onAccept(callback: () => void) {
      cleanEventListener<keyof QDialogSignals>(
        widget,
        "onAccept",
        oldProps.onAccept,
        newProps
      );
      addNewEventListener<keyof QDialogSignals>(widget, "onAccept", callback);
    },
    set onFinish(callback: (result: number) => void) {
      cleanEventListener<keyof QDialogSignals>(
        widget,
        "onFinish",
        oldProps.onFinish,
        newProps
      );
      addNewEventListener<keyof QDialogSignals>(widget, "onFinish", callback);
    },
    set onReject(callback: () => void) {
      cleanEventListener<keyof QDialogSignals>(
        widget,
        "onReject",
        oldProps.onReject,
        newProps
      );
      addNewEventListener<keyof QDialogSignals>(widget, "onReject", callback);
    }
  };
  Object.assign(setter, newProps);
  setViewProps(widget, newProps, oldProps);
};

export class VDialog extends QDialog implements VWidget {
  static tagName = "dialog";
  setProps(newProps: VProps, oldProps: VProps): void {
    setDialogProps(this, newProps, oldProps);
  }
  appendInitialChild(child: QWidget<any>): void {
    this.appendChild(child);
  }

  appendChild(child: QWidget<any>): void {
    if (!child || child instanceof QDialog) {
      return;
    }

    if (!this.layout()) {
      const flex = new FlexLayout();
      flex.setFlexNode(this.getFlexNode());
      this.setLayout(flex);
    }
    this.layout()!.addWidget(child);
  }

  insertBefore(child: QWidget<any>, _beforeChild: QWidget<any>): void {
    if (child! instanceof QDialog) {
      this.appendChild(child);
    }
  }

  removeChild(child: QWidget<any>): void {
    if (!this.layout()) {
      console.warn("parent hasn't layout to remove child from");
      return;
    }

    this.layout()!.removeWidget(child);
    child.close();
  }
}

class DialogConfig extends ComponentConfig {
  tagName = VDialog.tagName;
  shouldSetTextContent(_nextProps: VProps): boolean {
    return false;
  }
  finalizeInitialChildren(
    _instance: VComponent,
    _newProps: VProps,
    _root: AppContainer,
    _ctx: Ctx
  ): boolean {
    return true;
  }
  createInstance(
    props: VProps,
    _root: AppContainer,
    _context?: any,
    _worInProgress?: Fiber
  ): VComponent {
    const widget = new VDialog();
    widget.setProps(props, {});
    return widget;
  }
  commitMount(
    _instance: VDialog,
    _newProps: VProps,
    _internalInstanceHandle: any
  ): void {
    if (_newProps.visible !== false && _newProps.open !== false) {
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

export const Dialog = registerComponent<DialogProps>(new DialogConfig());
