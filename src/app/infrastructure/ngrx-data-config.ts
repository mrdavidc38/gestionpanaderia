import { EntityMetadataMap, DefaultDataServiceConfig } from '@ngrx/data';

export const entityMetadata: EntityMetadataMap = {
  Product: {},
  Order: {},
  User: {},
  Invoice: {}
};

export const entityConfig = {
  entityMetadata
};

export const defaultDataServiceConfig: DefaultDataServiceConfig = {
  root: '/api',
  timeout: 3000,
};
