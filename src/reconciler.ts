import Reconciler from "react-reconciler";
import { QWidget, QSystemTrayIcon, QObject } from "@vixen-js/core";
import {
  getComponentByTagName,
  VProps,
  VComponent,
  VWidget
} from "./components/Config";

export type AppContainer = Set<QWidget<any>>;
export const appContainer: AppContainer = new Set<QWidget>();

export type Ctx = {
  name: string;
};

const shouldIgnoreChild = (child: QObject<any>) =>
  child instanceof QSystemTrayIcon;

const HostConfig: Reconciler.HostConfig<
  string,
  VProps,
  AppContainer,
  VComponent,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
> = {
  getRootHostContext(/* nextRootInstance */): Ctx {
    const context: Ctx = {
      name: "root"
    };
    return context;
  },
  getChildHostContext(parentCtx, fiberType, nextRootInstance): Ctx {
    const { getCtx } = getComponentByTagName(fiberType);
    return getCtx(parentCtx, nextRootInstance);
  },
  shouldSetTextContent(type, nextProps) {
    const { shouldSetTextContent } = getComponentByTagName(type);
    return shouldSetTextContent(nextProps);
  },
  createTextInstance(newText) {
    console.warn(
      `Atempt to create a text instance, ${newText} Use <Text /> component instead`
    );
  },
  createInstance(type, newProps, root, ctx, workInProgress) {
    const { createInstance } = getComponentByTagName(type);
    return createInstance(newProps, root, ctx, workInProgress);
  },
  appendInitialChild(parent: VWidget, child: QWidget<any>) {
    if (shouldIgnoreChild(child)) return;
    parent.appendInitialChild(child);
  },
  finalizeInitialChildren(instance, type, newProps, root, ctx) {
    const { finalizeInitialChildren } = getComponentByTagName(type);
    return finalizeInitialChildren(instance, newProps, root, ctx);
  },
  prepareForCommit(/*rootNode*/) {
    return null;
  },
  resetAfterCommit(/*rootNode*/) {},
  commitMount(instance, type, newProps, internalInstanceHandle) {
    const { commitMount } = getComponentByTagName(type);
    return commitMount(instance, newProps, internalInstanceHandle);
  },
  appendChildToContainer(container, child: QWidget<any>) {
    container.add(child);
  },
  insertInContainerBefore(container, child) {
    container.add(child);
  },
  removeChildFromContainer(container, child) {
    container.delete(child);
    if (child.close) {
      child.close();
    }
  },
  prepareUpdate(instance, type, oldProps, newProps, root, hostCtx) {
    const { prepareUpdate } = getComponentByTagName(type);
    return prepareUpdate(instance, oldProps, newProps, root, hostCtx);
  },
  commitUpdate(
    instance,
    updatePayload,
    type,
    prevProps,
    nextProps,
    internalHandle
  ) {
    const { commitUpdate } = getComponentByTagName(type);
    return commitUpdate(
      instance,
      updatePayload,
      prevProps,
      nextProps,
      internalHandle
    );
  },
  appendChild(parent: VWidget, child: QWidget<any>) {
    if (shouldIgnoreChild(child)) return;
    parent.appendChild(child);
  },
  insertBefore(
    parent: VWidget,
    child: QWidget<any>,
    beforeChild: QWidget<any>
  ) {
    if (shouldIgnoreChild(child)) return;

    parent.insertBefore(child, beforeChild);
  },
  removeChild(parent: VWidget, child: QWidget<any>) {
    if (!shouldIgnoreChild(child)) {
      parent.removeChild(child);
    }
    if (child.close) {
      child.close();
    }
  },
  commitTextUpdate() {
    console.warn("Atempt to update a text instance which is not supported");
  },
  resetTextContent() {
    console.warn("resetTextContent triggered");
  },
  supportsMutation: true,
  supportsPersistence: false,
  supportsHydration: false,
  getPublicInstance(instance) {
    return instance;
  },
  hideInstance(instance: any) {
    instance.hide();
  },
  unhideInstance(instance: any) {
    instance.show();
  },
  hideTextInstance() {
    console.warn("Atempt to hide a text instance which is not supported");
  },
  unhideTextInstance: () => {
    console.warn("Atempt to unhide a text instance which is not supported");
  },
  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  noTimeout: -1,
  isPrimaryRenderer: true,
  preparePortalMount: function (_containerInfo: AppContainer): void {
    throw new Error("Function not implemented.");
  },
  getCurrentEventPriority: function (): Reconciler.Lane {
    throw new Error("Function not implemented.");
  },
  getInstanceFromNode: function (
    _node: any
  ): Reconciler.Fiber | null | undefined {
    throw new Error("Function not implemented.");
  },
  beforeActiveInstanceBlur: function (): void {
    throw new Error("Function not implemented.");
  },
  afterActiveInstanceBlur: function (): void {
    throw new Error("Function not implemented.");
  },
  prepareScopeUpdate: function (_scope: any, _instance: any): void {
    throw new Error("Function not implemented.");
  },
  getInstanceFromScope: function (_scopeInstance: any): VComponent | null {
    throw new Error("Function not implemented.");
  },
  detachDeletedInstance: function (_node: VComponent): void {
    throw new Error("Function not implemented.");
  }
};

export default Reconciler(HostConfig);
