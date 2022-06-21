export interface IUseCase<IRequest, IResponse> {
  execute(request?: IRequest, actor?: number): Promise<IResponse> | IResponse;
}
