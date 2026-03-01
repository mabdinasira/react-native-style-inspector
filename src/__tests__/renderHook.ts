import { createElement, type FunctionComponent } from 'react';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';

// Enable act() environment
(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

interface RenderHookResult<Result> {
  result: { current: Result };
  rerender: (newProps?: Record<string, unknown>) => void;
  unmount: () => void;
}

export const renderHook = <Result>(
  hook: (props?: Record<string, unknown>) => Result,
  options?: { initialProps?: Record<string, unknown> },
): RenderHookResult<Result> => {
  const resultRef = { current: undefined as Result };

  const TestComponent: FunctionComponent<Record<string, unknown>> = (props) => {
    resultRef.current = hook(props);
    return null;
  };

  let component: ReactTestRenderer;
  act(() => {
    component = create(createElement(TestComponent, options?.initialProps ?? {}));
  });

  return {
    result: resultRef,
    rerender: (newProps?: Record<string, unknown>) => {
      act(() => {
        component.update(createElement(TestComponent, newProps ?? options?.initialProps ?? {}));
      });
    },
    unmount: () => {
      act(() => {
        component.unmount();
      });
    },
  };
};

export { act };
