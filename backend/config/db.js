const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: process.env.CONNECTION_LIMIT, // the number of connections node.js will hold open to our database
  password: process.env.DB_PASS,
  user: process.env.DB_USER,
  database: process.env.MYSQL_DB,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
});

//  //create the User table

// pool.query('CREATE TABLE User (' +
//       'id int(11) NOT NULL AUTO_INCREMENT,' +
//       'name varchar(255) NOT NULL,' +
//       'role varchar(255) DEFAULT "user",' +
//       'email varchar(255) NOT NULL,' +
//       'password varchar(255) NOT NULL,' +
//       'token varchar(255) DEFAULT NULL,' +
//       'token_expire varchar(255) DEFAULT NULL,' +
//       'PRIMARY KEY (id),'+
//       'UNIQUE KEY email_UNIQUE (email),' +
//       'UNIQUE KEY password_UNIQUE (password))', function (err, result) {
//           if (err) throw err;
//           console.log("User created");
//         }
//      );

let db = {};

// ***Requests to the User table ***

db.allUser = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM User", (error, users) => {
      if (error) {
        return reject(error);
      }
      return resolve(users);
    });
  });
};

db.getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM User WHERE email = ?",
      [email],
      (error, users) => {
        if (error) {
          return reject(error);
        }
        return resolve(users[0]);
      }
    );
  });
};

db.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM User WHERE id = ?", [id], (error, users) => {
      if (error) {
        return reject(error);
      }
      return resolve(users[0]);
    });
  });
};

db.getUserByToken = (token) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM User WHERE token = ?",
      [token],
      (error, users) => {
        if (error) {
          return reject(error);
        }
        return resolve(users[0]);
      }
    );
  });
};

db.insertUser = (name, email, password) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO User (name, email, password) VALUES (?,  ?, ?)",
      [name, email, password],
      (error, result) => {
        if (error) {
          return reject(error);
        }

        return resolve(result.insertId);
      }
    );
  });
};

db.insertUserAdmin = (name, email, password, role) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO User (name, role, email, password) VALUES (?, ?, ?, ?)",
      [name, role, email, password],
      (error, result) => {
        if (error) {
          return reject(error);
        }

        return resolve(result.insertId);
      }
    );
  });
};

db.updateUser = (name, email, password, id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE User SET name = ?, email = ?, password = ? WHERE id = ?",
      [name, email, password, id],
      (error) => {
        if (error) {
          return reject(error);
        }
        return resolve();
      }
    );
  });
};

db.updateUserTokenOrPassword = (email, data) => {
  return new Promise((resolve, reject) => {
    pool.query(
      'UPDATE user SET ? WHERE email ="' + email + '"',
      data,
      (error, users) => {
        if (error) {
          return reject(error);
        }

        return resolve(users[0]);
      }
    );
  });
};

db.deleteUser = (id) => {
  return new Promise((resolve, reject) => {
    pool.query("DELETE FROM User WHERE id = ?", [id], (error) => {
      if (error) {
        return reject(error);
      }
      return resolve(console.log('user deleted'));
    });
  });
};

module.exports = db;
