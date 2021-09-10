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
    SLOT_PRIZE: [100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129],
    CRYPTO: [
        {type: "Bitcoin", text: "bc1quttj9jakgf44e5emd7cvmeg7t80zamj7gy2dda", link: "bitcoin:bc1quttj9jakgf44e5emd7cvmeg7t80zamj7gy2dda"},
    ],
    CONTACT: {
        address: "-",
        email: "-",
        phone: "-",
        facebook: "-"
    },
})