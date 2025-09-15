import { CallbackQueryContext, InlineKeyboard } from 'grammy';
import { MyContext } from '../types.js';

export const productsCommand = (ctx: CallbackQueryContext<MyContext>) => {
  ctx.answerCallbackQuery();

  ctx.callbackQuery.message?.editText('Вы в разделе с товарами', {
    reply_markup: new InlineKeyboard().text('Назад', 'backToMenu'),
  });
};
