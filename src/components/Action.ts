import {
  QAction,
  QActionSignals,
  QFont,
  QIcon,
  QKeySequence,
  QWidget,
  ShortcutContext
} from "@vixen-js/core";
import {
  ComponentConfig,
  registerComponent,
  VComponent,
  VProps
} from "./Config";
import {
  addNewEventListener,
  cleanEventListener,
  throwUnsupported
} from "../utils/helpers";
import { Fiber } from "react-reconciler";
import { AppContainer } from "../reconciler";

export interface ActionProps extends VProps, Partial<QActionSignals> {
  checkable?: boolean;
  checked?: boolean;
  enabled?: boolean;
  font?: QFont;
  icon?: QIcon;
  id?: string;
  separator?: boolean;
  shortcut?: QKeySequence;
  shortcutContext?: ShortcutContext;
  text?: string;
}

const setActionProps = (
  widget: VAction,
  newProps: ActionProps,
  oldProps: ActionProps
) => {
  const setter: ActionProps = {
    set checkable(checkable: boolean) {
      widget.setCheckable(checkable);
    },
    set checked(checked: boolean) {
      widget.setChecked(checked);
    },
    set enabled(enabled: boolean) {
      widget.setEnabled(enabled);
    },
    set font(font: QFont) {
      widget.setFont(font);
    },
    set icon(icon: QIcon) {
      widget.setIcon(icon);
    },
    set id(id: string) {
      widget.setObjectName(id);
    },
    set separator(separator: boolean) {
      widget.setSeparator(separator);
    },
    set shortcut(shortcut: QKeySequence) {
      widget.setShortcut(shortcut);
    },
    set shortcutContext(shortcutContext: ShortcutContext) {
      widget.setShortcutContext(shortcutContext);
    },
    set text(text: string) {
      widget.setText(text);
    },
    // Set Event Listeners
    set onChange(callbackFn: () => void) {
      cleanEventListener<keyof QActionSignals>(
        widget,
        "onChange",
        oldProps.onChange,
        callbackFn
      );
      addNewEventListener<keyof QActionSignals>(widget, "onChange", callbackFn);
    },
    set onTrigger(callbackFn: (checked: boolean) => void) {
      cleanEventListener<keyof QActionSignals>(
        widget,
        "onTrigger",
        oldProps.onChange,
        callbackFn
      );
      addNewEventListener<keyof QActionSignals>(
        widget,
        "onTrigger",
        callbackFn
      );
    },
    set onHover(callbackFn: () => void) {
      cleanEventListener<keyof QActionSignals>(
        widget,
        "onHover",
        oldProps.onHover,
        callbackFn
      );
      addNewEventListener<keyof QActionSignals>(widget, "onHover", callbackFn);
    },
    set onToggle(callbackFn: (checked: boolean) => void) {
      cleanEventListener<keyof QActionSignals>(
        widget,
        "onToggle",
        oldProps.onToggle,
        callbackFn
      );
      addNewEventListener<keyof QActionSignals>(widget, "onToggle", callbackFn);
    }
    // Finish Event Listeners Set
  };

  Object.assign(setter, newProps);
};

export class VAction extends QAction implements VComponent {
  setProps(newProps: VProps, oldProps: VProps): void {
    setActionProps(this, newProps, oldProps);
  }
  appendInitialChild(_child: QWidget): void {
    throwUnsupported(this);
  }

  appendChild(_child: QWidget): void {
    throwUnsupported(this);
  }
  insertBefore(_child: QWidget, _before: QWidget) {
    throwUnsupported(this);
  }

  removeChild(_child: QWidget): void {
    throwUnsupported(this);
  }

  static tagName: string = "action";
}

class ActionConfig extends ComponentConfig {
  tagName = VAction.tagName;

  shouldSetTextContent(_nextProps: VProps): boolean {
    return false;
  }
  createInstance(
    props: VProps,
    _root: AppContainer,
    _context?: any,
    _worInProgress?: Fiber
  ): VComponent {
    const action = new VAction();
    action.setProps(props, {});
    return action;
  }
  commitMount(
    _instance: VComponent,
    _newProps: VProps,
    _internalInstanceHandle: any
  ): void {
    return;
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

export const Action = registerComponent<ActionProps>(new ActionConfig());
