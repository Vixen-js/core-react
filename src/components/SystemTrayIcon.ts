import {
  QIcon,
  QMenu,
  QSystemTrayIcon,
  QSystemTrayIconSignals,
  QWidget
} from "@vixen-js/core";
import {
  ComponentConfig,
  registerComponent,
  VComponent,
  VProps
} from "./Config";
import { WidgetEventListeners } from "./View";
import { throwUnsupported } from "../utils/helpers";
import { AppContainer } from "../reconciler";
import { Fiber } from "react-reconciler";

export interface SystemTrayIconProps extends VProps {
  /**
   * Sets an icon for the system tray.
   */
  icon?: QIcon;

  /**
   * Sets the object name (id) of the widget in Qt. Object name can be analogous to id of an element in the web world. Using the objectName of the widget one can reference it in the Qt's stylesheet much like what we do with id in the web world.
   */
  id?: string;

  /**
   * Prop to set the event listener map.
   */
  on?: Partial<WidgetEventListeners | QSystemTrayIconSignals>;

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
    set on(
      listenerMap: Partial<WidgetEventListeners | QSystemTrayIconSignals>
    ) {
      const listenerMapLatest: any = Object.assign({}, listenerMap);
      const oldListenerMap = Object.assign({}, oldProps.on);
      Object.entries(oldListenerMap).forEach(([eventType, oldEvtListener]) => {
        const newEvtListener = listenerMapLatest[eventType];
        if (oldEvtListener !== newEvtListener) {
          widget.removeEventListener(eventType as any, oldEvtListener);
        } else {
          delete listenerMapLatest[eventType];
        }
      });

      Object.entries(listenerMapLatest).forEach(
        ([eventType, newEvtListener]) => {
          widget.addEventListener(eventType as any, newEvtListener);
        }
      );
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
    }
  };
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
