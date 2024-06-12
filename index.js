const {default: makeWASocket, makeInMemoryStore,   useMultiFileAuthState,
    DisconnectReason,} = require("@whiskeysockets/baileys");
const {Boom} = require('@hapi/boom');
const pino = require("pino");
const moment = require("moment-timezone")
require("./config")



const store = makeInMemoryStore({
    logger: pino().child({ level: "silent", stream: "store" }),
  });



  async function connectToWhatsapp() {
    const { state, saveCreds } = await useMultiFileAuthState('./SESSION')
    const botWa = makeWASocket({
        logger: pino({ level: "silent" }),
        printQRInTerminal: true,
        browser: ["Project01205", "Safari", "3.O"],
        auth: state,
    })
    store.bind(botWa.ev);

    botWa.ev.on('presence.update', (statusUpadate) => {
        try {
            let id = statusUpadate.id
            let splitId = id.split('@')
            const status = statusUpadate.presences[id].lastKnownPresence;
            const checkNumber01 = global.number01;
            const checkNumber02 = global.number02;
            const checkNumber03 = global.number03;
            const testNumber = global.testNumber;
            const senderId = global.msgSendId;
            // const datetime = moment().tz("America/Los_Angeles").format('YYYY-MM-DD HH:mm:ss');

          if (id === checkNumber01){
            if (status === 'available') {
                const sendMessage = `Target is Online Now!\nTime - ${datetime} \nInfo - ${splitId[0] }`
                botWa.sendMessage(senderId, {text:sendMessage})
            }
            if (status === 'composing') {
                const sendMessage = `Target is typing Now!\nInfo - ${splitId[0]}`
                botWa.sendMessage(senderId, {text:sendMessage})
            }
          }

          if (id === checkNumber02){
            if (status === 'available') {
                const sendMessage = `Target is Online Now!\nInfo - ${splitId[0]}`
                botWa.sendMessage(senderId, {text:sendMessage})
            }
            if (status === 'composing') {
                const sendMessage = `Target is typing Now!\nInfo - ${splitId[0]}`
                botWa.sendMessage(senderId, {text:sendMessage})
            }
          }

          if (id === checkNumber03){
            if (status === 'available') {
                const sendMessage = `Target is Online Now!\nInfo - ${splitId[0]}`
                botWa.sendMessage(senderId, {text:sendMessage})
            }
            if (status === 'composing') {
                const sendMessage = `Target is typing Now!\nInfo - ${splitId[0]}`
                botWa.sendMessage(senderId, {text:sendMessage})
            }
          }

          if (id === testNumber){
            if (status === 'available') {
                const sendMessage = `Test Message.....!\nTarget is Online Now!\nInfo - ${splitId[0]}`
                botWa.sendMessage(senderId, {text:sendMessage})
            }
            if (status === 'composing') {
                const sendMessage = `Test message.....~\nTarget is typing Now...!\nInfo - ${splitId[0]}`
                botWa.sendMessage(senderId, {text:sendMessage})
            }
          }
        }catch(err){
            console.log(err)
            botWa.sendMessage(senderId, {text:err})
        }
    })



    //Connection Brandwidth Updates
    botWa.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === "close") {
          let reason = lastDisconnect.error
            ? lastDisconnect?.error?.output.statusCode
            : 0;
          if (reason === DisconnectReason.badSession) {
            console.log(`Bad Session File, Please Delete Session and Scan Again`);
            process.exit();
          } else if (reason === DisconnectReason.connectionClosed) {
            console.log("Connection closed, reconnecting....");
            connectToWhatsapp();
          } else if (reason === DisconnectReason.connectionLost) {
            console.log("Connection Lost from Server, reconnecting...");
            connectToWhatsapp();
          } else if (reason === DisconnectReason.connectionReplaced) {
            console.log(
              "Connection Replaced, Another New Session Opened, Please Close Current Session First"
            );
            process.exit();
          } else if (reason === DisconnectReason.loggedOut) {
            console.log(`Device Logged Out, Please Delete Session and Scan Again.`);
            process.exit();
          } else if (reason === DisconnectReason.restartRequired) {
            console.log("Restart Required, Restarting...");
            connectToWhatsapp();
          } else if (reason === DisconnectReason.timedOut) {
            console.log("Connection TimedOut, Reconnecting...");
            connectToWhatsapp();
          } else {
            console.log(`Unknown DisconnectReason: ${reason}|${connection}`);
          }
        }
        console.log('Connected...', update)
      });
    
     botWa.ev.on("creds.update", saveCreds);
  }

  connectToWhatsapp();