# Supabase — експорт на структурата на Етап 2

**Източник:** реалния проект BookConnect в Supabase, schema `public`  
**Проверено:** 16.11.2026 чрез заявки към `information_schema.columns` и Supabase Table API.

Този експорт показва структурата на трите реално съществуващи таблици. **Не съдържа пароли, API ключове или лични данни.**

## genres — 4 тестови записа

| Колона | Тип | NULL | Допълнително |
|---|---|---|---|
| id | bigint | NO | PRIMARY KEY, identity |
| name_bg | text | NO | Наименование на български |
| name_en | text | NO | Наименование на английски |
| code | text | NO | UNIQUE |

## books — 6 тестови записа

| Колона | Тип | NULL | Допълнително |
|---|---|---|---|
| id | bigint | NO | PRIMARY KEY, identity |
| genre_id | bigint | NO | FOREIGN KEY към genres.id |
| title_bg | text | NO | Българско заглавие |
| title_en | text | NO | Английско заглавие |
| author_bg | text | NO | Българско име на автор |
| author_en | text | NO | Английско име на автор |
| description_bg | text | YES | Описание на български |
| description_en | text | YES | Описание на английски |
| cover_url | text | YES | URL на корицата |

## copies — 11 тестови записа

| Колона | Тип | NULL | Допълнително |
|---|---|---|---|
| id | bigint | NO | PRIMARY KEY, identity |
| book_id | bigint | NO | FOREIGN KEY към books.id |
| inventory_number | text | NO | UNIQUE |
| status | text | NO | DEFAULT 'available'; CHECK available / borrowed / reserved |

## Връзки и сигурност

- `genres.id` → `books.genre_id` — един жанр може да има много книги.
- `books.id` → `copies.book_id` — една книга може да има много екземпляри.
- RLS: включен за трите таблици.
- Публично четене на каталога, но без незащитен анонимен INSERT/UPDATE/DELETE.
- Допълнителна функция за добавяне на книга и екземпляр: `add_book_with_copy`, с достъп само за одобрен библиотекар.
- Вижте `schema.sql` за първоначалната структура и тестовите записи, `docs/STAGE_2_MIGRATION.sql` за защитения запис и `docs/ER_STAGE_2.md` за диаграмата.

## Как преподавателят може да провери

1. Отворете Supabase Table Editor в проекта BookConnect (достъп предоставя собственикът на проекта).
2. Разгледайте таблиците `genres`, `books`, `copies` и техните колони.
3. Сравнете схемата с този експорт и `schema.sql`.
4. Без нужда от администраторски достъп до Supabase можете да видите публичните данни на `https://boris2010-d.github.io/BookConnect/librarian.html`.

Това е текстов експорт на структурата, а не екранна снимка на административния панел.
