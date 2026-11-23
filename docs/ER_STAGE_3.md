# ER диаграма — Етап 3

Новата таблица `reservations` свързва влезлия ученик с книга и конкретен физически екземпляр. Схемите от Етап 1 и 2 не са променяни; това е надграждане.

```mermaid
erDiagram
  AUTH_USERS ||--o{ RESERVATIONS : creates
  GENRES ||--o{ BOOKS : categorizes
  BOOKS ||--o{ COPIES : has
  BOOKS ||--o{ RESERVATIONS : requested
  COPIES ||--o{ RESERVATIONS : allocated

  AUTH_USERS {
    uuid id PK
  }
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
  }
  COPIES {
    bigint id PK
    bigint book_id FK
    text inventory_number UK
    text status
  }
  RESERVATIONS {
    bigint id PK
    uuid user_id FK
    bigint book_id FK
    bigint copy_id FK
    text status
    timestamptz created_at
    timestamptz cancelled_at
  }
```

`AUTH_USERS` обозначава Supabase Auth таблицата `auth.users` и не се създава повторно. Потребител вижда само своите резервации (RLS). Уникални частични индекси ограничават една активна резервация за физически екземпляр и една активна резервация на книга за един потребител. Историята се пази чрез `status=cancelled`, вместо `DELETE`.

**SQL:** `docs/STAGE_3_MIGRATION.sql`  
**Алгоритъм:** `public.reserve_book` и `public.cancel_my_reservation`.
