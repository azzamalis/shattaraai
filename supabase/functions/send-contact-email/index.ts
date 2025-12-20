import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 3600000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 3;

// Input validation limits
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 255;
const MAX_SUBJECT_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;
const MAX_ORG_NAME_LENGTH = 200;

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactSalesData {
  fullName: string;
  businessEmail: string;
  organizationName: string;
  teamSize: string;
  message?: string;
}

// HTML escape function to prevent HTML injection in emails
function escapeHtml(text: string): string {
  if (!text) return '';
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Get client IP from request headers
function getClientIP(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
         req.headers.get('x-real-ip') ||
         req.headers.get('cf-connecting-ip') ||
         'unknown';
}

// Check rate limit using Supabase
async function checkRateLimit(supabase: any, ip: string, endpoint: string): Promise<{ allowed: boolean; remaining: number }> {
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
  
  try {
    // Count recent attempts from this IP
    const { count, error } = await supabase
      .from('contact_rate_limits')
      .select('*', { count: 'exact', head: true })
      .eq('ip_address', ip)
      .eq('endpoint', endpoint)
      .gte('created_at', windowStart);

    if (error) {
      console.error('Rate limit check error:', error);
      // Allow request if rate limit check fails (fail open for usability)
      return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW };
    }

    const currentCount = count || 0;
    const allowed = currentCount < MAX_REQUESTS_PER_WINDOW;
    const remaining = Math.max(0, MAX_REQUESTS_PER_WINDOW - currentCount - (allowed ? 1 : 0));

    return { allowed, remaining };
  } catch (error) {
    console.error('Rate limit error:', error);
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW };
  }
}

// Record rate limit attempt
async function recordRateLimitAttempt(supabase: any, ip: string, endpoint: string): Promise<void> {
  try {
    await supabase
      .from('contact_rate_limits')
      .insert({
        ip_address: ip,
        endpoint: endpoint,
        created_at: new Date().toISOString()
      });
  } catch (error) {
    console.error('Failed to record rate limit attempt:', error);
  }
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

  // Initialize Supabase client for rate limiting
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Get client IP for rate limiting
  const clientIP = getClientIP(req);
  const endpoint = 'contact_form';

  // Check rate limit
  const { allowed, remaining } = await checkRateLimit(supabase, clientIP, endpoint);
  
  if (!allowed) {
    console.log(`Rate limit exceeded for IP: ${clientIP}`);
    return new Response(
      JSON.stringify({ 
        error: "Too many requests. Please try again in 1 hour.",
        retryAfter: 3600
      }),
      {
        status: 429,
        headers: { 
          "Content-Type": "application/json",
          "Retry-After": "3600",
          "X-RateLimit-Remaining": "0",
          ...corsHeaders 
        },
      }
    );
  }

  try {
    const body = await req.json();
    
    // Record this attempt for rate limiting
    await recordRateLimitAttempt(supabase, clientIP, endpoint);
    
    // Check if it's contact sales form (has fullName field) or regular contact form
    if (body.fullName) {
      return await handleContactSales(body as ContactSalesData, remaining);
    } else {
      return await handleRegularContact(body as ContactFormData, remaining);
    }
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to send message. Please try again later."
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

const handleContactSales = async (data: ContactSalesData, remaining: number): Promise<Response> => {
  const { fullName, businessEmail, organizationName, teamSize, message } = data;

  // Validate required fields
  if (!fullName || !businessEmail || !organizationName || !teamSize) {
    return new Response(
      JSON.stringify({ error: "All required fields must be filled" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  // Validate input lengths
  if (fullName.length > MAX_NAME_LENGTH) {
    return new Response(
      JSON.stringify({ error: `Name must be less than ${MAX_NAME_LENGTH} characters` }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  if (businessEmail.length > MAX_EMAIL_LENGTH) {
    return new Response(
      JSON.stringify({ error: `Email must be less than ${MAX_EMAIL_LENGTH} characters` }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  if (!isValidEmail(businessEmail)) {
    return new Response(
      JSON.stringify({ error: "Please enter a valid email address" }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  if (organizationName.length > MAX_ORG_NAME_LENGTH) {
    return new Response(
      JSON.stringify({ error: `Organization name must be less than ${MAX_ORG_NAME_LENGTH} characters` }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  if (message && message.length > MAX_MESSAGE_LENGTH) {
    return new Response(
      JSON.stringify({ error: `Message must be less than ${MAX_MESSAGE_LENGTH} characters` }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  // Sanitize all user inputs for HTML
  const safeFullName = escapeHtml(fullName);
  const safeBusinessEmail = escapeHtml(businessEmail);
  const safeOrganizationName = escapeHtml(organizationName);
  const safeTeamSize = escapeHtml(teamSize);
  const safeMessage = message ? escapeHtml(message) : '';

  // Send notification email to sales team
  const salesEmailResponse = await resend.emails.send({
    from: "Sales Contact <noreply@updates.shattaraai.com>",
    to: ["hello@shattaraai.com"],
    subject: `New Sales Contact: ${safeOrganizationName} (Team: ${safeTeamSize})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #00A3FF; padding-bottom: 10px;">
          New Sales Contact Request
        </h2>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #555; margin-top: 0;">Contact Details</h3>
          <p><strong>Name:</strong> ${safeFullName}</p>
          <p><strong>Email:</strong> ${safeBusinessEmail}</p>
          <p><strong>Organization:</strong> ${safeOrganizationName}</p>
          <p><strong>Team Size:</strong> ${safeTeamSize}</p>
        </div>
        
        ${safeMessage ? `
        <div style="background: #fff; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px;">
          <h3 style="color: #555; margin-top: 0;">Message</h3>
          <p style="line-height: 1.6; white-space: pre-wrap;">${safeMessage}</p>
        </div>
        ` : ''}
        
        <div style="margin-top: 30px; padding: 15px; background: #e3f2fd; border-radius: 8px;">
          <p style="margin: 0; color: #1976d2; font-size: 14px;">
            <strong>Follow-up required:</strong> Please contact this lead within 24 hours.
          </p>
        </div>
      </div>
    `,
  });

  // Send confirmation email to customer
  const confirmationEmailResponse = await resend.emails.send({
    from: "Shattara AI Sales <noreply@updates.shattaraai.com>",
    to: [businessEmail],
    subject: "Thank you for contacting our sales team",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; padding: 20px 0; border-bottom: 1px solid #e9ecef;">
          <h1 style="color: #00A3FF; margin: 0;">Shattara AI</h1>
        </div>
        
        <div style="padding: 30px 20px;">
          <h2 style="color: #333; margin-bottom: 20px;">Thank you for your interest!</h2>
          
          <p style="line-height: 1.6; color: #555;">
            Dear ${safeFullName},
          </p>
          
          <p style="line-height: 1.6; color: #555;">
            Thank you for reaching out to our sales team regarding <strong>${safeOrganizationName}</strong>. 
            We're excited to learn more about your educational needs and how Shattara AI can help 
            your team of ${safeTeamSize} members.
          </p>
          
          <p style="line-height: 1.6; color: #555;">
            Our sales team will review your request and contact you within 24 hours to discuss:
          </p>
          
          <ul style="color: #555; line-height: 1.6;">
            <li>Custom pricing for your team size</li>
            <li>Enterprise features and integrations</li>
            <li>Implementation and onboarding support</li>
            <li>Training and support options</li>
          </ul>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #555; margin-top: 0;">What's Next?</h3>
            <p style="margin-bottom: 10px;">While you wait, explore our platform:</p>
            <ul style="margin: 0;">
              <li>Try our free features</li>
              <li>Browse our knowledge base</li>
              <li>Schedule a demo call</li>
            </ul>
          </div>
          
          <p style="line-height: 1.6; color: #555;">
            If you have any urgent questions, reach us at:
          </p>
          
          <ul style="color: #555; line-height: 1.6;">
            <li>Email: hello@shattaraai.com</li>
            <li>Phone: +966 53 481 4860</li>
          </ul>
          
          <p style="line-height: 1.6; color: #555;">
            Best regards,<br>
            The Shattara AI Sales Team
          </p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
          <p style="margin: 0; color: #888; font-size: 14px;">
            © 2024 Shattara AI - Built by people, Powered by machines
          </p>
        </div>
      </div>
    `,
  });

  console.log("Sales notification sent:", salesEmailResponse);
  console.log("Confirmation email sent:", confirmationEmailResponse);

  return new Response(
    JSON.stringify({ 
      success: true,
      message: "Thank you for your interest! Our sales team will contact you within 24 hours.",
      salesEmailId: salesEmailResponse.data?.id,
      confirmationEmailId: confirmationEmailResponse.data?.id 
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "X-RateLimit-Remaining": String(remaining),
        ...corsHeaders,
      },
    }
  );
};

const handleRegularContact = async (data: ContactFormData, remaining: number): Promise<Response> => {
  const { name, email, subject, message } = data;

  // Validate required fields
  if (!name || !email || !subject || !message) {
    return new Response(
      JSON.stringify({ error: "All fields are required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  // Validate input lengths
  if (name.length > MAX_NAME_LENGTH) {
    return new Response(
      JSON.stringify({ error: `Name must be less than ${MAX_NAME_LENGTH} characters` }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  if (email.length > MAX_EMAIL_LENGTH) {
    return new Response(
      JSON.stringify({ error: `Email must be less than ${MAX_EMAIL_LENGTH} characters` }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  if (!isValidEmail(email)) {
    return new Response(
      JSON.stringify({ error: "Please enter a valid email address" }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  if (subject.length > MAX_SUBJECT_LENGTH) {
    return new Response(
      JSON.stringify({ error: `Subject must be less than ${MAX_SUBJECT_LENGTH} characters` }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return new Response(
      JSON.stringify({ error: `Message must be less than ${MAX_MESSAGE_LENGTH} characters` }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  // Sanitize all user inputs for HTML
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message);

  // Send notification email to business
  const businessEmailResponse = await resend.emails.send({
      from: "Contact Form <noreply@updates.shattaraai.com>",
      to: ["hello@shattaraai.com"],
      subject: `New Contact Form Submission: ${safeSubject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #00A3FF; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #555; margin-top: 0;">Contact Details</h3>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            <p><strong>Subject:</strong> ${safeSubject}</p>
          </div>
          
          <div style="background: #fff; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px;">
            <h3 style="color: #555; margin-top: 0;">Message</h3>
            <p style="line-height: 1.6; white-space: pre-wrap;">${safeMessage}</p>
          </div>
          
          <div style="margin-top: 30px; padding: 15px; background: #e3f2fd; border-radius: 8px;">
            <p style="margin: 0; color: #1976d2; font-size: 14px;">
              This message was sent from the Shattara AI contact form.
            </p>
          </div>
        </div>
      `,
  });

  // Send confirmation email to user
  const userEmailResponse = await resend.emails.send({
      from: "Shattara AI <noreply@updates.shattaraai.com>",
      to: [email],
      subject: "Thank you for contacting Shattara AI",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 20px 0; border-bottom: 1px solid #e9ecef;">
            <h1 style="color: #00A3FF; margin: 0;">Shattara AI</h1>
          </div>
          
          <div style="padding: 30px 20px;">
            <h2 style="color: #333; margin-bottom: 20px;">Thank you for reaching out!</h2>
            
            <p style="line-height: 1.6; color: #555;">
              Dear ${safeName},
            </p>
            
            <p style="line-height: 1.6; color: #555;">
              We have received your message and appreciate you taking the time to contact us. 
              Our team will review your inquiry and get back to you as soon as possible, 
              typically within 24-48 hours.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #555; margin-top: 0;">Your Message Summary</h3>
              <p><strong>Subject:</strong> ${safeSubject}</p>
              <p style="margin-bottom: 0;"><strong>Message:</strong></p>
              <p style="line-height: 1.6; margin-top: 5px; white-space: pre-wrap;">${safeMessage}</p>
            </div>
            
            <p style="line-height: 1.6; color: #555;">
              If you have any urgent questions, you can also reach us directly at:
            </p>
            
            <ul style="color: #555; line-height: 1.6;">
              <li>Email: hello@shattaraai.com</li>
              <li>Phone: +966 53 481 4860</li>
            </ul>
            
            <p style="line-height: 1.6; color: #555;">
              Thank you for your interest in our AI-powered educational platform.
            </p>
            
            <p style="line-height: 1.6; color: #555;">
              Best regards,<br>
              The Shattara AI Team
            </p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
            <p style="margin: 0; color: #888; font-size: 14px;">
              © 2024 Shattara AI - Built by people, Powered by machines
            </p>
          </div>
        </div>
      `,
  });

  console.log("Business email sent:", businessEmailResponse);
  console.log("User confirmation email sent:", userEmailResponse);

  return new Response(
    JSON.stringify({ 
      success: true, 
      message: "Message sent successfully! We'll get back to you soon." 
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "X-RateLimit-Remaining": String(remaining),
        ...corsHeaders,
      },
    }
  );
};

serve(handler);
