import { Repository } from "../../domain/repository/Respository";
import {
  AddPeriod,
  AddPeriodCommand,
} from "../../domain/use-case/period/AddPeriod";

const periodsInput: AddPeriodCommand[] = [];

periodsInput.push({
  dateStart: new Date("2024-12-01 00:00:00"),
  dateEnd: new Date("2024-12-31 23:59:59"),
  name: "Grudzień 2024",
});

periodsInput.push({
  dateStart: new Date("2025-01-01 00:00:00"),
  dateEnd: new Date("2025-01-31 23:59:59"),
  name: "Styczeń 2025",
});

periodsInput.push({
  dateStart: new Date("2025-02-01 00:00:00"),
  dateEnd: new Date("2025-02-28 23:59:59"),
  name: "Luty 2025",
});

periodsInput.push({
  dateStart: new Date("2025-03-01 00:00:00"),
  dateEnd: new Date("2025-03-31 23:59:59"),
  name: "Marzec 2025",
});

export const populatePeriods = async (repository: Repository) => {
  const addPeriod = new AddPeriod(repository.periodRepository);

  await Promise.all(
    periodsInput.map(async (command) => {
      await addPeriod.execute(command);
    }),
  );
};
