import 'dotenv/config';
import { Bot, GrammyError, HttpError } from 'grammy';
import * as mongoose from 'mongoose';
import { hydrate } from '@grammyjs/hydrate';
import { MyContext } from './types.js';
import {
  backCommand,
  menuCommand,
  productsCommand,
  profileCommand,
  startCommand,
} from './commands/index.js';

const BOT_API_KEY = process.env.BOT_API_KEY;

if (!BOT_API_KEY) {
  throw new Error('BOT_API_KEY is not defined in environment variables');
}

const bot = new Bot<MyContext>(BOT_API_KEY);

bot.use(hydrate());

bot.command('start', startCommand);
bot.callbackQuery('menu', menuCommand);

bot.callbackQuery('products', productsCommand);

bot.callbackQuery('profile', profileCommand);

bot.callbackQuery('backToMenu', backCommand);

// Ответ на любое сообщение
bot.on('message:text', (ctx) => {
  ctx.reply(ctx.message.text);
});

// Обработка ошибок согласно документации
bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;

  if (e instanceof GrammyError) {
    console.error('Error in request:', e.description);
  } else if (e instanceof HttpError) {
    console.error('Could not contact Telegram:', e);
  } else {
    console.error('Unknown error:', e);
  }
});

// Функция запуска бота
async function startBot() {
  const MONGODB_URL = process.env.MONGODB_URL;

  if (!MONGODB_URL) {
    throw new Error('MONGODB_URL is not defined in environment variables');
  }

  try {
    await mongoose.connect(MONGODB_URL);
    bot.start();
    console.log('MongoDB connected and bot started');
  } catch (error) {
    console.error('Error in startBot:', error);
  }
}

startBot();
