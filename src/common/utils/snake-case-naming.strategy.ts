import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export class CustomSnakeNamingStrategy extends SnakeNamingStrategy {
  joinColumnName(relationName: string, referencedColumnName: string): string {
    return super
      .joinColumnName(relationName, referencedColumnName)
      .replace('__', '_');
  }
}
