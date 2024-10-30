declare module "react-proxy" {
  export interface ReactProxyComponent {
    update(Component: React.ComponentType): void;
    get(): React.ComponentType;
  }

  export default function createProxy(
    Component: React.ComponentType
  ): ReactProxyComponent;
}
