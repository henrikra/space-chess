class Store {
  public userId?: string;

  public setUser = (userId: string) => {
    this.userId = userId;
  }

  public getUser = () => this.userId;
}

export default new Store();