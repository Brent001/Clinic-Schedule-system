import { db } from '$lib/server/db';
import { user, logs } from '$lib/server/db/schema'; // Import the logs table
import { eq } from 'drizzle-orm';

export async function POST({ request, cookies, getClientAddress }) {
  try {
    const { username, password } = await request.json();

    console.log('Login attempt:', { username }); // Debugging log

    // Validate input
    if (!username || !password) {
      console.error('Validation failed: Missing username or password');
      return new Response(JSON.stringify({ error: 'Username and password are required' }), { status: 400 });
    }

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    if (!usernameRegex.test(username)) {
      console.error('Validation failed: Invalid username format');
      return new Response(JSON.stringify({ error: 'Invalid username format' }), { status: 400 });
    }

    // Use parameterized queries to prevent SQL injection
    const result = await db
      .select()
      .from(user)
      .where(eq(user.username, username))
      .limit(1);

    console.log('Database query result:', result); // Debugging log

    if (result.length === 0 || result[0].password !== password) {
      console.error('Invalid credentials');
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
    }

    // Log user activity
    const ip = getClientAddress(); // Get client IP address
    const userAgent = request.headers.get('user-agent'); // Get user agent string
    const time = new Date().toISOString();

    try {
      await db.insert(logs).values({
        username,
        ip,
        time,
        os: 'Unknown', // Replace with parsed OS if needed
        browser: userAgent || 'Unknown', // Replace with parsed browser if needed
      });
      console.log('User activity logged successfully');
    } catch (logError) {
      console.error('Error logging user activity:', logError);
    }

    // Set session cookie (for authentication)
    cookies.set('session', username, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Error during login:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}