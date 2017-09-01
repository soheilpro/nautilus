import * as _ from 'underscore';
import axios, { AxiosRequestConfig } from 'axios';
import { IService } from './iservice';
import { IChange } from './ichange';
import { IClient } from './iclient';
import { IEntity } from './ientity';
import { IFilter } from './ifilter';
import { IGetResult } from './iget-result';

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
    this.toId = this.toId.bind(this);
  }

  abstract basePath(): string;

  abstract serializeFilter(filter: TFilter): Object;

  abstract serializeEntity(entity: TEntity): Object;

  abstract serializeChange(change: TChange): Object;

  protected deserializeGetResult(data: any): TGetResult {
    const result: IGetResult<TEntity> = {
      entities: data.data as TEntity[],
    };

    return result as TGetResult;
  }

  async get(filter: TFilter, supplement?: string[]) {
    const invokeOptions: IInvokeOptions = {
      method: 'GET',
      path: this.basePath(),
      query: {
        ...(filter ? this.serializeFilter(filter) : {}),
        supplement: supplement ? supplement.join(',') : undefined,
      },
    };

    const data = (await this.invoke(invokeOptions)).data;

    return this.deserializeGetResult(data);
  }

  async insert(entity: TEntity) {
    const invokeOptions: IInvokeOptions = {
      method: 'POST',
      path: this.basePath(),
      data: this.serializeEntity(entity),
    };

    return (await this.invoke(invokeOptions)).data.data;
  }

  async update(id: string, change: TChange) {
    const invokeOptions: IInvokeOptions = {
      method: 'PATCH',
      path: `${this.basePath()}/${id}`,
      data: this.serializeChange(change),
    };

    return (await this.invoke(invokeOptions)).data.data;
  }

  delete(id: string) {
    const invokeOptions: IInvokeOptions = {
      method: 'DELETE',
      path: `${this.basePath()}/${id}`,
    };

    return this.invoke(invokeOptions);
  }

  protected invoke(options: IInvokeOptions) {
    const config: AxiosRequestConfig = {
      method: options.method,
      url: this.client.address + options.path,
      params: _.pick(options.query, (value: any) => value !== undefined),
      data: _.pick(options.data, (value: any) => value !== undefined),
      validateStatus: () => true,
    };

    if (this.client.session) {
      config.auth = {
        username: this.client.session.user.id,
        password: this.client.session.accessToken,
      };
    }

    return new Promise<any>(async (resolve, reject) => {
      try {
        const result = await axios.request(config);
        resolve(result);
      }
      catch (error) {
        reject(error);
      }
    });
  }

  protected toId(object: IEntity) {
    if (object === undefined)
      return undefined;

    if (object === null)
      return '';

    return object.id;
  }

  protected toIdArray(entities: IEntity[]) {
    if (!entities)
      return undefined;

    const result = entities.map(this.toId);

    if (result.length === 0)
      return undefined;

    return result.join(',');
  }
}
