import { QRadioButton, QRadioButtonSignals, QWidget } from "@vixen-js/core";
import { AbstractButtonProps, setAbstractButtonProps } from "./AbstractButton";
import { ComponentConfig, registerComponent, VWidget } from "./Config";
import { throwUnsupported } from "../utils/helpers";
import { AppContainer } from "../reconciler";
import { Fiber } from "react-reconciler";

export type RadioButtonProps = AbstractButtonProps<QRadioButtonSignals>;

const setRadioButtonProps = (
  widget: VRadioButton,
  newProps: RadioButtonProps,
  oldProps: RadioButtonProps
) => {
  const setter: RadioButtonProps = {
    // more setters to be added
  };
  Object.assign(setter, newProps);
  setAbstractButtonProps(widget, newProps, oldProps);
};

/**
 * @ignore
 */
export class VRadioButton extends QRadioButton implements VWidget {
  static tagName = "radio-button";
  setProps(newProps: RadioButtonProps, oldProps: RadioButtonProps): void {
    setRadioButtonProps(this, newProps, oldProps);
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

class RadioButtonConfig extends ComponentConfig {
  tagName = VRadioButton.tagName;
  shouldSetTextContent(_nextProps: RadioButtonProps): boolean {
    return true;
  }
  createInstance(
    newProps: RadioButtonProps,
    _rootInstance: AppContainer,
    _context: any,
    _workInProgress: Fiber
  ): VRadioButton {
    const widget = new VRadioButton();
    widget.setProps(newProps, {});
    return widget;
  }
  commitMount(
    instance: VRadioButton,
    newProps: RadioButtonProps,
    _internalInstanceHandle: any
  ): void {
    if (newProps.visible !== false) {
      instance.show();
    }
    return;
  }
  commitUpdate(
    instance: VRadioButton,
    _updatePayload: any,
    oldProps: RadioButtonProps,
    newProps: RadioButtonProps
  ): void {
    instance.setProps(newProps, oldProps);
  }
}

export const RadioButton = registerComponent<RadioButtonProps>(
  new RadioButtonConfig()
);
