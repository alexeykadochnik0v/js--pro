import express from 'express';
import { errorHandler } from './middleware/errorHandler.js';
import tasksRouter from './routes/tasks.js';

const app = express(); // Factory для серверов
const PORT = process.env.PORT || 3000;

// app.use - это регистрация миддлеверки
// Когда передаем мы используем string + content-type application/json
// req.body - будет не строка, а объект
app.use(express.json());

app.use('/api/tasks', tasksRouter);
app.use(errorHandler);

// Вешаем сервер слушать порт
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Controller -> Service -> Repository
// Controller - этот
// слой отвечает за обработку HTTP запроса и формировани ответа HTTP
// Сделать маппинг между HTTP слоев в бизнес слой, делаем валидацию,
// подготавливаем ответ
// Service - слой бизнес логики. Может взаимодействовать с другими сервисами
// микросервисами, базой данных и т.д.
// Reposotiry - Слой работы с Базой данных, надо сделать маппинг с интерфейсов
// бизнес логики в интерфейсы БД. Из объекта сделать SQL запрос
// Даже с ORM сложные запросы. Транзакцию и т.д.

// req.queryString - передаем опции, а уже в функцию передаем объект

// UI
