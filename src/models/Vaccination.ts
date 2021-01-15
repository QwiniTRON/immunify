import { PatientVaccination } from '../server';




export type VaccinationStatus = {
  dateMessage?: string
  statusColor?: 'green' | 'red' | 'yellow'
}


export class Vaccination { }

export class VaccinationModel {

  public static getVaccinationStatus(vaccination: PatientVaccination): VaccinationStatus {
    const lastVaccination = vaccination.passedStages[0];
    const result: VaccinationStatus = {
      dateMessage: "Вы прошли все стадии вакцинации",
      statusColor: 'green'
    }


    if (lastVaccination.revaccination || lastVaccination.stage !== Math.max.apply(null, vaccination.totalStages)) {
      let startDate = new Date(lastVaccination.date);
      startDate = new Date(startDate.setMonth(startDate.getMonth() + lastVaccination.durationStartInMonths));

      let endDate = new Date(lastVaccination.date);
      endDate = new Date(endDate.setMonth(endDate.getMonth() + lastVaccination.durationEndInMonths));

      const currentDate = new Date();

      if (currentDate >= startDate) {
        if (currentDate <= endDate) result.statusColor = 'yellow';
        else result.statusColor = 'red';
      }

      result.dateMessage = `Следующая вакцинация не поздее ${startDate.toLocaleDateString('ru-RU')}`;
    }

    return result;
  }

}