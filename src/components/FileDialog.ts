import {
  DialogLabel,
  Option,
  QFileDialog,
  QFileDialogSignals,
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
import { throwUnsupported } from "../utils/helpers";
import { Fiber } from "react-reconciler";
import { AppContainer } from "../reconciler";

export interface FileDialogLabelText {
  label: DialogLabel;
  text: string;
}

export interface DialogOptions<T = Option> {
  option: T;
  on: boolean;
}

export interface FileDialogProps extends DialogProps<QFileDialogSignals> {
  defaultSuffix?: string;
  supportedSchemes?: string[];
  labelText?: FileDialogLabelText;
  option?: DialogOptions;

  options?: Option;
}

const setFielDialogProps = (
  widget: VFileDialog,
  newProps: FileDialogProps,
  oldProps: FileDialogProps
) => {
  const setter: FileDialogProps = {
    set defaultSuffix(suffix: string) {
      widget.setDefaultSuffix(suffix);
    },
    set supportedSchemes(schemes: string[]) {
      widget.setSupportedSchemes(schemes);
    },
    set labelText({ label, text }: FileDialogLabelText) {
      widget.setLabelText(label, text);
    },
    set option({ option, on }: DialogOptions) {
      widget.setOption(option, on);
    },
    set options(options: Option) {
      widget.setOptions(options);
    }
  };
  Object.assign(setter, newProps);
  setDialogProps(widget, newProps, oldProps);
};

export class VFileDialog extends QFileDialog implements VWidget {
  static tagName = "file-dialog";
  setProps(newProps: VProps, oldProps: VProps): void {
    setFielDialogProps(this, newProps, oldProps);
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

class FileDialogConfig extends ComponentConfig {
  tagName = VFileDialog.tagName;

  shouldSetTextContent(_nextProps: VProps): boolean {
    return false;
  }
  createInstance(
    props: VProps,
    _root: AppContainer,
    _context?: any,
    _worInProgress?: Fiber
  ): VComponent {
    const widget = new VFileDialog();
    widget.setProps(props, {});
    return widget;
  }
  commitMount(
    _instance: VFileDialog,
    _newProps: FileDialogProps,
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

export const FileDialog = registerComponent<FileDialogProps>(
  new FileDialogConfig()
);
