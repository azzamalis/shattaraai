-- Reset stuck video to trigger auto-retry mechanism
UPDATE content 
SET processing_status = 'pending', 
    text_content = NULL, 
    chapters = NULL, 
    updated_at = NOW() - INTERVAL '5 minutes'
WHERE id = 'ae644602-be71-4f9c-85c6-a6e8c15742ff';