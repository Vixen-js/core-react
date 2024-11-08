import { QCheckBox, QCheckBoxSignals, QWidget } from "@vixen-js/core";
import { AbstractButtonProps, setAbstractButtonProps } from "./AbstractButton";
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

type CheckboxSignals = AbstractButtonProps & Partial<QCheckBoxSignals>;
/**
 * The Checkbox component provides ability to add and manipulate native button widgets.
 * ## Example
 * ```javascript
 * import React from "react";
 * import { Renderer, CheckBox, Window } from "@vixen-js/core-react";
 * const App = () => {
 *   return (
 *     <Window>
 *       <CheckBox style={checkboxStyle} text={"Hello World"} checked={true} />
 *     </Window>
 *   );
 * };
 * const checkboxStyle = `
 *   color: white;
 * `;
 * Renderer.render(<App />);
 * ```
 */
export interface CheckboxProps extends CheckboxSignals {
  checked?: boolean;
}

const setCheckboxProps = (
  widget: VCheckbox,
  newProps: CheckboxProps,
  oldProps: CheckboxProps
) => {
  const setter: CheckboxProps = {
    set checked(checked: boolean) {
      widget.setChecked(checked);
    },
    set onStateChange(callbackFn: (state: number) => void) {
      cleanEventListener<keyof QCheckBoxSignals>(
        widget,
        "onStateChange",
        oldProps.onStateChange,
        newProps
      );
      addNewEventListener<keyof QCheckBoxSignals>(
        widget,
        "onStateChange",
        callbackFn
      );
    }
  };
  Object.assign(setter, newProps);
  setAbstractButtonProps(widget, newProps, oldProps);
};

export class VCheckbox extends QCheckBox implements VWidget {
  static tagName = "checkbox";
  setProps(newProps: CheckboxProps, oldProps: CheckboxProps): void {
    setCheckboxProps(this, newProps, oldProps);
  }
  appendChild(_child: QWidget<any>): void {
    throwUnsupported(this);
  }
  appendInitialChild(_child: QWidget<any>): void {
    throwUnsupported(this);
  }
  insertBefore(_child: QWidget<any>, _beforeChild: QWidget<any>): void {
    throwUnsupported(this);
  }
  removeChild(_child: QWidget<any>): void {
    throwUnsupported(this);
  }
}

class CheckboxConfig extends ComponentConfig {
  tagName = VCheckbox.tagName;
  shouldSetTextContent(_nextProps: VProps): boolean {
    return true;
  }
  createInstance(
    props: VProps,
    _root: AppContainer,
    _context?: any,
    _worInProgress?: Fiber
  ): VComponent {
    const widget = new VCheckbox();
    widget.setProps(props, {});
    return widget;
  }
  finalizeInitialChildren(
    _instance: VComponent,
    _newProps: VProps,
    _root: AppContainer,
    _ctx: any
  ): boolean {
    return true;
  }
  commitMount(
    _instance: VCheckbox,
    _newProps: CheckboxProps,
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

export const Checkbox = registerComponent<CheckboxProps>(new CheckboxConfig());
