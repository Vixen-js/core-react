import { QPushButton, QPushButtonSignals, QWidget } from "@vixen-js/core";
import { AbstractButtonProps, setAbstractButtonProps } from "./AbstractButton";
import {
  ComponentConfig,
  registerComponent,
  VComponent,
  VProps,
  VWidget
} from "./Config";
import { throwUnsupported } from "../utils/helpers";
import { AppContainer, Ctx } from "../reconciler";
import { Fiber } from "react-reconciler";

type ButtonSignals = AbstractButtonProps & Partial<QPushButtonSignals>;

/**
 * The Button component provides ability to add and manipulate native button widgets.
 * ## Example
 * ```javascript
 * import React from "react";
 * import { Renderer, Button, Window } from "@vixen-js/core-react";
 * const App = () => {
 *   return (
 *     <Window>
 *       <Button style={buttonStyle} text={"Hello World"} />
 *     </Window>
 *   );
 * };
 * const buttonStyle = `
 *   color: white;
 * `;
 * Renderer.render(<App />);
 * ```
 */
export interface ButtonProps extends ButtonSignals {
  /**
   * Check if the button has border raised.
   */
  flat?: boolean;
}

const setButtonProps = (
  widget: VButton,
  newProps: ButtonProps,
  oldProps: ButtonProps
) => {
  const setter: ButtonProps = {
    set flat(flat: boolean) {
      widget.setFlat(flat);
    }
  };
  Object.assign(setter, newProps);
  setAbstractButtonProps(widget, newProps, oldProps);
};

export class VButton extends QPushButton implements VWidget {
  static tagName = "button";
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

  setProps(newProps: VProps, oldProps: VProps): void {
    setButtonProps(this, newProps, oldProps);
  }
}

class ButtonConfig extends ComponentConfig {
  tagName = VButton.tagName;
  shouldSetTextContent(_nextProps: VProps): boolean {
    return true;
  }

  createInstance(
    newProps: ButtonProps,
    _root: AppContainer,
    _context?: any,
    _worInProgress?: Fiber
  ): VButton {
    const widget = new VButton();
    widget.setProps(newProps, {});
    return widget;
  }
  commitMount(
    _instance: VButton,
    _newProps: VProps,
    _internalInstanceHandle: any
  ): void {
    if (_newProps.visible !== false) {
      _instance.show();
    }
  }
  finalizeInitialChildren(
    _instance: VComponent,
    _newProps: VProps,
    _root: AppContainer,
    _ctx: Ctx
  ): boolean {
    return true;
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

export const Button = registerComponent<ButtonProps>(new ButtonConfig());
