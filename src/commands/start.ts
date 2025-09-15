import { InlineKeyboard } from 'grammy';
import { User } from '../models/User.js';
import { MyContext } from '../types.js';

export const start = async (ctx: MyContext) => {
  if (!ctx.from) {
    return ctx.reply('User info is not available');
  }

  const { id, first_name, username } = ctx.from;

  try {
    const keyboard = new InlineKeyboard().text('Меню', 'menu');
    const existingUser = await User.findOne({ telegramId: id });

    if (existingUser) {
      return ctx.reply('Вы уже зарегистрированы!', { reply_markup: keyboard });
    }

    const newUser = new User({
      telegramId: id,
      firstName: first_name,
      username,
    });

    await newUser.save();

    return ctx.reply('Вы успешно зарегистрировались!', {
      reply_markup: keyboard,
    });
  } catch (error) {
    console.error(error);
    ctx.reply('Произошла ошибка!');
  }
};
