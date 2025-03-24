const billDets = {
    base: 138, // Base cost
    percentPerUnit: 1.17, // Percentage per unit
    totalTaxPercent: 16, // Total tax percentage
    tax: 1.52, // Additional tax
    range: [
      { unitRange: 100, cost: 4.71, taxPerUnit: 0.45 }, // Range 1
      { unitRange: 300, cost: 10.29, taxPerUnit: 0.8 }, // Range 2
      { unitRange: 500, cost: 14.55, taxPerUnit: 1.1 }, // Range 3
      { unitRange: 1000, cost: 16.64, taxPerUnit: 1.15 }, // Range 4
    ],
  };

  const costCalc = (unit, billDets) => {
    const calc = (unit, cos, index, billDets) => {
      const base = unit * cos + billDets.base;
      const tax1 = unit * billDets.percentPerUnit;
      const tax2 = unit * billDets.range[index].taxPerUnit;
      const tax3 = (billDets.totalTaxPercent / 100) * (base + tax1 + tax2);
      const total = base + tax1 + tax2 + tax3 + billDets.tax;
  
      return { base, total };
    };
  
    let { base, total } = { base: 0, total: 0 };
  
    if (unit > billDets.range[3].unitRange) {
      ({ base, total } = calc(unit, billDets.range[3].cost, 3, billDets));
    } else if (unit > billDets.range[2].unitRange) {
      ({ base, total } = calc(unit, billDets.range[2].cost, 2, billDets));
    } else if (unit > billDets.range[1].unitRange) {
      ({ base, total } = calc(unit, billDets.range[1].cost, 1, billDets));
    } else {
      ({ base, total } = calc(unit, billDets.range[0].cost, 0, billDets));
    }
  
    return parseFloat(total.toFixed());
  };

  console.log(costCalc(458, billDets)); // 143