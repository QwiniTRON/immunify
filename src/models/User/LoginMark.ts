export enum LoginTypeEnum {
  Simple,
  VK,
  Facebook,
  Google
}

export class LoginMark {
  public Type: LoginTypeEnum;
  public Value: string;

  constructor(type: LoginTypeEnum, value: string) {
    this.Type = type;
    this.Value = value;
  }

  toJSON() {
    return JSON.stringify({
      Type: this.Type,
      Value: this.Value
    });
  }
}
