import {
  defaultContainer,
  getContainer,
  getInstancesOf,
  hasContainer,
  registerContainer,
  removeContainer,
} from './common';

/**
 * The container registry is responsible for holding the default and every
 * created container instance for later access.
 *
 * _Note: This class is for internal use and it's API may break in minor or
 * patch releases without warning._
 */
export class ContainerRegistry {
  public static readonly defaultContainer = defaultContainer;
  public static registerContainer = registerContainer;
  public static hasContainer = hasContainer;
  public static getContainer = getContainer;
  public static getInstancesOf = getInstancesOf;
  public static removeContainer = removeContainer;
}
