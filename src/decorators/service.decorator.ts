import { ServiceMetadata } from '../interfaces/service-metadata.interface';
import { ServiceOptions } from '../interfaces/service-options.interface';
import { EMPTY_VALUE } from '../empty.const';
import { Constructable } from '../types/constructable.type';
import { Container } from '../container.class';

/**
 * Marks class as a service that can be injected using Container.
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export function service<T = unknown>(): Function;
export function service<T = unknown>(options: ServiceOptions<T>): Function;
export function service<T>(options: ServiceOptions<T> = {}): ClassDecorator {
  return targetConstructor => {
    const serviceMetadata: ServiceMetadata<T> = {
      id: options.id || targetConstructor,
      type: targetConstructor as unknown as Constructable<T>,
      factory: (options as any).factory || undefined,
      multiple: options.multiple || false,
      eager: options.eager || false,
      scope: options.scope || 'container',
      referencedBy: new Map().set(Container.defaultContainer.id, Container.defaultContainer),
      value: EMPTY_VALUE,
    };

    Container.defaultContainer.set(serviceMetadata);
  };
}
