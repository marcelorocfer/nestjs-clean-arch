import { Entity } from "../entities/entity";
import { RepositoryInterface } from "./repository-contracts";

export type SortDirection = 'asc' | 'desc';

export type SearchProps<Filter = string> = {
  page?: number;
  perPage?:number;
  sort?: string | null;
  sortDir?: SortDirection | null;
  filter?: Filter | null;
}

export type SearchResultProps<E extends Entity, Filter> = {
  items: E[]
  total: number
  currentPage: number
  perpage: number
  sort: string | null
  sortDir: string | null
  filter: Filter | null
}

export class SearchParams {
  protected _page: number;
  protected _perPage = 15;
  protected _sort: string | null;
  protected _sortDir: SortDirection | null;
  protected _filter: string | null;

  constructor(props: SearchProps = {}) {
    this.page = props.page;
    this.perPage = props.perPage;
    this.sort = props.sort;
    this.sortDir = props.sortDir;
    this.filter = props.filter;
  }

  get page() {
    return this._page;
  }

  private set page(value: number) {
    let _page = +value;
    if (Number.isNaN(_page) || _page <= 0 || parseInt(_page as any) !== _page) {
      _page = 1;
    }
    this._page = _page;
  }

  get perPage() {
    return this._perPage;
  }

  private set perPage(value: number) {
    let _perPage = value === (true as any) ? this._perPage : +value;
    if (
      Number.isNaN(_perPage) || _perPage <= 0 || parseInt(_perPage as any) !== _perPage) {
      _perPage = this._perPage;
    }
    this._perPage = _perPage;
  }

  get sort() {
    return this._sort;
  }

  private set sort(value: string | null) {
    this._sort = value === null || value === undefined || value === '' ? null : `${value}`;
  }

  get sortDir() {
    return this._sortDir;
  }

  private set sortDir(value: string | null) {
    if (!this.sort) {
      this._sortDir = null;
      return;
    }
    const dir = `${value}`.toLowerCase();
    this._sortDir = dir !== 'asc' && dir !== 'desc' ? 'desc' : dir;
  }

  get filter() {
    return this._filter;
  }

  private set filter(value: string | null) {
    this._filter = value === null || value === undefined || value === '' ? null : `${value}`;
  }
}

export class SearchResult<E extends Entity, Filter = string> {
  readonly items: E[]
  readonly total: number
  readonly currentPage: number
  readonly perpage: number
  readonly lastpage: number
  readonly sort: string | null
  readonly sortDir: string | null
  readonly filter: Filter | null

  constructor(props: SearchResultProps<E, Filter>) {
    this.items = props.items;
    this.total = props.total;
    this.currentPage = props.currentPage;
    this.perpage = props.perpage;
    this.lastpage = Math.ceil(props.total / props.perpage);
    this.sort = props.sort ?? null;
    this.sortDir = props.sortDir ?? null;
    this.filter = props.filter ?? null;
  }

  toJSON(forceEntity = false) {
    return {
      items: forceEntity ? this.items.map(item => item.toJSON()) : this.items,
      total: this.total,
      current_page: this.currentPage,
      per_page: this.perpage,
      last_page: this.lastpage,
      sort: this.sort,
      sort_dir: this.sortDir,
      filter: this.filter
    }
  }
}

export interface SearchableRepositoryInterface<
  E extends Entity,
  SearchInput,
  SearchOutput,
> extends RepositoryInterface<E> {
  search(props: SearchParams): Promise<SearchOutput>;
}