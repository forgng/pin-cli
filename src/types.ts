export interface Pin {
  name: string;
  path: string;
}

export interface PinFile {
  createdAt: number;
  updatedAt: number;
  pins: Pin[];
}
