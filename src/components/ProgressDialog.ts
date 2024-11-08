import {
  QProgressDialog,
  QProgressDialogSignals,
  QWidget
} from "@vixen-js/core";
import { DialogProps, setDialogProps } from "./Dialog";
import { ComponentConfig, registerComponent, VWidget } from "./Config";
import {
  addNewEventListener,
  cleanEventListener,
  throwUnsupported
} from "../utils/helpers";
import { AppContainer } from "../reconciler";
import { Fiber } from "react-reconciler";

interface ProgressBarRange {
  max: number;
  min: number;
}

type ProgreesDialogSignals = DialogProps & Partial<QProgressDialogSignals>;

export interface ProgressDialogProps extends ProgreesDialogSignals {
  autoClose?: boolean;
  autoReset?: boolean;
  cancelButtonText?: string;
  labelText?: string;
  maxValue?: number;
  minValue?: number;

  /**
   * This property holds the time(`in milliseconds`) that must pass before the dialog appears.
   *
   * https://doc.qt.io/qt-5/qprogressdialog.html#minimumDuration-prop
   * @default 4
   */
  minDuration?: number;
  range?: ProgressBarRange;
  value?: number;
  /**
   * Set this to `false` to allow the progress dialog opening
   * automatically when window first mounts
   */
  shouldReset?: boolean;
}

function setProgressDialogProps(
  widget: VProgressDialog,
  newProps: ProgressDialogProps,
  oldProps: ProgressDialogProps
) {
  const setter: ProgressDialogProps = {
    set shouldReset(shouldReset: boolean) {
      if (shouldReset) widget.reset();
    },
    set autoClose(autoClose: boolean) {
      widget.setAutoClose(autoClose);
    },
    set autoReset(autoReset: boolean) {
      widget.setAutoReset(autoReset);
    },
    set cancelButtonText(cancelButtonText: string) {
      widget.setCancelButtonText(cancelButtonText);
    },
    set labelText(labelText: string) {
      widget.setLabelText(labelText);
    },
    set maxValue(maxValue: number) {
      widget.setMaximum(maxValue);
    },
    set minValue(minValue: number) {
      widget.setMinimum(minValue);
    },
    set minDuration(minDuration: number) {
      widget.setMinimumDuration(minDuration);
    },
    set range({ max, min }: ProgressBarRange) {
      widget.setRange(min, max);
    },
    set value(value: number) {
      widget.setValue(value);
    },
    set onCancel(callback: () => void) {
      cleanEventListener<keyof QProgressDialogSignals>(
        widget,
        "onCancel",
        oldProps.onCancel,
        newProps
      );
      addNewEventListener<keyof QProgressDialogSignals>(
        widget,
        "onCancel",
        callback
      );
    }
  };
  Object.assign(setter, newProps);
  setDialogProps(widget, newProps, oldProps);
}

export class VProgressDialog extends QProgressDialog implements VWidget {
  static tagName = "progress-dialog";
  setProps(newProps: ProgressDialogProps, oldProps: ProgressDialogProps): void {
    setProgressDialogProps(this, newProps, oldProps);
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

class ProgressDialogConfig extends ComponentConfig {
  tagName: string = VProgressDialog.tagName;
  shouldSetTextContent(_nextProps: ProgressDialogProps): boolean {
    return false;
  }
  createInstance(
    newProps: ProgressDialogProps,
    _rootInstance: AppContainer,
    _context: any,
    _workInProgress: Fiber
  ): VProgressDialog {
    const widget = new VProgressDialog();
    widget.setProps(newProps, {});
    return widget;
  }
  commitMount(
    instance: VProgressDialog,
    newProps: ProgressDialogProps,
    _internalInstanceHandle: any
  ): void {
    if (newProps.visible !== false && newProps.open !== false) {
      instance.show();
    }
    return;
  }
  commitUpdate(
    instance: VProgressDialog,
    _updatePayload: any,
    oldProps: ProgressDialogProps,
    newProps: ProgressDialogProps
  ): void {
    instance.setProps(newProps, oldProps);
  }
}
/**
 * Pop up ProgressDialog inheriting the functionality of Vixen UI `QProgressDialog`
 * @example
 * ```javascript
 * function ProgressDialogExample(props){
 *  const [open, setOpen] = useState(false);
 *  const events = useEventHandler<QProgressDialogSignals>({
 *    canceled(){
 *        setOpen(false);
 *        //....do whatever you want
 *    }
 *  }, [....deps])
 * const [value, setValue] = useState(0);
 *  return (
 *    <View>
 *      <ProgressDialog
 *        open={open}
 *        on={events}
 *        maxValue={100}
 *        minValue={0}
 *        value={value}
 *      />
 *      <Button text="open dialog" on={{clicked:()=>setOpen(true)}}/>
 *      <Button
 *        text="Progress"
 *        on={{clicked:()=>open && value < 100 &&setValue(value+5)}}
 *      />
 *    </View>
 *  )
 * }
 * ```
 */

export const ProgressDialog = registerComponent<ProgressDialogProps>(
  new ProgressDialogConfig()
);
