import { Context } from "koa";

export interface IContext {
  auth?: string;
  identity?: { id: string; role: string };
}

const getContext = ({ ctx }: any): IContext => {
  const { request } = ctx as Context;

  return {
    auth: request.header.authorization,
  };
};

export default getContext;
