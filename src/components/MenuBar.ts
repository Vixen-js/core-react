import {
  QWidget,
  QMenu,
  QMenuBar,
  QMenuBarSignals,
  NativeElement
} from "@vixen-js/core";
import { setViewProps, ViewProps } from "./View";
import {
  ComponentConfig,
  registerComponent,
  VComponent,
  VProps,
  VWidget
} from "./Config";
import { cleanEventListener, throwUnsupported } from "../utils/helpers";
import { Fiber } from "react-reconciler";
import { AppContainer } from "../reconciler";

type MenuBarSignals = ViewProps & Partial<QMenuBarSignals>;
export interface MenuBarProps extends MenuBarSignals {
  nativeMenuBar?: boolean;
}

const setMenuBarProps = (
  widget: VMenuBar,
  newProps: MenuBarProps,
  oldProps: MenuBarProps
) => {
  const setter: MenuBarProps = {
    set nativeMenuBar(nativeMenuBar: boolean) {
      widget.setNativeMenuBar(nativeMenuBar);
    },
    set onHover(callback: (action: NativeElement) => void) {
      cleanEventListener<keyof QMenuBarSignals>(
        widget,
        "onHover",
        oldProps.onHover,
        callback
      );
    },
    set onTrigger(callback: (action: NativeElement) => void) {
      cleanEventListener<keyof QMenuBarSignals>(
        widget,
        "onTrigger",
        oldProps.onTrigger,
        callback
      );
    }
  };
  Object.assign(setter, newProps);
  setViewProps(widget, newProps, oldProps);
};

export class VMenuBar extends QMenuBar implements VWidget {
  static tagName = "menu-bar";
  setProps(newProps: VProps, oldProps: VProps): void {
    setMenuBarProps(this, newProps, oldProps);
  }

  appendInitialChild(child: QWidget<any>): void {
    if (child instanceof QMenu) {
      this.addMenu(child);
    } else {
      console.warn("MenuBar only  support Menu as children");
    }
  }
  appendChild(child: QWidget<any>): void {
    this.appendInitialChild(child);
  }

  insertBefore(_child: QWidget<any>, _beforeChild: QWidget<any>): void {
    throwUnsupported(this);
  }

  removeChild(_child: QWidget<any>): void {
    console.warn("MenuBar doesn't support removeChild");
    throwUnsupported(this);
  }
}

class MenuBarConfig extends ComponentConfig {
  tagName = VMenuBar.tagName;
  shouldSetTextContent(_nextProps: VProps): boolean {
    return false;
  }
  createInstance(
    _props: VProps,
    _root: AppContainer,
    _context?: any,
    _worInProgress?: Fiber
  ): VMenuBar {
    const widget = new VMenuBar();
    widget.setProps(_props, {});
    return widget;
  }

  commitMount(
    _instance: VMenuBar,
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

export const MenuBar = registerComponent<MenuBarProps>(new MenuBarConfig());
