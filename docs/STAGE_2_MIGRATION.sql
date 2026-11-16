-- Stage 2 migration already applied to the BookConnect Supabase project.
-- This file is a record of the changes, not part of the initial seed schema.
-- Run only once on a database containing schema.sql.
GRANT SELECT ON public.genres, public.books, public.copies TO anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.genres, public.books, public.copies FROM anon;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.copies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Librarians can add books" ON public.books
FOR INSERT TO authenticated
WITH CHECK (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'librarian'
  AND (auth.jwt() ->> 'is_anonymous') IS DISTINCT FROM 'true'
);

CREATE POLICY "Librarians can add copies" ON public.copies
FOR INSERT TO authenticated
WITH CHECK (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'librarian'
  AND (auth.jwt() ->> 'is_anonymous') IS DISTINCT FROM 'true'
);
GRANT INSERT ON public.books, public.copies TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.books_id_seq, public.copies_id_seq TO authenticated;

CREATE OR REPLACE FUNCTION public.add_book_with_copy(
  p_genre_id bigint, p_title_bg text, p_title_en text,
  p_author_bg text, p_author_en text, p_inventory_number text
)
RETURNS bigint LANGUAGE plpgsql SECURITY INVOKER SET search_path = ''
AS $$
DECLARE new_id bigint;
BEGIN
  IF p_title_bg IS NULL OR length(trim(p_title_bg)) = 0
    OR p_title_en IS NULL OR length(trim(p_title_en)) = 0
    OR p_author_bg IS NULL OR length(trim(p_author_bg)) = 0
    OR p_author_en IS NULL OR length(trim(p_author_en)) = 0
    OR p_inventory_number IS NULL OR length(trim(p_inventory_number)) = 0 THEN
    RAISE EXCEPTION 'All book fields and inventory number are required';
  END IF;
  INSERT INTO public.books (genre_id,title_bg,title_en,author_bg,author_en)
  VALUES (p_genre_id, trim(p_title_bg),trim(p_title_en),trim(p_author_bg),trim(p_author_en))
  RETURNING id INTO new_id;
  INSERT INTO public.copies (book_id,inventory_number,status)
  VALUES (new_id,trim(p_inventory_number),'available');
  RETURN new_id;
END $$;

REVOKE ALL ON FUNCTION public.add_book_with_copy(bigint,text,text,text,text,text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.add_book_with_copy(bigint,text,text,text,text,text) TO authenticated;

-- Set role through Supabase Auth Admin / app_metadata, NEVER user_metadata.
-- A user with app_metadata.role = librarian can call add_book_with_copy().
