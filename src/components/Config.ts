import { QWidget } from "@vixen-js/core";
import { Fiber } from "react-reconciler";
import { AppContainer, Ctx } from "../reconciler";
import React from "react";

type UpdatePayload = any;

export interface VProps {
  [key: string]: any;
}

export abstract class VComponent {
  static tagName: string;
  abstract setProps(newProps: VProps, oldProps: VProps): void;
  abstract appendInitialChild: (child: QWidget<any>) => void;
  abstract appendChild: (child: QWidget<any>) => void;
  abstract insertBefore: (child: QWidget<any>, before: QWidget<any>) => void;
  abstract removeChild: (child: QWidget<any>) => void;
}

export abstract class VWidget extends QWidget<any> implements VComponent {
  static tagName: string;
  abstract setProps(newProps: VProps, oldProps: VProps): void;
  abstract appendInitialChild(child: QWidget<any>): void;
  abstract appendChild(child: QWidget<any>): void;
  abstract insertBefore(child: QWidget<any>, beforeChild: QWidget<any>): void;
  abstract removeChild(child: QWidget<any>): void;
}

export abstract class ComponentConfig {
  abstract tagName: string;

  getCtx(_parent: Ctx, _root: AppContainer): Ctx {
    return {} as Ctx;
  }

  abstract shouldSetTextContent(nextProps: VProps): boolean;
  abstract createInstance(
    props: VProps,
    root: AppContainer,
    context?: any,
    worInProgress?: Fiber
  ): VComponent;

  finalizeInitialChildren(
    _instance: VComponent,
    _newProps: VProps,
    _root: AppContainer,
    _ctx: Ctx
  ): boolean {
    return false;
  }

  commitMount(
    _instance: VComponent,
    _newProps: VProps,
    _internalInstanceHandle: any
  ) {
    return;
  }

  prepareUpdate(
    _instance: VComponent,
    _oldProps: VProps,
    _newProps: VProps,
    _root: AppContainer,
    _ctx: Ctx
  ): UpdatePayload {
    return true;
  }

  abstract commitUpdate(
    instance: VComponent,
    updatePayload: UpdatePayload,
    oldProps: VProps,
    newProps: VProps,
    root: AppContainer
  ): void;
}

type VixenTag<P> = string | React.ComponentType<P>;

const components = new Map<string, ComponentConfig>();

export function getComponentByTagName(tagName: string): ComponentConfig {
  const config = components.get(tagName);
  if (!config) {
    throw new Error(`No component found for tag: ${tagName}`);
  }
  return config;
}

export function registerComponent<P>(config: ComponentConfig): VixenTag<P> {
  if (components.has(config.tagName)) {
    throw `[${config.tagName}] component already exists. This base component will be ignored`;
  }

  components.set(config.tagName, config);
  return config.tagName;
}
