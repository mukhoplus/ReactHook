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
