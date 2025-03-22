import { create } from 'zustand';
import { CameraCapturedPicture } from 'expo-camera';

type CameraStore = {
  onCapture: ((picture: CameraCapturedPicture) => void) | null;
  setOnCapture: (callback: ((picture: CameraCapturedPicture) => void) | null) => void;
};

export const useCameraStore = create<CameraStore>((set) => ({
  onCapture: null,
  setOnCapture: (callback) => set({ onCapture: callback }),
}));