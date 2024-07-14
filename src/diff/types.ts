export type Change<T = unknown> = BreakingChange<T> | NonBreakingChange<T>;

export interface BreakingChange<T = unknown> {
  type: T;
  breaking: true;
}

export interface NonBreakingChange<T = unknown> {
  type: T;
  breaking: false;
}
