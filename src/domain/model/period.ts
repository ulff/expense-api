import { Period } from "../types/period";
import {
  addPeriod,
  getPeriodForDate,
  listPeriods,
  updatePeriod,
  getPeriodById,
} from "../../db/repository/period";
import MissingPeriodForDateError from "../error/MissingPeriodForDateError";

type periodInputType = {
  periodId?: string;
  dateStart: Date;
  dateEnd: Date;
  name: string;
};

const validatePeriod: (input: periodInputType) => string[] = ({
  periodId,
  dateStart,
  dateEnd,
  name,
}) => {
  const validationErrors = [];

  if (periodId) {
    // todo: if periodId then check if exists
  }

  if (!name) {
    validationErrors.push("Name is empty.");
  }
  if (!dateStart || !dateEnd) {
    validationErrors.push(
      "Both dates are obligatory. At least one of them is empty.",
    );
  }
  if (dateStart >= dateEnd) {
    validationErrors.push("Start have to be before end date.");
  }

  // todo: check both dates formats
  // todo: one day difference at least
  // todo: search for conflicts with existing dates

  return validationErrors;
};

const savePeriod: (input: periodInputType) => Promise<Period> = async ({
  periodId,
  dateStart,
  dateEnd,
  name,
}) => {
  if (periodId) {
    return updatePeriod({
      periodId,
      dateStart,
      dateEnd,
      name,
    });
  } else {
    return addPeriod({
      dateStart,
      dateEnd,
      name,
    });
  }
};

const listAllPeriods: () => Promise<Period[]> = async () => {
  const periods = listPeriods();
  return periods;
};

const getPeriod: (periodId: string) => Promise<Period> = async (periodId) => {
  return getPeriodById(periodId);
};

const getCurrentPeriod: () => Promise<Period> = async () => {
  const now = new Date();
  const period = await getPeriodForDate(now);
  if (!period) {
    throw new MissingPeriodForDateError(now);
  }

  return period;
};

export {
  validatePeriod,
  savePeriod,
  listAllPeriods,
  getCurrentPeriod,
  getPeriod,
};
