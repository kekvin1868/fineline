const FlowType = Object.freeze({
  INCOME: 'income',
  EXPENSE: 'expense',
  UNCATEGORIZED: 'uncategorized',

  values: () => Object.values(FlowType).filter(v => typeof v === 'string'),
  keys: () => Object.keys(FlowType).filter(k => typeof FlowType[k] !== 'function'),
  isValid: (value) => FlowType.values().includes(value),
  fromValue: (value) => {
    const entry = Object.entries(FlowType).find(([key, val]) => val === value);
    return entry ? entry[0] : null;
  }
});

export default FlowType;
