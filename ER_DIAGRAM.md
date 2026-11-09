# BookConnect — ER диаграма

```mermaid
erDiagram
    PROFILES ||--o{ LOANS : borrows
    PROFILES ||--o{ RESERVATIONS : makes
    GENRES ||--o{ BOOKS : categorizes
    BOOKS ||--o{ COPIES : has
    BOOKS ||--o{ RESERVATIONS : receives
    COPIES ||--o{ LOANS : appears_in

    PROFILES {
        uuid id PK
        text full_name
        text role
        timestamp created_at
    }
    GENRES {
        bigint id PK
        text name
    }
    BOOKS {
        bigint id PK
        bigint genre_id FK
        text title
        text author
        text isbn
        text description
    }
    COPIES {
        bigint id PK
        bigint book_id FK
        text inventory_number
        text condition
    }
    LOANS {
        bigint id PK
        uuid profile_id FK
        bigint copy_id FK
        timestamp borrowed_at
        timestamp due_at
        timestamp returned_at
    }
    RESERVATIONS {
        bigint id PK
        uuid profile_id FK
        bigint book_id FK
        timestamp created_at
        text status
    }
```

## Връзки

- Един жанр има много книги; всяка книга има един жанр.
- Една книга има много физически екземпляри.
- Един потребител може да има много заемания и резервации.
- Един екземпляр може да има много заемания във времето, но само едно активно заемане.
- Една книга може да има много резервации.

## Правила

- `profiles.id` съответства на потребителя в Supabase Auth.
- `role` е `student`, `teacher` или `librarian`.
- `returned_at = NULL` означава активно заемане.
- При реализацията ще се добави уникален частичен индекс върху `loans(copy_id)` за редовете с `returned_at IS NULL`, за да се предотврати двойно заемане.
- За достъпа ще се използват Supabase RLS политики.

*Това е начална схема, не доказателство за вече създадена база в Supabase.*
