import path from 'path';
import Database from '../../../release/app/node_modules/better-sqlite3';

export type WorkItem = {
  id?: number;
  modelName: string;
  promptName: string;
  queryText: string;
  responseText: string;
  contextText: string;
  notesText: string;
  dateTime: string;
};

export function connect() {
  return Database(
    path.join(__dirname, '../../../', 'assets/database', 'ai-base.db'),
    { fileMustExist: true },
  );
}

export function insertWorkItem(workItem: WorkItem) {
  const db = connect();
  const stm = db.prepare(
    `INSERT INTO WorkItem (modelName, promptName, queryText, responseText, contextText, notesText, dateTime) VALUES (?, ?, ?, ?, ?, ?, ?)`,
  );
  stm.run(
    workItem.modelName,
    workItem.promptName,
    workItem.queryText,
    workItem.responseText,
    workItem.contextText,
    workItem.notesText,
    new Date().toDateString(),
  );
}

export function getWorkItems() {
  const db = connect();

  const stm = db.prepare('SELECT * FROM WorkItem');

  return stm.all() as WorkItem[];
}

