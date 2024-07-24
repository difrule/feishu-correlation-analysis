import * as stats from "simple-statistics";
import {
  FieldType,
  IFieldConfig,
  IRecord,
  IRecordValue,
  ITable,
  ToastType,
  bitable,
  checkers,
} from "@lark-base-open/js-sdk";
import _ from "lodash";
import { TFunction } from "i18next";

export const Pearson = "pearson";
export const Spearman = "spearman";

export async function calculate(
  tableId: string,
  viewId: string,
  method: string,
  t: TFunction<"translation", undefined>
) {
  // get table and records
  const table = await bitable.base.getTableById(tableId);
  const tableName = await table.getName();
  const records = await getAllRecords(table, viewId);

  if (records.length < 2) {
    bitable.ui.showToast({
      toastType: ToastType.error,
      message: t("notEnoughRecords"),
    });
    return;
  }

  // build  matrix
  const fields = await table.getFieldListByType(FieldType.Number);
  const matrix = new Array<Array<[string, string, string]>>();
  const fieldList = new Array<[string, string]>();
  for (const field1 of fields) {
    const fileNmae = await field1.getName();
    fieldList.push([field1.id, fileNmae]);
    let fieldPairs = new Array<[string, string, string]>();
    for (const field2 of fields) {
      fieldPairs.push([field1.id, field2.id, ""]);
    }
    matrix.push(fieldPairs);
  }

  // calculate correlation
  for (const fieldPairs of matrix) {
    for (const fieldPair of fieldPairs) {
      const [independents, dependents] = getFieldNumberValues(
        records,
        fieldPair[0],
        fieldPair[1]
      );
      const desc = getCorrelationDesc(independents, dependents, method, t);
      fieldPair[2] = desc;
    }
  }

  await createResultMatrixTable(tableName, fieldList, matrix, t);
  return "";
}

async function createResultMatrixTable(
  orginalTableName: string,
  fieldList: Array<[string, string]>,
  matrix: Array<Array<[string, string, string]>>,
  t: TFunction<"translation", undefined>
) {
  // create fields
  const createFields: Array<IFieldConfig> = [
    { type: FieldType.Text, name: t("tableTitle") },
  ];
  for (const field of fieldList) {
    createFields.push({ type: FieldType.Text, name: field[1] });
  }

  // if table exist, delete it
  const tableName = orginalTableName + "-" + t("tableName");
  try {
    const oldTable = await bitable.base.getTableByName(tableName);
    await bitable.base.deleteTable(oldTable.id);
  } catch (error) {
    console.log("old table not exist");
  }

  // add table
  const tableResult = await bitable.base.addTable({
    name: tableName,
    fields: createFields,
  });
  const table = await bitable.base.getTableById(tableResult.tableId);
  const fields = await table.getFieldListByType(FieldType.Text);
  const newfieldList = new Array<[string, string]>();
  for (const field of fields) {
    const fileName = await field.getName();
    newfieldList.push([field.id, fileName]);
  }

  // add data
  const records = new Array<IRecordValue>();
  for (const [i, fieldPairs] of matrix.entries()) {
    const record: IRecordValue = {
      fields: { [newfieldList[0][0]]: newfieldList[i + 1][1] },
    };
    for (const [j, fieldPair] of fieldPairs.entries()) {
      record.fields[newfieldList[j + 1][0]] = fieldPair[2];
    }
    records.push(record);
  }
  table.addRecords(records);
  bitable.ui.switchToTable(table.id);
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

function getFieldNumberValues(
  records: IRecord[],
  fieldId1: string,
  fieldId2: string
) {
  const values1 = new Array<number>();
  const values2 = new Array<number>();
  for (const record of records) {
    if (record.recordId === undefined) {
      console.log("recordId is undefined");
      continue;
    }
    const value1 = record.fields[fieldId1];
    const value2 = record.fields[fieldId2];
    if (checkers.isNumber(value1) && checkers.isNumber(value2)) {
      values1.push(value1 as number);
      values2.push(value2 as number);
    }
  }
  return [values1, values2];
}

async function getAllRecords(table: ITable, viewId: string) {
  const records = new Array<IRecord>();
  const res = await table.getRecords({ viewId: viewId, pageSize: 5000 });
  records.push(...res.records);
  let hasMore = res.hasMore;
  let pageToken = res.pageToken;
  while (hasMore) {
    const res = await table.getRecords({
      viewId: viewId,
      pageSize: 5000,
      pageToken: pageToken,
    });
    records.push(...res.records);
    pageToken = res.pageToken;
    hasMore = res.hasMore;
  }
  return records;
}

function pearsonCoefficient(x: Array<number>, y: Array<number>) {
  const covariance = stats.sampleCovariance(x, y);
  const stdX = stats.sampleStandardDeviation(x);
  const stdY = stats.sampleStandardDeviation(y);
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
