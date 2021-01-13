export const pathDictionary: { [p: string]: string } = {}

type PathMode = "strict" | "exact";
function addNewPath(path: string, text: string, mode: PathMode) {
  pathDictionary[path] = text;

  if(mode == 'exact') pathDictionary[path + "/"] = text;
}


addNewPath("/vaccination", 'Вернуться к вакцинациям', "exact");
addNewPath("/profile", 'Вернуться в профиль', "exact");