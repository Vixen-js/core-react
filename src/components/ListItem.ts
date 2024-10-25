import { QIcon, QListWidgetItem, QWidget } from "@vixen-js/core";
import {
  ComponentConfig,
  registerComponent,
  VComponent,
  VProps
} from "./Config";
import { Fiber } from "react-reconciler";
import { AppContainer, Ctx } from "../reconciler";

export interface ListItemProps {
  title?: string;
  icon?: QIcon;
}

export const setListItemProps = (
  widget: VListItem,
  newProps: ListItemProps,
  _oldProps: ListItemProps
) => {
  const setter: ListItemProps = {
    set title(title: string) {
      widget.setText(title);
    },
    set icon(icon: QIcon) {
      widget.setIcon(icon);
    }
  };
  Object.assign(setter, newProps);
};

export class VListItem extends QListWidgetItem implements VComponent {
  static tagName = "list-item";
  native: any = null;
  actualListItemWidget?: QWidget<any>;

  setProps(newProps: VProps, oldProps: VProps): void {
    setListItemProps(this, newProps, oldProps);
  }

  appendInitialChild(child: QWidget<any>) {
    if (this.actualListItemWidget) {
      throw new Error("ListItem can have only one child");
    }
    this.actualListItemWidget = child;
  }
  appendChild(child: QWidget<any>) {
    this.appendInitialChild(child);
  }
  insertBefore(child: QWidget<any>, _before: QWidget<any>) {
    this.appendInitialChild(child);
  }
  removeChild(child: QWidget<any>) {
    if (child) {
      child.close();
    }
    if (this.actualListItemWidget) {
      delete this.actualListItemWidget;
    }
  }
}

class ListItemConfig extends ComponentConfig {
  tagName = VListItem.tagName;
  shouldSetTextContent(_nextProps: VProps): boolean {
    return false;
  }
  createInstance(
    props: VProps,
    _root: AppContainer,
    _context?: any,
    _worInProgress?: Fiber
  ): VComponent {
    const widget = new VListItem();
    widget.setProps(props, {});
    return widget;
  }
  finalizeInitialChildren(
    _instance: VComponent,
    _newProps: VProps,
    _root: AppContainer,
    _ctx: Ctx
  ): boolean {
    return false;
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

export const ListItem = registerComponent<ListItemProps>(new ListItemConfig());
