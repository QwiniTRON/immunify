import {PathDcitionary} from './appRouter';

export const pathDictionary = new PathDcitionary();

pathDictionary.addNewPath('/passport', 'вернуться в имунный паспорт', 'exact');
pathDictionary.addNewPath('/vaccination', 'назад к вакцинациям', 'exact');
pathDictionary.addNewPath('/calendar', 'Вернуться к моим записям', 'exact');

pathDictionary.addNewPath('/passport/:id', 'вернуться к болезни', 'exact');

pathDictionary.addNewPath('/passport/vaccine/:id', 'вернуться к вакцине', 'exact');