import {
  Orientation,
  QProgressBar,
  QProgressBarSignals,
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
import {
  addNewEventListener,
  cleanEventListener,
  throwUnsupported
} from "../utils/helpers";
import { AppContainer } from "../reconciler";
import { Fiber } from "react-reconciler";

type ProgressBarSignals = ViewProps & Partial<QProgressBarSignals>;
export interface ProgressBarProps extends ProgressBarSignals {
  value?: number;
  max?: number;
  min?: number;
  orientation?: Orientation;
}

const setProgressBarProps = (
  widget: VProgressBar,
  newProps: ProgressBarProps,
  oldProps: ProgressBarProps
) => {
  const setter: ProgressBarProps = {
    set value(value: number) {
      widget.setValue(value);
    },
    set max(max: number) {
      widget.setMaximum(max);
    },
    set min(min: number) {
      widget.setMinimum(min);
    },
    set orientation(orientation: Orientation) {
      widget.setOrientation(orientation);
    },
    set onValueChange(callback: (value: number) => void) {
      cleanEventListener<keyof QProgressBarSignals>(
        widget,
        "onValueChange",
        oldProps.onValueChange,
        newProps
      );
      addNewEventListener<keyof QProgressBarSignals>(
        widget,
        "onValueChange",
        callback
      );
    }
  };
  Object.assign(setter, newProps);
  setViewProps(widget, newProps, oldProps);
};

export class VProgressBar extends QProgressBar implements VWidget {
  static tagName = "progress-bar";
  setProps(newProps: ProgressBarProps, oldProps: ProgressBarProps) {
    setProgressBarProps(this, newProps, oldProps);
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

class ProgressBarConfig extends ComponentConfig {
  tagName = VProgressBar.tagName;
  shouldSetTextContent(_nextProps: VProps): boolean {
    return false;
  }

  createInstance(
    props: VProps,
    _root: AppContainer,
    _context?: any,
    _worInProgress?: Fiber
  ): VProgressBar {
    const widget = new VProgressBar();
    widget.setProps(props, {});
    return widget;
  }

  commitMount(
    instance: VProgressBar,
    newProps: VProps,
    _internalInstanceHandle: any
  ): void {
    if (newProps.visible !== false) {
      instance.show();
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

export const ProgressBar = registerComponent<ProgressBarProps>(
  new ProgressBarConfig()
);
