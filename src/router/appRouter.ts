export type AppRoute = {
  mode: PathMode
  path: string
  text: string
}

type PathMode = "strict" | "exact" | "none";

export interface IPathDictionary {
  check(route: string, current: string): boolean
  addNewPath(path: string, text: string, mode: PathMode): void
  findRoute(path: string): AppRoute | null
}


export class PathDcitionary implements IPathDictionary {
  private routes: AppRoute[] = [];

  /**
   * constructor
   */
  constructor() { }

  /**
   * проверить совпадение роута с путём
   * 
   * @param {string} route роут в списке роутов
   * @param {string} current путь для проверки
   */
  public check(route: string, current: string): boolean {
    const routePath = route.split('/').slice(1);
    const currentPath = current.split('/').slice(1);

    if (routePath.length != currentPath.length) return false;


    for (let i = 0; i < routePath.length; i++) {
      const routeSegment = routePath[i];
      const currentSegment = currentPath[i];
      const dynamic = routeSegment.startsWith(':');

      if (dynamic && currentSegment.length == 0) return false;

      if (!dynamic && routeSegment != currentSegment) return false;
    }

    return true;
  }

  /**
   * добавление нового роута
   * 
   * @param {string} path путь роута
   * @param {string} text текст роута
   * @param {PathMode} mode режим 
   */
  public addNewPath(path: string, text: string, mode: PathMode) {
    this.routes?.push({
      path,
      text,
      mode
    });
  }

  /**
   * 
   * поиск роута для данного пути
   * 
   * @param {string} path 
   */
  public findRoute(path: string) {
    for (const route of this.routes) {
      const checkResult = this.check(route.path, path);

      if (checkResult) return route;
    }

    return null;
  }
}