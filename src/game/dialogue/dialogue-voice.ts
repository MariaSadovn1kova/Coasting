import { Howl } from "howler";

export class DialogueVoice {
  private sound: Howl | null = null;
  private currentSrc: string | null = null;

  setVoice(src: string) {
    if (this.currentSrc === src && this.sound) {
      return;
    }

    this.sound?.unload();

    this.currentSrc = src;

    this.sound = new Howl({
      src: [src],

      volume: 0.45,

      preload: true,
    });
  }

  play() {
    if (!this.sound) {
      return;
    }

    this.sound.play();
  }

  stop() {
    this.sound?.stop();
  }

  destroy() {
    this.sound?.unload();

    this.sound = null;
    this.currentSrc = null;
  }
}
