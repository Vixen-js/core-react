import {
  EchoMode,
  InputDialogOptions,
  InputMode,
  QInputDialog,
  QInputDialogSignals,
  QWidget
} from "@vixen-js/core";
import { DialogProps, setDialogProps } from "./Dialog";
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

type InputDialogSignals = DialogProps & Partial<QInputDialogSignals>;
export interface InputDialogProps extends InputDialogSignals {
  cancelButtonText?: string;
  selectEditable?: boolean;
  doubleDecimals?: number;
  doubleMax?: number;
  docubleMin?: number;
  doubleStep?: number;
  doubleValue?: number;
  inputMode?: InputMode;
  intMax?: number;
  intMin?: number;
  intValue?: number;
  labelText?: string;
  okButtonText?: string;
  options?: InputDialogOptions;
  textEchoMode?: EchoMode;
  textvalue?: string;
}

const setInputDialogProps = (
  widget: VInputDialog,
  newProps: InputDialogProps,
  oldProps: InputDialogProps
) => {
  const setter: InputDialogProps = {
    set cancelButtonText(text: string) {
      widget.setCancelButtonText(text);
    },
    set selectEditable(editable: boolean) {
      widget.setComboBoxEditable(editable);
    },
    set doubleDecimals(decimals: number) {
      widget.setDoubleDecimals(decimals);
    },
    set doubleMax(max: number) {
      widget.setDoubleMaximum(max);
    },
    set doubleMin(min: number) {
      widget.setDoubleMinimum(min);
    },
    set doubleStep(step: number) {
      widget.setDoubleStep(step);
    },
    set doubleValue(value: number) {
      widget.setDoubleValue(value);
    },
    set inputMode(mode: InputMode) {
      widget.setInputMode(mode);
    },
    set intMax(max: number) {
      widget.setIntMaximum(max);
    },
    set intMin(min: number) {
      widget.setIntMinimum(min);
    },
    set intValue(value: number) {
      widget.setIntValue(value);
    },
    set labelText(label: string) {
      widget.setLabelText(label);
    },
    set okButtonText(text: string) {
      widget.setOkButtonText(text);
    },
    set options(options: InputDialogOptions) {
      widget.setOptions(options);
    },
    set textEchoMode(echoMode: EchoMode) {
      widget.setTextEchoMode(echoMode);
    },
    set textValue(text: string) {
      widget.setTextValue(text);
    },
    set onDoubleValueChange(callback: (value: number) => void) {
      cleanEventListener<keyof QInputDialogSignals>(
        widget,
        "onDoubleValueChange",
        oldProps.onDoubleValueChange,
        callback
      );
      addNewEventListener<keyof QInputDialogSignals>(
        widget,
        "onDoubleValueChange",
        callback
      );
    },
    set onDoubleValueSelect(callback: (value: number) => void) {
      cleanEventListener<keyof QInputDialogSignals>(
        widget,
        "onDoubleValueSelect",
        oldProps.onDoubleValueSelect,
        callback
      );
      addNewEventListener<keyof QInputDialogSignals>(
        widget,
        "onDoubleValueSelect",
        callback
      );
    },
    set onIntValueChange(callback: (value: number) => void) {
      cleanEventListener<keyof QInputDialogSignals>(
        widget,
        "onIntValueChange",
        oldProps.onIntValueChange,
        callback
      );
      addNewEventListener<keyof QInputDialogSignals>(
        widget,
        "onIntValueChange",
        callback
      );
    },
    set onIntValueSelect(callback: (value: number) => void) {
      cleanEventListener<keyof QInputDialogSignals>(
        widget,
        "onIntValueSelect",
        oldProps.onIntValueSelect,
        callback
      );
      addNewEventListener<keyof QInputDialogSignals>(
        widget,
        "onIntValueSelect",
        callback
      );
    },
    set onTextValueChange(callback: (text: string) => void) {
      cleanEventListener<keyof QInputDialogSignals>(
        widget,
        "onTextValueChange",
        oldProps.onTextValueChange,
        callback
      );
      addNewEventListener<keyof QInputDialogSignals>(
        widget,
        "onTextValueChange",
        callback
      );
    },
    set onTextValueSelect(callback: (text: string) => void) {
      cleanEventListener<keyof QInputDialogSignals>(
        widget,
        "onTextValueSelect",
        oldProps.onTextValueSelect,
        callback
      );
      addNewEventListener<keyof QInputDialogSignals>(
        widget,
        "onTextValueSelect",
        callback
      );
    }
  };
  Object.assign(setter, newProps);
  setDialogProps(widget, newProps, oldProps);
};

export class VInputDialog extends QInputDialog implements VWidget {
  static tagName = "input-dialog";
  setProps(newProps: VProps, oldProps: VProps): void {
    setInputDialogProps(this, newProps, oldProps);
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

class InputDialogConfig extends ComponentConfig {
  tagName = VInputDialog.tagName;
  shouldSetTextContent(_nextProps: VProps): boolean {
    return false;
  }
  createInstance(
    props: VProps,
    _root: AppContainer,
    _context?: any,
    _worInProgress?: Fiber
  ): VComponent {
    const widget = new VInputDialog();
    widget.setProps(props, {});
    return widget;
  }
  commitMount(
    instance: VInputDialog,
    newProps: VProps,
    _internalInstanceHandle: any
  ): void {
    if (newProps.visible !== false && newProps.open !== false) {
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

export const InputDialog = registerComponent<InputDialogProps>(
  new InputDialogConfig()
);
