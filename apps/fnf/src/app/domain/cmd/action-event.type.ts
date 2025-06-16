export const actionEventTypes = [
  'refresh_panel',
  'mkdir',
  'copy',
  'move',
  'remove',
  'delempty',
  'rename',
  'refresh_job_queue_table',

] as const;

export type ActionEventType = typeof actionEventTypes[number];