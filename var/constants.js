module.exports = Object.freeze({
    SERVER: "http://localhost:3000",
    AUTH_USER: "09f009efe7b9ae",
    AUTH_PASS: "cd1233a2d8d6a7",
    AUTH_FROM: "oanapopescu93@gmail.com",
    SERVER_TABLES: [
        {table_id: '001', table_name: "roulette", table_type: "european"},
        {table_id: '002', table_name: "roulette", table_type: "american"},
        {table_id: '003', table_name: "roulette", table_type: "european"},
        {table_id: '004', table_name: "roulette", table_type: "american"},
        {table_id: '001', table_name: "blackjack"},
        {table_id: '002', table_name: "blackjack"},
        {table_id: '003', table_name: "blackjack"},
        {table_id: '001', table_name: "slots"},
        {table_id: '002', table_name: "slots"},
        {table_id: '003', table_name: "slots"},
        {table_id: '004', table_name: "slots"},
        {table_id: '005', table_name: "slots"},
    ],
    SERVER_MARKET: [        
        {id: "garlic", name: "garlic", value:"0.1 carrots", price:0.1, quantity: 1},
        {id: "onion", name: "onion", value:"0.2 carrots", price:0.2, quantity: 1},
        {id: "radish", name: "radish", value:"0.5 carrots", price:0.5, quantity: 1},
        {id: "carrot", name: "carrot", value:"1 carrots", price:1, quantity: 1},
        {id: "turnip", name: "turnip", value:"2 carrots", price:2, quantity: 1},
        {id: "potato", name: "potato", value:"5 carrots", price:5, quantity: 1},
        {id: "cabbage", name: "cabbage", value:"10 carrots", price:10, quantity: 1},
    ],
    SESS_USERS: [
        {id: 0, user: "oana", email: "oanapopescu93@gmail.com", pass: "oana", money: 100},
        {id: 1, user: "client01", email: "client01@gmail.com", pass: "client", money: 101},
        {id: 3, user: "client02", email: "client02@gmail.com", pass: "client", money: 102},
    ],
    NODE_ENV: "development",
    SESS_HOURS: 2,

    BITCOIN: {
        text: "bc1qf856valhr4xrwzvgtxng8rsftzyhcrvphs6ztm",
        link: "bitcoin:bc1qf856valhr4xrwzvgtxng8rsftzyhcrvphs6ztm?amount=0.0001&time=1624099991"
    },

    CONTACT: {
        email: "oanapopescu93@gmail.com",
    }
})