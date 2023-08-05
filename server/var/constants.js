module.exports = Object.freeze({
    AUTH_USER: "09f009efe7b9ae",
    AUTH_PASS: "cd1233a2d8d6a7",
    AUTH_FROM: "oanapopescu93@gmail.com",

    SECRET_KEY: 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3',
    SECRET_KEY_JWT: "hello friend",

    PAYPAL_MODE: 'sandbox', //sandbox or live
    PAYPAL_CLIENT_ID: 'AYbRvJeQImerka0dvE00pNHjCenRb72jenr5ERICIQsHcauLYMnP-prfnm95bVmq90N7q72UB7kcj_KO',
    PAYPAL_CLIENT_SECRET: 'EL2r6gQpAcFkBLb2DC8eFsarnDGMu6cN2D1kL33dRvP4Yqya3UaQ2rBhKGC7l_N08f6EDaN_vAbFGnBf',

    DATABASE: [
        {
            host: 'db4free.net', 
            user: 'oana_popescu_93', 
            password: 'Qazwsxedc123rfv123!',
            database: 'bunnybetdatabase',
            sql: "SELECT * FROM casino_users",
            // multipleStatements: true 
        },
    ],
})