 
import type { DefineMethods } from 'aspida';
import type * as Types from '../@types';

export type Methods = DefineMethods<{
  get: {
    status: 200;
    /** OK */
    resBody: Types.Notice[];
  };

  post: {
    status: 201;
    /** Created */
    resBody: Types.Notice;
    reqBody: Types.NoticeInput;
  };
}>;
