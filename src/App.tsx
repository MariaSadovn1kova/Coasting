import { useAppStore } from "./app/store/use-app-store";

import { GameScreen } from "./ui/screens/game-screen";
import { MainMenu } from "./ui/screens/main-menu";

function App() {
  const screen = useAppStore((state) => state.screen);

  if (screen === "game") {
    return <GameScreen />;
  }

  return <MainMenu />;
}

export default App;
