import express from "express";
import { listPeriods, getCurrentPeriod } from "../db/repository/period";
import { savePeriod, validatePeriod } from "../domain/period";

const router = express.Router();

router.get("/", async (request, response) => {
  const periods = await listPeriods();
  response.json(periods);
});

router.get("/current", async (request, response) => {
  const period = await getCurrentPeriod();

  if (!period) {
    response.status(404).json({})
  }

  response.json(period);
});

router.post("/", async (request, response) => {
  const dateStart = request.body.dateStart as Date;
  const dateEnd = request.body.dateEnd as Date;
  const name = request.body.name as string;

  const validationErrors = validatePeriod({
    dateStart,
    dateEnd,
    name,
  });
  if (validationErrors.length > 0) {
    response.status(400).json({ errors: validationErrors });
    return;
  }

  try {
    const period = await savePeriod({
      dateStart,
      dateEnd,
      name
    });
    response.status(201).json(period);
  } catch (e) {
    response.status(500).end();
  }
});

router.put("/:periodId", async (request, response) => {
  const periodId = request.params.periodId

  const dateStart = request.body.dateStart as Date;
  const dateEnd = request.body.dateEnd as Date;
  const name = request.body.name as string;

  const validationErrors = validatePeriod({
    periodId,
    dateStart,
    dateEnd,
    name,
  });

  if (validationErrors.length > 0) {
    response.status(400).json({ errors: validationErrors });
    return;
  }

  try {
    const period = await savePeriod({
      periodId,
      dateStart,
      dateEnd,
      name
    });
    response.status(201).json(period);
  } catch (e) {
    response.status(500).end();
  }
});

export default router;
