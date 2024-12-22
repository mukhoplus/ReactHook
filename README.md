# React Hooks

## Hook의 개요

- Hook은 React 버전 16.8부터 React 요소로 새로 추가됨
- Hook을 사용하여 기존 Class 바탕의 코드를 작성할 필요 없이 상태 값과 여러 React의 기능을 사용할 수 있음
- 기존 React 컨셉을 대체하는 것이 아니라 props, state, context, refs, lifecycle와 같은 React 개념에 대한 좀 더 직관적인 API를 제공
- 기존에 컴포넌트 사이에서 상태 로직을 재사용하려면 render props나 고차 컴포넌트와 같은 패턴을 통해 사용
  - Wrapoper Hell
- Hook은 컴포넌트로부터 상태 관련 로직을 추상화할 수 있으며, 계층의 변화 없이 상태 관련 로직을 재사용할 수 있도록 도와줌

## Hook 개요

- Class를 작성하지 않고도 state와 다른 React의 기능들을 사용할 수 있게 해줌
- 클래스형 컴포넌트와는 달리, Hook은 React state를 클래스를 작성하지 않고 함수 안에서 사용할 수 있도록 해줌

  ```jsx
  class Example extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        count: 0,
      };
    }

    render() {
      return (
        <div>
          <p>You clicked {this.state.count} times</p>
          <button
            onClick={() => this.setState({ count: this.state.count + 1 })}
          >
            Click me
          </button>
        </div>
      );
    }
  }
  ```

- React의 함수 컴포넌트는 다음과 같이 생김

  ```jsx
  const Example = () => {
    const [count, setCount] = useState(0);
    return <div />;
  };

  function Example() {
    const [count, setCount] = useState(0);
    return <div />;
  }
  ```

## useState

- this.state를 대체하는 함수
- useState를 호출함으로써 state 변수와 그 변수를 업데이트하는 함수를 반환
  - count, setCount
- useState의 인자는 state의 초기 값
- 일반 변수와 달리 state 변수는 React에 의해 사라지지 않음
- `const [count, setCount] = useState(0);`와 같이 대괄호를 이용하는 자바스크립트 문법은 "배열 구조 분해"라고 함

## useEffect

- useEffect Hook은 componentDidMount, componentDidUpdate, componentWillUnmount가 합쳐진 것
- 함수 컴포넌트에서 side effect를 수행할 수 있음
  - Side effect: 데이터 가져오기, 구독(subscription) 설정하기, 수동으로 React 컴포넌트의 DOM을 수정하는 것 등

### 정리(Clean-up)를 이용하지 않는 Effects

- React DOM을 업데이트 한 뒤 추가로 코드를 실행해야 하는 경우가 있음
- 네트워크 request, DOM 수동 조작, 로깅 등은 정리가 필요 없는 경우
  - 실행 이후 신경 쓸 것이 없기 때문
- Class를 사용하는 예시

  - React의 class 컴포넌트에서 render 메서드 그 자체는 side effect를 발생시키지 않으며, effect를 수행하는 것은 React가 DOM을 업데이트하고 난 이후.
  - React class에서 side effect를 componentDidMount와 componentDidUpdate에 두는 이유
  - 아래 코드에서는 class 안에 두 개의 생명주기 메서드에 같은 코드가 중복됨

  ```jsx
  class Example extends React.Component {
    constructor(props) {
      super(props);
      this.state = { count: 0 };
    }
  }

  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
  }

  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }

  render() {
    <div>
      <p>You clicked {this.state.count} times</p>
      <button onClick={() => this.setState({ count: this.state.count + 1 })}>
        Click me
      </button>
    </div>
  }
  ```

  - Hook을 사용하는 예시

  ```jsx
  import React, { useState, useEffect } from "react";

  function Example() {
    const [count, setCount] = useState(0);

    useEffect(() => {
      document.title = `You clicked ${count} times`;
    });

    return (
      <div>
        <p>You clicked {count} times</p>
        <button onClick={() => setCount(count + 1)}>Click me</button>
      </div>
    );
  }

  export default Example;
  ```

  - useEffect Hook을 이용하여 React에게 컴포넌트가 렌더링 이후에 어떤 일을 수행해야하는지 지정
  - useEffect를 컴포넌트 안에서 불러내는 이유
    - useEffect를 컴포넌트 내부에 둠으로써 effect를 통해 count state 변수(또는 그 어떤 props)에도 접근할 수 있게 됨
  - useEffect는 렌더링 이후에 매번 수행됨
    - 기본적으로 첫번째 렌더링과 이후의 모든 업데이트에서 수행되며, 필요에 맞게 수정될 수 있음
  - React는 effect가 수행되는 시점에 이미 DOM이 업데이트되었음을 보장

### 정리(Clean-up)를 이용하는 Effects

- Class를 사용하는 예시

  - 두 개의 메서드 내에 개념상 똑같은 effect에 대한 코드가 있음에도 불구하고 생명주기 메서드는 이를 분리하게 만듬
  - 이 예시가 완전하기 위해서는 componentDidUpdate가 필요함

  ```jsx
  class FriendStatus extends React.Component {
    constructor(props) {
      super(props);
      this.state = { isOnline: null };
      this.handleStatusChange = this.handleStatusChange.bind(this);
    }

    componentDidMount() {
      ChatAPI.subscribeToFriendStatus(
        this.props.friend.id,
        this.handleStatusChange
      );
    }

    componentWillUnmount() {
      ChatAPI.unsubscribeFromFriendStatus(
        this.props.friend.id,
        this.handleStatusChange
      );
    }

    handleStatusChange(status) {
      this.setState({
        isOnline: status.isOnline,
      });
    }

    render() {
      if (this.state.isOnline === null) {
        return "Loading...";
      }
      return this.state.isOnline ? "Online" : "Offline";
    }
  }
  ```

- Hook을 이용하는 예시

  - effect에서 함수를 반환하는 이유
    - effect를 위한 추가적인 정리 메커니즘
  - React가 effect를 정리하는 시점
    - React는컴포넌트가 마운트 해제되는 때에 정리를 실행
    - effect는 한번이 아니라 렌더링이 실행되는 때마다 실행

  ```jsx
  import React, { useState, useEffect } from "react";

  function FriendStatus(props) {
    const [isOnline, setIsOnline] = useState(null);

    useEffect(() => {
      function handleStatusChange(status) {
        setIsOnline(status.isOnline);
      }

      ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);

      // effect 이후에 어떻게 clean-up할 것인지 표시
      return () => {
        ChatAPI.unsubscribeFromFriendStatus(
          props.friend.id,
          handleStatusChange
        );
      };
    });

    if (isOnline === null) {
      return "Loading...";
    }
    return inOnline ? "Online" : "Offline";
  }
  ```

- useEffect를 여러 번 사용하여 서로 관련이 없는 로직들을 갈라놓을 수 있음
- effect가 업데이트 시마다 실행되는 이유

  - 왜 이 요소가 버그가 적은 컴포넌트를 만드는 데에 도움이 되는 디자인인가?
  - componentDidMount와 componentWillUnmount만 정의되어 있을 때에, 컴포넌트가 화면에 표시되어 있는 동안 friend prop이 변한다면?
    - 다른 친구의 온라인 상태를 계속 표시하게 됨
    - 마운트 해제가 일어날 동안에는 구독 해지 호출이 다른 친구 ID를 사용하여 메모리 누수나 충돌이 발생할 수도 있음
  - 클래스 컴포넌트에서는 이런 경우들을 다루기 위해 componentDidUpdate를 사용함
    - 기존의 구독을 해지하고, 새로운 구독을 생성함
  - React 애플리케이션의 흔한 버그 중의 하나가 componentDidUpdate를 제대로 다루지 않는 것

  ```jsx
  function FriendStatus(props) {
    // ...
    useEffect(() => {
      // ...
      ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);

      return () => {
        ChatAPI.unsubscribeFromFriendStatus(
          props.friend.id,
          handleStatusChange
        );
      };
    });
  }

  /*
  // { friend: { id: 100 } } state을 사용하여 마운트함
  ChatAPI.subscribeToFriendStatus(100, handleStatusChange); // 첫번째 effect 작동
  
  // { friend: { id: 200 } } state로 업데이트함
  ChatAPI.unsubscribeFromFriendStatus(100, handleStatusChange); // 이전 effect 정리
  ChatAPI.subscribeToFriendStatus(200, handleStatusChange); // 다음 effect 작동
  
  // { friend: { id: 300 } } state로 업데이트함
  ChatAPI.unsubscribeFromFriendStatus(200, handleStatusChange); // 이전 effect 정리
  ChatAPI.subscribeToFriendStatus(300, handleStatusChange); // 다음 effect 작동
  
  // 마운트 해제
  ChatAPI.unsubscribeFromFriendStatus(300, handleStatusChange); // 마지막 effect 정리
  */
  ```

- Effect를 건너뛰어 성능 최적화하기
  - 모든 렌더링 이후에 effect를 정리하거나 적용하는 것이 때때로 성능 저하르 발생시키는 경우도 있음
  - 클래스 컴포넌트의 경우에는 componentDidUpdate에서 prevProps나 prevState와의 비교를 통해 이러한 문제를 해결할 수 있음
    ```jsx
    componentDidUpdate(prevProps, prevState) {
      if (prevState.count !== this.state.count) {
        document.title = `You clicked ${this.state.count} times`;
      }
    }
    ```
  - useEffect Hook API에서는 특정 값들이 리렌더링 시에 변경되지 않는다면 React로 하여금 effect를 건너뛰도록 할 수 있음
    - 이를 위해 useEffect의 두번째 인자로 배열을 전달할 수 있음
      - 배열 안에 포함된 값이 변경될 때마다 effect가 실행됨
      - 배열이 비어있으면, effect는 매번 렌더링 이후에 실행됨
    ```jsx
    useEffect(() => {
      document.title = `You clicked ${count} times`;
    }, [count]); // count가 변경될 때마다 effect가 실행됨
    ```
  - 이는 정리를 사용하는 effect의 경우에도 동일하게 적용됨
    ```jsx
    useEffect(() => {
      function handleStatusChange(status) {
        setIsOnline(status.isOnline);
      }
      ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
      return () => {
        ChatAPI.unsubscribeFromFriendStatus(
          props.friend.id,
          handleStatusChange
        );
      };
    }, [props.friend.id]); // props.friend.id가 변경될 때마다 effect가 실행됨
    ```

## Hook의 규칙

- 최상위(at the Top Level)에서만 Hook을 호출해야 함
  - 반복문, 조건문, 중첩된 함수 내에서 Hook을 호출하지 않아야 함
- 오직 React 함수 내에서 Hook을 호출해야 함
  - 일반 자바스크립트 함수에서 Hook을 호출하지 않아야 함
  - 커스텀 Hook을 만들 때에는 기존의 Hook들을 사용하여 만들어야 함

## Custom Hook

- 컴포넌트 로직을 함수로 뽑아내어 재사용할 수 있음
- 두 개의 자바스크립트 함수에서 같은 로직을 공유하고자 할 때는 또 다른 함수로 분리함
- Custom Hook은 이름이 use로 시작하는 자바스크립트 함수로, 다른 Hook을 호출할 수 있음

  ```javascript
  // Custom Hook
  import [ useState, useEffect} from 'react';

  function useFriendStatus(friendID) {
    const [isOnline, setIsOnline] = useState(null);

    useEffect(() => {
      const handleStatusChange = (status) => {
        setIsOnline(status.isOnline);
      };
    });

    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };

    return isOnline;
  }

  // Using Custom Hook
  function FriendStatus(props) {
    const isOnline = useFriendStatus(props.friend.id);

    if (isOnline === null) {
      return "Loading...";
    }
    return isOnline ? "Online" : "Offline";
  }

  function FriendListItem(props) {
    const isOnline = useFriendStatus(props.friend.id);

    return (
      <li style={{ color: isOnline ? "green" : "black" }}>{props.friend.name}</li>
    );
  }
  ```

- Custom Hook은 React의 특별한 기능이라기보다 기본적으로 Hook의 디자인을 따르는 관습
- 이때, **같은 Hook을 사용하는 두 개의 컴포넌트는 같은 state를 공유하지 않음**
  - 각 컴포넌트 안의 state와 effect는 완전히 독립적임
  - 하나의 컴포넌트 안에서 useState와 useEffect를 여러 번 부를 수 있고, 이들은 모두 완전히 독립적
- Hook은 함수이기 때문에 Hook 사이에서도 정보를 전달할 수 있음
- useReducer / Redux reducer

  - useState는 업데이트 로직을 모아주는 데에 도움이 되지 않음
  - 독립적으로 테스트하기에 편리하며 복잡한 업데이트 로직의 표현이 늘어나는 경우에 잘 맞음

  ```javascript
  function todosReducer(state, action) {
    switch (action.type) {
      case "add":
        return [
          ...state,
          {
            text: action.text,
            completed: false,
          },
        ];
      // ... other actions ...
      default:
        return state;
    }
  }

  function useReducer(reducer, initialState) {
    const [state, setState] = useReducer(initialState);

    function dispatch(action) {
      const nextState = reducer(state, action);
      setState(nextState);
    }

    return [state, dispatch];
  }

  function Todos() {
    const [todos, dispatch] = useReducer(todosReducer, []);

    function handleAddClick(text) {
      dispatch({ type: "add", text });
    }

    // ...
  }
  ```

## Hook API Reference

### 기본 Hook

#### useState

```javascript
const [state, setState] = useState(initialState);
```

- 상태 유지 값과 그 값을 갱신하는 함수 반환
- 최초로 렌더링을 하는 동안, 반환된 `state`는 첫 번째 전달된 인자(`initialState`)의 값과 같음
- `setState` 함수는 state를 갱신할 때 사용하며, 새 state 값을 받아 컴포넌트 리렌더링을 큐에 등록함
  ```javascript
  setState(newState);
  ```
  - React는 `setState` 함수 동일성이 안정적이고 리렌더링 시에도 변경되지 않을 것이라는 것을 보장함
  - 이것은 `useEffect`나 `useCallbck` 의존성 목록에 이 함수를 포함하지 않아도 무방한 이유
- 함수적 갱신
  - 이전 state를 사용해서 새로운 state를 계산하는 경우 함수를 setState로 전달할 수 있음
  - 이전 값을 받아 갱신된 값을 반환
  ```jsx
  function Counter({ initialCount }) {
    const [count, setCount] = useState(initialCount);
    return (
      <>
        Count: {count}
        <button onClick={() => setCount(initialCount)}>Reset</button>
        <button onClick={() => setCount((prevCount) => prevCount - 1)}>
          -
        </button>
        <button onClick={() => setCount((prevCount) => prevCount + 1)}>+</button>
      </>
    );
  }
  ```
- 지연 초기 state
  - `initialState` 인자는 초기 렌더링 시에 사용하는 state
  - 초기 state가 고비용 계산의 결과라면, 초기 렌더링 시에만 실행될 함수를 대신 제공할 수 있음
  ```jsx
  const [state, setState] = useState(() => {
    const initialState = someExpensiveComputation(props);
    return initialState;
  });
  ```
- state 갱신의 취소
  - State Hook을 현재의 state와 동일한 값으로 갱신하는 경우, React는 이를 무시하고 그 처리를 종료
    - 이때, React는 Object.is 비교 알고리즘을 사용
  - 렌더링 시에 고비용의 계산을 하고 있다면 `useMemo`를 사용하여 그것들을 최적화할 수 있음

#### useEffect

```javascript
useEffect(didUpdate);
```

- 명령형 또는 어떤 effect를 발생하는 함수를 인자로 받음
- `useEffect`에 전달된 함수는 화면에 렌더링이 완료된 후에 수행되게 됨
- 기본적으로 동작은 모든 렌더링이 완료된 후에 수행되나, **어떤 값이 변경되었을 때만 실행되기 할 수도 있음**
- effect 정리
  - effect는 종종 컴포넌트가 화면에서 제거될 때 정리해야 하는 리소스(구독, 타이머 ID 등)를 만듬
  - 이를 수행하기 위해 useEffect에 전달된 함수는 정리(clean-up) 함수를 반환할 수 있음
    ```jsx
    useEffect(() => {
      const subscription = props.source.subscribe();
      return () => {
        subscription.unsubscribe();
      };
    });
    ```
  - 정리 함수는 메모리 누수 방지를 위해 UI에서 컴포넌트를 제거하기 전에 수행됨
  - 컴포넌트가 여러 번 렌더링 된다면, 다음 effect가 수행되기 전에 이전 effect는 정리됨
- effect 타이밍
  - `componentDidMount`와 `componetDidUpdate`와는 다르게, `useEffect`로 전달된 함수는 지연 이벤트 동안에 레이아웃 배치와 그리기를 완료한 **후** 발생함
  - 모든 effect가 지연될 수는 없음
    - 사용자에게 노출되는 DOM 변경은 사용자가 노출된 내용의 불일치를 경험하지 않도록 다음 화면을 다 그리기 이전에 동기화되어야 함
    - 이런 종류의 effect를 위해 React는 useLayoutEffect라는 추가적인 Hook을 제공
- 조건부 effect 발생
  - effect의 기본 동작은 모든 렌더링을 완료한 후 effect를 발생하는 것
  - 하지만 일부 경우에서는 과도한 작업일 수 있음
  - 이것을 수행하기 위해서는 `useEffect`에 두 번째 인자를 전달
    ```jsx
    // 이 작업은 props.source가 변경될 때에만 구독을 재생성함
    useEffect(() => {
      const subscription = props.source.subscribe();
      return () => {
        subscription.unsubscribe();
      };
    }, [props.source]);
    ```

#### useContext

```javascript
const value = useContext(MyContext);
```

- context 객체(`React.createContxt`에서 반환된 값)을 받아 그 context의 현재 값을 반환함
- context의 현재 값은 트리 안에서 이 Hook을 호출하는 컴포넌트에가장 가까이에 있는 `<MyContext.Provider>`의 `value` prop에 의해 결정됨
- 컴포넌트에서 가장 가까운 `<MyContext.Provider>`가 갱신되면 이 Hook은 그 `MyContext` provider에게 전달된 가장 최신의 context `value`를 사용하여 렌더러를 트리거함
  - 이때, 상위 컴포넌트에서 `React.memo` 또는 `shouldComponentUpdate`를 사용하더라도 `useContext` 컴포넌트 자체에서부터 다시 렌더링됨
- `useContext`로 전달한 인자는 `context 객체 그 자체`이어야 함
  `useContext(MyContext)`
- `useContext`를 호출한 컴포넌트는 context 값이 변경되면 항상 리렌더링 될 것
- 컴포넌트를 리렌더링 하는 것에 비용이 많이 든다면, 메모이제이션을 사용하여 최적화할 수 있음
- `useContext(MyContext)`는 context를 읽고 context의 변경을 구독하는 것만 가능
  - context의 값을 설정하기 위해서는 여전히 트리의 윗 계층에서의 `<MyContext.Provider>`가 필요
- **`useContext`를 `Context.Provider`와 같이 사용하라**

  ```jsx
  const themes = {
    light: {
      foreground: "#000000",
      background: "#eeeeee",
    },
    dark: {
      foreground: "#ffffff",
      background: "#222222",
    },
  };

  const ThemeContext = React.createContext(themes.light);

  function App() {
    return (
      <ThemeContext.Provider value={themes.dark}>
        <ThemedButton />
      </ThemeContext.Provider>
    );
  }

  function Toolbar() {
    return (
      <div>
        <ThemedButton />
      </div>
    );
  }

  function ThemedButton() {
    const theme = useContext(ThemeContext);
    return (
      <button style={{ background: theme.background, color: theme.foreground }}>
        I am styled by theme context!
      </button>
    );
  }
  ```

### 추가 Hook

#### useReducer

```javascript
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

- `useState`의 대체 함수
- `(state, action) => newState` 형태로 reducer를 받고 `dispatch` 메서드와 짝의 형태로 현재 state를 반환
- 다수의 하윗값을 포함하는 복잡한 저적 로직을 만드는 경우, 다음 stat가 이전 state에 의존적인 경우에 보통 `useState`보다 `useReducer`를 선호
- 콜백 대신 dispatch를 전달할 수 있으므로, 자세한 업데이트를 트리거 하는 컴포넌트의 성능을 최적화할 수 있음
- React는 `dispatch` 함수의 동일성이 안정적이고 리렌더링 시에도 변경되지 않으리라는 것을 보장함

  - `useEffect`나 `useCallbck` 의존성 목록에 이 함수를 포함하지 않아도 무방한 이유

- 초기 state의 구체화
  - `useReducer` state의 초기화에는 두 가지 방법이 있음
    1. 초기 state를 두 번째 인자로 전달
    ```jsx
    const [state, dispatch] = useReducer(reducer, { count: initialCount });
    ```
    - React에서는 Reducer의 인자로써 `state = initialState`와 같은 초기값을 나타내는, Redux에서느 보편화된 관습을 사용하지 않음
    - 때때로 초기값은 props에 의존할 필요가 있어 Hook 호출에서 지정되기도 함
    - 초기값을 나타내는 것이 정말 필요핟면 `useReducer(reducer, undefined, reducer)`를 호출하는 방법으로 Redux를 모방할 수는 있겠지만, 권장되는 방법은 아님
- 초기화 지연

  - `init` 함수를 세 번째 인자로 전달
  - 초기 state는 `init(initialArg)에 설정될 것

  ```jsx
  function init(initialCount) {
    return { count: initialCount };
  }

  function reducer(state, action) {
    switch (action.type) {
      case "increment":
        return { count: state.count + 1 };
      case "decrement":
        return { count: state.count - 1 };
      case "reset":
        return init(action.payload);
      default:
        throw new Error();
    }
  }

  function Counter({ initialCount }) {
    const [state, dispatch] = useReducer(reducer, initialCount, init);

    return (
      <>
        Count: {state.count}
        <button
          onClick={() => dispatch({ type: "reset", payload: initialCount })}
        >
          Reset
        </button>
        <button onClick={() => dispatch({ type: "increment" })}>+</button>
        <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      </>
    );
  }
  ```

- dispatch의 회피
  - Reducer Hook에서 현재 state와 같은 값을 반환하는 경우 React는 자식을 리렌더링하거나 effect를 발생하지 않고 이것들을 회피할 것

#### useCallback

```javascript
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

- 메모이제이션된 콜백을 반환
- 함수를 메모이제이션
- 인라인 콜백과 그것의 의존성 값의 배열을 전달
- 메모이제이션된 버전은 콜백의 의존성이 변경되었을 때에만 변경됨
  - 불필요한 렌더링을 방지하기 위해 참조의 동일성에 의존적인 최적화된 자식 컴포넌트에 콜백을 전달할 때 유용
- `useCallback(fn, deps)`는 `useMemo(() => fn, deps)`와 동일

```jsx
import React, { useState, useCallback } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []); // 빈 배열이므로 항상 같은 함수 참조 유지

  return <button onClick={increment}>Count: {count}</button>;
}
```

#### useMemo

```javascript
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

- 메모이제이션된 값을 반환
- 값을 메모이제이션
- 생성 함수와 그것의 의존성 값의 배열을 전달
- `useMemo`는 의존성이 변경되었을 때에만 메모이제이션된 값만 다시 계산
  - 모든 렌더링 시의 고비용 계산을 방지하게 해줌
- `useMemo`로 전달된 함수는 렌더링 중에 실행되므로, 통상적으로 렌더링 중에는 하지 않는 것을 이 함수 내에서 하지 말 것
  - Side Effects는 `useEffect`에서 하는 일이지 `useMemo`에서 하는 일이 아님
- 배열이 없는 경우 매 렌더링 때마다 새 값을 계산하게 될 것
- useMemo는 성능 최적화를 위해 사용할 수는 있지만 의미상으로 보장이 있다고는 생각하면 안됨
- 가까운 미래의 React에서는 이 함수를 사용하지 않을 가능성이 있으므로, `useMemo`를 사용하지 않고도 동작할 수 있도록 코드를 작성하고 그것을 추가하여 성능을 최적화해라
- 의존성 값의 배열은 함수에 인자로 전달되지는 않으나, 함수 안에서 참조되는 모든 값은 의존성 값의 배열에 나타나야 함

```jsx
import React, { useState, useMemo } from "react";

function ExpensiveCalculation() {
  const [number, setNumber] = useState(0);
  const [toggle, setToggle] = useState(false);

  const factorial = useMemo(() => {
    console.log("Factorial 계산 중...");
    const calc = (n) => (n <= 1 ? 1 : n * calc(n - 1));
    return calc(number);
  }, [number]); // `number`가 변경될 때만 재계산

  return (
    <div>
      <input
        type="number"
        value={number}
        onChange={(e) => setNumber(parseInt(e.target.value) || 0)}
      />
      <p>Factorial: {factorial}</p>
      <button onClick={() => setToggle(!toggle)}>
        Toggle: {toggle.toString()}
      </button>
    </div>
  );
}
```

#### useRef

```javascript
const refContainer = useRef(initialValue);
```

- `useRef`는 `.curren` 프로퍼티로 전달된 인자(`initialValue`)로 초기화된 변경 가능한 ref 객체를 반환
- 반환된 개체는 컴포넌트의 전 생애주기를 통해 유지될 것

```jsx
function TextInputWithFocusButton() {
  const inputRef = useRef(null);

  const handleFocus = () => {
    inputRef.current.focus();
  };

  return (
    <>
      <input ref={inputRef} type="text" />
      <button onClick={handleFocus}>Focus Input</button>
    </>
  );
}
```

- 본질적으로 `useRef`는 `.current` 프로퍼티에 변경 가능한 값을 담고 있는 "상자"와 같으
- 보통 DOM에 접근하는 방법으로 refs에 친숙
  - `<div ref={myRef} />`를 사용하여 React로 ref 객체를 전달한다면, React는 노드가 변경될 때마다 변경된 DOM 노드에 그것의 `.current` 프로퍼티를 설정할 것
- 그럼에도, `ref` 속성보다 `useRef()`가 더 유용
  - 클래스에서 인스턴스 필드를 사요하는 바업과 유사한 어떤 가변값을 유지하는 데에 편리
  - `useRef()`가 순수 자바스크립트 객체를 생성하기 때문
- 컴포넌트가 리렌더링될 때마다 새로운 객체를 생성하지 않음
  - `useRef()`와 `{ current: ...}` 객체 자체를 생성하는 것의 유일한 차이점은 `useRef`는 매번 렌더링할 때 동일한 ref 객체를 제공하는 것
- `useRef`는 내용이 변경될 때 그것을 알려주지는 않음
  - `.current` 프로퍼티를 변형하는 것이 리렌더링을 발생시키지는 않음
- React가 DOM 노드에 ref를 ttach하거나 detach할 때 어떤 콛를 실행하고 싶다면 대신 콜백 ref를 사용할 것

#### useImperativeHandle

#### useLayoutEffect

#### useDebugValue

#### useDeferredValue

#### useTransition

#### useId

### Library Hooks

#### useSyncExternalStore

#### useInsertionEffect
