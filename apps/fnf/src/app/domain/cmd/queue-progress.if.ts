export interface QueueProgressIf {
  unfinished: number;
  finished: number;
  errors: number;
  class: string;
}