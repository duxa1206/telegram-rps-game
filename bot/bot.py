import asyncio
import logging
import os
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import WebAppInfo
from dotenv import load_dotenv

# Загружаем переменные окружения
load_dotenv()

# Токен из .env файла
BOT_TOKEN = os.getenv("BOT_TOKEN")

# URL веб-приложения на GitHub Pages
WEBAPP_URL = "https://duxa1206.github.io/telegram-rps-game/"

if not BOT_TOKEN:
    raise ValueError("Не найден BOT_TOKEN в .env файле!")

logging.basicConfig(level=logging.INFO)

dp = Dispatcher()


@dp.message(Command("start"))
async def cmd_start(message: types.Message):
    """Обработчик команды /start"""
    kb = [
        [types.KeyboardButton(text="🎮 Играть!", web_app=WebAppInfo(url=WEBAPP_URL))]
    ]
    keyboard = types.ReplyKeyboardMarkup(
        keyboard=kb,
        resize_keyboard=True
    )
    
    await message.answer(
        "👋 Привет! Добро пожаловать в игру «Камень, Ножницы, Бумага»!\n\n"
        "Нажми кнопку ниже, чтобы начать играть:",
        reply_markup=keyboard
    )


@dp.message(Command("help"))
async def cmd_help(message: types.Message):
    """Обработчик команды /help"""
    await message.answer(
        "🎮 **Как играть:**\n\n"
        "1. Нажми кнопку «Играть!»\n"
        "2. Выбери камень, ножницы или бумагу\n"
        "3. Попробуй обыграть бота!\n\n"
        "Правила:\n"
        "🪨 Камень бьёт ножницы\n"
        "✂️ Ножницы бьют бумагу\n"
        "📄 Бумага бьёт камень"
    )


async def main():
    bot = Bot(token=BOT_TOKEN)
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
