import { Howl, Howler } from "howler";

type TSoundId = "chest-open";

interface ISoundConfig {
  src: string;
  volume?: number;
}

const sounds: Record<TSoundId, ISoundConfig> = {
  "chest-open": {
    src: "/assets/audio/sfx/open-chest.mp3",
    volume: 0.5,
  },
};

export class AudioManager {
  private sounds = new Map<TSoundId, Howl>();

  constructor() {
    this.initializeSounds();
  }

  private initializeSounds() {
    Object.entries(sounds).forEach(([id, config]) => {
      const sound = new Howl({
        src: [config.src],
        volume: config.volume ?? 1,
        preload: true,
      });

      this.sounds.set(id as TSoundId, sound);
    });
  }

  playSfx(id: TSoundId) {
    const sound = this.sounds.get(id);

    if (!sound) {
      return;
    }

    sound.play();
  }

  setMasterVolume(volume: number) {
    Howler.volume(Math.max(0, Math.min(volume, 1)));
  }

  destroy() {
    this.sounds.forEach((sound) => {
      sound.unload();
    });

    this.sounds.clear();
  }
}
