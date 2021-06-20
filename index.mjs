import dotenv from 'dotenv'
dotenv.config({path:'/home/squadpolinema/otomatis-insta/.env.local'})
import { IgApiClient } from 'instagram-private-api';
import  get  from 'request-promise'; // request is already declared as a dependency of the library
import TelegramBot from 'node-telegram-bot-api';
import fs from 'fs';
(async () => {
  try{
    const ig = new IgApiClient();
    const clamp = (value, min, max) => Math.max(Math.min(value, max), min);
    async function generateUsertagFromName(name, x, y)  {
      // constrain x and y to 0..1 (0 and 1 are not supported)
      x = clamp(x, 0.0001, 0.9999);
      y = clamp(y, 0.0001, 0.9999);
      // get the user_id (pk) for the name
      const { pk } = await ig.user.searchExact(name);
      return {
        user_id: pk,
        position: [x, y],
      };
    }
    ig.state.generateDevice(process.env.USERNAME);
    ig.state.proxyUrl = process.env.IG_PROXY;
	  const saveSession = async (data) => {
fs.writeFileSync("/home/squadpolinema/otomatis-insta/igSessionStore.json", JSON.stringify(data), "utf-8");
};
	  const loadSession = async () => {
  const sessionFile = fs.readFileSync("/home/squadpolinema/otomatis-insta/igSessionStore.json", "utf-8");
  
  await ig.state.deserialize(sessionFile);
  
  ig.request.end$.subscribe(async () => {
    const serialized = await ig.state.serialize();
    delete serialized.constants;
    await saveSession(serialized);
  });
  const pk = ig.state.cookieUserId;
  return pk;
};
const newLogin = async () => {
  
  
  const auth = await ig.account.login(process.env.USERNAME, process.env.PASSWORD);

  ig.request.end$.subscribe(async () => {
	  
    const serialized = await ig.state.serialize();
    delete serialized.constants;
    await saveSession(serialized);
  });
  return auth.pk;
};
	  const loginFlow = async () => {
	
  const igSession = fs.existsSync("/home/squadpolinema/otomatis-insta/igSessionStore.json");
  if (igSession) {
    const auth = await loadSession();
    return auth;
  } else {
	  
    const auth = await newLogin();
    return auth;
  }
};
const auth = await loginFlow();
       // getting random square image from internet as a Buffer
    const imageBuffer = await get({
      url: 'https://source.unsplash.com/10x10/?nature', // random picture with 800x800 size
      encoding: null, // this is required, only this way a Buffer is returned
    });
  
    const publishResult = await ig.publish.photo({
      file: imageBuffer, // image buffer, you also can specify image from your disk using fs
      usertags: {
        in: [
          // tag the user 'instagram' @ (0.5 | 0.5)
          await generateUsertagFromName(process.env.USERNAME1, 0.5, 0.5),
          await generateUsertagFromName(process.env.USERNAME2, 2, 2),
        ],
      },
    });
  
    console.log(publishResult.status); // publishResult.status should be "ok"
  }catch(e){
console.log(e.message)


// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TOKEN_TELEGRAM;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: false });

bot.sendMessage(process.env.TELEGRAM_USER, e.message);
  }

})();
