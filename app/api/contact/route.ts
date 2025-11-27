import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Check if email is configured
    const contactEmail = process.env.CONTACT_EMAIL;
    const smtpUser = process.env.SMTP_USER;
    
    if (!contactEmail && !smtpUser) {
      console.warn('Email not configured. Message details:', body);
      return NextResponse.json(
        { message: 'Message received (email not configured)' },
        { status: 200 }
      );
    }

    // Use contact email or fallback to SMTP user
    const ownerEmail = contactEmail || smtpUser!;

    // Create transporter only if SMTP is configured
    let transporter;
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      // Verify transporter configuration
      await transporter.verify();
    } else {
      console.warn('SMTP not configured. Email would have been sent to:', ownerEmail);
      return NextResponse.json(
        { message: 'Message received (SMTP not configured)' },
        { status: 200 }
      );
    }

    // Email to site owner
    const ownerMailOptions = {
      from: process.env.SMTP_FROM || `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: ownerEmail,
      subject: `New Contact Form: ${body.subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #374151; }
            .value { color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Contact Form Submission</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Name:</div>
                <div class="value">${body.name}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value">${body.email}</div>
              </div>
              <div class="field">
                <div class="label">Subject:</div>
                <div class="value">${body.subject}</div>
              </div>
              <div class="field">
                <div class="label">Message:</div>
                <div class="value" style="white-space: pre-wrap;">${body.message}</div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Auto-reply to user (only if SMTP is configured)
    const userMailOptions = {
      from: process.env.SMTP_FROM || `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: body.email,
      subject: 'Thank you for contacting me!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You for Reaching Out!</h1>
            </div>
            <div class="content">
              <p>Hello <strong>${body.name}</strong>,</p>
              <p>Thank you for your message. I'll get back to you soon!</p>
              <p>Best regards,<br><strong>${process.env.SITE_OWNER_NAME || 'Portfolio Owner'}</strong></p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Send emails
    await transporter.sendMail(ownerMailOptions);
    await transporter.sendMail(userMailOptions);

    return NextResponse.json(
      { message: 'Message sent successfully!' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error sending email:', error);
    
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}