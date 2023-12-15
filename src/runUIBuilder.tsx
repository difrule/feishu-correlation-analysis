import { FieldType, UIBuilder } from "@lark-base-open/js-sdk";
import { UseTranslationResponse } from "react-i18next";
import { Pearson, Spearman, calculate } from "./statistics";
import { TFunction } from "i18next";

export default async function (
  uiBuilder: UIBuilder,
  { t }: UseTranslationResponse<"translation", undefined>
) {
  uiBuilder.form(
    (form) => ({
      formItems: [
        form.tableSelect("table", {
          label: t("selectTable"),
        }),
        form.viewSelect("view", {
          label: t("selectView"),
          sourceTable: "table",
        }),
        form.fieldSelect("independentVariable", {
          label: t("independentVariable"),
          sourceTable: "table",
          filterByTypes: [FieldType.Number],
        }),
        form.fieldSelect("dependentVariable", {
          label: t("dependentVariable"),
          sourceTable: "table",
          filterByTypes: [FieldType.Number],
        }),
        form.select("algorithm", {
          label: t("selectAlgorithm"),
          options: [
            { label: t("spearman"), value: Spearman },
            { label: t("pearson"), value: Pearson },
          ],
          defaultValue: Spearman,
        }),
      ],
      buttons: [t("button")],
    }),
    newCalculate(uiBuilder, t)
  );
  uiBuilder.markdown(t("description"));
}

interface FormParams {
  key: string;
  values: {
    [key: string]: unknown;
  };
}

interface optoin {
  id: string;
}

function newCalculate(
  uiBuilder: UIBuilder,
  t: TFunction<"translation", undefined>
) {
  return async function (params: FormParams) {
    const {
      table,
      view,
      independentVariable,
      dependentVariable,
      algorithm,
    }: {
      table: optoin;
      view: optoin;
      independentVariable: optoin;
      dependentVariable: optoin;
      algorithm: string;
    } = params.values as any;
    if (
      !table ||
      !view ||
      !independentVariable ||
      !dependentVariable ||
      !algorithm
    ) {
      uiBuilder.message.error(t("mustSelectAllOptions"));
      return;
    }
    uiBuilder.showLoading(t("calculating"));
    const result = await calculate(
      table.id,
      view.id,
      independentVariable.id,
      dependentVariable.id,
      algorithm,
      t
    );
    uiBuilder.markdown(result);
    uiBuilder.markdown(t("description"));
    uiBuilder.hideLoading();
  };
}
