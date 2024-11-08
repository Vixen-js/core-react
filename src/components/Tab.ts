import {
  QIcon,
  QTabWidget,
  QTabWidgetSignals,
  QWidget,
  TabPosition
} from "@vixen-js/core";
import { setViewProps, ViewProps } from "./View";
import { ComponentConfig, registerComponent, VComponent } from "./Config";
import { AppContainer } from "../reconciler";
import { Fiber } from "react-reconciler";
import { setTabItemProps, VTabItem } from "./TabItem";
import { addNewEventListener, cleanEventListener } from "../utils/helpers";

type TabSignals = ViewProps & Partial<QTabWidgetSignals>;
export interface TabProps extends TabSignals {
  tabPosition?: TabPosition;
}

/**
 * @ignore
 */
export const setTabProps = (
  widget: VTab,
  newProps: TabProps,
  oldProps: TabProps
) => {
  const setter: TabProps = {
    set tabPosition(value: TabPosition) {
      widget.setTabPosition(value);
    },
    set onCurrentChange(callback: (index: number) => void) {
      cleanEventListener<keyof QTabWidgetSignals>(
        widget,
        "onCurrentChange",
        oldProps.onCurrentChange,
        newProps
      );
      addNewEventListener<keyof QTabWidgetSignals>(
        widget,
        "onCurrentChange",
        callback
      );
    },
    set onTabBarClick(callback: (index: number) => void) {
      cleanEventListener<keyof QTabWidgetSignals>(
        widget,
        "onTabBarClick",
        oldProps.onTabBarClick,
        newProps
      );
      addNewEventListener<keyof QTabWidgetSignals>(
        widget,
        "onTabBarClick",
        callback
      );
    },
    set onTabBarDblClick(callback: (index: number) => void) {
      cleanEventListener<keyof QTabWidgetSignals>(
        widget,
        "onTabBarDblClick",
        oldProps.onTabBarDblClick,
        newProps
      );
      addNewEventListener<keyof QTabWidgetSignals>(
        widget,
        "onTabBarDblClick",
        callback
      );
    },
    set onTabCloseRequest(callback: (index: number) => void) {
      cleanEventListener<keyof QTabWidgetSignals>(
        widget,
        "onTabCloseRequest",
        oldProps.onTabCloseRequest,
        newProps
      );
      addNewEventListener<keyof QTabWidgetSignals>(
        widget,
        "onTabCloseRequest",
        callback
      );
    }
  };
  Object.assign(setter, newProps);
  setViewProps(widget, newProps, oldProps);
};

/**
 * @ignore
 */
export class VTab extends QTabWidget implements VComponent {
  static tagName = "tab";
  setProps(newProps: TabProps, oldProps: TabProps): void {
    setTabProps(this, newProps, oldProps);
  }

  appendInitialChild(tabItem: QWidget<any>): void {
    if (!(tabItem instanceof VTabItem)) {
      throw new Error("Children of tab should be of type TabItem");
    }

    if (tabItem.actualTabWidget) {
      this.addTab(tabItem.actualTabWidget, new QIcon(), "");
      tabItem.parentTab = this;
      setTabItemProps(tabItem, this, tabItem.initialProps, {});
    }
  }
  appendChild(child: QWidget<any>): void {
    this.appendInitialChild(child);
  }

  insertBefore(child: QWidget<any>, beforeChild: QWidget<any>): void {
    if (!(child instanceof VTabItem)) {
      throw new Error("Children of tab should be of type TabItem");
    }
    const beforeTab = beforeChild as any as VTabItem;
    const index = this.indexOf(beforeTab.actualTabWidget!);
    this.insertTab(index, child.actualTabWidget!, new QIcon(), "");
    child.parentTab = this;
    setTabItemProps(child, this, child.initialProps, {});
  }
  removeChild(child: QWidget<any>): void {
    const childTab = child as any as VTabItem;
    const childIndex = this.indexOf(childTab.actualTabWidget!);
    this.removeTab(childIndex);
  }
}

class TabsConfig extends ComponentConfig {
  tagName = VTab.tagName;
  shouldSetTextContent(_nextProps: TabProps): boolean {
    return false;
  }
  createInstance(
    newProps: TabProps,
    _rootInstance: AppContainer,
    _context: any,
    _workInProgress: Fiber
  ): VTab {
    const widget = new VTab();
    widget.setProps(newProps, {});
    return widget;
  }
  commitMount(
    instance: VTab,
    newProps: TabProps,
    _internalInstanceHandle: any
  ): void {
    if (newProps.visible !== false) {
      instance.show();
    }
  }
  finalizeInitialChildren(
    _instance: VTab,
    _newProps: TabProps,
    _rootContainerInstance: AppContainer,
    _context: any
  ): boolean {
    return true;
  }
  commitUpdate(
    instance: VTab,
    _updatePayload: any,
    oldProps: TabProps,
    newProps: TabProps
  ): void {
    instance.setProps(newProps, oldProps);
  }
}

export const Tabs = registerComponent<TabProps>(new TabsConfig());
