const express = require('express');
const router = express.Router();
const HmCase = require('../../models/HmCase');

router.get('/', (req, res) => {

  var data = []

  function Client(date, contact) {
    this.date = date
    this.contact = contact
  }

  clients = new Array();

  for (i = 0; i < 4; i++) {
    clients.push(new Client("2018-08-0" + i, i))
  }

  for (i = 0; i < clients.length; i++) {
    var dict = {}
    dict['Date'] = clients[i].date
    dict['Contact'] = clients[i].contact
    data[i] = dict
  }

  console.log(data)

  // res.json(data);

  const x = {
    images: [
      { name: 'a', id: 1 },
      { name: 'a', id: 2 }
    ],
    message: 'User is successfully created verify link has been send to email address',
  };
  res.json(x);

  // let clients = [{
  //   date: {
  //     image: {
  //       id: 1,
  //       name: '123'
  //     },
  //     image: {
  //       id: 1,
  //       name: '123'
  //     }
  //   }, contact: "", otherstuff: ""
  // }, { date: "", contact: "", otherstuff: "" }]
  // let clientsMapped = clients.map(client => ({ Date: client.date, Contact: client.contact }))
  // let yourJson = JSON.stringify(clientsMapped);
  // console.log(yourJson);


})
module.exports = router
