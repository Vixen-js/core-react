import Reconciler, { HostConfig } from "react-reconciler";
import { DefaultEventPriority } from "react-reconciler/constants";
import { QWidget, QSystemTrayIcon, QObject } from "@vixen-js/core";
import { getComponentByTagName, VComponent } from "./components/Config";
import { VWidget } from "./components/Config";

export type AppContainer = Set<QWidget<any>>;
export const appContainer: AppContainer = new Set<QWidget>();

export type Ctx = {
  name: string;
};

type Type = string;
type Props = { [key: string]: any };
type Container = AppContainer;
type Instance = VComponent;
type TextInstance = any;
type SuspenseInstance = any;
type HydratableInstance = any;
type PublicInstance = any;
type HostContext = Ctx;
type UpdatePayload = any;
type _ChildSet = any;
type TimeoutHandle = any;
type NoTimeout = -1;

const shouldIgnoreChild = (child: QObject<any>) =>
  child instanceof QSystemTrayIcon;

const hostConfig: HostConfig<
  Type,
  Props,
  Container,
  Instance,
  TextInstance,
  SuspenseInstance,
  HydratableInstance,
  PublicInstance,
  HostContext,
  UpdatePayload,
  _ChildSet,
  TimeoutHandle,
  NoTimeout
> = {
  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  noTimeout: -1,
  isPrimaryRenderer: true,
  createInstance(
    type: Type,
    newProps: Props,
    rootContainer: Container,
    ctx: HostContext,
    internalHandle: any
  ) {
    const { createInstance } = getComponentByTagName(type);
    return createInstance(newProps, rootContainer, ctx, internalHandle);
  },
  createTextInstance(
    _text: string,
    _root: Container,
    _ctx: HostContext,
    _internalHandle: any
  ) {
    console.warn("Can't create text without <Text /> element.");
  },
  shouldSetTextContent(type, props) {
    const { shouldSetTextContent } = getComponentByTagName(type);
    return shouldSetTextContent(props);
  },
  getChildHostContext(parentHostContext, type, rootContainer) {
    const { getCtx } = getComponentByTagName(type);
    return getCtx(parentHostContext, rootContainer);
  },
  getRootHostContext(_rootContext) {
    const ctx: Ctx = {
      name: "root"
    };
    return ctx;
  },
  appendInitialChild(parent: VWidget, child: QWidget<any>) {
    if (shouldIgnoreChild(child)) return;

    parent.appendInitialChild(child);
  },
  finalizeInitialChildren(instance, type, newProps, rootInstance, ctx) {
    const { finalizeInitialChildren } = getComponentByTagName(type);
    return finalizeInitialChildren(instance, newProps, rootInstance, ctx);
  },
  prepareForCommit() {
    return null;
  },
  resetAfterCommit() {
    return;
  },
  commitMount(instance, type, newProps, internalHandle) {
    const { commitMount } = getComponentByTagName(type);
    return commitMount(instance, newProps, internalHandle);
  },
  appendChildToContainer(container, child) {
    container.add(child);
  },
  insertInContainerBefore(container, child, _beforeChild) {
    container.add(child);
  },
  removeChildFromContainer(container, child) {
    container.delete(child);
    if (child.close) {
      child.close();
    }
  },
  prepareUpdate(instance, type, oldProps, newProps, rootInstance, ctx) {
    const { prepareUpdate } = getComponentByTagName(type);
    return prepareUpdate(instance, oldProps, newProps, rootInstance, ctx);
  },
  commitUpdate(
    instance,
    updatePayload,
    type,
    oldProps,
    newProps,
    finishedWork
  ) {
    const { commitUpdate } = getComponentByTagName(type);
    return commitUpdate(
      instance,
      updatePayload,
      oldProps,
      newProps,
      finishedWork
    );
  },
  appendChild(parent, child) {
    if (shouldIgnoreChild(child)) return;
    parent.appendChild(child);
  },
  insertBefore(parent, child, beforeChild) {
    if (shouldIgnoreChild(child)) return;
    parent.insertBefore(child, beforeChild);
  },
  removeChild(parent, child) {
    if (!shouldIgnoreChild(child)) {
      parent.removeChild(child);
    }
    if (child.close) {
      child.close();
    }
  },
  commitTextUpdate(_textInstance, _oldText, _newText) {
    console.warn("Can't update text without <Text /> element.");
  },
  resetTextContent(_instance) {
    console.warn("Can't reset text without <Text /> element.");
  },
  supportsMutation: true,
  supportsPersistence: false,
  supportsHydration: false,
  getPublicInstance(instance) {
    return instance;
  },
  hideInstance(instance: VWidget) {
    instance.hide();
  },
  unhideInstance(instance: VWidget) {
    instance.show();
  },
  hideTextInstance(_textInstance) {
    console.warn("Can't hide text without <Text /> element.");
  },
  unhideTextInstance(_textInstance) {
    console.warn("Can't unhide text without <Text /> element.");
  },
  preparePortalMount(_containerInfo) {
    return;
  },
  getCurrentEventPriority() {
    return DefaultEventPriority;
  },
  getInstanceFromNode(node) {
    return node;
  },
  beforeActiveInstanceBlur() {
    return;
  },
  afterActiveInstanceBlur() {
    return;
  },
  prepareScopeUpdate(_scope, _instance) {
    return;
  },
  getInstanceFromScope(_scope) {
    return _scope;
  },
  detachDeletedInstance(node: VWidget) {
    if (node.close) {
      node.close();
    }
  },
  clearContainer(_container) {
    // IMPORTANT NOTE: This method is required by React Reconciler and should not be deleted.
    return;
  }
};

export default Reconciler(hostConfig);
