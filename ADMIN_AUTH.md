# Admin Authentication Setup

## How It Works

The admin dashboard uses **Sanity OAuth** for authentication. Users sign in with their Google account (that has access to your Sanity project), and once authenticated, they can access:

- `/admin` - Admin dashboard
- `/admin/cms` - Sanity Studio (embedded)
- `/admin/registrations` - Registration data management

## Authentication Flow

1. User visits `/admin` (or any admin route)
2. If not authenticated, redirected to `/admin/login`
3. User clicks "Sign in with Google"
4. Redirected to Sanity OAuth (Google login)
5. After successful login, redirected back with access token
6. Token is verified and stored in secure cookies
7. User is redirected to their original destination

## For Users

### First Time Sign In

1. Navigate to `/admin/login`
2. Click "Sign in with Google"
3. Use the Google account that has access to the Sanity project
4. You'll be redirected back and logged in

### Requirements

- You must have access to the Sanity project
- Your Google account must be added as a member in Sanity
- Project admins can add members at: https://sanity.io/manage → Your Project → Members

## For Developers

### API Routes

- `POST /api/auth/sanity/login` - Handles OAuth callback and sets auth cookies
- `POST /api/auth/sanity/logout` - Clears auth cookies

### Cookies Set

- `auth-token` - Simple flag set to "authenticated"
- `sanity-token` - The actual Sanity access token (for future API calls if needed)

Both cookies are:

- HttpOnly (not accessible via JavaScript)
- Secure in production
- SameSite: Lax
- Max Age: 7 days

### Adding New Admin Routes

All routes under `/app/(admin)/admin/` are automatically protected by the layout authentication check.

### Testing Locally

1. Make sure your Sanity project allows `http://localhost:3000` as a CORS origin
2. Navigate to `http://localhost:3000/admin/login`
3. Sign in with Google (use account with Sanity project access)

## Security Notes

- The Sanity OAuth flow is secure and managed by Sanity
- Tokens are stored in HttpOnly cookies (not accessible via JavaScript)
- Each login session lasts 7 days
- Users can manually sign out via the "Sign Out" button in the admin header
