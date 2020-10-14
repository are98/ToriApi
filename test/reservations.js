const chai = require('chai');
const chaiHttp = require('chai-http');
const { response } = require('express');
chai.use(chaiHttp);
const should = chai.should();
const server = require('../server')

const expect = chai.expect;
const apiAddress = 'http://localhost:3000';

describe('register', function(){

    before(function() {
        server.start();
    });

    after(function() {
        server.stop();
    })


    describe('create a new user', function(){
        it('Should add a new user', async function() {
            await chai.request(apiAddress)
            .post('/users')
            .send({
                id: 1234,
                email: 'email',
                firstName: 'firstName',
                lastName: 'lastName',
                password: 'password',
                address: {
                    country: 'country',
                    city: 'city',
                    postalCode: 'postalCode',
                    streetAddress: 'streetAddress'
                }
            }).then(response => {
                expect(response.status).to.equal(201)
                return chai.request(apiAddress).get('/users');
            })
            
            .catch(error => {
                expect.fail(error)
            })
            
        })
    })

})

describe('Tori operations', function(){

    before(function() {
        server.start();
    });

    after(function() {
        server.stop();
    })


   ////////////////////



    describe('get postings', function() {
        it('Should respond with an array of postings',async function(){
            await chai.request(apiAddress)
            .get('/postings')
            .then(response => {
                expect(response.status).to.equal(200);
               
                expect(response.body).to.be.a('object');
                expect(response.body).to.have.a.property('posting');
                expect(response.body.posting).to.be.a('array');

                expect(response.body.posting[0]).to.have.a.property('id');
                expect(response.body.posting[0]).to.have.a.property('title');
                expect(response.body.posting[0]).to.have.a.property('description');
                expect(response.body.posting[0]).to.have.a.property('category');
                expect(response.body.posting[0]).to.have.a.property('price');
                expect(response.body.posting[0]).to.have.a.property('dateOfPosting');
                expect(response.body.posting[0]).to.have.a.property('sellerName');

                expect(response.body.posting[0].location).to.have.a.property('country');
                expect(response.body.posting[0].location).to.have.a.property('city');

                expect(response.body.posting[0].deliveryType).to.have.a.property('shipping');
                expect(response.body.posting[0].deliveryType).to.have.a.property('pickup');
                
            }).catch(error => {
                expect().fail(error)
            })
        })
    })


    
    describe('add a new posting', function(){
        it('Should add a new posting', async function(){
            await chai.request(apiAddress)
            .post('/postings')
            .send({
                id: 1234,
                title: "example title",
                description: "exampe description",
                category: "example category",
                location:
                {
                    country: "example country",
                    city: "example city"
                },
                //images
                price: 10,
                dateOfPosting: "06-10-2020", 
                sellerName: "Firstname Lastname",
                deliveryType:
                {
                    shipping: false,
                    pickup: false
                }
            }) .then(response => {
                expect(response.status).to.equal(201);
                return chai.request(apiAddress).get('/postings');
            })
            .then(readResponse => {
                expect(readResponse.body.posting[readResponse.body.posting.length - 1].title).to.equal('example title');
                expect(readResponse.body.posting[readResponse.body.posting.length - 1].description).to.equal('exampe description');
                expect(readResponse.body.posting[readResponse.body.posting.length - 1].category).to.equal('example category');

                expect(readResponse.body.posting[readResponse.body.posting.length - 1].location.country).to.equal('example country');
                expect(readResponse.body.posting[readResponse.body.posting.length - 1].location.city).to.equal('example city');

                expect(readResponse.body.posting[readResponse.body.posting.length - 1].price).to.equal(10);
                expect(readResponse.body.posting[readResponse.body.posting.length - 1].dateOfPosting).to.equal('06-10-2020');
                expect(readResponse.body.posting[readResponse.body.posting.length - 1].sellerName).to.equal('Firstname Lastname');

                expect(readResponse.body.posting[readResponse.body.posting.length - 1].deliveryType.shipping).to.equal(false);
                expect(readResponse.body.posting[readResponse.body.posting.length - 1].deliveryType.pickup).to.equal(false);

            })
            .catch(error => {
                expect.fail(error)
            })
        })
    })

    describe('modigy posting', function() {
        it('Should modify a posting', async function() {
            await chai.request(apiAddress)
            .put('/postings/1')
            .send({city: 'Tampere'})
            .end(function(error, response) {
                response.should.have.status(200);
                expect(readResponse.body.posting.location.city).to.equal('Tampere');
            })
        })
    })


    describe('get posting by id', function() {
        it('Should respond with an array of postings',async function(){
            await chai.request(apiAddress)
            .get('/postings/1')
            .then(response => {
                expect(response.status).to.equal(200);

    
            }).catch(error => {
                expect().fail(error)
            })
        })
    })


    describe('delete posting', function() {
        it('Should delete posting by id', async function() {
            await chai.request(apiAddress)
            .delete('/postings/1')
            .end((error, response) => {
                response.should.have.status(200);
            })
        })
    })

    

})