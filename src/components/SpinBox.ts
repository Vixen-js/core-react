import { QSpinBox, QSpinBoxSignals, QWidget } from "@vixen-js/core";
import { setViewProps, ViewProps } from "./View";
import { ComponentConfig, registerComponent, VWidget } from "./Config";
import {
  addNewEventListener,
  cleanEventListener,
  throwUnsupported
} from "../utils/helpers";
import { AppContainer } from "../reconciler";
import { Fiber } from "react-reconciler";

type Range = {
  minimum: number;
  maximum: number;
};

type SpinBoxSignals = ViewProps & Partial<QSpinBoxSignals>;

export interface SpinBoxProps extends SpinBoxSignals {
  prefix?: string;
  suffix?: string;
  singleStep?: number;
  range?: Range;
  value?: number;
}

const setSpinBoxProps = (
  widget: VSpinBox,
  newProps: SpinBoxProps,
  oldProps: SpinBoxProps
) => {
  const setter: SpinBoxProps = {
    set prefix(prefix: string) {
      widget.setPrefix(prefix);
    },
    set suffix(suffix: string) {
      widget.setSuffix(suffix);
    },
    set singleStep(step: number) {
      widget.setSingleStep(step);
    },
    set range(range: Range) {
      widget.setRange(range.minimum, range.maximum);
    },
    set value(value: number) {
      widget.setValue(value);
    },
    set onValueChange(callback: (value: number) => void) {
      cleanEventListener<keyof QSpinBoxSignals>(
        widget,
        "onValueChange",
        oldProps.onValueChange,
        callback
      );
      addNewEventListener<keyof QSpinBoxSignals>(
        widget,
        "onValueChange",
        callback
      );
    }
  };
  Object.assign(setter, newProps);
  setViewProps(widget, newProps, oldProps);
};

export class VSpinBox extends QSpinBox implements VWidget {
  static tagName = "spin-box";
  setProps(newProps: SpinBoxProps, oldProps: SpinBoxProps): void {
    setSpinBoxProps(this, newProps, oldProps);
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

class SpinBoxConfig extends ComponentConfig {
  tagName = VSpinBox.tagName;
  shouldSetTextContent(_nextProps: SpinBoxProps): boolean {
    return true;
  }
  createInstance(
    newProps: SpinBoxProps,
    _rootInstance: AppContainer,
    _context: any,
    _workInProgress: Fiber
  ): VSpinBox {
    const widget = new VSpinBox();
    widget.setProps(newProps, {});
    return widget;
  }
  finalizeInitialChildren(
    _instance: VSpinBox,
    _newProps: SpinBoxProps,
    _rootContainerInstance: AppContainer,
    _context: any
  ): boolean {
    return true;
  }
  commitMount(
    instance: VSpinBox,
    newProps: SpinBoxProps,
    _internalInstanceHandle: any
  ): void {
    if (newProps.visible !== false) {
      instance.show();
    }
    return;
  }
  commitUpdate(
    instance: VSpinBox,
    _updatePayload: any,
    oldProps: SpinBoxProps,
    newProps: SpinBoxProps
  ): void {
    instance.setProps(newProps, oldProps);
  }
}

export const SpinBox = registerComponent<SpinBoxProps>(new SpinBoxConfig());
