import {
  QMainWindow,
  QMainWindowSignals,
  QMenuBar,
  QWidget
} from "@vixen-js/core";
import { setViewProps, ViewProps } from "./View";
import { ComponentConfig, registerComponent, VProps, VWidget } from "./Config";
import { AppContainer } from "../reconciler";
import { Fiber } from "react-reconciler";

type WindowSignals = ViewProps & Partial<QMainWindowSignals>;

export interface WindowProps extends WindowSignals {
  menuBar?: QMenuBar;
}

const setWindowProps = (
  window: VWindow,
  props: WindowProps,
  oldProps: WindowProps
) => {
  const setter: WindowProps = {
    set menuBar(menuBar: QMenuBar) {
      window.setMenuBar(menuBar);
    }
  };
  Object.assign(setter, props);
  setViewProps(window, props, oldProps);
};

export class VWindow extends QMainWindow implements VWidget {
  static tagName = "main-window";
  setProps(newProps: VProps, oldProps: VProps): void {
    setWindowProps(this, newProps, oldProps);
  }
  removeChild(child: QWidget<any>): void {
    const childToRemove = this.takeCentralWidget();
    if (childToRemove) {
      childToRemove.close();
    }
    child.close();
  }
  appendInitialChild(child: QWidget<any>): void {
    if (child instanceof QMenuBar) {
      if (!this.menuBar()) {
        this.setMenuBar(child);
      } else {
        console.warn("Window already has a menu bar");
      }
      return;
    }

    if (!this.centralWidget()) {
      this.setCentralWidget(child);
    } else {
      console.warn("Window already has one child node");
    }
  }
  appendChild(child: QWidget<any>): void {
    this.appendInitialChild(child);
  }
  insertBefore(child: QWidget<any>, _beforeChild: QWidget<any>): void {
    this.appendInitialChild(child);
  }
}

class WindowConfig extends ComponentConfig {
  tagName = VWindow.tagName;
  shouldSetTextContent(_nextProps: WindowProps): boolean {
    return false;
  }
  createInstance(
    newProps: WindowProps,
    _root: AppContainer,
    _ctx: any,
    _workInProgress: Fiber
  ): VWindow {
    const window = new VWindow();
    window.setProps(newProps, {});
    return window;
  }
  finalizeInitialChildren(
    _instance: VWindow,
    _newProps: WindowProps,
    _rootContainerInstance: AppContainer,
    _context: any
  ): boolean {
    return true;
  }
  commitMount(
    instance: VWindow,
    newProps: WindowProps,
    _internalInstanceHandle: any
  ): void {
    if (newProps.visible !== false) {
      instance.show();
    }
    return;
  }
  commitUpdate(
    instance: VWindow,
    _updatePayload: any,
    oldProps: VProps,
    newProps: VProps
  ): void {
    instance.setProps(newProps, oldProps);
  }
}

export const Window = registerComponent<WindowProps>(new WindowConfig());
