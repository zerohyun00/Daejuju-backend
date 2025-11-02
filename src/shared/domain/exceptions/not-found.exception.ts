import { DomainException } from './domain.exception';

/**
 * Not Found Exception
 * 엔티티를 찾을 수 없을 때 발생
 */
export class NotFoundException extends DomainException {
  constructor(entity: string, identifier: string | number) {
    super(`${entity} with identifier ${identifier} not found`);
    this.name = 'NotFoundException';
  }
}

