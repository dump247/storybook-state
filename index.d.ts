import { StoryFnReactReturnType } from "@storybook/react/dist/client/preview/types";
export type Store<T> = {
  /**
   * @description
   * Object that contains the current state.
   */
  state: T;

  /**
   * @description
   * Set the given state keys. The state parameter is an object with the keys and values to set.
   * This only sets/overwrites the specific keys provided.
   */
  set(nextState: Partial<T>): void;

  /**
   * @description
   * Reset the store to the initial state.
   */
  reset(): void;
};

export type LegacyStorybookStateCallback<T> = (
  store: Store<T>
) => StoryFnReactReturnType;
export function withState<T extends {}>(
  state: T,
  callback: LegacyStorybookStateCallback<T>
): any; // RenderFunction;

export type StorybookStateCallback<T> = (context: {
  store: Store<T>;
}) => StoryFnReactReturnType;
export function withState<T extends {}>(
  state: T
): (callback: StorybookStateCallback<T>) => any;
