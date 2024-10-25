import {
  FlexLayout,
  QListWidget,
  QListWidgetSignals,
  QWidget
} from "@vixen-js/core";
import { setViewProps, ViewProps } from "./View";
import {
  ComponentConfig,
  registerComponent,
  VComponent,
  VProps
} from "./Config";
import { Fiber } from "react-reconciler";
import { AppContainer } from "../reconciler";
import { VListItem } from "./ListItem";

export type ListProps = ViewProps<QListWidgetSignals>;

export const setListProps = (
  widget: VList,
  newProps: ListProps,
  oldProps: ListProps
) => {
  const setter: ListProps = {};
  Object.assign(setter, newProps);
  setViewProps(widget, newProps, oldProps);
};

export class VList extends QListWidget implements VComponent {
  static tagName = "list";
  setProps(newProps: VProps, oldProps: VProps): void {
    setListProps(this, newProps, oldProps);
  }
  removeChild(child: QWidget<any>) {
    const row = this.row(child as any);
    this.takeItem(row);
  }
  appendInitialChild(child: QWidget<any>) {
    this.appendChild(child);
  }
  appendChild(child: QWidget<any>) {
    if (!this.layout()) {
      this.setLayout(new FlexLayout());
    }

    if (!(child instanceof VListItem)) {
      throw new Error("Children of list must be ListItem");
    }

    this.addItem(child);
    if (child.actualListItemWidget) {
      child.setSizeHint(child.actualListItemWidget.size());
      this.setItemWidget(child, child.actualListItemWidget);
    }
  }
  insertBefore(child: QWidget<any>, before: QWidget<any>) {
    const row = this.row(before as any);
    this.insertItem(row, child as any);
  }
}

class ListConfig extends ComponentConfig {
  tagName = VList.tagName;
  shouldSetTextContent(_nextProps: VProps): boolean {
    return false;
  }
  createInstance(
    props: VProps,
    _root: AppContainer,
    _context?: any,
    _worInProgress?: Fiber
  ): VComponent {
    const widget = new VList();
    widget.setProps(props, {});
    return widget as any;
  }
  commitMount(
    instance: VComponent,
    newProps: VProps,
    _internalInstanceHandle: any
  ): void {
    if (newProps.visible !== false) {
      (instance as VList).show();
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

export const List = registerComponent<ListProps>(new ListConfig());
