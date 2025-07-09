
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ReferralRequest {
  invite_code: string;
  activity_type: 'link_clicked' | 'signup_completed' | 'first_content_uploaded' | 'reward_earned';
  metadata?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { invite_code, activity_type, metadata = {}, user_agent } = await req.json() as ReferralRequest;

    if (!invite_code || !activity_type) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get the referrer user from the invite code
    const { data: referralData, error: referralError } = await supabaseClient
      .from('user_referrals')
      .select('user_id')
      .eq('invite_code', invite_code)
      .eq('is_active', true)
      .single();

    if (referralError || !referralData) {
      return new Response(
        JSON.stringify({ error: 'Invalid invite code' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get current user (if authenticated)
    const authHeader = req.headers.get('Authorization');
    let currentUser = null;
    
    if (authHeader) {
      const { data: { user } } = await supabaseClient.auth.getUser(
        authHeader.replace('Bearer ', '')
      );
      currentUser = user;
    }

    // Prevent self-referrals
    if (currentUser && currentUser.id === referralData.user_id) {
      return new Response(
        JSON.stringify({ error: 'Cannot refer yourself' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get client IP address
    const clientIP = req.headers.get('x-forwarded-for') || 
                    req.headers.get('x-real-ip') || 
                    'unknown';

    // Create referral activity record
    const { data: activityData, error: activityError } = await supabaseClient
      .from('referral_activities')
      .insert({
        referrer_user_id: referralData.user_id,
        referee_user_id: currentUser?.id || null,
        invite_code,
        activity_type,
        metadata,
        ip_address: clientIP,
        user_agent
      })
      .select()
      .single();

    if (activityError) {
      console.error('Error creating referral activity:', activityError);
      return new Response(
        JSON.stringify({ error: 'Failed to track referral' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Handle reward creation for specific activities
    if (activity_type === 'signup_completed' || activity_type === 'first_content_uploaded') {
      const rewardType = activity_type === 'signup_completed' ? 'free_month' : 'free_month';
      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1); // Expires in 1 year

      // Create reward for referrer
      await supabaseClient
        .from('referral_rewards')
        .insert({
          user_id: referralData.user_id,
          referral_activity_id: activityData.id,
          reward_type: rewardType,
          reward_value: 1,
          status: 'approved',
          expires_at: expiresAt.toISOString()
        });

      // Create reward for referee (if they signed up)
      if (currentUser && activity_type === 'signup_completed') {
        await supabaseClient
          .from('referral_rewards')
          .insert({
            user_id: currentUser.id,
            referral_activity_id: activityData.id,
            reward_type: 'free_month',
            reward_value: 1,
            status: 'approved',
            expires_at: expiresAt.toISOString()
          });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        activity_id: activityData.id 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in track-referral function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
})
