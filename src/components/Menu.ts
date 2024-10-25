import { Component, QMenu, QMenuSignals } from "@vixen-js/core";
import { setViewProps, ViewProps } from "./View";
import {
  ComponentConfig,
  registerComponent,
  VComponent,
  VProps,
  VWidget
} from "./Config";
import { VAction } from "./Action";
import { throwUnsupported } from "../utils/helpers";
import { Fiber } from "react-reconciler";
import { AppContainer } from "../reconciler";

export interface MenuProps extends ViewProps<QMenuSignals> {
  title?: string;
}

const setMenuProps = (
  widget: VMenu,
  newProps: MenuProps,
  _oldProps: MenuProps
) => {
  const setter: MenuProps = {
    set title(title: string) {
      widget.setTitle(title);
    }
  };
  Object.assign(setter, newProps);
  setViewProps(widget, newProps, _oldProps);
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
