import { QColor, QWidget } from "@vixen-js/core";
import { DialogOption } from "./Common";
import {
  ColorDialogOption,
  QColorDialog,
  QColorDialogSignals
} from "@vixen-js/core/dist/lib/QtWidgets/QColorDialog";
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
import { DialogProps, setDialogProps } from "./Dialog";
import { Fiber } from "react-reconciler";
import { AppContainer } from "../reconciler";

type ColorDialogSignals = DialogProps & Partial<QColorDialogSignals>;
export interface ColorDialogProps extends ColorDialogSignals {
  currentColor?: QColor;
  option?: DialogOption<ColorDialogOption>;
  options?: ColorDialogOption;
}

const setColorDialogProps = (
  widget: VColorDialog,
  newProps: ColorDialogProps,
  oldProps: ColorDialogProps
) => {
  const setter: ColorDialogProps = {
    set currentColor(color: QColor) {
      widget.setCurrentColor(color);
    },
    set option({ option, on }: DialogOption<ColorDialogOption>) {
      widget.setOption(option, on);
    },
    set options(options: ColorDialogOption) {
      widget.setOptions(options);
    },
    set onColorSelect(callback: (color: QColor) => void) {
      cleanEventListener<keyof QColorDialogSignals>(
        widget,
        "onColorSelect",
        oldProps.onColorSelect,
        callback
      );
      addNewEventListener<keyof QColorDialogSignals>(
        widget,
        "onColorSelect",
        callback
      );
    },
    set onCurrentColorChange(callback: (color: QColor) => void) {
      cleanEventListener<keyof QColorDialogSignals>(
        widget,
        "onCurrentColorChange",
        oldProps.onCurrentColorChange,
        callback
      );
      addNewEventListener<keyof QColorDialogSignals>(
        widget,
        "onCurrentColorChange",
        callback
      );
    }
  };
  Object.assign(setter, newProps);
  setDialogProps(widget, newProps, oldProps);
};

export class VColorDialog extends QColorDialog implements VWidget {
  static tagName = "color-dialog";
  setProps(newProps: VProps, oldProps: VProps): void {
    setColorDialogProps(this, newProps, oldProps);
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

class ColorDialogConfig extends ComponentConfig {
  tagName = VColorDialog.tagName;
  shouldSetTextContent(_nextProps: VProps): boolean {
    return false;
  }
  createInstance(
    props: VProps,
    _root: AppContainer,
    _context?: any,
    _worInProgress?: Fiber
  ): VComponent {
    const widget = new VColorDialog();
    widget.setProps(props, {});
    return widget;
  }
  commitMount(
    _instance: VColorDialog,
    _newProps: ColorDialogProps,
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

export const ColorDialog = registerComponent<ColorDialogProps>(
  new ColorDialogConfig()
);
