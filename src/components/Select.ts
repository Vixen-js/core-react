import {
  InsertPolicy,
  QComboBox,
  QComboBoxSignals,
  QIcon,
  QSize,
  QVariant,
  QWidget,
  SizeAdjustPolicy
} from "@vixen-js/core";
import { setViewProps, ViewProps } from "./View";
import {
  ComponentConfig,
  registerComponent,
  VComponent,
  VProps,
  VWidget
} from "./Config";
import { throwUnsupported } from "../utils/helpers";
import { Fiber } from "react-reconciler";
import { AppContainer, Ctx } from "../reconciler";

type SelectItem = {
  text: string;
  icon?: QIcon;
  userData?: QVariant;
};

export interface SelectProps extends ViewProps<QComboBoxSignals> {
  items?: SelectItem[];
  count?: number;
  iconSize?: QSize;
  frame?: boolean;
  currentIndex?: number;
  currentText?: string;
  currentData?: QVariant;
  duplicatesEnabled?: boolean;
  editable?: boolean;
  insertPolicy?: InsertPolicy;
  maxCount?: number;
  maxVisibleItems?: number;
  minimumContentsLength?: number;
  modelColumn?: number;
  sizeAdjustPolicy?: SizeAdjustPolicy;
}

const setSelectProps = (
  widget: VSelect,
  newProps: SelectProps,
  oldProps: SelectProps
) => {
  const setter: SelectProps = {
    set items(items: SelectItem[]) {
      widget.clear();
      items.forEach((item) => {
        widget.addItem(item.icon, item.text, item.userData);
      });
    },
    set currentIndex(currentIndex: number) {
      widget.setCurrentIndex(currentIndex);
    },
    set currentText(currentText: string) {
      widget.setCurrentText(currentText);
    },
    set currentData(currentData: QVariant) {
      widget.setProperty("currentData", currentData.native!);
    },
    set duplicatesEnabled(duplicatesEnabled: boolean) {
      widget.setDuplicatesEnabled(duplicatesEnabled);
    },
    set editable(editable: boolean) {
      widget.setEditable(editable);
    },
    set insertPolicy(insertPolicy: InsertPolicy) {
      widget.setInsertPolicy(insertPolicy);
    },
    set maxCount(maxCount: number) {
      widget.setMaxCount(maxCount);
    },
    set maxVisibleItems(maxVisibleItems: number) {
      widget.setMaxVisibleItems(maxVisibleItems);
    },
    set minimumContentsLength(minimumContentsLength: number) {
      widget.setMinimumContentsLength(minimumContentsLength);
    },
    set modelColumn(modelColumn: number) {
      widget.setModelColumn(modelColumn);
    },
    set sizeAdjustPolicy(sizeAdjustPolicy: SizeAdjustPolicy) {
      widget.setSizeAdjustPolicy(sizeAdjustPolicy);
    },
    set count(count: number) {
      widget.setProperty("count", count);
    },
    set iconSize(iconSize: QSize) {
      widget.setIconSize(iconSize);
    },
    set frame(frame: boolean) {
      widget.setFrame(frame);
    },
    set id(id: string) {
      widget.setObjectName(id);
    }
  };
  Object.assign(setter, newProps);
  setViewProps(widget, newProps, oldProps);
};

export class VSelect extends QComboBox implements VWidget {
  static tagName = "select";
  setProps(newProps: VProps, oldProps: VProps): void {
    setSelectProps(this, newProps, oldProps);
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

class SelectConfig extends ComponentConfig {
  tagName = VSelect.tagName;
  shouldSetTextContent(_nextProps: VProps): boolean {
    return true;
  }
  createInstance(
    props: VProps,
    _root: AppContainer,
    _context?: any,
    _worInProgress?: Fiber
  ): VComponent {
    const widget = new VSelect();
    widget.setProps(props, {});
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
    _instance: VSelect,
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

export const Select = registerComponent<SelectProps>(new SelectConfig());
