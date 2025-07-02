export const actionEventTypes = [
  'refresh_panel',
  'mkdir',
  'copy',
  'move',
  'remove',
  'delempty',
  'rename',
  'refresh_job_queue_table',
  'open_job_queue_table',
  'update',
  'created',
  'open'
] as const;

export type ActionEventType = typeof actionEventTypes[number];