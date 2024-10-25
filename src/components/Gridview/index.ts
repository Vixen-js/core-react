import { FunctionComponentElement } from "react";
import { GridRowProps, VGridRow } from "./GridRow";
import {
  ComponentConfig,
  registerComponent,
  VComponent,
  VProps,
  VWidget
} from "../Config";
import { QGridLayout, QLayout, QWidget } from "@vixen-js/core";
import { setViewProps } from "../View";
import {
  DataWithOffset,
  offsetOfIdx,
  updateDisplacedChildren
} from "./helpers";
import { Fiber } from "react-reconciler";
import { AppContainer, Ctx } from "../../reconciler";

export type GridViewColumnProps = {
  [ColumnIdx: number]: {
    stretch?: number;
    minWidth?: number;
  };
};

export type GridViewRowProps = {
  [RowIdx: number]: {
    stretch?: number;
    minHeight?: number;
  };
};

export interface GridViewProps {
  children:
    | FunctionComponentElement<GridRowProps>[]
    | FunctionComponentElement<GridRowProps>;

  columnProps?: GridViewColumnProps;
  rowProps?: GridViewRowProps;

  horizontalSpacing?: number;
  verticalSpacing?: number;
}

const setGridViewProps = (
  widget: VGridView,
  newProps: GridViewProps,
  oldProps: GridViewProps
) => {
  const setter: Omit<GridViewProps, "children"> = {
    set horizontalSpacing(spacing: number) {
      widget.layout()?.setHorizontalSpacing(spacing);
    },
    set verticalSpacing(spacing: number) {
      widget.layout()?.setVerticalSpacing(spacing);
    },
    set columnProps(columnProps: GridViewColumnProps) {
      for (const idxStr of Object.keys(columnProps)) {
        const idx = +idxStr;
        const { stretch, minWidth } = columnProps[idx];

        widget.layout()?.setColumnStretch(idx, stretch ?? 0);
        widget.layout()?.setColumnMinimumWidth(idx, minWidth ?? 0);
      }
    },
    set rowProps(props: GridViewRowProps) {
      for (const idxStr of Object.keys(props)) {
        const idx = +idxStr;
        const { stretch, minHeight } = props[idx];
        widget.layout()?.setRowStretch(idx, stretch ?? 0);
        widget.layout()?.setRowMinimumHeight(idx, minHeight ?? 0);
      }
    }
  };
  Object.assign(setter, newProps);
  setViewProps(widget, newProps, oldProps);
};

export class VGridView extends QWidget implements VWidget {
  static tagName = "grid-view";
  native: any = null;
  initialProps?: GridViewProps;
  childRows: DataWithOffset<VGridRow>[] = [];

  layout(): QGridLayout | null {
    return super.layout() as any;
  }

  setLayout(layout: QLayout): void {
    super.setLayout(layout);
  }

  updateChildren(startIdx = 0): void {
    updateDisplacedChildren<VGridRow, VGridView>(
      startIdx,
      this.childRows,
      this,
      "height",
      "setParentGridAndUpdate"
    );
  }

  setProps(newProps: GridViewProps, oldProps: GridViewProps): void {
    if (this.layout()) {
      setGridViewProps(this, newProps, oldProps);
    } else {
      this.initialProps = newProps;
    }
  }

  appendInitialChild(child: QWidget<any>): void {
    this.appendChild(child);
  }

  appendChild(child: QWidget<any>): void {
    if (!(child instanceof VGridRow)) {
      throw new Error("Only rows can be child of grid-view");
    }

    const updateChild = () => {
      const offset = offsetOfIdx<VGridRow>(
        this.childRows.length,
        this.childRows,
        "height"
      );

      child.setParentGridAndUpdate(this, offset);

      this.childRows.push({ offset, widget: child });
    };

    if (this.layout()) {
      updateChild();
      return;
    }

    const layout = new QGridLayout();
    this.setLayout(layout);

    if (this.initialProps) {
      setGridViewProps(this, this.initialProps, {} as GridViewProps);
    }

    updateChild();
  }

  insertBefore(child: QWidget<any>, beforeChild: QWidget<any>): void {
    const prevIdx = this.childRows.findIndex(
      ({ widget }) => widget === (beforeChild as any as VGridRow)
    );

    if (prevIdx === -1) {
      throw new Error("Attempted to insert child before non-existent row");
    }

    const offset = offsetOfIdx<VGridRow>(prevIdx, this.childRows, "height");

    this.childRows.splice(prevIdx, 0, { offset, widget: child as any });
    this.updateChildren(prevIdx);
  }

  removeChild(child: QWidget<any>): void {
    const prevIdx = this.childRows.findIndex(
      ({ widget }) => widget === (child as any as VGridRow)
    );

    if (prevIdx !== -1) {
      this.childRows.splice(prevIdx, 1);
      this.updateChildren(prevIdx);
    }

    (child as any).remove();
    (child as any).parentGrid = undefined;
  }
}

class GridViewConfig extends ComponentConfig {
  tagName = VGridView.tagName;
  shouldSetTextContent(_nextProps: VProps): boolean {
    return false;
  }

  createInstance(
    props: GridViewProps,
    _root: AppContainer,
    _context?: any,
    _worInProgress?: Fiber
  ): VComponent {
    const widget = new VGridView(null!);
    widget.setProps(props, { children: [] });
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
    _instance: VGridView,
    _newProps: VProps,
    _internalInstanceHandle: any
  ): void {
    if (_newProps.visible !== false) {
      _instance.show();
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

export const GridView = registerComponent<GridViewProps>(new GridViewConfig());
