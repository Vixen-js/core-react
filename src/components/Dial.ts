import { QDial, QDialSignals, QWidget } from "@vixen-js/core";
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
import { Fiber } from "react-reconciler";
import { AppContainer } from "../reconciler";

type DialSignals = ViewProps & Partial<QDialSignals>;

/**
 * The Dial provides ability to add and manipulate native dial slider widgets. It is based on
 * ## Example
 * ```javascript
 * import React from "react";
 * import { Renderer, Dial, Window } from "@vixen-js/core-react";
 * const App = () => {
 *   return (
 *     <Window>
 *       <Dial />
 *     </Window>
 *   );
 * };
 * Renderer.render(<App />);
 * ```
 */
export interface DialProps extends DialSignals {
  notchesVisible?: boolean;
  wrapping?: boolean;
  notchTarget?: number;
}

const setDialProps = (
  widget: VDial,
  newProps: DialProps,
  oldProps: DialProps
) => {
  const setter: DialProps = {
    set notchesVisible(notchesVisible: boolean) {
      widget.setNotchesVisible(notchesVisible);
    },
    set wrapping(wrapping: boolean) {
      widget.setWrapping(wrapping);
    },
    set netchTarget(target: number) {
      widget.setNotchTarget(target);
    },
    //Event Listeners
    set onActionTrigger(callback: (action: number) => void) {
      cleanEventListener<keyof QDialSignals>(
        widget,
        "onActionTrigger",
        oldProps.onActionTrigger,
        callback
      );
      addNewEventListener<keyof QDialSignals>(
        widget,
        "onActionTrigger",
        callback
      );
    },
    set onRangeChange(callback: (min: number, max: number) => void) {
      cleanEventListener<keyof QDialSignals>(
        widget,
        "onRangeChange",
        oldProps.onRangeChange,
        callback
      );
      addNewEventListener<keyof QDialSignals>(
        widget,
        "onRangeChange",
        callback
      );
    },
    set onSliderMove(callback: (value: number) => void) {
      cleanEventListener<keyof QDialSignals>(
        widget,
        "onSliderMove",
        oldProps.onSliderMove,
        callback
      );
      addNewEventListener<keyof QDialSignals>(widget, "onSliderMove", callback);
    },
    set onSliderPress(callback: () => void) {
      cleanEventListener<keyof QDialSignals>(
        widget,
        "onSliderPress",
        oldProps.onSliderPress,
        callback
      );
      addNewEventListener<keyof QDialSignals>(
        widget,
        "onSliderPress",
        callback
      );
    },
    set onSliderRelease(callback: () => void) {
      cleanEventListener<keyof QDialSignals>(
        widget,
        "onSliderRelease",
        oldProps.onSliderRelease,
        callback
      );
      addNewEventListener<keyof QDialSignals>(
        widget,
        "onSliderRelease",
        callback
      );
    },
    set onValueChange(callback: (value: number) => void) {
      cleanEventListener<keyof QDialSignals>(
        widget,
        "onValueChange",
        oldProps.onValueChange,
        callback
      );
      addNewEventListener<keyof QDialSignals>(
        widget,
        "onValueChange",
        callback
      );
    }
  };
  Object.assign(setter, newProps);
  setViewProps(widget, newProps, oldProps);
};

export class VDial extends QDial implements VWidget {
  static tagName = "dial";
  setProps(newProps: DialProps, oldProps?: DialProps): void {
    setDialProps(this, newProps, oldProps || {});
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

class DialConfig extends ComponentConfig {
  tagName = VDial.tagName;
  shouldSetTextContent(_nextProps: VProps): boolean {
    return true;
  }
  createInstance(
    props: VProps,
    _root: AppContainer,
    _context?: any,
    _worInProgress?: Fiber
  ): VComponent {
    const widget = new VDial();
    widget.setProps(props, {});
    return widget;
  }
  commitMount(
    _instance: VDial,
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

export const Dial = registerComponent<DialProps>(new DialConfig());
