export const FlowType = {
  EXPENSE: 'expense',
  INCOME: 'income',
  UNCATEGORIZED: 'uncategorized',
} as const

export type FlowTypeValues = typeof FlowType[keyof typeof FlowType];
export type FlowTypeKey = keyof typeof FlowType;

export const FlowTypeUtils = {
  values: (): FlowTypeValues[] => Object.values(FlowType),
  keys: (): FlowTypeKey[] => Object.keys(FlowType) as FlowTypeKey[],
  isValid: (valid: unknown): valid is FlowTypeValues => {
    return typeof valid === 'string' && Object.values(FlowType).includes(valid as FlowTypeValues);
  },
};
