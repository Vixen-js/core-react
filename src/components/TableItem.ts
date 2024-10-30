import {
  AlignmentFlag,
  CheckState,
  ItemFlag,
  QBrush,
  QFont,
  QIcon,
  QSize,
  QTableWidgetItem,
  QVariant,
  QWidget
} from "@vixen-js/core";
import { ComponentConfig, registerComponent, VComponent } from "./Config";
import { throwUnsupported } from "../utils/helpers";
import { AppContainer } from "../reconciler";
import { Fiber } from "react-reconciler";

export interface TableData {
  role: number;
  value: QVariant;
}

export type CellPosition = [number, number];

export interface TableItemProps {
  /**
   * position of this item in the Table
   * @tuple [row: number, column: number]
   */
  cellPosition: CellPosition;
  text?: string;
  /**
   * handle the behavior of the TableItem
   *
   * following example makes the item non-editable+selectable only checkable
   * @example
   * ```javascript
   * <TableItem flags={ItemFlag.ItemIsEnabled | ItemFlag.ItemIsUserCheckable} {...props}/>
   * ```
   */
  flags?: ItemFlag;
  checkState?: CheckState;
  data?: TableData;
  background?: QBrush;
  foreground?: QBrush;
  icon?: QIcon;
  selected?: boolean;
  font?: QFont;
  hintSize?: QSize;
  statusTip?: string;
  textAlignment?: AlignmentFlag;
  toolTip?: string;
  whatsThis?: string;
}

type SimplifiedTableItemProps = Omit<TableItemProps, "cellPosition">;

const setTableItemProps = (
  widget: VTableItem,
  newProps: SimplifiedTableItemProps,
  _oldProps: SimplifiedTableItemProps
) => {
  const setter: SimplifiedTableItemProps = {
    set text(text: string) {
      widget.setText(text);
    },
    set flags(flags: ItemFlag) {
      widget.setFlags(flags);
    },
    set checkState(checkState: CheckState) {
      widget.setCheckState(checkState);
    },
    set data({ role, value }: TableData) {
      widget.setData(role, value);
    },
    set background(background: QBrush) {
      widget.setBackground(background);
    },
    set foreground(foreground: QBrush) {
      widget.setForeground(foreground);
    },
    set icon(icon: QIcon) {
      widget.setIcon(icon);
    },
    set selected(selected: boolean) {
      widget.setSelected(selected);
    },
    set font(font: QFont) {
      widget.setFont(font);
    },
    set hintSize(hintSize: QSize) {
      widget.setSizeHint(hintSize);
    },
    set statusTip(statusTip: string) {
      widget.setStatusTip(statusTip);
    },
    set textAlignment(textAlignment: AlignmentFlag) {
      widget.setTextAlignment(textAlignment);
    },
    set toolTip(toolTip: string) {
      widget.setToolTip(toolTip);
    },
    set whatsThis(whatsThis: string) {
      widget.setWhatsThis(whatsThis);
    }
  };
  Object.assign(setter, newProps);
};

/**
 * @ignore
 */
export class VTableItem extends QTableWidgetItem implements VComponent {
  static tagName = "table-item";
  cellPosition!: CellPosition;
  setProps(newProps: TableItemProps, oldProps: TableItemProps): void {
    this.cellPosition = newProps.cellPosition;
    setTableItemProps(this, newProps, oldProps);
  }
  appendInitialChild(_child: QWidget<any>): void {
    throwUnsupported(this);
  }
  appendChild(_child: QWidget<any>): void {
    throwUnsupported(this);
  }
  insertBefore(_child: QWidget<any>, _beforeChild: QWidget<any>): void {
    throwUnsupported(this);
  }
  removeChild(_child: QWidget<any>): void {
    throwUnsupported(this);
  }
}

class TableItemConfig extends ComponentConfig {
  tagName = VTableItem.tagName;
  shouldSetTextContent(_nextProps: TableItemProps): boolean {
    return true;
  }
  createInstance(
    newProps: TableItemProps,
    _rootInstance: AppContainer,
    _context: any,
    _workInProgress: Fiber
  ): VTableItem {
    const widget = new VTableItem();
    widget.setProps(newProps, { cellPosition: [0, 0] });
    return widget;
  }
  commitUpdate(
    instance: VTableItem,
    _updatePayload: any,
    oldProps: TableItemProps,
    newProps: TableItemProps
  ): void {
    instance.setProps(newProps, oldProps);
  }
}
/**
 * React implementation of Vixen Table Item widget
 *
 * Can only be used as a child of `<Table/>`
 * @property `cellPosition` valid position of the item in the Table
 */

export const TableItem = registerComponent<TableItemProps>(
  new TableItemConfig()
);
