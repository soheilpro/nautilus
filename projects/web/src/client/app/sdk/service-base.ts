import * as _ from 'underscore';
import axios, { AxiosRequestConfig } from 'axios';
import { IService } from './iservice';
import { IChange } from './ichange';
import { IClient } from './iclient';
import { IEntity } from './ientity';
import { IFilter } from './ifilter';
import { IGetResult } from './iget-result';
import { ArgumentError } from './argument-error';

export interface IInvokeOptions {
  method: string;
  path: string;
  query?: Object;
  data?: Object;
}

export abstract class ServiceBase<TEntity extends IEntity, TFilter extends IFilter, TChange extends IChange, TGetResult extends IGetResult<TEntity>> implements IService<TEntity, TFilter, TChange, TGetResult> {
  private client: IClient;

  constructor(client: IClient) {
    this.client = client;
    this.deserializeEntity = this.deserializeEntity.bind(this);
    this.toId = this.toId.bind(this);
  }

  abstract basePath(): string;

  abstract deserializeEntity(data: any): TEntity;

  abstract serializeFilter(filter: TFilter): Object;

  abstract serializeEntity(entity: TEntity): Object;

  abstract serializeChange(change: TChange): Object;

  protected deserializeGetResult(result: any): TGetResult {
    return {
      entities: result.data.map(this.deserializeEntity),
    } as TGetResult;
  }

  async get(filter: TFilter, supplement?: string[]): Promise<TGetResult> {
    const invokeOptions: IInvokeOptions = {
      method: 'GET',
      path: this.basePath(),
      query: {
        ...(filter ? this.serializeFilter(filter) : {}),
        supplement: supplement ? supplement.join(',') : undefined,
      },
    };

    const result = (await this.invoke(invokeOptions)).data;

    return this.deserializeGetResult(result);
  }

  async insert(entity: TEntity): Promise<TEntity> {
    const invokeOptions: IInvokeOptions = {
      method: 'POST',
      path: this.basePath(),
      data: this.serializeEntity(entity),
    };

    const result = (await this.invoke(invokeOptions)).data;

    return this.deserializeEntity(result.data);
  }

  async update(id: string, change: TChange): Promise<TEntity> {
    const invokeOptions: IInvokeOptions = {
      method: 'PATCH',
      path: `${this.basePath()}/${id}`,
      data: this.serializeChange(change),
    };

    const result = (await this.invoke(invokeOptions)).data;

    return this.deserializeEntity(result.data);
  }

  delete(id: string): Promise<void> {
    const invokeOptions: IInvokeOptions = {
      method: 'DELETE',
      path: `${this.basePath()}/${id}`,
    };

    return this.invoke(invokeOptions);
  }

  protected async invoke(options: IInvokeOptions): Promise<any> {
    const config: AxiosRequestConfig = {
      method: options.method,
      url: this.client.address + options.path,
      params: _.pick(options.query, (value: any) => value !== undefined),
      data: _.pick(options.data, (value: any) => value !== undefined),
      validateStatus: (): boolean => true,
    };

    if (this.client.session) {
      config.auth = {
        username: this.client.session.user.id,
        password: this.client.session.accessToken,
      };
    }

    const result = await axios.request(config);

    if (result.status === 422)
      throw new ArgumentError(result.data.message);

    if (result.status >= 400)
      throw new Error(result.statusText);

    return result;
  }

  protected toId(object: IEntity): string {
    if (object === undefined)
      return undefined;

    if (object === null)
      return '';

    return object.id;
  }

  protected toIdArray(entities: IEntity[]): string {
    if (!entities)
      return undefined;

    const result = entities.map(this.toId);

    if (result.length === 0)
      return undefined;

    return result.join(',');
  }
}
