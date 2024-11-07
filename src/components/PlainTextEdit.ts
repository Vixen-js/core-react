import { QPlainTextEdit, QPlainTextEditSignals, QWidget } from "@vixen-js/core";
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

type PlainTextEditSignals = ViewProps & Partial<QPlainTextEditSignals>;
export interface PlainTextEditProps extends PlainTextEditSignals {
  text?: string;
  readOnly?: boolean;
  placeholder?: string;
}

const setPlainTextEditProps = (
  widget: VPlainTextEdit,
  newProps: PlainTextEditProps,
  oldProps: PlainTextEditProps
) => {
  const setter: PlainTextEditProps = {
    set text(text: string) {
      widget.setPlainText(text);
    },
    set readOnly(readOnly: boolean) {
      widget.setReadOnly(readOnly);
    },
    set placeholder(placeholder: string) {
      widget.setPlaceholderText(placeholder);
    },
    set onTextChange(callback: () => void) {
      cleanEventListener<keyof QPlainTextEditSignals>(
        widget,
        "onTextChange",
        oldProps.onTextChange,
        callback
      );
      addNewEventListener<keyof QPlainTextEditSignals>(
        widget,
        "onTextChange",
        callback
      );
    },
    set onBlockCountChange(callback: (blockCount: number) => void) {
      cleanEventListener<keyof QPlainTextEditSignals>(
        widget,
        "onBlockCountChange",
        oldProps.onBlockCountChange,
        callback
      );
      addNewEventListener<keyof QPlainTextEditSignals>(
        widget,
        "onBlockCountChange",
        callback
      );
    },
    set onCopyAvailable(callback: (yes: boolean) => void) {
      cleanEventListener<keyof QPlainTextEditSignals>(
        widget,
        "onCopyAvailable",
        oldProps.onCopyAvailable,
        callback
      );
      addNewEventListener<keyof QPlainTextEditSignals>(
        widget,
        "onCopyAvailable",
        callback
      );
    },
    set onCursorPositionChange(callback: () => void) {
      cleanEventListener<keyof QPlainTextEditSignals>(
        widget,
        "onCursorPositionChange",
        oldProps.onCursorPositionChange,
        callback
      );
      addNewEventListener<keyof QPlainTextEditSignals>(
        widget,
        "onCursorPositionChange",
        callback
      );
    },
    set onModificationChange(callback: (changed: boolean) => void) {
      cleanEventListener<keyof QPlainTextEditSignals>(
        widget,
        "onModificationChange",
        oldProps.onModificationChange,
        callback
      );
      addNewEventListener<keyof QPlainTextEditSignals>(
        widget,
        "onModificationChange",
        callback
      );
    },
    set onRedoAvailable(callback: (available: boolean) => void) {
      cleanEventListener<keyof QPlainTextEditSignals>(
        widget,
        "onRedoAvailable",
        oldProps.onRedoAvailable,
        callback
      );
      addNewEventListener<keyof QPlainTextEditSignals>(
        widget,
        "onRedoAvailable",
        callback
      );
    },
    set onSelectionChange(callback: () => void) {
      cleanEventListener<keyof QPlainTextEditSignals>(
        widget,
        "onSelectionChange",
        oldProps.onSelectionChange,
        callback
      );
      addNewEventListener<keyof QPlainTextEditSignals>(
        widget,
        "onSelectionChange",
        callback
      );
    },
    set onUndoAvailable(callback: (available: boolean) => void) {
      cleanEventListener<keyof QPlainTextEditSignals>(
        widget,
        "onUndoAvailable",
        oldProps.onUndoAvailable,
        callback
      );
      addNewEventListener<keyof QPlainTextEditSignals>(
        widget,
        "onUndoAvailable",
        callback
      );
    }
  };
  Object.assign(setter, newProps);
  setViewProps(widget, newProps, oldProps);
};

export class VPlainTextEdit extends QPlainTextEdit implements VWidget {
  static tagName = "plaintext-edit";
  setProps(newProps: VProps, oldProps: VProps): void {
    setPlainTextEditProps(this, newProps, oldProps);
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

class PlainTextEditConfig extends ComponentConfig {
  tagName = VPlainTextEdit.tagName;
  shouldSetTextContent(_nextProps: VProps): boolean {
    return true;
  }

  createInstance(
    props: VProps,
    _root: AppContainer,
    _context?: any,
    _worInProgress?: Fiber
  ): VComponent {
    const widget = new VPlainTextEdit();
    widget.setProps(props, {});
    return widget;
  }

  commitMount(
    _instance: VPlainTextEdit,
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

export const PlainTextEdit = registerComponent<PlainTextEditProps>(
  new PlainTextEditConfig()
);
