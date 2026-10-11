import { useAppStore } from "./app/store/use-app-store";

import { GameScreen } from "./ui/screens/game-screen";
import { MainMenu } from "./ui/screens/main-menu";

import { StartupScreen } from "./ui/startup/startup-screen";

import { useStartupStore } from "./game/store/use-startup-store";

export default function App() {
  const startupStage = useStartupStore((state) => state.stage);

  const screen = useAppStore((state) => state.screen);

  if (startupStage !== "complete") {
    return <StartupScreen />;
  }

  if (screen === "game") {
    return <GameScreen />;
  }

  return <MainMenu />;
}
