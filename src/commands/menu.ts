import { CallbackQueryContext, InlineKeyboard } from 'grammy';
import { MyContext } from '../types.js';

export const menuCommand = (ctx: CallbackQueryContext<MyContext>) => {
  ctx.answerCallbackQuery();

  ctx.callbackQuery.message?.editText(
    'Вы в главном меню магазина.\nОтсюда Вы можете попасть в раздел с товарами и в свой профиль. Для перехода нажмите кнопку ниже:',
    {
      reply_markup: new InlineKeyboard()
        .text('Товары', 'products')
        .text('Профиль', 'profile'),
    }
  );
};
