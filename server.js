const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const app = express()
const port = 3000
const querystring = require('querystring');
const bcrypt = require('bcrypt');
const { send } = require('process');




app.use(bodyParser.json());

//app.get('/', (req, res) => {
//  res.send('Hello World!')
//})

let apiInstance = null;



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
    dateOfPosting: '2020-09-30',
    sellerName: 'Arttu Kemppainen',
    deliveryType: {
      shipping: false,
      pickup: true
  }
}
]

let userInfo = [
  {
    id: 1,
    email: 't7kear00@students.oamk.fi',
    firstName: 'Arttu',
    lastName: 'Kemppainen',
    password: '$2y$10$BYGVYlkSmXWwnJDlNgCFs.syDx3Jg92WW.1GiRShxtEPvgpvm70ea', //12345678
    address: {
      country: 'Finland',
      city: 'Oulu',
      postalCode: '90120',
      streetAddress: 'Hallituskatu 10 A 2'
    }
  }
]


app.get('/postings', (req, res) => {

  res.json({posting});
  //res.render('posting', {querystring: req.query.})
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
  const hashedPassword = bcrypt.hash(req.body.password, 10)
    const newUser = {
      id: uuidv4(),
      
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hashedPassword,
      address:
      {
        country: req.body.address.country,
        city: req.body.address.city,
        postalCode: req.body.address.postalCode,
        streetAddress: req.body.address.streetAddress
      }
    }

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
  }
  if('country' in req.body.address == false ) {
    res.status(400);
    res.json({status: "Give a country"})
    return;
  }
  if('city' in req.body.address == false ) {
    res.status(400);
    res.json({status: "Give a city"})
    return;
  }
  if('postalCode' in req.body.address == false ) {
    res.status(400);
    res.json({status: "Give a postal code"})
    return;
  }
  if('streetAddress' in req.body.address == false ) {
    res.status(400);
    res.json({status: "Give a street address"})
    return;
  }
  


  userInfo.push(newUser);
  res.sendStatus(201);
  
  
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



app.get('/apiKeyGenerate/:userId', (req, res) => {
  const userId = req.params.id;
  let apiKey = users.getApiKey(userId);
  if(apiKey === false) // user not found
  {
    res.sendStatus(400);
  }
  if(apiKey === null)
  {
    apiKey = userInfo.resetApiKey(userId)
  }
  res.json({
    apiKey
  })
});

function checkForApiKey(req, res, next)
{
  const receivedKey = req.get('X-Api-Key');
  if(receivedKey === undefined) {
    return res.status(400).json({ reason: "X-Api-Key header missing"});
  }

  const user = userInfo.getUserWithApiKey(receivedKey);
  if(user === undefined) {
    return res.status(400).json({ reason: "Incorrect api key"});
  }

  req.user = user;

  // pass the control to the next handler in line
  next();
}

app.get('/apiKeyProtectedResource', checkForApiKey, (req, res) => {
  res.json({
    yourResource: "foo"
  })
});


const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;

passport.use(new BasicStrategy(
  function(username, password, done) {

    const user = userInfo.getUserByName(username);
    if(user == undefined) {
      // Username not found
      console.log("HTTP Basic username not found");
      return done(null, false, { message: "HTTP Basic username not found" });
    }

    // Verify password match
    if(bcrypt.compareSync(password, userInfo.password) == false) {
      // Password does not match
      console.log("HTTP Basic password not matching username");
      return done(null, false, { message: "HTTP Basic password not found" });
    }
    return done(null, user);
  }
));

app.get('/httpBasicProtectedResource',
        passport.authenticate('basic', { session: false }),
        (req, res) => {
  res.json({
    yourProtectedResource: "profit"
  });
});


const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt;
const jwtSecretKey = require('./jwt-key.json');


let options = {}

options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

options.secretOrKey = jwtSecretKey.secret;

passport.use(new JwtStrategy(options, function(jwt_payload, done) {
  console.log("Processing JWT payload for token content:");
  console.log(jwt_payload);



  const now = Date.now() / 1000;
  if(jwt_payload.exp > now) {
    done(null, jwt_payload.user);
  }
  else {// expired
    done(null, false);
  }
}));


app.get(
  '/jwtProtectedResource',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    console.log("jwt");
    res.json(
      {
        status: "Successfully accessed protected resource with JWT",
        user: req.userInfo
      }
    );
  }
);

app.get(
  '/loginForJWT',
  passport.authenticate('basic', { session: false }),
  (req, res) => {
    const body = {
      id: req.userInfo.id,
      email : req.userInfo.email
    };

    const payload = {
      user : body
    };

    const options = {
      expiresIn: '1d'
    }

    const token = jwt.sign(payload, jwtSecretKey.secret, options);

    return res.json({ token });
})

app.post('/postings',
  passport.authenticate('jwt', {session: false}),
  (req, res) => {
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
    //res.json(posting.get)
  })


exports.start = () => {
    apiInstance = app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    })
}

exports.stop = () => {
    apiInstance.close();
}