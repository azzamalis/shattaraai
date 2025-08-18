-- Allow exam_id to be nullable in exam_attempts table for cases where exam is taken without a specific exam record
ALTER TABLE public.exam_attempts 
ALTER COLUMN exam_id DROP NOT NULL;