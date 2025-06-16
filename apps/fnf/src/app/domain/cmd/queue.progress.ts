export interface QueueProgress {
  unfinished: number;
  finished: number;
  errors: number;
  class: string;
  getInfoText: () => string;
}