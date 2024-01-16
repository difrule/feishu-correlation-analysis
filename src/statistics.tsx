import * as stats from "simple-statistics";
import { IRecord, ITable, bitable, checkers } from "@lark-base-open/js-sdk";
import _ from "lodash";
import { TFunction } from "i18next";

export const Pearson = "pearson";
export const Spearman = "spearman";

export async function calculate(
  tableId: string,
  viewId: string,
  independentId: string,
  dependentId: string,
  method: string,
  t: TFunction<"translation", undefined>
) {
  // get table and view
  const table = await bitable.base.getTableById(tableId);
  const view = await table.getViewById(viewId);

  // get number fields and values
  const records = await getAllRecords(table, view.id, []);
  const independents = getFieldNumberValues(records, independentId);
  const dependents = getFieldNumberValues(records, dependentId);

  return getCorrelationDesc(independents, dependents, method, t);
}

function getCorrelationDesc(
  independents: number[],
  dependents: number[],
  method: string,
  t: TFunction<"translation", undefined>
) {
  let coefficient = calculateCoefficient(independents, dependents, method);
  coefficient = parseFloat(coefficient.toFixed(2));
  const correlation = getCorrelation(coefficient, t);
  return _.template(t("resultDescription"))({ correlation, coefficient });
}

function calculateCoefficient(
  independents: number[],
  dependents: number[],
  method: string
) {
  switch (method) {
    case Pearson:
      return pearsonCoefficient(independents, dependents);
    case Spearman:
      return spearmanCoefficient(independents, dependents);
    default:
      throw new Error("unknown method");
  }
}

function getCorrelation(
  correlation: number,
  t: TFunction<"translation", undefined>
) {
  if (correlation > 0.7) {
    return t("strongPositiveCorrelation");
  } else if (correlation > 0.4) {
    return t("moderatePositiveCorrelation");
  } else if (correlation > 0.1) {
    return t("weakPositiveCorrelation");
  } else if (correlation < -0.7) {
    return t("strongNegativeCorrelation");
  } else if (correlation < -0.4) {
    return t("moderateNegativeCorrelation");
  } else if (correlation < -0.1) {
    return t("weakNegativeCorrelation");
  } else {
    return t("noCorrelation");
  }
}

function getFieldNumberValues(records: IRecord[], fieldId: string) {
  const values = new Array<number>();
  for (const record of records) {
    if (record.recordId === undefined) {
      continue;
    }
    const value = record.fields[fieldId];
    if (checkers.isNumber(value)) {
      values.push(value);
    }
  }
  return values;
}

async function getAllRecords(
  table: ITable,
  viewId: string,
  records: IRecord[]
) {
  const recordsRes = await table.getRecords({ viewId: viewId, pageSize: 5000 });
  records.push(...recordsRes.records);
  if (recordsRes.hasMore) {
    const moreRecords = await getAllRecords(table, viewId, records);
    records.push(...moreRecords);
  }
  return records;
}

function pearsonCoefficient(x: Array<number>, y: Array<number>) {
  const covariance = stats.sampleCovariance(x, y);
  const stdX = stats.standardDeviation(x);
  const stdY = stats.standardDeviation(y);
  return covariance / (stdX * stdY);
}

function spearmanCoefficient(x: Array<number>, y: Array<number>) {
  const xRank = rankArray(x);
  const yRank = rankArray(y);
  return pearsonCoefficient(xRank, yRank);
}

function rankArray(data: number[]): number[] {
  const sorted = Array.from(data).sort((a, b) => a - b);
  const rankMap = new Map<number, number>();
  sorted.forEach((value, index) => {
    if (!rankMap.has(value)) {
      const firstRank = index + 1;
      const lastRank = sorted.lastIndexOf(value) + 1;
      const averageRank = (firstRank + lastRank) / 2;
      rankMap.set(value, averageRank);
    }
  });
  return data.map((v) => rankMap.get(v) as number);
}
