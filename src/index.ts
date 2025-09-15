import 'dotenv/config';
import { Bot } from 'grammy';
import { GrammyError, HttpError } from 'grammy';
import * as mongoose from 'mongoose';
import { User } from './models/User.js';

const BOT_API_KEY = process.env.BOT_API_KEY;

if (!BOT_API_KEY) {
  throw new Error('BOT_API_KEY is not defined in environment variables');
}

const bot = new Bot(BOT_API_KEY);

bot.command('start', async (ctx) => {
  if (!ctx.from) {
    return ctx.reply('User info is not available');
  }

  const { id, first_name, username } = ctx.from;

  try {
    const existingUser = await User.findOne({ telegramId: id });

    if (existingUser) {
      return ctx.reply('Вы уже зарегистрированы!');
    }

    const newUser = new User({
      telegramId: id,
      firstName: first_name,
      username,
    });

    await newUser.save();

    return ctx.reply('Вы успешно зарегистрировались!');
  } catch (error) {
    console.error(error);
    ctx.reply('Произошла ошибка!');
  }
});

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
