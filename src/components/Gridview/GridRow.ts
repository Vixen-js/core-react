import { FunctionComponentElement } from "react";
import { GridColumnProps, VGridColumn } from "./GridColumn";
import {
  ComponentConfig,
  registerComponent,
  VComponent,
  VProps
} from "../Config";
import { Component, QWidget } from "@vixen-js/core";
import {
  DataWithOffset,
  offsetOfIdx as offsetForIdx,
  updateDisplacedChildren
} from "./helpers";
import { Fiber } from "react-reconciler";
import { AppContainer, Ctx } from "../../reconciler";
import { VGridView } from ".";

export type GridRowProps = {
  children?:
    | Array<FunctionComponentElement<GridColumnProps>>
    | FunctionComponentElement<GridColumnProps>;

  height?: number;
};

const setGridRowProps = (
  widget: VGridRow,
  _parentGrid: VGridView,
  newProps: Omit<GridRowProps, "children">,
  _oldProps: Omit<GridRowProps, "children">
) => {
  const setter: Omit<GridRowProps, "children"> = {
    set height(height: number) {
      widget.height = height;
    }
  };
  Object.assign(setter, newProps);
};

export class VGridRow extends Component implements VComponent {
  static tagName = "grid-row";
  native: any = null;
  parentGrid?: VGridView;
  latestProps?: GridRowProps;
  prevProps?: GridRowProps;
  childColumns: DataWithOffset<VGridColumn>[] = [];
  rowIndex?: number;
  height?: number;

  setParentGridAndUpdate(parentGrid: VGridView, idx: number): void {
    this.parentGrid = parentGrid;
    this.rowIndex = idx;
    setGridRowProps(
      this,
      parentGrid,
      this.latestProps ?? {},
      this.prevProps ?? {}
    );

    this.updateChildren();
  }

  updateChildren(startIdx = 0): void {
    updateDisplacedChildren<VGridColumn, VGridRow>(
      startIdx,
      this.childColumns,
      this,
      "width",
      "setParentRowAndUpdate"
    );
  }
  remove(): void {
    this.childColumns.forEach(({ widget }) => {
      widget.remove();
    });
  }

  setProps(newProps: GridRowProps, oldProps: GridRowProps): void {
    if (this.parentGrid) {
      setGridRowProps(this, this.parentGrid, newProps, oldProps);
    }

    this.latestProps = newProps;
    this.prevProps = oldProps;
  }

  appendInitialChild(child: QWidget<any>) {
    this.appendChild(child);
  }

  appendChild(child: QWidget<any>) {
    if (!(child instanceof VGridColumn)) {
      throw new Error("Only columns can be child of grid-row");
    }

    const offset = offsetForIdx<VGridColumn>(
      this.childColumns.length,
      this.childColumns,
      "width"
    );

    child.setParentRowAndUpdate(this, offset);

    this.childColumns.push({ offset, widget: child });
  }

  insertBefore(child: QWidget<any>, before: QWidget<any>): void {
    const prevIdx = this.childColumns.findIndex(
      ({ widget }) => widget === (before as any as VGridColumn)
    );

    if (prevIdx === -1) {
      throw new Error("Attempted to insert child before non-existent column");
    }

    const offset = offsetForIdx<VGridColumn>(
      prevIdx,
      this.childColumns,
      "width"
    );

    this.childColumns.splice(prevIdx, 0, { offset, widget: child as any });
    // Update Displaced childs
    this.updateChildren(prevIdx);
  }
  removeChild(child: QWidget<any>): void {
    const prevIdx = this.childColumns.findIndex(
      ({ widget }) => widget === (child as any as VGridColumn)
    );

    if (prevIdx !== -1) {
      this.childColumns.splice(prevIdx, 1);
      this.updateChildren(prevIdx);
    }

    // remove child from parent
    (child as any).remove();
    (child as any).parent = undefined;
  }
}

class GirdRowConfig extends ComponentConfig {
  tagName = VGridRow.tagName;
  shouldSetTextContent(_nextProps: VProps): boolean {
    return false;
  }
  createInstance(
    props: GridRowProps,
    _root: AppContainer,
    _context?: any,
    _worInProgress?: Fiber
  ): VGridRow {
    const widget = new VGridRow(null!);
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

export const GridRow = registerComponent<GridRowProps>(new GirdRowConfig());
