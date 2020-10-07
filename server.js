const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const app = express()
const port = 3000



app.use(bodyParser.json());
//node index.js komennolla serveri pyörimään


//app.get('/', (req, res) => {
//  res.send('Hello World!')
//})

let apiInstance = null;

let userInfo = [
  {
    id: 1,
    email: 't7kear00@students.oamk.fi',
    firstName: 'Arttu',
    lastName: 'Kemppainen',
    password: '12345678',
    address: {
      country: 'Finland',
      city: 'Oulu',
      postalCode: '90120',
      streetAddress: 'Hallituskatu 10 A 2'
    }
  }
]

let posting = [
  {
    id: 1,
    title: 'Ikea Limon Table',
    description: 'Ikea Limon table in good condition',
    category: 'Tables',
    location: {
      country: 'Finland',
      city: 'Oulu'
    },
  //images: null,
    price: 39.90,
    dateOfPosting: '2020-09-30 11:43',
    sellerName: 'Arttu Kemppainen',
    deliveryType: {
      shipping: false,
      pickup: true
  }
}
]


//tässä täytyy etsiä postauksia query parametreilla
app.get('/postings', (req, res) => {

  /*var category = req.query.category;
  var location = req.query.location;
  var dateOfPosting = req.query.dateOfPosting;

  var category = require('category');
  var category_parts = category.parse(request.category, true);
  var category_query = category_parts.query;*/



  res.json({posting})
})
  

app.get('/postings/:id', (req, res) => {
  const result = posting.find(t => t.id == req.params.id);
  if (result !== undefined)
  {
      res.json(result);
  } else {
      res.sendStatus(404);
  }
})


//login
//app.post('/login')

app.post('/login', (req, res) => {
  userInfo.find({ email: req.body.email}).exec()
  .then(userInfo => {
    if (userInfo.length < 1) {
        return res.status(401).json({
          message: 'Auth failed'
        })
    }

    if (userInfo.length < 1) {
      return res.status(401).json({
        message: 'Auth failed'
      })
  }
  })
  .catch(err => {
    res.status(500).json({
      error: err
    })
  })
})

//register
app.post('/users', (req, res) => {
  const newUser = {
    id: uuidv4(),
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password, //salasana pitää muotoilla kryptiseen muotoon
    location:
    {
      country: req.body.location.country,
      city: req.body.location.city,
      postalCode: req.body.location.postalCode,
      streetAddress: req.body.location.streetAddress
    }
  }

  /*
  if('email' in req.body == false ) {
    res.status(400);
    res.json({status: "Give a email"})
    return;
  }

  if('password' in req.body == false ) {
    res.status(400);
    res.json({status: "Give a password"})
    return;
  }

  if('firstName' in req.body == false ) {
    res.status(400);
    res.json({status: "Give a first name"})
    return;
  }
  if('lastName' in req.body == false ) {
    res.status(400);
    res.json({status: "Give a last name"})
    return;
  }*/
  


  userInfo.push(newUser);
  res.sendStatus(201);
  //console.log(req.body);
  //userInfo.push(newUser);
  
})

app.post('/postings', (req, res) => {
  const newPosting = {
    id: uuidv4(),
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    location:
    {
      country: req.body.location.country,
      city: req.body.location.city
    },
    //images
    price: req.body.price,
    dateOfPosting: req.body.dateOfPosting,
    sellerName: req.body.sellerName,
    deliveryType:
    {
      shipping: req.body.deliveryType.shipping,
      pickup: req.body.deliveryType.pickup
    }
  }
  posting.push(newPosting);
  res.sendStatus(201);
})

app.delete('/postings/:id', (req, res) => {
  const result = posting.findIndex(t => t.id == req.params.id);
  if (result != -1) {
    posting.splice(result, 1);
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
})

app.put('/postings/:id', (req, res) => {
  const result = posting.find(t => t.id == req.params.id);
  if(result !== undefined)
  {
    for (const key in req.body) {
      result[key] = req.body[key];
    }
    res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  

})


/*app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})*/

exports.start = () => {
    apiInstance = app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    })
}

exports.stop = () => {
    apiInstance.close();
}