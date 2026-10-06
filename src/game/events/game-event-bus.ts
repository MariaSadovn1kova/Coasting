import type { IContainerItem } from "../inventory/container-content";

interface IGameEventMap {
  "inventory-toggle": undefined;
  "inventory-updated": IContainerItem[];
}

type TGameEvent = keyof IGameEventMap;

type TGameEventHandler<T extends TGameEvent> = (
  payload: IGameEventMap[T],
) => void;

export class GameEventBus {
  private listeners = new Map<TGameEvent, Set<(payload: unknown) => void>>();

  on<T extends TGameEvent>(event: T, handler: TGameEventHandler<T>) {
    const handlers =
      this.listeners.get(event) ?? new Set<(payload: unknown) => void>();

    handlers.add(handler as (payload: unknown) => void);

    this.listeners.set(event, handlers);

    return () => {
      handlers.delete(handler as (payload: unknown) => void);
    };
  }

  emit<T extends TGameEvent>(
    event: T,
    ...args: IGameEventMap[T] extends undefined
      ? []
      : [payload: IGameEventMap[T]]
  ) {
    const handlers = this.listeners.get(event);

    if (!handlers) {
      return;
    }

    const payload = args[0];

    handlers.forEach((handler) => {
      handler(payload);
    });
  }

  clear() {
    this.listeners.clear();
  }
}

export const gameEventBus = new GameEventBus();
