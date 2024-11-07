import { Component, NativeElement, QMenu, QMenuSignals } from "@vixen-js/core";
import { setViewProps, ViewProps } from "./View";
import {
  ComponentConfig,
  registerComponent,
  VComponent,
  VProps,
  VWidget
} from "./Config";
import { VAction } from "./Action";
import {
  addNewEventListener,
  cleanEventListener,
  throwUnsupported
} from "../utils/helpers";
import { Fiber } from "react-reconciler";
import { AppContainer } from "../reconciler";

type MenuSignals = ViewProps & Partial<QMenuSignals>;
export interface MenuProps extends MenuSignals {
  title?: string;
}

const setMenuProps = (
  widget: VMenu,
  newProps: MenuProps,
  oldProps: MenuProps
) => {
  const setter: MenuProps = {
    set title(title: string) {
      widget.setTitle(title);
    },
    set onAboutToHide(callback: () => void) {
      cleanEventListener<keyof QMenuSignals>(
        widget,
        "onAboutToHide",
        oldProps.onAboutToHide,
        callback
      );
      addNewEventListener<keyof QMenuSignals>(
        widget,
        "onAboutToHide",
        callback
      );
    },
    set onAboutToShow(callback: () => void) {
      cleanEventListener<keyof QMenuSignals>(
        widget,
        "onAboutToShow",
        oldProps.onAboutToShow,
        callback
      );
      addNewEventListener<keyof QMenuSignals>(
        widget,
        "onAboutToShow",
        callback
      );
    },
    set onHover(callback: (action: NativeElement) => void) {
      cleanEventListener<keyof QMenuSignals>(
        widget,
        "onHover",
        oldProps.onHover,
        callback
      );
      addNewEventListener<keyof QMenuSignals>(widget, "onHover", callback);
    },
    set onTrigger(callback: (action: NativeElement) => void) {
      cleanEventListener<keyof QMenuSignals>(
        widget,
        "onTrigger",
        oldProps.onTrigger,
        callback
      );
      addNewEventListener<keyof QMenuSignals>(widget, "onTrigger", callback);
    }
  };
  Object.assign(setter, newProps);
  setViewProps(widget, newProps, oldProps);
};

export class VMenu extends QMenu implements VWidget {
  static tagName = "menu";
  setProps(newProps: MenuProps, oldProps: MenuProps) {
    setMenuProps(this, newProps, oldProps);
  }
  appendInitialChild(child: Component): void {
    this.appendChild(child);
  }

  appendChild(child: Component): void {
    if (!(child instanceof VAction)) {
      console.warn("Only actions can be added to menu");
      return;
    }
    this.addAction(child);
  }
  insertBefore(_child: Component, _beforeChild: Component): void {
    throwUnsupported(this);
  }
  removeChild(child: Component): void {
    if (child instanceof VAction) {
      this.removeAction(child);
    }
  }
}

class MenuConfig extends ComponentConfig {
  tagName = VMenu.tagName;
  shouldSetTextContent(_nextProps: VProps): boolean {
    return false;
  }
  createInstance(
    props: VProps,
    _root: AppContainer,
    _context?: any,
    _worInProgress?: Fiber
  ): VComponent {
    const menu = new VMenu();
    setViewProps(menu, props, {});
    return menu;
  }
  commitMount(
    instance: VMenu,
    newProps: MenuProps,
    _internalInstanceHandle: any
  ): void {
    if (newProps.visible !== false) {
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

export const Menu = registerComponent<MenuProps>(new MenuConfig());
