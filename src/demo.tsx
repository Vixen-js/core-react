import { Button } from "./components/Button";
import { Text } from "./components/Text";
import { View } from "./components/View";
import { Window } from "./components/Window";
import { Renderer } from "./renderer";

const styles = `
 #container {
    flex: 1;
    min-height: '100%';
    justify-content: 'center';
  }
  #textContainer {
    flex-direction: 'row';
    justify-content: 'space-around';
    align-items: 'center';
  }
`;

const App = () => {
  return (
    <Window styleSheet={styles}>
      <View id="container">
        <View id="textContainer">
          <Text>Hello Vixen</Text>
        </View>
        <Button text="Click Me" />
      </View>
    </Window>
  );
};

Renderer.render(<App />);
