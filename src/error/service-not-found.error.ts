import { ServiceIdentifier } from '../types/service-identifier.type';
import { Token } from '../token.class';

/**
 * Thrown when requested service was not found.
 */
export function ServiceNotFoundError(identifier: ServiceIdentifier) {
  let normalizedIdentifier: string = '<UNKNOWN_IDENTIFIER>';

  if (typeof identifier === 'string') {
    normalizedIdentifier = identifier;
  } else if (identifier instanceof Token) {
    normalizedIdentifier = `Token<${identifier.name || 'UNSET_NAME'}>`;
  } else if (identifier && (identifier.name || identifier.prototype?.name)) {
    normalizedIdentifier =
      `MaybeConstructable<${identifier.name}>` ||
      `MaybeConstructable<${(identifier.prototype as { name: string })?.name}>`;
  }

  return new Error(
    `Service with "${normalizedIdentifier}" identifier was not found in the container. ` +
      `Register it before usage via explicitly calling the "Container.set" function or using the "@Service()" decorator.`
  );
}
