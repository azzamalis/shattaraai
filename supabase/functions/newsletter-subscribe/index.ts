
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SubscriptionData {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  try {
    const { email }: SubscriptionData = await req.json();

    // Validate email
    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Please enter a valid email address" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Check if email already exists
    const { data: existingSubscriber, error: checkError } = await supabase
      .from("newsletter_subscribers")
      .select("email, status")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (checkError) {
      console.error("Error checking existing subscriber:", checkError);
      throw new Error("Database error occurred");
    }

    if (existingSubscriber) {
      if (existingSubscriber.status === "active") {
        return new Response(
          JSON.stringify({ 
            error: "You're already subscribed to our newsletter!" 
          }),
          {
            status: 409,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      } else {
        // Reactivate unsubscribed user
        const { error: updateError } = await supabase
          .from("newsletter_subscribers")
          .update({ 
            status: "active", 
            subscribed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq("email", email.toLowerCase());

        if (updateError) {
          console.error("Error reactivating subscriber:", updateError);
          throw new Error("Failed to reactivate subscription");
        }
      }
    } else {
      // Insert new subscriber
      const { error: insertError } = await supabase
        .from("newsletter_subscribers")
        .insert([
          {
            email: email.toLowerCase(),
            status: "active"
          }
        ]);

      if (insertError) {
        console.error("Error inserting subscriber:", insertError);
        throw new Error("Failed to subscribe to newsletter");
      }
    }

    // Send welcome email
    const welcomeEmailResponse = await resend.emails.send({
      from: "Shattara AI <noreply@updates.shattaraai.com>",
      to: [email],
      subject: "Welcome to Shattara AI Newsletter!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 20px 0; border-bottom: 1px solid #e9ecef;">
            <h1 style="color: #00A3FF; margin: 0;">Shattara AI</h1>
          </div>
          
          <div style="padding: 30px 20px;">
            <h2 style="color: #333; margin-bottom: 20px;">Welcome to our Newsletter!</h2>
            
            <p style="line-height: 1.6; color: #555;">
              Thank you for subscribing to the Shattara AI newsletter! 
              We're excited to have you join our community of learners and educators.
            </p>
            
            <p style="line-height: 1.6; color: #555;">
              You'll receive updates about:
            </p>
            
            <ul style="color: #555; line-height: 1.6; margin: 20px 0;">
              <li>New AI-powered educational features</li>
              <li>Learning tips and best practices</li>
              <li>Platform updates and improvements</li>
              <li>Educational resources and content</li>
            </ul>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <h3 style="color: #555; margin-top: 0;">Get Started Today</h3>
              <p style="margin-bottom: 15px; color: #555;">
                Ready to transform your learning experience with AI?
              </p>
              <a href="https://shattaraai.com/signup" 
                 style="display: inline-block; background: #00A3FF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Create Your Free Account
              </a>
            </div>
            
            <p style="line-height: 1.6; color: #555;">
              Thank you for choosing Shattara AI to enhance your educational journey.
            </p>
            
            <p style="line-height: 1.6; color: #555;">
              Best regards,<br>
              The Shattara AI Team
            </p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
            <p style="margin: 0; color: #888; font-size: 12px;">
              You can unsubscribe from these emails at any time by contacting us at hello@shattaraai.com
            </p>
            <p style="margin: 10px 0 0 0; color: #888; font-size: 12px;">
              © 2024 Shattara AI - Built by people, Powered by machines
            </p>
          </div>
        </div>
      `,
    });

    console.log("Welcome email sent:", welcomeEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Thank you for subscribing! Check your email for a welcome message." 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    // Log full error details server-side only
    console.error("Error in newsletter-subscribe function:", error);
    
    // Return safe generic error to client (no internal details exposed)
    return new Response(
      JSON.stringify({ 
        error: "Failed to subscribe to newsletter. Please try again later."
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
