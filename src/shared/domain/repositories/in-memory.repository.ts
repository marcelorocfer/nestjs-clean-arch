import { Entity } from "../entities/entity";
import { RepositoryInterface } from "./repository-contracts";

export abstract class InMemoryRepository<E extends Entity>
  implements RepositoryInterface<E>
{
  items: E[] = [];

  async insert(entity: any): Promise<void> {
    this.items.push(entity);
  }

  async findById(id: string): Promise<any> {
    const _id = `${id}`;
    const entity = this.items.find(item => item.id === _id);
    if (!entity) {
      throw new Error('Entity not found');
    }
    return entity;
  }

  async findAll(): Promise<any[]> {
    return this.items;
  }

  update(entity: any): Promise<void> {
    throw new Error("Method not implemented.");
  }

  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

}