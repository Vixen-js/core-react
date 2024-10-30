import { QIcon, QWidget } from "@vixen-js/core";
import { VTab } from "./Tab";
import { Component } from "react";
import { ComponentConfig, registerComponent, VComponent } from "./Config";
import { AppContainer } from "../reconciler";
import { Fiber } from "react-reconciler";

export interface TabItemProps {
  title?: string;
  icon?: QIcon;
}

/**
 * @ignore
 */
export const setTabItemProps = (
  tabItem: VTabItem,
  parentTab: VTab,
  newProps: TabItemProps,
  _oldProps: TabItemProps
) => {
  if (!tabItem.actualTabWidget) {
    return;
  }
  const tabIndex = parentTab.indexOf(tabItem.actualTabWidget);
  if (tabIndex < 0) {
    console.error("TabItem is not part of the parent tab it references to");
    return;
  }

  const setter: TabItemProps = {
    set title(text: string) {
      parentTab.setTabText(tabIndex, text);
    },
    set icon(qicon: QIcon) {
      parentTab.setTabIcon(tabIndex, qicon);
    }
  };
  Object.assign(setter, newProps);
};

/**
 * @ignore
 */
export class VTabItem extends Component implements VComponent {
  static tagName: string = "tab-item";
  native: any;
  actualTabWidget?: QWidget<any>;
  initialProps: TabItemProps = {};
  parentTab?: VTab;

  setProps(newProps: TabItemProps, oldProps: TabItemProps): void {
    if (this.parentTab) {
      setTabItemProps(this, this.parentTab, newProps, oldProps);
    } else {
      this.initialProps = newProps;
    }
  }
  appendInitialChild(child: QWidget<any>): void {
    if (this.actualTabWidget) {
      throw new Error("Tab Item can have only one child");
    }
    this.actualTabWidget = child;
  }
  appendChild(child: QWidget<any>): void {
    this.appendInitialChild(child);
  }
  insertBefore(child: QWidget<any>, _beforeChild: QWidget<any>): void {
    this.appendInitialChild(child);
  }
  removeChild(child: QWidget<any>): void {
    child.close();
    delete this.actualTabWidget;
  }
}

class TabItemConfig extends ComponentConfig {
  tagName = VTabItem.tagName;
  shouldSetTextContent(_nextProps: TabItemProps): boolean {
    return false;
  }
  createInstance(
    newProps: TabItemProps,
    _rootInstance: AppContainer,
    _context: any,
    _workInProgress: Fiber
  ): VTabItem {
    const item = new VTabItem(null!);
    item.setProps(newProps, {});
    return item;
  }
  finalizeInitialChildren(
    _instance: VTabItem,
    _newProps: TabItemProps,
    _rootContainerInstance: AppContainer,
    _context: any
  ): boolean {
    return false;
  }
  commitUpdate(
    instance: VTabItem,
    _updatePayload: any,
    oldProps: TabItemProps,
    newProps: TabItemProps
  ): void {
    instance.setProps(newProps, oldProps);
  }
}

export const TabItem = registerComponent<TabItemProps>(new TabItemConfig());
