import path from "path";
import sqllite from "sqlite3";

class MyDB {
  constructor() {
    const dbPath = path.join(process.cwd(), "db.sqlite");
    this.db = new sqllite.Database(dbPath);

    this.db.serialize(() => {
      this.db.run(
        `CREATE TABLE IF NOT EXISTS files (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, url TEXT, type TEXT, status TEXT)`,
      );
    });
  }

  async getAllFiles() {
    return new Promise((resolve, reject) => {
      this.db.all(`SELECT * FROM files`, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async getFilesByStatus(status) {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM files WHERE status = ?`,
        [status],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        },
      );
    });
  }

  async getFilesByName(name) {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM files WHERE name LIKE ?`,
        [`%${name}%`],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        },
      );
    });
  }

  async addFile(name, url, type, status) {
    this.db.serialize(() => {
      this.db.run(
        `INSERT INTO files (name, url, type, status) VALUES (?, ?, ?, ?)`,
        [name, url, type, status],
      );
    });
  }

  async updateFileStatus(name, status) {
    this.db.serialize(() => {
      this.db.run(`UPDATE files SET status = ? WHERE name = ?`, [status, name]);
    });
  }

  async deleteFile(name) {
    this.db.serialize(() => {
      this.db.run(`DELETE FROM files WHERE name = ?`, [name]);
    });
  }

  async deleteAllFiles() {
    this.db.serialize(() => {
      this.db.run(`DELETE FROM files`);
    });
  }

  async deleteFilesByStatus(status) {
    this.db.serialize(() => {
      this.db.run(`DELETE FROM files WHERE status = ?`, [status]);
    });
  }

  async deleteFilesByName(name) {
    this.db.serialize(() => {
      this.db.run(`DELETE FROM files WHERE name = ?`, [name]);
    });
  }

  close() {
    this.db.close();
  }
}

const db = new MyDB();
export default db;
