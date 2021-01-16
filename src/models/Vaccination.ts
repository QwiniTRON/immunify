import { PatientVaccination } from '../server';




export type VaccinationStatus = {
  dateMessage?: string
  statusColor?: 'green' | 'red' | 'yellow'
  date: number
  isEternal: boolean
}


export class Vaccination { }

export class VaccinationModel {

  public static getVaccinationStatus(vaccination: PatientVaccination): VaccinationStatus {
    const lastVaccination = vaccination.passedStages[0];
    const result: VaccinationStatus = {
      dateMessage: "Вы прошли все стадии вакцинации",
      statusColor: 'green',
      date: 0,
      isEternal: true
    }
    

    if (lastVaccination.revaccination || lastVaccination.stage !== Math.max.apply(null, vaccination.totalStages)) {
      let startDate = new Date(lastVaccination.date);
      startDate = new Date(startDate.setMonth(startDate.getMonth() + lastVaccination.durationStartInMonths));

      let endDate = new Date(lastVaccination.date);
      endDate = new Date(endDate.setMonth(endDate.getMonth() + lastVaccination.durationEndInMonths));

      const currentDate = new Date();

      result.isEternal = false;

      if (currentDate >= startDate) {
        if (currentDate <= endDate) result.statusColor = 'yellow';
        else result.statusColor = 'red';
      }

      result.dateMessage = `Следующая вакцинация не поздее ${startDate.toLocaleDateString('ru-RU')}`;
      result.date = startDate.getTime();
    }

    return result;
  }

}