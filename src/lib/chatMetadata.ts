import { supabase } from '@/integrations/supabase/client';

interface ChatStatistics {
  messageCount: number;
  duration: number; // in minutes
  topics: string[];
  complexity: 'beginner' | 'intermediate' | 'advanced';
  lastActivity: string;
}

export async function generateChatMetadata(
  conversationId: string,
  messages: any[]
): Promise<Partial<ChatStatistics>> {
  try {
    // Calculate basic statistics
    const messageCount = messages.length;
    const userMessages = messages.filter(m => m.sender_type === 'user');
    const aiMessages = messages.filter(m => m.sender_type === 'ai');
    
    // Calculate conversation duration
    let duration = 0;
    if (messages.length > 1) {
      const firstMessage = new Date(messages[0].created_at);
      const lastMessage = new Date(messages[messages.length - 1].created_at);
      duration = Math.round((lastMessage.getTime() - firstMessage.getTime()) / (1000 * 60));
    }

    // Extract topics from content (simple keyword extraction)
    const topics = extractTopicsFromMessages(messages);
    
    // Determine complexity based on conversation characteristics
    const complexity = determineComplexity(messages, userMessages, aiMessages);
    
    const lastActivity = messages.length > 0 
      ? messages[messages.length - 1].created_at 
      : new Date().toISOString();

    return {
      messageCount,
      duration: Math.max(duration, 1), // Minimum 1 minute
      topics,
      complexity,
      lastActivity
    };
  } catch (error) {
    console.error('Error generating chat metadata:', error);
    return {
      messageCount: messages.length,
      duration: 1,
      topics: [],
      complexity: 'beginner',
      lastActivity: new Date().toISOString()
    };
  }
}

function extractTopicsFromMessages(messages: any[]): string[] {
  const topics = new Set<string>();
  
  // Common educational topics and keywords
  const topicKeywords = {
    'Mathematics': ['math', 'algebra', 'calculus', 'geometry', 'equation', 'solve', 'calculate'],
    'Science': ['science', 'physics', 'chemistry', 'biology', 'experiment', 'theory'],
    'Programming': ['code', 'programming', 'javascript', 'python', 'function', 'variable', 'algorithm'],
    'History': ['history', 'historical', 'century', 'war', 'ancient', 'medieval'],
    'Literature': ['literature', 'novel', 'poem', 'author', 'character', 'plot'],
    'Language': ['language', 'grammar', 'vocabulary', 'pronunciation', 'translation'],
    'Art': ['art', 'painting', 'drawing', 'artist', 'design', 'creative'],
    'Music': ['music', 'song', 'instrument', 'melody', 'rhythm', 'composer'],
    'Business': ['business', 'marketing', 'finance', 'strategy', 'management'],
    'Philosophy': ['philosophy', 'ethics', 'logic', 'moral', 'philosophical']
  };

  const allContent = messages
    .map(m => m.content.toLowerCase())
    .join(' ');

  Object.entries(topicKeywords).forEach(([topic, keywords]) => {
    if (keywords.some(keyword => allContent.includes(keyword))) {
      topics.add(topic);
    }
  });

  return Array.from(topics).slice(0, 5); // Limit to 5 topics
}

function determineComplexity(
  messages: any[], 
  userMessages: any[], 
  aiMessages: any[]
): 'beginner' | 'intermediate' | 'advanced' {
  const avgMessageLength = messages.reduce((sum, m) => sum + m.content.length, 0) / messages.length;
  const conversationLength = messages.length;
  
  // Simple heuristics for complexity
  if (conversationLength > 20 && avgMessageLength > 100) {
    return 'advanced';
  } else if (conversationLength > 10 && avgMessageLength > 50) {
    return 'intermediate';
  } else {
    return 'beginner';
  }
}

export async function updateContentWithChatMetadata(
  contentId: string,
  conversationId: string,
  messages: any[]
): Promise<void> {
  try {
    const metadata = await generateChatMetadata(conversationId, messages);
    
    await supabase
      .from('content')
      .update({
        metadata: metadata,
        updated_at: new Date().toISOString()
      })
      .eq('id', contentId);
      
    console.log('Updated content with chat metadata:', metadata);
  } catch (error) {
    console.error('Error updating content with chat metadata:', error);
  }
}