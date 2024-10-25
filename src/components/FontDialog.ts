import {
  FontDialogOption,
  QFont,
  QFontDialog,
  QFontDialogSignals,
  QWidget
} from "@vixen-js/core";
import { DialogProps, setDialogProps } from "./Dialog";
import { DialogOption } from "./Common";
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

export interface FontDialogProps extends DialogProps<QFontDialogSignals> {
  currentFont?: QFont;
  option?: DialogOption<FontDialogOption>;
  options?: FontDialogOption;
}

const setFontDialogProps = (
  widget: VFontDialog,
  newProps: FontDialogProps,
  oldProps: FontDialogProps
) => {
  const setter: FontDialogProps = {
    set currentFont(font: QFont) {
      widget.setCurrentFont(font);
    },
    set option({ option, on }: DialogOption<FontDialogOption>) {
      widget.setOption(option, on);
    },
    set options(options: FontDialogOption) {
      widget.setOptions(options);
    }
  };
  Object.assign(setter, newProps);
  setDialogProps(widget, newProps, oldProps);
};

export class VFontDialog extends QFontDialog implements VWidget {
  static tagName = "font-dialog";
  setProps(newProps: FontDialogProps, oldProps: FontDialogProps) {
    setFontDialogProps(this, newProps, oldProps);
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

class FontDialogConfig extends ComponentConfig {
  tagName = VFontDialog.tagName;
  shouldSetTextContent(_nextProps: VProps): boolean {
    return false;
  }
  createInstance(
    props: VProps,
    _root: AppContainer,
    _context?: any,
    _worInProgress?: Fiber
  ): VComponent {
    const widget = new VFontDialog();
    widget.setProps(props, {});
    return widget;
  }
  commitMount(
    instance: VFontDialog,
    _newProps: FontDialogProps,
    _internalInstanceHandle: any
  ): void {
    if (_newProps.visible !== false && _newProps.open !== false) {
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

export const FontDialog = registerComponent<FontDialogProps>(
  new FontDialogConfig()
);
