import type { AspidaClient, BasicHeaders } from 'aspida';
import type { Methods as Methods_1swob1w } from './books';
import type { Methods as Methods_4kt2eg } from './books/_id@string';
import type { Methods as Methods_1fsd16d } from './loans';
import type { Methods as Methods_wln3mj } from './notices';
import type { Methods as Methods_1xo5a1x } from './returns';
import type { Methods as Methods_1xhiioa } from './users';
import type { Methods as Methods_1is6fjm } from './users/_id@string';

const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (baseURL === undefined ? '/api' : baseURL).replace(/\/$/, '');
  const PATH0 = '/books';
  const PATH1 = '/loans';
  const PATH2 = '/notices';
  const PATH3 = '/returns';
  const PATH4 = '/users';
  const GET = 'GET';
  const POST = 'POST';

  return {
    books: {
      _id: (val1: string) => {
        const prefix1 = `${PATH0}/${val1}`;

        return {
          /**
           * @returns OK
           */
          get: (option?: { config?: T | undefined } | undefined) =>
            fetch<Methods_4kt2eg['get']['resBody'], BasicHeaders, Methods_4kt2eg['get']['status']>(prefix, prefix1, GET, option).json(),
          /**
           * @returns OK
           */
          $get: (option?: { config?: T | undefined } | undefined) =>
            fetch<Methods_4kt2eg['get']['resBody'], BasicHeaders, Methods_4kt2eg['get']['status']>(prefix, prefix1, GET, option).json().then(r => r.body),
          $path: () => `${prefix}${prefix1}`,
        };
      },
      /**
       * @returns OK
       */
      get: (option?: { config?: T | undefined } | undefined) =>
        fetch<Methods_1swob1w['get']['resBody'], BasicHeaders, Methods_1swob1w['get']['status']>(prefix, PATH0, GET, option).json(),
      /**
       * @returns OK
       */
      $get: (option?: { config?: T | undefined } | undefined) =>
        fetch<Methods_1swob1w['get']['resBody'], BasicHeaders, Methods_1swob1w['get']['status']>(prefix, PATH0, GET, option).json().then(r => r.body),
      /**
       * @returns Created
       */
      post: (option: { body: Methods_1swob1w['post']['reqBody'], config?: T | undefined }) =>
        fetch<Methods_1swob1w['post']['resBody'], BasicHeaders, Methods_1swob1w['post']['status']>(prefix, PATH0, POST, option).json(),
      /**
       * @returns Created
       */
      $post: (option: { body: Methods_1swob1w['post']['reqBody'], config?: T | undefined }) =>
        fetch<Methods_1swob1w['post']['resBody'], BasicHeaders, Methods_1swob1w['post']['status']>(prefix, PATH0, POST, option).json().then(r => r.body),
      $path: () => `${prefix}${PATH0}`,
    },
    loans: {
      /**
       * @returns OK
       */
      get: (option?: { config?: T | undefined } | undefined) =>
        fetch<Methods_1fsd16d['get']['resBody'], BasicHeaders, Methods_1fsd16d['get']['status']>(prefix, PATH1, GET, option).json(),
      /**
       * @returns OK
       */
      $get: (option?: { config?: T | undefined } | undefined) =>
        fetch<Methods_1fsd16d['get']['resBody'], BasicHeaders, Methods_1fsd16d['get']['status']>(prefix, PATH1, GET, option).json().then(r => r.body),
      /**
       * @returns Created
       */
      post: (option: { body: Methods_1fsd16d['post']['reqBody'], config?: T | undefined }) =>
        fetch<Methods_1fsd16d['post']['resBody'], BasicHeaders, Methods_1fsd16d['post']['status']>(prefix, PATH1, POST, option).json(),
      /**
       * @returns Created
       */
      $post: (option: { body: Methods_1fsd16d['post']['reqBody'], config?: T | undefined }) =>
        fetch<Methods_1fsd16d['post']['resBody'], BasicHeaders, Methods_1fsd16d['post']['status']>(prefix, PATH1, POST, option).json().then(r => r.body),
      $path: () => `${prefix}${PATH1}`,
    },
    notices: {
      /**
       * @returns OK
       */
      get: (option?: { config?: T | undefined } | undefined) =>
        fetch<Methods_wln3mj['get']['resBody'], BasicHeaders, Methods_wln3mj['get']['status']>(prefix, PATH2, GET, option).json(),
      /**
       * @returns OK
       */
      $get: (option?: { config?: T | undefined } | undefined) =>
        fetch<Methods_wln3mj['get']['resBody'], BasicHeaders, Methods_wln3mj['get']['status']>(prefix, PATH2, GET, option).json().then(r => r.body),
      /**
       * @returns Created
       */
      post: (option: { body: Methods_wln3mj['post']['reqBody'], config?: T | undefined }) =>
        fetch<Methods_wln3mj['post']['resBody'], BasicHeaders, Methods_wln3mj['post']['status']>(prefix, PATH2, POST, option).json(),
      /**
       * @returns Created
       */
      $post: (option: { body: Methods_wln3mj['post']['reqBody'], config?: T | undefined }) =>
        fetch<Methods_wln3mj['post']['resBody'], BasicHeaders, Methods_wln3mj['post']['status']>(prefix, PATH2, POST, option).json().then(r => r.body),
      $path: () => `${prefix}${PATH2}`,
    },
    returns: {
      /**
       * @returns OK
       */
      get: (option?: { config?: T | undefined } | undefined) =>
        fetch<Methods_1xo5a1x['get']['resBody'], BasicHeaders, Methods_1xo5a1x['get']['status']>(prefix, PATH3, GET, option).json(),
      /**
       * @returns OK
       */
      $get: (option?: { config?: T | undefined } | undefined) =>
        fetch<Methods_1xo5a1x['get']['resBody'], BasicHeaders, Methods_1xo5a1x['get']['status']>(prefix, PATH3, GET, option).json().then(r => r.body),
      /**
       * @returns Created
       */
      post: (option: { body: Methods_1xo5a1x['post']['reqBody'], config?: T | undefined }) =>
        fetch<Methods_1xo5a1x['post']['resBody'], BasicHeaders, Methods_1xo5a1x['post']['status']>(prefix, PATH3, POST, option).json(),
      /**
       * @returns Created
       */
      $post: (option: { body: Methods_1xo5a1x['post']['reqBody'], config?: T | undefined }) =>
        fetch<Methods_1xo5a1x['post']['resBody'], BasicHeaders, Methods_1xo5a1x['post']['status']>(prefix, PATH3, POST, option).json().then(r => r.body),
      $path: () => `${prefix}${PATH3}`,
    },
    users: {
      _id: (val1: string) => {
        const prefix1 = `${PATH4}/${val1}`;

        return {
          /**
           * @returns OK
           */
          get: (option?: { config?: T | undefined } | undefined) =>
            fetch<Methods_1is6fjm['get']['resBody'], BasicHeaders, Methods_1is6fjm['get']['status']>(prefix, prefix1, GET, option).json(),
          /**
           * @returns OK
           */
          $get: (option?: { config?: T | undefined } | undefined) =>
            fetch<Methods_1is6fjm['get']['resBody'], BasicHeaders, Methods_1is6fjm['get']['status']>(prefix, prefix1, GET, option).json().then(r => r.body),
          $path: () => `${prefix}${prefix1}`,
        };
      },
      /**
       * @returns OK
       */
      get: (option?: { config?: T | undefined } | undefined) =>
        fetch<Methods_1xhiioa['get']['resBody'], BasicHeaders, Methods_1xhiioa['get']['status']>(prefix, PATH4, GET, option).json(),
      /**
       * @returns OK
       */
      $get: (option?: { config?: T | undefined } | undefined) =>
        fetch<Methods_1xhiioa['get']['resBody'], BasicHeaders, Methods_1xhiioa['get']['status']>(prefix, PATH4, GET, option).json().then(r => r.body),
      $path: () => `${prefix}${PATH4}`,
    },
  };
};

export type ApiInstance = ReturnType<typeof api>;
export default api;
