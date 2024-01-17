const resources = {
  zh: {
    translation: {
      selectTable: "选择数据表",
      selectView: "选择视图",
      independentVariable: "自变量",
      dependentVariable: "因变量",
      selectAlgorithm: "选择算法",
      pearson: "皮尔逊相关系数（适用于正态分布）",
      spearman: "斯皮尔曼相关系数（适用于非正态分布）",
      button: "计算",
      mustSelectAllOptions: "必须选择所有选项",
      calculating: "正在计算...",
      strongPositiveCorrelation: "强正相关",
      moderatePositiveCorrelation: "中等正相关",
      weakPositiveCorrelation: "弱正相关",
      strongNegativeCorrelation: "强负相关",
      moderateNegativeCorrelation: "中等负相关",
      weakNegativeCorrelation: "弱负相关",
      noCorrelation: "无相关",
      resultDescription: `<%= coefficient %>(<%= correlation %>)`,
      tableTitle: "自变量\\因变量",
      tableName: "相关系数矩阵",
      notEnoughRecords: "至少需要两条记录",
      description: `
> #### 相关系数:
> 相关系数是一个数字，用来描述两个事物之间的关系。这个数字在-1到1之间变化。
>
> 如果是1，那就说明这两个事物非常相关，一个增加，另一个也增加。如果是-1，那就说明一个增加，另一个减少。如果是0，那就说明这两个事物之间没有关系。
>
> 注意：相关性不代表因果关系。例如夏天的时候，冰淇淋的销量和空调的销量都会增加，但是这并不代表冰淇淋的销量增加导致了空调的销量增加。`,
    },
  },
  en: {
    translation: {
      selectTable: "Select Table",
      selectView: "Select View",
      independentVariable: "Independent Variable",
      dependentVariable: "Dependent Variable",
      selectAlgorithm: "Select Algorithm",
      pearson: "Pearson Correlation Coefficient (for normal distribution)",
      spearman:
        "Spearman Correlation Coefficient (for non-normal distribution)",
      button: "Calculate",
      mustSelectAllOptions: "Must select all options",
      calculating: "Calculating...",
      strongPositiveCorrelation: "Strong Positive Correlation",
      moderatePositiveCorrelation: "Moderate Positive Correlation",
      weakPositiveCorrelation: "Weak Positive Correlation",
      strongNegativeCorrelation: "Strong Negative Correlation",
      moderateNegativeCorrelation: "Moderate Negative Correlation",
      weakNegativeCorrelation: "Weak Negative Correlation",
      noCorrelation: "No Correlation",
      resultDescription: `<%= coefficient %>(<%= correlation %>)`,
      tableTitle: "Independent Variable\\Dependent Variable",
      tableName: "Correlation Coefficient Matrix",
      notEnoughRecords: "At least two records are required",
      description: `
> #### Correlation Coefficient:
> The correlation coefficient is a number used to describe the relationship between two things. This number varies between -1 and 1.
>
> If it is 1, it means that these two things are very related, one increases and the other also increases. If it is -1, it means that when one increases, the other decreases. If it is 0, it means that there is no relationship between these two things.
>
> Note: Correlation does not mean causation. For example, in summer,  the sales of ice cream and the sales of air conditioners will increase, but this does not mean that the increase in ice cream sales has led to an increase in air conditioner sales.`,
    },
  },
};

export default resources;
