import { User } from '../models/User.js';
import { CallbackQueryContext, InlineKeyboard } from 'grammy';
import { MyContext } from '../types.js';

export const profileCommand = async (ctx: CallbackQueryContext<MyContext>) => {
  ctx.answerCallbackQuery();

  const user = await User.findOne({ telegramId: ctx.from?.id });

  if (!user) {
    return ctx.callbackQuery.message?.editText(
      'Для доступа к профилю необходимо зарегистрироваться\nИспользуй команду /start'
    );
  }

  const regData = user.createdAt.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  ctx.callbackQuery.message?.editText(
    `Здравствуйте, ${ctx.from?.first_name}!
    \nДата регистрации: ${regData}
    \nУ Вас еще нет заказов`,
    {
      reply_markup: new InlineKeyboard().text('Назад', 'backToMenu'),
    }
  );
};
