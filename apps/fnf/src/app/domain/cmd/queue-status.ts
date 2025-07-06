export const queueStatusList = [

  // QueueIf Status:
  'IDLE',
  'RUNNING',
  'ERROR',
  'PAUSED',

  // Action Status:
  'NEW',
  'PENDING',
  'PROCESSING', // Running

  // done:
  'ERROR',
  'WARNING',
  'SUCCESS',
  'ABORT',

] as const;

export type QueueStatus = typeof queueStatusList[number];