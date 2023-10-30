import { Entity } from "../entities/entity";
import { NotFoundError } from "../errors/not-found-error";
import { RepositoryInterface } from "./repository-contracts";

export abstract class InMemoryRepository<E extends Entity>
  implements RepositoryInterface<E>
{
  items: E[] = [];

  async insert(entity: any): Promise<void> {
    this.items.push(entity);
  }

  async findById(id: string): Promise<any> {
    return this._get(id);
  }

  async findAll(): Promise<any[]> {
    return this.items;
  }

  async update(entity: any): Promise<void> {
    console.log(this.items);
    await this._get(entity.id);
    const index = this.items.findIndex(item => item.id === entity.id);
    this.items[index] = entity;
  }

  async delete(id: string): Promise<void> {
    await this._get(id);
    const index = this.items.findIndex(item => item.id === id);
    this.items.splice(index, 1);
  }

  protected async _get(id: string): Promise<any> {
    const _id = `${id}`;
    const entity = this.items.find(item => item.id === _id);
    if (!entity) {
      throw new NotFoundError('Entity not found');
    }
    return entity;
  }
}