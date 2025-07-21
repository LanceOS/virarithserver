
-----

# Get Started with Your Application

This guide will walk you through setting up and deploying your SvelteKit application. The application utilizes SvelteKit 5 with the `adapter-auto`, allowing for flexible deployment as a Node.js application or on platforms like Vercel. It integrates with Minio for object storage, PostgreSQL for the database, PGAdmin for database management, Better-Auth for authentication, and Drizzle for ORM.

## 1\. Environment Variables Setup

The first and most critical step is configuring your environment variables. These variables control how your application connects to its various services. You will need to create a `.env` file in the root of your project, based on the provided `env.example`.

**Important:** Never commit your `.env` file to version control (e.g., Git).

Here's the structure of your `env.example` with explanations for each variable:

```env
# --- PUBLIC ENVIRONMENT VARIABLES ---
# These variables are accessible on both the client and server side.
# For production, PUBLIC_URL and PUBLIC_MINIO_ENDPOINT should be your application's domain.
PUBLIC_URL=http://localhost:5173 # Your application's base URL/domain
PUBLIC_PORT=5173 # The port your application runs on (default for SvelteKit dev)

PUBLIC_BUCKET_NAME=bucketname # The default Minio bucket name

PUBLIC_MINIO_ENDPOINT=http://localhost:5173 # Domain you are using for Minio (e.g., https://s3.your-domain.com)

PUBLIC_BETTER_AUTH_URL=http://localhost:5173 # Your application's base URL/domain (used by Better-Auth)

# --- PRIVATE ENVIRONMENT VARIABLES ---
# These variables are only accessible on the server side.
# For production, update localhost references to your deployed service endpoints or subdomains.

# PostgreSQL Database Configuration
PRIVATE_POSTGRES_URL=localhost:5432 # Host and port for your PostgreSQL database
PRIVATE_POSTGRES_USER=username # PostgreSQL database username
PRIVATE_POSTGRES_PASSWORD=password # PostgreSQL database password
PRIVATE_POSTGRES_DB=database # PostgreSQL database name

# PGAdmin Configuration
PG_ADMIN=admin@example.com # Default email for PGAdmin login
PG_ADMIN_PASSWORD=admin # Default password for PGAdmin login

# Minio Object Storage Configuration
MINIO_ROOT_USER=username # Minio root user (access key)
MINIO_ROOT_PASSWORD=password # Minio root password (secret key)
PRIVATE_MINIO_ENDPOINT=minio # Internal Minio endpoint (e.g., service name in Docker Compose)
PRIVATE_MINIO_PORT=9000 # Internal Minio port (Set to 443 if you are using HTTPS with a reverse proxy)

# Minio Bucket Access (for application's specific access to a bucket, if different from root)
PRIVATE_BUCKET_ACCESS_KEY= # Access key for specific bucket operations (optional, often Minio root user can be used)
PRIVATE_BUCKET_SECRET_KEY= # Secret key for specific bucket operations (optional)

# Social Authentication (Better-Auth)
PRIVATE_DISCORD_CLIENT= # Discord OAuth Client ID
PRIVATE_DISCORD_SECRET= # Discord OAuth Client Secret

PRIVATE_GOOGLE_SECRET= # Google OAuth Client Secret
PRIVATE_GOOGLE_CLIENT= # Google OAuth Client ID

PRIVATE_BETTER_AUTH_SECRET= # A strong, random string for Better-Auth's secret key (e.g., 32+ characters)
```

### Configuration Notes:

  * **Local Hosting (Docker Compose Services):** If you are hosting PostgreSQL, PGAdmin, and Minio locally using Docker Compose, the `localhost` and `minio` (for `PRIVATE_MINIO_ENDPOINT`) values are appropriate. The `PUBLIC_URL`, `PUBLIC_PORT`, `PUBLIC_MINIO_ENDPOINT`, and `PUBLIC_BETTER_AUTH_URL` should also point to `http://localhost:5173` for local development.

  * **Better-Auth and Social Logins (Production):**

      * For production, `PUBLIC_URL` and `PUBLIC_BETTER_AUTH_URL` **must** point to your application's actual domain (e.g., `https://your-app-domain.com`).
      * The `PRIVATE_BETTER_AUTH_SECRET` should be a long, randomly generated string for security.
      * You'll need to configure social authentication providers (Discord and Google). This involves creating applications on their respective developer portals to obtain `PRIVATE_DISCORD_CLIENT`, `PRIVATE_DISCORD_SECRET`, `PRIVATE_GOOGLE_CLIENT`, and `PRIVATE_GOOGLE_SECRET` values. **Crucially, ensure that the redirect URLs you configure on Discord and Google's developer portals point back to your application's domain (`https://your-app-domain.com/auth/callback/discord` and `https://your-app-domain.com/auth/callback/google` respectively).**

**Where to get your Social Auth Keys and set Redirect URLs:**

  * **Discord:**

    1.  Go to the [Discord Developer Portal](https://discord.com/developers/applications).
    2.  Create a new application or select an existing one.
    3.  Navigate to the "OAuth2" section.
    4.  Under "Redirects", add the appropriate redirect URL(s). For Better-Auth, this will typically be `https://your-app-domain.com/auth/callback/discord`.
    5.  Copy your "Client ID" (`PRIVATE_DISCORD_CLIENT`) and "Client Secret" (`PRIVATE_DISCORD_SECRET`).
    6.  *Tutorial Aid:* You can find a basic guide on Discord OAuth setup here: [https://discordjs.guide/oauth2/](https://discordjs.guide/oauth2/)

  * **Google:**

    1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
    2.  Create a new project or select an existing one.
    3.  Navigate to "APIs & Services" \> "Credentials".
    4.  Click "Create Credentials" and choose "OAuth client ID".
    5.  Select "Web application" as the application type.
    6.  Under "Authorized redirect URIs", add the appropriate redirect URL(s). For Better-Auth, this will typically be `https://your-app-domain.com/auth/callback/google`.
    7.  Copy your "Client ID" (`PRIVATE_GOOGLE_CLIENT`) and "Client Secret" (`PRIVATE_GOOGLE_SECRET`).
    8.  *Tutorial Aid:* A step-by-step guide for Google OAuth setup can be found here: [https://dev.to/idrisakintobi/a-step-by-step-guide-to-google-oauth2-authentication-with-javascript-and-bun-4he7](https://dev.to/idrisakintobi/a-step-by-step-guide-to-google-oauth2-authentication-with-javascript-and-bun-4he7)

## 2\. Running Your Application Locally (with Docker Compose)

Assuming you have Docker and Docker Compose installed:

1.  **Ensure `.env` is configured for `localhost`** as shown in the example values above.
2.  **Start your Docker Compose services:**
    ```bash
    docker-compose up -d
    ```
    This will bring up your PostgreSQL, PGAdmin, and Minio containers.
3.  **Run Drizzle Migrations:**
    Once PostgreSQL is running, you need to apply your database schema using Drizzle.
    ```bash
    npx drizzle-kit migrate
    ```
    (You might need to install `drizzle-kit` globally if you haven't already: `npm install -g drizzle-kit`)
4.  **Start the SvelteKit application:**
    ```bash
    npm install
    npm run dev
    ```
    Your application should now be running on `http://localhost:5173`.

## 3\. Deployment and Domain Setup (Cloudflare DNS Tunneling)

Once your application is stable and ready for production, you'll need to deploy it and set up domain access.

1.  **Purchase a Domain:** Acquire a domain name from a registrar of your choice.

2.  **Set up Cloudflare:**

      * Sign up for a Cloudflare account.
      * Add your newly purchased domain to Cloudflare.
      * Follow Cloudflare's instructions to change your domain's nameservers to Cloudflare's nameservers.

3.  **Deploy Your SvelteKit Application:**

      * **Node.js Application:** If you're deploying as a Node.js application, ensure your server is running and accessible (e.g., on a VPS).
      * **Vercel:** If deploying to Vercel, simply connect your Git repository, and Vercel will handle the deployment automatically due to `adapter-auto`. Remember to set your production environment variables (matching your domain, e.g., `PUBLIC_URL=https://your-app-domain.com`) within Vercel's dashboard.

4.  **Cloudflare DNS Tunneling (Cloudflare Tunnel / Argo Tunnel):**
    Cloudflare Tunnels allow you to securely expose your locally running services (or services on a private network) to the internet without opening firewall ports.

      * **Install `cloudflared`:** Install the Cloudflare Tunnel client (`cloudflared`) on the server or machine where your SvelteKit application and Docker Compose services are running.

      * **Create a Tunnel:**

          * In your Cloudflare Dashboard, go to "Zero Trust" (or "Access" depending on your Cloudflare plan) -\> "Tunnels".
          * Click "Create a tunnel" and follow the prompts. Give your tunnel a descriptive name.
          * Cloudflare will provide you with a command to run on your server to authenticate and start the tunnel.

      * **Configure Public Hostnames:**

          * Within your tunnel configuration in the Cloudflare Dashboard, navigate to "Public Hostnames".
          * **Main Application:** Add a public hostname for your main SvelteKit application. This will point to your base domain (e.g., `your-app-domain.com`). The "Service" should point to the internal address and port of your SvelteKit application (e.g., `http://localhost:5173` or the internal IP and port if deployed on a different server).
          * **Minio (Public Endpoint):** Add a public hostname for your Minio S3 API access (e.g., `s3.your-app-domain.com` pointing to `http://localhost:9000` or your internal Minio service IP/port).
          * **Minio Console (Optional):** You might also want a separate subdomain for the Minio Console (e.g., `minio-console.your-app-domain.com` pointing to `http://localhost:9001`).
          * **PGAdmin (Optional, for easy access):** `pgadmin.your-app-domain.com` (pointing to `http://localhost:80` or the exposed port of your PGAdmin container).
          * **Important:** Ensure the "Service" address for each hostname correctly reflects the internal IP and port where that service is running relative to where `cloudflared` is installed.

      * **Tutorial Aids for Cloudflare Tunnel:**

          * **Cloudflare's Official Documentation:** [https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)
          * **Crosstalk Solutions (YouTube/Blog):** Search for "Cloudflare Tunnel Easy Setup" by Crosstalk Solutions. They often have clear, practical tutorials. A relevant article is [https://www.crosstalksolutions.com/cloudflare-tunnel-easy-setup/](https://www.crosstalksolutions.com/cloudflare-tunnel-easy-setup/)

## 4\. Final Steps

Once your application is deployed, DNS is configured, and Cloudflare Tunnels are active:

1.  **Update Environment Variables:** Ensure that the `PUBLIC_URL`, `PUBLIC_MINIO_ENDPOINT`, and `PUBLIC_BETTER_AUTH_URL` in your deployed environment's configuration (e.g., Vercel environment variables, or your server's `.env` file) are updated to use your actual domain (e.g., `https://your-app-domain.com`, `https://s3.your-app-domain.com`).
2.  **Verify Domain Access:** Test accessing your application via `https://your-app-domain.com` and your subdomains (e.g., `https://s3.your-app-domain.com`, `https://pgadmin.your-app-domain.com`).
3.  **Test Social Logins:** Ensure Discord and Google authentication are working correctly on your deployed application.
4.  **Secure Your Environment Variables:** Double-check that your production environment variables are securely stored in your deployment environment and not exposed publicly.

You should now be able to fully utilize your application\!