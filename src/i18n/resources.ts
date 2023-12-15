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
      resultDescription: `
计算结果:
  \n相关性: <%= correlation %>
  \n相关系数: <%= coefficient %>`,
      description: `
> #### 相关系数:
> 相关系数是一个数字，用来描述两个事物之间的关系。这个数字在-1到1之间变化。
>
> 如果是1，那就说明这两个事物非常相关，一个增加，另一个也增加。如果是-1，那就说明一个增加，另一个减少。如果是0，那就说明这两个事物之间没有关系。`,
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
      resultDescription: `
Result:
  Correlation: {{correlation}}
  Coefficient: {{coefficient}}`,
      description: `
> #### Correlation Coefficient:
> The correlation coefficient is a number used to describe the relationship between two things. This number varies between -1 and 1.
>
> If it is 1, it means that these two things are very related, one increases and the other also increases. If it is -1, it means that when one increases, the other decreases. If it is 0, it means that there is no relationship between these two things.`,
    },
  },
};

export default resources;
