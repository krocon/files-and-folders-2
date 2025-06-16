export const queueStatusList = [

  // Queue Status:
  'IDLE',
  'RUNNING',
  'ERROR',

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