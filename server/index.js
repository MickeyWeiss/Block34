const { client, createTables, createCustomer, createRestaurant, fetchCustomers, fetchRestaurants, createReservation, fetchReservation, destroyReservation } = require('./db.js');
const express = require('express');
const app = express()
app.use(express.json())
const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`listening on port ${port}`);
})

app.get('/api/customers', async(req, res, next) => {
    try {
        res.send(await fetchCustomers())
    }catch (error) {
        next(error)
    }
})

app.get('/api/restaurants', async (req, res, next) => {
    try {
        res.send(await fetchRestaurants())
    }catch (error){
        next(error)
    }
})

app.get('/api/reservations', async (req, res,nest) => {
    try {
        res.send(await fetchReservation())
    }catch (error){
        next(error)
    }
})

app.delete('/api/customers/:customer_id/reservations/:id', async (req, res, next) => {
    try {
        await destroyReservation({customer_id: req.params.customer_id, id: req.params.id})
        res.sendStatus(204)
    }catch(error){
        next(error)
    }
})

app.post('/api/customers/:customer_id/reservations', async (req, res, next) => {
    try {
        res.status.send(await createReservation({customer_id: req.params.customer_id, restaurant_id: req.body.restaurant_id, date: req.body.date, party_count: req.body.party_count }))
    }catch(error){
        next(error)
    }
})

const init = async () => {
    console.log('connecting to database');
    await client.connect();
    console.log('connected to database');
    await createTables();
    const [mickey, rebecca, elijah, noodles, chipotle, modmarket] = await Promise.all([
        createCustomer({name: 'mickey'}),
        createCustomer({name: 'rebecca'}),
        createCustomer({name: 'elijah'}),
        createRestaurant({name: 'noodles'}),
        createRestaurant({name: 'chipotle'}),
        createRestaurant({name: 'modmarket'}),
    ])
    console.log('created tables');
    console.log(await fetchCustomers());
    console.log(await fetchRestaurants());

const [reservation1, reservation2, reservation3] = await Promise.all([
    createReservation({
        date: '8/15/2024',
        party_count: '1',
        restaurant_id: noodles.id,
        customer_id: mickey.id
    }),
    createReservation({
        date: '8/16/2024',
        party_count: '2',
        restaurant_id: chipotle.id,
        customer_id: rebecca.id,
    }),
    createReservation({
        date: '8/17/2024',
        party_count: '3',
        restaurant_id: modmarket.id,
        customer_id: elijah.id,
    })
])
  console.log(await fetchReservation())
}

init();