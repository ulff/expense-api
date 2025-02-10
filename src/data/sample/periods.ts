import { RepositoryBus } from "../../domain/repository/RespositoryBus";
import {
  AddPeriod,
  AddPeriodCommand,
} from "../../domain/use-case/period/AddPeriod";

const periodCommands: AddPeriodCommand[] = [];

periodCommands.push({
  dateStart: new Date("2024-12-01 00:00:00"),
  dateEnd: new Date("2024-12-31 23:59:59"),
  name: "Grudzień 2024",
});

periodCommands.push({
  dateStart: new Date("2025-01-01 00:00:00"),
  dateEnd: new Date("2025-01-31 23:59:59"),
  name: "Styczeń 2025",
});

periodCommands.push({
  dateStart: new Date("2025-02-01 00:00:00"),
  dateEnd: new Date("2025-02-28 23:59:59"),
  name: "Luty 2025",
});

periodCommands.push({
  dateStart: new Date("2025-03-01 00:00:00"),
  dateEnd: new Date("2025-03-31 23:59:59"),
  name: "Marzec 2025",
});

periodCommands.push({
  dateStart: new Date("2025-04-01 00:00:00"),
  dateEnd: new Date("2025-04-30 23:59:59"),
  name: "Kwiecień 2025",
});

periodCommands.push({
  dateStart: new Date("2025-05-01 00:00:00"),
  dateEnd: new Date("2025-05-31 23:59:59"),
  name: "Maj 2025",
});

export const populatePeriods = async (repository: RepositoryBus) => {
  const addPeriod = new AddPeriod(repository.periodRepository);

  await Promise.all(
    periodCommands.map(async (command) => {
      await addPeriod.execute(command);
    }),
  );
};
