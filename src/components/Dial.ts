import { QDial, QDialSignals, QWidget } from "@vixen-js/core";
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

export interface DialProps extends ViewProps<QDialSignals> {
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
