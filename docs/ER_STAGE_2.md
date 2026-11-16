# ER — реално създадена база за Етап 2

Този файл документира **реалните** 3 таблици, проверени в Supabase. Първоначалният проектен модел от Етап 1 остава в `ER_DIAGRAM.md`.

```mermaid
erDiagram
  GENRES ||--o{ BOOKS : category
  BOOKS ||--o{ COPIES : has
  GENRES {
    bigint id PK
    text code UK
    text name_bg
    text name_en
  }
  BOOKS {
    bigint id PK
    bigint genre_id FK
    text title_bg
    text title_en
    text author_bg
    text author_en
    text description_bg
    text description_en
    text cover_url
  }
  COPIES {
    bigint id PK
    bigint book_id FK
    text inventory_number UK
    text status
  }
```

- **PK:** първични ключове `id` в трите таблици.
- **FK:** `books.genre_id → genres.id`, `copies.book_id → books.id`.
- **UNIQUE:** `genres.code`, `copies.inventory_number`.
- **CHECK:** `copies.status` е `available`, `borrowed` или `reserved`.
- **Тестови записи при настройката:** 4 жанра, 6 книги, 11 екземпляра.
- **Достъп:** RLS включен; публично четене, но не и анонимно писане. Записът за библиотекар е ограничен чрез проверка на `auth.jwt().app_metadata.role` и RPC `add_book_with_copy` (виж `STAGE_2_MIGRATION.sql`).
- Таблиците `profiles`, `loans`, `reservations` от общия проектен план **не са реализирани** в Етап 2.
