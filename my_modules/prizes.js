"use strict";

const db = require('./db.js');

const Prize = function (prize_info) {

  if (!prize_info.type || !prize_info.sponsor || !prize_info.description)
    throw 'ERROR: To create a new prize, "type", "sponsor" and "description" parameters must be provided';
  if (isNaN(parseInt(prize_info.stock)) || parseInt(prize_info.stock) < 0)
    throw 'ERROR: The stock value must be an integer >= 0';
  if (prize_info.due_date && new Date(prize_info.due_date).getTime() === NaN)
    throw 'ERROR: Invalid date format for due date. Required format "yyyy/MM/dd"';

  // Properties
  let id = prize_info.id;
  let type = prize_info.type;
  let sponsor = prize_info.sponsor;
  let description = prize_info.description;
  let stock = parseInt(prize_info.stock);
  let set_date = prize_info.set_date;
  let update_date = prize_info.update_date;
  let due_date = prize_info.due_date ? new Date(prize_info.due_date).getTime() : null;
  let note = prize_info.note;

  // Methods
  const save = () => {
    if (id)
      throw "ERROR: This prize has already been saved, try using the update method";
    return new Promise((resolve, reject) => {
      db.insert('prizes', {
        'type': type,
        'sponsor': sponsor,
        'description': description,
        'stock': stock,
        'set_date': Date.now(),
        'update_date': null,
        'due_date': due_date,
        'note': note
      })
        .then((WriteResult) => {
          id = WriteResult.ops[0]._id;
          return resolve(WriteResult);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  const update = () => {
    if (!id)
      throw "ERROR: A prize can only be edited after it has been saved";
    return new Promise((resolve, reject) => {
      db.update('prizes', { id: id }, {
        'type': type,
        'sponsor': sponsor,
        'description': description,
        'stock': stock,
        'update_date': Date.now(),
        'due_date': due_date,
        'note': note
      })
        .then((WriteResult) => {
          return resolve(WriteResult);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  const edit = (values) => {
    if (values.type)
      type = values.type;
    if (values.sponsor)
      sponsor = values.sponsor;
    if (values.description)
      description = values.description;
    if (values.stock)
      stock = values.stock;
    if (values.due_date)
      due_date = values.due_date;
    if (values.note)
      note = values.note;
    return update();
  }

  const stockUpdate = (value) => {
    let intVal = parseInt(value);
    if (!value || isNaN(intVal))
      throw "ERROR: The stock's modifier value must be a integer - Prizes.js module stockUpdate()";
    if (stock + intVal < 0)
      throw "ERROR: The stock's modifier value was greater than the current stock - Prizes.js module stockUpdate()";
    stock += intVal;
    return update();
  }

  const stockIncrease = (val) => {
    if (!val || isNaN(parseInt(val)) || parseInt(val) <= 0)
      throw "ERROR: The stock's modifier value must be a integer > 0 - Prizes.js module stockIncrease()";
    return stockUpdate(val)
  }

  const stockDecrease = (val) => {
    if (!val || isNaN(parseInt(val)) || parseInt(val) <= 0)
      throw "ERROR: The stock's modifier value must be a integer > 0 - Prizes.js module stockDecrease()";
    return stockUpdate(val * -1)
  }

  const getPublicData = () => {
    return {
      id: id,
      type: type,
      sponsor: sponsor,
      description: description,
      stock: stock,
      set_date: set_date,
      update_date: update_date,
      due_date: due_date,
      note: note
    }
  }

  return {
    // Public Methods
    save: save,
    edit: edit,
    update: update,
    getPublicData: getPublicData,
    stockIncrease: stockIncrease,
    stockDecrease: stockDecrease,
    getId: () => id,
    getStock: () => stock
  }
}

const findById = (id) => {
  if (!id)
    throw "The parameter id must be provided";
  return new Promise((resolve, reject) => {
    db.findById('prizes', id)
      .then((result) => {
        if (result)
          return resolve(new Prize({
            id: result._id,
            type: result.type,
            sponsor: result.sponsor,
            description: result.description,
            stock: result.stock,
            set_date: result.set_date,
            due_date: result.due_date,
            note: result.note
          }));
        return resolve(null);
      })
      .catch((err) => {
        return reject('ERR_DB - Unable to fetch prizes data - Users module - Returned ERROR: ' + err);
      });
  });
}

const findAll = () => {
  return new Promise(function (resolve, reject) {
    db.find('prizes')
      .then((results) => {
        if (results.length) {
          return resolve(results.map((result) => {
            return new Prize({
              id: result._id,
              type: result.type,
              sponsor: result.sponsor,
              description: result.description,
              stock: parseInt(result.stock),
              set_date: result.set_date,
              update_date: result.update_date,
              due_date: result.due_date,
              note: result.note
            });
          }));
        }
        return resolve([]);
      })
      .catch((err) => {
        return reject('ERR_DB - Unable to fetch prizes data - Users module - Returned ERROR: ' + err);
      });
  });
}

module.exports = {
  Prize: Prize,
  findById: findById,
  findAll: findAll
}
