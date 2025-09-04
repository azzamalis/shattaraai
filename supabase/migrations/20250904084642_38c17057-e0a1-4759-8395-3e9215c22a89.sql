-- Reset the failed video to trigger immediate retry
UPDATE content 
SET processing_status = 'pending', 
    text_content = NULL, 
    chapters = NULL, 
    updated_at = NOW() - INTERVAL '1 minute'
WHERE id = '453c08da-9297-4109-84cf-e7627fbfbe72' 
AND processing_status = 'failed';