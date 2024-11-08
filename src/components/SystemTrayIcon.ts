import {
  QIcon,
  QMenu,
  QSystemTrayIcon,
  QSystemTrayIconActivationReason,
  QSystemTrayIconSignals,
  QWidget,
  WidgetEventTypes
} from "@vixen-js/core";
import {
  ComponentConfig,
  registerComponent,
  VComponent,
  VProps
} from "./Config";
import { EventTypesUnion, WidgetEventListeners, EventCallback } from "./View";
import {
  addNewEventListener,
  cleanEventListener,
  throwUnsupported
} from "../utils/helpers";
import { AppContainer } from "../reconciler";
import { Fiber } from "react-reconciler";

export interface SystemTrayIconProps
  extends VProps,
    Partial<WidgetEventListeners & QSystemTrayIconSignals> {
  /**
   * Sets an icon for the system tray.
   */
  icon?: QIcon;

  /**
   * Sets the object name (id) of the widget in Qt. Object name can be analogous to id of an element in the web world. Using the objectName of the widget one can reference it in the Qt's stylesheet much like what we do with id in the web world.
   */
  id?: string;

  /**
   * Sets a tooltip for the system tray.
   */
  tooltip?: string;

  /**
   * Shows or hides the widget and its children.
   */
  visible?: boolean;
}

const setSystemTrayIconProps = (
  widget: VSystemTrayIcon,
  newProps: SystemTrayIconProps,
  oldProps: SystemTrayIconProps
) => {
  const setter: SystemTrayIconProps = {
    set icon(icon: QIcon) {
      widget.setIcon(icon);
    },
    set id(id: string) {
      widget.setObjectName(id);
    },
    set tooltip(tooltip: string) {
      widget.setToolTip(tooltip);
    },
    set visible(shouldShow: boolean) {
      if (shouldShow) {
        widget.show();
      } else {
        widget.hide();
      }
    },
    set onActivate(
      callback: (reason: QSystemTrayIconActivationReason) => void
    ) {
      cleanEventListener<keyof QSystemTrayIconSignals>(
        widget,
        "onActivate",
        oldProps.onActivate,
        newProps
      );
      addNewEventListener<keyof QSystemTrayIconSignals>(
        widget,
        "onActivate",
        callback
      );
    },
    set onMessageClick(callback: () => void) {
      cleanEventListener<keyof QSystemTrayIconSignals>(
        widget,
        "onMessageClick",
        oldProps.onMessageClick,
        newProps
      );
      addNewEventListener<keyof QSystemTrayIconSignals>(
        widget,
        "onMessageClick",
        callback
      );
    }
  };

  // Event Listener Definition
  Object.keys(WidgetEventTypes)
    .filter((type) => type !== "None")
    .forEach((eventType) => {
      const evtType = eventType as Omit<EventTypesUnion, "None">;
      Object.defineProperty(setter, evtType.toString(), {
        set(callback: EventCallback) {
          cleanEventListener<typeof evtType>(
            widget,
            evtType,
            oldProps[evtType.toString()],
            callback
          );
          addNewEventListener<typeof evtType>(widget, eventType, callback);
        }
      });
    });

  Object.assign(setter, newProps);
};

/**
 * @ignore
 */
export class VSystemTrayIcon extends QSystemTrayIcon implements VComponent {
  static tagName = "systemtrayicon";
  contextMenu: QMenu | null = null;

  setProps(newProps: SystemTrayIconProps, oldProps: SystemTrayIconProps): void {
    setSystemTrayIconProps(this, newProps, oldProps);
  }
  appendInitialChild(child: QWidget<any>): void {
    if (child instanceof QMenu) {
      if (!this.contextMenu) {
        this.contextMenu = child;
        this.setContextMenu(child);
      } else {
        console.warn("SystemTrayIcon can't have more than one Menu.");
      }
    } else {
      console.warn("SystemTrayIcon only supports Menu as its children");
    }
  }
  appendChild(child: QWidget<any>): void {
    this.appendInitialChild(child);
  }
  insertBefore(_child: QWidget<any>, _beforeChild: QWidget<any>): void {
    throwUnsupported(this);
  }
  removeChild(_child: QWidget<any>): void {
    throwUnsupported(this);
  }
}

class SystemTrayIconConfig extends ComponentConfig {
  tagName = VSystemTrayIcon.tagName;
  shouldSetTextContent(_nextProps: SystemTrayIconProps): boolean {
    return false;
  }
  createInstance(
    newProps: SystemTrayIconProps,
    _rootInstance: AppContainer,
    _context: any,
    _workInProgress: Fiber
  ): VSystemTrayIcon {
    const widget = new VSystemTrayIcon();
    widget.setProps(newProps, {});
    return widget;
  }
  commitMount(
    instance: VSystemTrayIcon,
    newProps: SystemTrayIconProps,
    _internalInstanceHandle: any
  ): void {
    if (newProps.visible !== false) {
      instance.show();
    }
  }
  commitUpdate(
    instance: VSystemTrayIcon,
    _updatePayload: any,
    oldProps: SystemTrayIconProps,
    newProps: SystemTrayIconProps
  ): void {
    instance.setProps(newProps, oldProps);
  }
}

export const SystemTrayIcon = registerComponent<SystemTrayIconProps>(
  new SystemTrayIconConfig()
);
