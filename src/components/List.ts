import {
  FlexLayout,
  QListWidget,
  QListWidgetItem,
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
import { addNewEventListener, cleanEventListener } from "../utils/helpers";

export type ListProps = ViewProps & Partial<QListWidgetSignals>;

export const setListProps = (
  widget: VList,
  newProps: ListProps,
  oldProps: ListProps
) => {
  const setter: ListProps = {
    set onCurrentItemChange(
      callback: (current: QListWidgetItem, previous: QListWidgetItem) => void
    ) {
      cleanEventListener<keyof QListWidgetSignals>(
        widget,
        "onCurrentItemChange",
        oldProps.onCurrentItemChange,
        callback
      );
      addNewEventListener<keyof QListWidgetSignals>(
        widget,
        "onCurrentItemChange",
        callback
      );
    },
    set onCurrentRowChange(callback: (currentRow: number) => void) {
      cleanEventListener<keyof QListWidgetSignals>(
        widget,
        "onCurrentRowChange",
        oldProps.onCurrentRowChange,
        callback
      );
      addNewEventListener<keyof QListWidgetSignals>(
        widget,
        "onCurrentRowChange",
        callback
      );
    },
    set onCurrentTextChange(callback: (currentText: string) => void) {
      cleanEventListener<keyof QListWidgetSignals>(
        widget,
        "onCurrentTextChange",
        oldProps.onCurrentTextChange,
        callback
      );
      addNewEventListener<keyof QListWidgetSignals>(
        widget,
        "onCurrentTextChange",
        callback
      );
    },
    set onItemActivate(callback: (item: QListWidgetItem) => void) {
      cleanEventListener<keyof QListWidgetSignals>(
        widget,
        "onItemActivate",
        oldProps.onItemActivate,
        callback
      );
      addNewEventListener<keyof QListWidgetSignals>(
        widget,
        "onItemActivate",
        callback
      );
    },
    set onItemChange(callback: (item: QListWidgetItem) => void) {
      cleanEventListener<keyof QListWidgetSignals>(
        widget,
        "onItemChange",
        oldProps.onItemChange,
        callback
      );
      addNewEventListener<keyof QListWidgetSignals>(
        widget,
        "onItemChange",
        callback
      );
    },
    set onItemClick(callback: (item: QListWidgetItem) => void) {
      cleanEventListener<keyof QListWidgetSignals>(
        widget,
        "onItemClick",
        oldProps.onItemClick,
        callback
      );
      addNewEventListener<keyof QListWidgetSignals>(
        widget,
        "onItemClick",
        callback
      );
    },
    set onItemDblClick(callback: (item: QListWidgetItem) => void) {
      cleanEventListener<keyof QListWidgetSignals>(
        widget,
        "onItemDblClick",
        oldProps.onItemDblClick,
        callback
      );
      addNewEventListener<keyof QListWidgetSignals>(
        widget,
        "onItemDblClick",
        callback
      );
    },
    set onItemEnter(callback: (item: QListWidgetItem) => void) {
      cleanEventListener<keyof QListWidgetSignals>(
        widget,
        "onItemEnter",
        oldProps.onItemEnter,
        callback
      );
      addNewEventListener<keyof QListWidgetSignals>(
        widget,
        "onItemEnter",
        callback
      );
    },
    set onItemPress(callback: (item: QListWidgetItem) => void) {
      cleanEventListener<keyof QListWidgetSignals>(
        widget,
        "onItemPress",
        oldProps.onItemPress,
        callback
      );
      addNewEventListener<keyof QListWidgetSignals>(
        widget,
        "onItemPress",
        callback
      );
    },
    set onItemSelectionChange(callback: () => void) {
      cleanEventListener<keyof QListWidgetSignals>(
        widget,
        "onItemSelectionChange",
        oldProps.onItemSelectionChange,
        callback
      );
      addNewEventListener<keyof QListWidgetSignals>(
        widget,
        "onItemSelectionChange",
        callback
      );
    }
  };
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
