const isNumber = require('../helpers/is_number');
const MysqlService = require('../services/mysql');

class CRUD {
  static getQueries(Model) {
    const dbName = Model.getDbName();
    const fields = MysqlService.formatFields(Model);

    const generic = {
      get_all: `SELECT ${fields} FROM ${dbName} ${Model.name}`,
      get_by_id: `SELECT ${fields} FROM ${dbName} ${Model.name} WHERE ${Model.name}.id = ?`,
      get_by_id_in: `SELECT ${fields} FROM ${dbName} ${Model.name} WHERE ${Model.name}.id IN (?)`,
      get_count: `SELECT COUNT(*) total FROM ${dbName} ${Model.name}`,
      create: `INSERT INTO ${dbName} SET ?`,
      update: `UPDATE ${dbName} SET ? WHERE id = ?`,
      update_in: `UPDATE ${dbName} SET ? WHERE id IN (?)`,
      delete: `DELETE FROM ${dbName} WHERE id = ?`,
    };

    return Object.assign(generic, Model.getQueries());
  }

  static format(ModelsList, modelData) {
    const formatObject = (modelRow) => {
      const result = {};

      Object.keys(modelRow).forEach((modelKey) => {
        const keysSplitted = modelKey.split('__');
        const fieldKey = Object.keys(ModelsList[keysSplitted[0]].getFields()).find(modelKey =>
          ModelsList[keysSplitted[0]].getFields()[modelKey].name === keysSplitted[1]);

        if (ModelsList[keysSplitted[0]].getFields()[fieldKey].private === true) {
          return;
        }

        if (typeof result[keysSplitted[0]] === 'undefined') {
          result[keysSplitted[0]] = {};
        }

        result[keysSplitted[0]][keysSplitted[1]] = modelRow[modelKey];
      });

      return result;
    };

    if (Array.isArray(modelData)) {
      const data = modelData.map(formatObject);
      if (data.length < 1) {
        return data;
      }

      const arrayResult = {};
      Object.keys(data[0]).forEach((key) => {
        arrayResult[key] = data.map(obj => obj[key]);
      });

      return arrayResult;
    }

    return formatObject(modelData);
  }

  /**
   * To Call this function, all objects of the wanted model
   * must have the getFieldsWithRelations() function
   * (example in models/ondemand_request.js)
   */
  static crudFormatWithRelations(ModelsList, modelData) {
    const formatObject = (modelRow) => {
      const result = {};

      Object.keys(modelRow).forEach((modelKey) => {
        const keysSplitted = modelKey.split('__');
        const fieldKey = Object.keys(ModelsList[keysSplitted[0]].getFields()).find(modelKey =>
          ModelsList[keysSplitted[0]].getFields()[modelKey].name === keysSplitted[1]);

        if (ModelsList[keysSplitted[0]].getFields()[fieldKey].private === true) {
          return;
        }

        if (typeof result[keysSplitted[0]] === 'undefined') {
          result[keysSplitted[0]] = {};
        }

        result[keysSplitted[0]][keysSplitted[1]] = modelRow[modelKey];
      });

      return result;
    };

    const mergeLines = (Model, line, previous) => {
      // Pop corresponding object from the line
      const newObject = line[Model.name];
      delete line[Model.name];

      let prevObject = previous;
      // Pop previous object
      if (Array.isArray(previous) && previous.length > 0) {
        prevObject = previous.pop();
      }

      // Do we need to override the previous object or add another
      let override = true;

      // For each field of model
      const fields = Model.getFieldsWithRelations();
      if (prevObject !== undefined && prevObject !== null) {
        Object.keys(fields).forEach((field) => {
          switch (fields[field].type) {
            case 'INT':
            case 'BIGINT':
            case 'ENUM':
            case 'VARCHAR':
              override = override
                && (prevObject[fields[field].name] === newObject[fields[field].name]);
              break;
            case 'DATETIME':
              override = override
                && (prevObject[fields[field].name].toString() ===
                    newObject[fields[field].name].toString());
              break;
            default:
              if (override) {
                newObject[fields[field].name]
                  = mergeLines(fields[field].type, line, prevObject[fields[field].name]);
              } else {
                newObject[fields[field].name]
                  = mergeLines(fields[field].type, line, null);
              }
          }
        });
      } else {
        // If there is not previous object, make sure that the newObject is not null or
        // have all the fields
        let nullObject = true;
        Object.keys(fields).forEach((field) => {
          // console.log(field);
          if (newObject[field] === undefined) {
            newObject[field] = null;
          }
          nullObject = nullObject && (newObject[field] === null);
        });
        if (nullObject) {
          return null;
        }
      }

      // Case of return : object or list
      if (override) {
        if (Array.isArray(previous)) {
          previous.push(newObject);
          return previous;
        }
        return newObject;
      }
      if (Array.isArray(previous)) {
        previous.push(prevObject);
        previous.push(newObject);
        return previous;
      } else if (previous !== undefined && previous !== null) {
        return [prevObject, newObject];
      }
      return newObject;
    };

    if (Array.isArray(modelData)) {
      let data = null;
      modelData.forEach((element) => {
        data = mergeLines(this, formatObject(element), data);
      });

      const returnObject = {};
      returnObject[this.name] = data;

      return returnObject;
    }

    return formatObject(modelData);
  }

  constructor(mysql, Model) {
    this.mysql = mysql;
    this.model = Model;
    this.queries = CRUD.getQueries(Model);
  }

  getQuery(name) {
    if (typeof this.queries[name] === 'undefined') {
      return '';
    }

    return this.queries[name];
  }

  count() {
    return new Promise((resolve, reject) =>
      this.mysql.query(this.getQuery('get_count'))
        .then(rows => resolve(rows[0].total))
        .catch(reject));
  }

  findAll() {
    return this.mysql.query(this.getQuery('get_all'));
  }

  findById(id) {
    return new Promise((resolve, reject) => {
      if (!isNumber(id)) {
        const err = new Error('ID_INVALID');
        err.status = 400;

        return reject(err);
      }

      return this.mysql.query(this.getQuery('get_by_id'), [id])
        .then((rows) => {
          if (rows.length < 1) {
            const notFound = new Error('ID_NOT_FOUND');
            notFound.status = 404;

            return reject(notFound);
          }

          return resolve(rows[0]);
        })
        .catch(reject);
    });
  }

  findByIds(ids) {
    return new Promise((resolve, reject) =>
      this.mysql.query(this.getQuery('get_by_id_in'), [ids])
        .then((rows) => {
          if (rows.length < 1) {
            const notFound = new Error('ID_NOT_FOUND');
            notFound.status = 404;

            return reject(notFound);
          }

          return resolve(rows[0]);
        })
        .catch(reject));
  }

  create(data) {
    return new Promise((resolve, reject) =>
      this.mysql.query(this.getQuery('create'), data)
        .then(response => this.findById(response.insertId))
        .then(row => resolve(row))
        .catch(reject));
  }

  update(id, data) {
    return new Promise((resolve, reject) => {
      if (!isNumber(id)) {
        const err = new Error('ID_INVALID');
        err.status = 400;

        return reject(err);
      }

      return this.mysql.query(this.getQuery('update'), [data, id])
        .then(() => this.findById(id)) // @TODO migrate this to controller not here!
        .then(row => resolve(row))
        .catch(reject);
    });
  }

  updateIn(ids, data) {
    return new Promise((resolve, reject) =>
      this.mysql.query(this.getQuery('update_in'), [data, ids])
        .then(() => resolve(ids))
        .catch(reject));
  }

  delete(id) {
    return new Promise((resolve, reject) =>
      this.mysql.query(this.getQuery('delete'), id)
        .then(response => resolve(response))
        .catch(reject));
  }
}

module.exports = CRUD;
