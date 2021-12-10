module.exports = Object.freeze({
    SERVER: "http://localhost:3000",
    AUTH_USER: "09f009efe7b9ae",
    AUTH_PASS: "cd1233a2d8d6a7",
    AUTH_FROM: "oanapopescu93@gmail.com",

    DATABASE: [
        {
            host: 'sql11.freemysqlhosting.net', 
            user: 'sql11457323', 
            password: 'cVmj7G5WeV',
            database: 'sql11457323',
            sql: "SELECT * FROM casino_users",
        },
    ],

    SERVER_TABLES: [
        {table_id: '001', table_name: "roulette", table_type: "european"},
        {table_id: '002', table_name: "roulette", table_type: "american"},
        {table_id: '003', table_name: "roulette", table_type: "european"},
        {table_id: '004', table_name: "roulette", table_type: "american"},
        {table_id: '001', table_name: "blackjack"},
        {table_id: '002', table_name: "blackjack"},
        {table_id: '003', table_name: "blackjack"},
        {table_id: '001', table_name: "slots", table_type: "type1"},
        {table_id: '002', table_name: "slots", table_type: "type2"},
        {table_id: '003', table_name: "slots", table_type: "type1"},
        {table_id: '004', table_name: "slots", table_type: "type2"},
        {table_id: '005', table_name: "slots", table_type: "type1"},
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
    SLOT_PRIZE: [1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3],
    SERVER_RABBITS: [
        {id: 1, name: "Rabbit01", color: "red"},
        {id: 2, name: "Rabbit02", color: "orange"},
        {id: 3, name: "Rabbit03", color: "yellow"},
        {id: 4, name: "Rabbit04", color: "green"},
        {id: 5, name: "Rabbit05", color: "blue"},
        {id: 6, name: "Rabbit06", color: "purple"},
    ],
    
    CRYPTO: [
        {type: "Bitcoin", text: "-", link: "bitcoin:-"},
    ],

    CONTACT: {
        address: "-",
        email: "-",
        phone: "-",
        facebook: "-"
    },

    GOOGLE_CLIENT_ID: '287917990003-9l5albqoaoo06tsvknmftludhtg08hha.apps.googleusercontent.com',
    GOOGLE_CLIENT_SECRET: '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',
})