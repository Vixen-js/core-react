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
import {
  addNewEventListener,
  cleanEventListener,
  throwUnsupported
} from "../utils/helpers";
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

type FileDialogSignals = DialogProps & Partial<QFileDialogSignals>;

export interface FileDialogProps extends FileDialogSignals {
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
    },
    set onCurrentChange(callback: (value: string) => void) {
      cleanEventListener<keyof QFileDialogSignals>(
        widget,
        "onCurrentChange",
        oldProps.onCurrentChange,
        newProps
      );
      addNewEventListener<keyof QFileDialogSignals>(
        widget,
        "onCurrentChange",
        callback
      );
    },
    set onCurrentUrlChange(callback: (value: string) => void) {
      cleanEventListener<keyof QFileDialogSignals>(
        widget,
        "onCurrentUrlChange",
        oldProps.onCurrentUrlChange,
        newProps
      );
      addNewEventListener<keyof QFileDialogSignals>(
        widget,
        "onCurrentUrlChange",
        callback
      );
    },
    set onDirectoryEnter(callback: (value: string) => void) {
      cleanEventListener<keyof QFileDialogSignals>(
        widget,
        "onDirectoryEnter",
        oldProps.onDirectoryEnter,
        newProps
      );
      addNewEventListener<keyof QFileDialogSignals>(
        widget,
        "onDirectoryEnter",
        callback
      );
    },
    set onDirectoryUrlEnter(callback: (value: string) => void) {
      cleanEventListener<keyof QFileDialogSignals>(
        widget,
        "onDirectoryUrlEnter",
        oldProps.onDirectoryUrlEnter,
        newProps
      );
      addNewEventListener<keyof QFileDialogSignals>(
        widget,
        "onDirectoryUrlEnter",
        callback
      );
    },
    set onFileSelect(callback: (value: string) => void) {
      cleanEventListener<keyof QFileDialogSignals>(
        widget,
        "onFileSelect",
        oldProps.onFileSelect,
        newProps
      );
      addNewEventListener<keyof QFileDialogSignals>(
        widget,
        "onFileSelect",
        callback
      );
    },
    set onFilesSelect(callback: (value: string[]) => void) {
      cleanEventListener<keyof QFileDialogSignals>(
        widget,
        "onFilesSelect",
        oldProps.onFilesSelect,
        newProps
      );
      addNewEventListener<keyof QFileDialogSignals>(
        widget,
        "onFilesSelect",
        callback
      );
    },
    set onFilterSelect(callback: (value: string) => void) {
      cleanEventListener<keyof QFileDialogSignals>(
        widget,
        "onFilterSelect",
        oldProps.onFilterSelect,
        newProps
      );
      addNewEventListener<keyof QFileDialogSignals>(
        widget,
        "onFilterSelect",
        callback
      );
    },
    set onUrlSelect(callback: (value: string) => void) {
      cleanEventListener<keyof QFileDialogSignals>(
        widget,
        "onUrlSelect",
        oldProps.onUrlSelect,
        newProps
      );
      addNewEventListener<keyof QFileDialogSignals>(
        widget,
        "onUrlSelect",
        callback
      );
    },
    set onUrlsSelect(callback: (value: string[]) => void) {
      cleanEventListener<keyof QFileDialogSignals>(
        widget,
        "onUrlsSelect",
        oldProps.onUrlsSelect,
        newProps
      );
      addNewEventListener<keyof QFileDialogSignals>(
        widget,
        "onUrlsSelect",
        callback
      );
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
