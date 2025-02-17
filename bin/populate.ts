import { populatePeriods } from "../src/domain/data/sample/periods";
import { populateExpenses } from "../src/domain/data/sample/expenses";

import { DbRepositoryBus } from "../src/infrastructure/db/DbRepositoryBus";

const run = async (repository: DbRepositoryBus) => {
  process.stdout.write("Populating periods... ");
  await populatePeriods(repository);
  process.stdout.write("done.\n");

  process.stdout.write("Populating expenses... ");
  await populateExpenses(repository);
  process.stdout.write("done.\n");
};

const repository = new DbRepositoryBus();
run(repository)
  .then(() => {
    process.stdout.write("\nDatabase populated successfully!\n");
    process.exit(0);
  })
  .catch((error) => {
    process.stdout.write("\nError populating database:\n");
    console.error(error);
    process.exit(1);
  });
