import { ContainerInstance } from './container-instance.class';
import { Constructable } from './types/constructable.type';
import { ContainerIdentifier } from './types/container-identifier.type';

/**
 * The list of all known container. Created containers are automatically added
 * to this list. Two container cannot be registered with the same ID.
 *
 * This map doesn't contains the default container.
 */
export const containerMap = new Map<ContainerIdentifier, ContainerInstance>();

/**
 * The default global container. By default services are registered into this
 * container when registered via `Container.set()` or `@Service` decorator.
 */
export const defaultContainer = new ContainerInstance('default');

/**
 * Registers the given container instance or throws an error.
 *
 * _Note: This function is auto-called when a Container instance is created,
 * it doesn't need to be called manually!_
 *
 * @param container the container to add to the registry
 */
export function registerContainer(container: ContainerInstance) {
  if (container instanceof ContainerInstance === false) {
    // TODO: Create custom error for this.
    throw new Error('Only ContainerInstance instances can be registered.');
  }

  /** If we already set the default container (in index) then no-one else can register a default. */
  if (!!defaultContainer && container.id === 'default') {
    // TODO: Create custom error for this.
    throw new Error('You cannot register a container with the "default" ID.');
  }

  if (containerMap.has(container.id)) {
    // TODO: Create custom error for this.
    throw new Error('Cannot register container with same ID.');
  }

  containerMap.set(container.id, container);
}

/**
 * Returns true if a container exists with the given ID or false otherwise.
 *
 * @param id the ID of the container
 */
export function hasContainer(id: ContainerIdentifier) {
  return containerMap.has(id);
}

/**
 * Returns the container for requested ID or throws an error if no container
 * is registered with the given ID.
 *
 * @param id the ID of the container
 */
export function getContainer(id: ContainerIdentifier) {
  const registeredContainer = containerMap.get(id);

  if (registeredContainer === undefined) {
    // TODO: Create custom error for this.
    throw new Error('No container is registered with the given ID.');
  }

  return registeredContainer;
}

/**
 * Retrieves all services that are instances of given instance class from the service container.
 */
export function getInstancesOf<T = unknown>(instanceClass: Constructable<T>): T[] {
  const allContainers = [defaultContainer].concat(Array.from(containerMap.values()));

  return Array.from(
    new Set(
      allContainers.reduce(
        (previousInstances, container) => previousInstances.concat(container.getInstancesOf(instanceClass)),
        [] as T[]
      )
    )
  );
}

/**
 * Removes the given container from the registry and disposes all services
 * registered only in this container.
 *
 * This function throws an error if no
 *   - container exists with the given ID
 *   - any of the registered services threw an error during it's disposal
 *
 * @param container the container to remove from the registry
 */
export async function removeContainer(container: ContainerInstance) {
  const registeredContainer = containerMap.get(container.id);

  if (registeredContainer === undefined) {
    // TODO: Create custom error for this.
    throw new Error('No container is registered with the given ID.');
  }

  /** We remove the container first. */
  containerMap.delete(container.id);

  /** We dispose all registered classes in the container. */
  await registeredContainer.dispose();
}
