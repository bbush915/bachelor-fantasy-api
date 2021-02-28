import { Context } from "koa";

export interface IContext {
  authorization?: string;
  identity?: { id: string };
}

const getContext = ({ ctx }: any): IContext => {
  const { request } = ctx as Context;

  return {
    authorization: request.header.authorization,
  };
};

export default getContext;
