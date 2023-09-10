const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ],
    }
});

const wordList = ['regalo', 'regalado', 'regalada'];


const sendChatMessage = async (message) => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: `${message}` }]
        })
    });
    return response.json();
};

client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready to start!');
});

client.on('auth_failure', () => {
    console.log('Client is auth_failure!');
});

client.on('disconnected', () => {
    console.log('Client is disconnected!');
});

client.on('message', msg => {
    const message = msg.body.toLowerCase();
    console.log(msg.body);
    console.log(message);

    if (message === 'ping') {
        console.log('dijo ping!', msg.body)
        msg.reply('pong');
    }
    const ignoreMsg = msg.from == 'status@broadcast' || !!msg.id.participant;

    console.log('ignoreMsg? ', ignoreMsg);
    console.log(msg.from + ' says: ' + msg.body);

    /* if (msg.body && !ignoreMsg) {
        console.log('the next message is going on: ', msg.body)
        sendChatMessage(msg.body)
            .then((response) => {
                console.log(response);
                console.log(response.choices[0].message.content);
                msg.reply(response.choices[0].message.content);
            });
    } */
});

client.initialize();