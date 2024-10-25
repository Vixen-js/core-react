import { Component, QWidget } from "@vixen-js/core";
import {
  ComponentConfig,
  registerComponent,
  VComponent,
  VProps
} from "../Config";
import { Fiber } from "react-reconciler";
import { AppContainer, Ctx } from "../../reconciler";
import { VGridRow } from "./GridRow";

export type GridColumnProps = {
  width?: number;
};

const setGridColumnProps = (
  widget: VGridColumn,
  parent: VGridRow,
  newProps: GridColumnProps,
  _oldProps: GridColumnProps
) => {
  if (widget.actualWidget) {
    const layout = parent.parentGrid?.layout();
    layout?.removeWidget(widget.actualWidget);
    layout?.addWidget(
      widget.actualWidget,
      parent.rowIndex ?? 0,
      widget.columnIndex ?? 0,
      parent.height ?? 1,
      widget.width ?? 1
    );
  }

  const setter: GridColumnProps = {
    set width(width: number) {
      widget.width = width;
    }
  };
  Object.assign(setter, newProps);
};

export class VGridColumn extends Component implements VComponent {
  static tagName = "grid-col";
  native: any = null;
  actualWidget?: QWidget<any>;
  parent?: VGridRow;
  latestProps?: GridColumnProps;
  prevProps?: GridColumnProps;
  columnIndex?: number;
  width?: number;

  setParentRowAndUpdate(parent: VGridRow, idx: number): void {
    this.parent = parent;
    this.columnIndex = idx;
    setGridColumnProps(
      this,
      parent,
      this.latestProps ?? {},
      this.prevProps ?? {}
    );
  }

  remove(): void {
    if (!this.actualWidget) {
      return;
    }

    this.parent?.parentGrid?.layout()?.removeWidget(this.actualWidget);
    this.actualWidget.close();
    this.actualWidget = undefined;
  }

  setProps(newProps: VProps, oldProps: VProps): void {
    setGridColumnProps(this, this.parent!, newProps, oldProps);
  }

  appendInitialChild(child: QWidget<any>) {
    if (this.actualWidget) {
      throw new Error("Grid column can have only one child");
    }

    this.actualWidget = child;
  }
  appendChild(child: QWidget<any>) {
    this.appendInitialChild(child);
  }

  insertBefore(child: QWidget, _before: QWidget) {
    this.appendInitialChild(child);
  }
  removeChild(_child: QWidget) {
    this.remove();
  }
}

class GridColumnConfig extends ComponentConfig {
  tagName = VGridColumn.tagName;
  shouldSetTextContent(_nextProps: VProps): boolean {
    return false;
  }
  createInstance(
    props: VProps,
    _root: AppContainer,
    _context?: any,
    _worInProgress?: Fiber
  ): VComponent {
    const widget = new VGridColumn(null!);
    widget.setProps(props, props);
    return widget;
  }
  finalizeInitialChildren(
    _instance: VComponent,
    _newProps: VProps,
    _root: AppContainer,
    _ctx: Ctx
  ): boolean {
    return true;
  }
  commitMount(
    _instance: VComponent,
    _newProps: VProps,
    _internalInstanceHandle: any
  ): void {
    // do nothing
    return;
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

export const GridColumn = registerComponent<GridColumnProps>(
  new GridColumnConfig()
);
