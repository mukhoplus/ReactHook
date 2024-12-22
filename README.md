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

### useState

- this.state를 대체하는 함수
- useState를 호출함으로써 state 변수와 그 변수를 업데이트하는 함수를 반환
  - count, setCount
- useState의 인자는 state의 초기 값
- 일반 변수와 달리 state 변수는 React에 의해 사라지지 않음
- `const [count, setCount] = useState(0);`와 같이 대괄호를 이용하는 자바스크립트 문법은 "배열 구조 분해"라고 함
