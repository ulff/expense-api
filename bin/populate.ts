import { populatePeriods } from "../src/data/sample/periods";
import { populateExpenses } from "../src/data/sample/expenses";
import { DbRepository } from "../src/infrastructure/db/DbRepository";

const run = async (repository: DbRepository) => {
  process.stdout.write("Populating periods... ");
  await populatePeriods(repository);
  process.stdout.write("done.\n");

  process.stdout.write("Populating expenses... ");
  await populateExpenses(repository);
  process.stdout.write("done.\n");
};

const repository = new DbRepository();
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
