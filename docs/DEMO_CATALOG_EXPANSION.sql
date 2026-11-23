-- BookConnect — additional DEMO catalog, not verified school inventory.
-- Safe to run again: titles and inventory numbers are not duplicated.
WITH incoming(seq,genre_code,title_bg,title_en,author_bg,author_en) AS (
 VALUES
(1,'classic','Немили-недраги','The Unloved','Иван Вазов','Ivan Vazov'),
(2,'classic','Чичовци','Uncles','Иван Вазов','Ivan Vazov'),
(3,'classic','Железният светилник','The Iron Candlestick','Димитър Талев','Dimitar Talev'),
(4,'classic','Тютюн','Tobacco','Димитър Димов','Dimitar Dimov'),
(5,'classic','Гераците','The Geraks','Елин Пелин','Elin Pelin'),
(6,'classic','Андрешко','Andreshko','Елин Пелин','Elin Pelin'),
(7,'classic','Престъпление и наказание','Crime and Punishment','Фьодор Достоевски','Fyodor Dostoevsky'),
(8,'classic','Гордост и предразсъдъци','Pride and Prejudice','Джейн Остин','Jane Austen'),
(9,'classic','Граф Монте Кристо','The Count of Monte Cristo','Александър Дюма','Alexandre Dumas'),
(10,'classic','Моби Дик','Moby-Dick','Херман Мелвил','Herman Melville'),
(11,'classic','Дон Кихот','Don Quixote','Мигел де Сервантес','Miguel de Cervantes'),
(12,'children','Приключенията на Том Сойер','The Adventures of Tom Sawyer','Марк Твен','Mark Twain'),
(13,'children','Алиса в Страната на чудесата','Alice''s Adventures in Wonderland','Луис Карол','Lewis Carroll'),
(14,'children','Пипи Дългото чорапче','Pippi Longstocking','Астрид Линдгрен','Astrid Lindgren'),
(15,'children','Емил от Льонеберя','Emil of Lönneberga','Астрид Линдгрен','Astrid Lindgren'),
(16,'children','Мечо Пух','Winnie-the-Pooh','А. А. Милн','A. A. Milne'),
(17,'children','Ян Бибиян','Yan Bibiyan','Елин Пелин','Elin Pelin'),
(18,'children','Мери Попинз','Mary Poppins','П. Л. Травърс','P. L. Travers'),
(19,'children','Приказки','Fairy Tales','Ханс Кристиан Андерсен','Hans Christian Andersen'),
(20,'fantasy','Задругата на пръстена','The Fellowship of the Ring','Дж. Р. Р. Толкин','J. R. R. Tolkien'),
(21,'fantasy','Лъвът, вещицата и дрешникът','The Lion, the Witch and the Wardrobe','К. С. Луис','C. S. Lewis'),
(22,'fantasy','Магьосникът от Землемория','A Wizard of Earthsea','Урсула К. Ле Гуин','Ursula K. Le Guin'),
(23,'fantasy','Игра на тронове','A Game of Thrones','Джордж Р. Р. Мартин','George R. R. Martin'),
(24,'fantasy','Ерагон','Eragon','Кристофър Паолини','Christopher Paolini'),
(25,'modern','Фермата на животните','Animal Farm','Джордж Оруел','George Orwell'),
(26,'modern','Да убиеш присмехулник','To Kill a Mockingbird','Харпър Ли','Harper Lee'),
(27,'modern','Алхимикът','The Alchemist','Паулу Коелю','Paulo Coelho'),
(28,'modern','Крадецът на книги','The Book Thief','Маркус Зюсак','Markus Zusak'),
(29,'modern','Цветя за Алджърнън','Flowers for Algernon','Даниъл Кийс','Daniel Keyes'),
(30,'modern','Повелителят на мухите','Lord of the Flies','Уилям Голдинг','William Golding')
), insert_books AS (
 INSERT INTO public.books(genre_id,title_bg,title_en,author_bg,author_en,description_bg,description_en)
 SELECT g.id,i.title_bg,i.title_en,i.author_bg,i.author_en,
 'Примерно заглавие за учебния каталог BookConnect.',
 'Sample title for the BookConnect school demo catalog.'
 FROM incoming i JOIN public.genres g ON g.code=i.genre_code
 WHERE NOT EXISTS(SELECT 1 FROM public.books b WHERE b.title_bg=i.title_bg AND b.author_bg=i.author_bg)
 RETURNING id
)
SELECT count(*) AS added_books FROM insert_books;

WITH incoming(seq,genre_code,title_bg,title_en,author_bg,author_en) AS (
 VALUES
(1,'classic','Немили-недраги','The Unloved','Иван Вазов','Ivan Vazov'),
(2,'classic','Чичовци','Uncles','Иван Вазов','Ivan Vazov'),
(3,'classic','Железният светилник','The Iron Candlestick','Димитър Талев','Dimitar Talev'),
(4,'classic','Тютюн','Tobacco','Димитър Димов','Dimitar Dimov'),
(5,'classic','Гераците','The Geraks','Елин Пелин','Elin Pelin'),
(6,'classic','Андрешко','Andreshko','Елин Пелин','Elin Pelin'),
(7,'classic','Престъпление и наказание','Crime and Punishment','Фьодор Достоевски','Fyodor Dostoevsky'),
(8,'classic','Гордост и предразсъдъци','Pride and Prejudice','Джейн Остин','Jane Austen'),
(9,'classic','Граф Монте Кристо','The Count of Monte Cristo','Александър Дюма','Alexandre Dumas'),
(10,'classic','Моби Дик','Moby-Dick','Херман Мелвил','Herman Melville'),
(11,'classic','Дон Кихот','Don Quixote','Мигел де Сервантес','Miguel de Cervantes'),
(12,'children','Приключенията на Том Сойер','The Adventures of Tom Sawyer','Марк Твен','Mark Twain'),
(13,'children','Алиса в Страната на чудесата','Alice''s Adventures in Wonderland','Луис Карол','Lewis Carroll'),
(14,'children','Пипи Дългото чорапче','Pippi Longstocking','Астрид Линдгрен','Astrid Lindgren'),
(15,'children','Емил от Льонеберя','Emil of Lönneberga','Астрид Линдгрен','Astrid Lindgren'),
(16,'children','Мечо Пух','Winnie-the-Pooh','А. А. Милн','A. A. Milne'),
(17,'children','Ян Бибиян','Yan Bibiyan','Елин Пелин','Elin Pelin'),
(18,'children','Мери Попинз','Mary Poppins','П. Л. Травърс','P. L. Travers'),
(19,'children','Приказки','Fairy Tales','Ханс Кристиан Андерсен','Hans Christian Andersen'),
(20,'fantasy','Задругата на пръстена','The Fellowship of the Ring','Дж. Р. Р. Толкин','J. R. R. Tolkien'),
(21,'fantasy','Лъвът, вещицата и дрешникът','The Lion, the Witch and the Wardrobe','К. С. Луис','C. S. Lewis'),
(22,'fantasy','Магьосникът от Землемория','A Wizard of Earthsea','Урсула К. Ле Гуин','Ursula K. Le Guin'),
(23,'fantasy','Игра на тронове','A Game of Thrones','Джордж Р. Р. Мартин','George R. R. Martin'),
(24,'fantasy','Ерагон','Eragon','Кристофър Паолини','Christopher Paolini'),
(25,'modern','Фермата на животните','Animal Farm','Джордж Оруел','George Orwell'),
(26,'modern','Да убиеш присмехулник','To Kill a Mockingbird','Харпър Ли','Harper Lee'),
(27,'modern','Алхимикът','The Alchemist','Паулу Коелю','Paulo Coelho'),
(28,'modern','Крадецът на книги','The Book Thief','Маркус Зюсак','Markus Zusak'),
(29,'modern','Цветя за Алджърнън','Flowers for Algernon','Даниъл Кийс','Daniel Keyes'),
(30,'modern','Повелителят на мухите','Lord of the Flies','Уилям Голдинг','William Golding')
)
INSERT INTO public.copies(book_id,inventory_number,status)
SELECT b.id,'BC-DEMO-2026-'||lpad(i.seq::text,3,'0'),'available'
FROM incoming i JOIN public.books b ON b.title_bg=i.title_bg AND b.author_bg=i.author_bg
WHERE NOT EXISTS(SELECT 1 FROM public.copies c WHERE c.inventory_number='BC-DEMO-2026-'||lpad(i.seq::text,3,'0'));
