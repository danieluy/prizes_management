"use strict";

const db = require('./db.js');

const Winner = function (winner_info) {
  if (!winner_info.ci || !winner_info.name || !winner_info.lastname)
    throw 'ERROR: To create a new Winner, "ci", "name" and "lastname" parameters must be provided';
  if (!checkCi(winner_info.ci))
    throw 'ERROR: The provided C.I. number is not valid';
  if (winner_info.gender && winner_info.gender.toUpperCase() !== 'F' && winner_info.gender.toUpperCase() !== 'M' && winner_info.gender.toUpperCase() !== 'O')
    throw 'ERROR: The gender value can only be "F", "M" or "O"';
  if (winner_info.mail && !winner_info.mail.match(/\S+\@\S+\.\S+/))
    throw 'ERROR: The mail value must be a valid email address';

  // Properties
  let id = winner_info.id;
  let ci = winner_info.ci;
  let name = winner_info.name;
  let lastname = winner_info.lastname;
  let facebook = winner_info.facebook;
  let gender = winner_info.gender ? winner_info.gender.toUpperCase() : null;
  let phone = winner_info.phone;
  let mail = winner_info.mail;
  let prizes = winner_info.prizes;
  let set_date = winner_info.set_date;
  let update_date = winner_info.update_date;

  // Methods
  const save = () => {
    if (id)
      throw "ERROR: This winner has already been saved, try using the update method";
    return new Promise((resolve, reject) => {
      db.insert('winners', {
        'ci': ci,
        'name': name,
        'lastname': lastname,
        'facebook': facebook,
        'gender': gender,
        'phone': phone,
        'mail': mail,
        'prizes': [],
        'set_date': Date.now(),
        'update_date': null
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
      throw "ERROR: A winner can only be edited after it has been saved";
    return new Promise((resolve, reject) => {
      db.update('winners', { id: id }, {
        'name': name,
        'lastname': lastname,
        'facebook': facebook,
        'gender': gender ? gender.toUpperCase() : null,
        'phone': phone,
        'mail': mail,
        'prizes': prizes,
        'update_date': Date.now()
      })
        .then((WriteResult) => {
          return resolve(WriteResult);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }


  const addPrize = (prize_id) => {
    if (!prize_id)
      throw 'ERROR: To add a prize the "prize_id" parameter must be provided';
    prizes.push({ 'id': prize_id, 'handed': null, 'granted': Date.now() });
    return update();
  }

  const deletePrize = (prize_id) => {
    if (!prize_id)
      throw 'ERROR: To delete a prize the "prize_id" parameter must be provided';
    prizes = prizes.filter(prize => prize.id !== prize_id);
    return update();
  }

  const handOverPrize = (prize_id) => {
    let found = false;
    let i = 0;
    while (i < prizes.length && !found) {
      if (prizes[i].id === prize_id && !prizes[i].handed) {
        prizes[i].handed = Date.now();
        found = true;
      }
      i++;
    }
    return update();
  }

  const getPublicData = () => {
    return {
      id: id,
      ci: ci,
      name: name,
      lastname: lastname,
      facebook: facebook,
      gender: gender,
      phone: phone,
      mail: mail,
      prizes: prizes,
      set_date: set_date,
      update_date: update_date
    }
  }

  const hasWonSinceThreeMonths = () => {

    let today = Date.now();
    for (let i = 0; i < prizes.length; i++) {
      let difference_days = Math.floor((today - prizes[i].granted) / 1000 / 60 / 60 / 24);
      if (difference_days < 90)
        return true;
    }
    return false;
  }

  return {
    // Public Methods
    save: save,
    update: update,
    getCi: () => ci,
    setCi: (_ci) => { ci = _ci },
    getName: () => name,
    setName: (_name) => { name = _name },
    getLastname: () => lastname,
    setLastname: (_lastname) => { lastname = _lastname },
    getFacebook: () => facebook,
    setFacebook: (_facebook) => { facebook = _facebook },
    getGender: () => gender,
    setGender: (_gender) => { gender = _gender },
    getPhone: () => phone,
    setPhone: (_phone) => { phone = _phone },
    getMail: () => mail,
    setMail: (_mail) => { mail = _mail },
    getPrizes: () => prizes,
    getPublicData: getPublicData,
    addPrize: addPrize,
    deletePrize: deletePrize,
    handOverPrize: handOverPrize,
    hasWonSinceThreeMonths: hasWonSinceThreeMonths
  }
}

const findByCi = (ci) => {
  return new Promise(function (resolve, reject) {
    db.findOne('winners', { ci: ci })
      .then((result) => {
        if (result) {
          return resolve(new Winner({
            'id': result._id,
            'ci': result.ci,
            'name': result.name,
            'lastname': result.lastname,
            'facebook': result.facebook,
            'gender': result.gender,
            'phone': result.phone,
            'mail': result.mail,
            'prizes': result.prizes,
            'set_date': result.set_date,
            'update_date': result.update_date
          }));
        }
        return resolve(null);
      })
      .catch((err) => {
        return reject('ERR_DB - Unable to fetch prizes data - Users module - Returned ERROR: ' + err);
      });
  });
}

const findAll = () => {
  return new Promise(function (resolve, reject) {
    db.find('winners')
      .then((results) => {
        if (results.length) {
          return resolve(results.map((result) => {
            return new Winner({
              'id': result._id,
              'ci': result.ci,
              'name': result.name,
              'lastname': result.lastname,
              'facebook': result.facebook,
              'gender': result.gender,
              'phone': result.phone,
              'mail': result.mail,
              'prizes': result.prizes,
              'set_date': result.set_date,
              'update_date': result.update_date
            });
          }));
        }
        return resolve([]);
      })
      .catch((err) => {
        return reject("ERR_DB - Unable to fetch winner's data - Winners module - Returned ERROR: " + err);
      });
  });
}

module.exports = {
  Winner: Winner,
  findByCi: findByCi,
  findAll: findAll
}


const checkCi = (ci) => {
  if (ci.match(/^\d+$/) && ci.length >= 7 && ci.length <= 8) {
    let fixed_ci = ci;
    if (ci.length === 7)
      fixed_ci = '0' + ci;
    let coeffs = [2, 9, 8, 7, 6, 3, 4];
    let sum = 0;
    for (let i = 0; i < coeffs.length; i++) {
      let digit = parseInt(fixed_ci.slice(i, i + 1));
      let coeff = coeffs[i];
      let multiply = ((digit * coeff).toString());
      let toAdd = multiply.slice(multiply.length - 1);
      sum += parseInt(toAdd);
    }
    let verifDig = 10 - (sum % 10);
    if (verifDig === 10)
      verifDig = 0;
    if (verifDig.toString() == fixed_ci.slice(fixed_ci.length - 1))
      return true;
  }
  return false;
};
