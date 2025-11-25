
# AV Control Basic Auth Server

This Node.js Express server enforces HTTP Basic Authentication for Poly TC10/HP Poly Studio X access tests.

- Username: `AVControl`
- Password: `123`
- `GET /` (protected): returns HTML with **SUCCESS** when authorized, otherwise **ACCESS DENIED** with 401 and `WWW-Authenticate` header.
- `GET /health` (public): health check for Render.
- CORS enabled for all origins; adjust in `server.js` if needed.

## Deploy on Render.com

### Option A: Using `render.yaml`
1. Push these files to a GitHub repo.
2. In Render, click **New +** → **Blueprint** and point to the repo.
3. Render will create a **Web Service** using the provided config and give you an HTTPS URL.

### Option B: Manual Web Service
1. Create **Web Service**.
2. Select Node environment.
3. **Start Command**: `node server.js`
4. **Health Check Path**: `/health`
5. Deploy; you will get an HTTPS URL like `https://av-control-basic-auth.onrender.com`.

## Testing
- Browser prompt: navigate to `/`. You will be asked for username and password.
- Programmatic: send `Authorization: Basic QVZDb250cm9sOjEyMw==` header (`AVControl:123` Base64).

## Notes
- For production, store credentials in env vars and read them in `server.js`.
- Adjust CORS policy if you need to restrict access.
