// types/mediapipe-hands.d.ts
declare module "@mediapipe/hands/hands" {
  import type { Results } from "@mediapipe/hands";

  export class Hands {
    constructor(config: { locateFile: (file: string) => string });
    setOptions(opts: {
      maxNumHands?: number;
      minDetectionConfidence?: number;
      minTrackingConfidence?: number;
      modelComplexity?: 0 | 1;
      selfieMode?: boolean;
    }): void;
    onResults(cb: (results: Results) => void): void;
    send(input: { image: HTMLVideoElement | HTMLCanvasElement }): Promise<void>;
  }
}
