# Deploying to Vercel with Neon PostgreSQL

This guide provides step-by-step instructions for deploying your project to Vercel using Neon's free PostgreSQL tier.

## Prerequisites

- A Vercel account
- A Neon account
- Your project code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Set Up Neon PostgreSQL Database

1. **Sign up at Neon**
   - Go to [Neon](https://neon.tech) and create a free account
   - Click "New Project"
   - Name your project (e.g., "kottab-production")
   - Select a region closest to your target users
   - Click "Create Project"

2. **Get Connection Strings**
   Once the project is created:
   - Copy the main connection string labeled "Connection string"
   - Also copy the "Direct connection" string (for Prisma's `directUrl`)

3. **Test the Connection Locally**
   - Update the `.env.neon` file with your actual connection string
   - Run `npm run db:neon` to test the connection and set up the database
   - Follow the prompts to migrate and seed the database

## Step 2: Deploy to Vercel

1. **Log in to Vercel**
   - Go to [Vercel](https://vercel.com) and log in
   - Click "Add New Project"
   - Import your Git repository

2. **Configure Project Settings**
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: Leave as default (uses vercel.json)
   - Output Directory: .next

3. **Set Environment Variables**
   Click on "Environment Variables" and add:
   ```
   DATABASE_URL=postgresql://neondb_owner:npg_o5Qhkv3pFBuZ@ep-black-rice-a4muwrma-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true&connect_timeout=15
   DIRECT_URL=postgresql://neondb_owner:npg_o5Qhkv3pFBuZ@ep-black-rice-a4muwrma-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
   NEXTAUTH_SECRET=Hha0zIBh1E1BLgtBNk7axqglfl4AR5bdw+U5JjA0OoI=
   NEXTAUTH_URL=https://kuttab.vercel.app
   NODE_ENV=production
   ```

   Notes:
   - Replace "kuttab.vercel.app" with your actual domain
   - The `DATABASE_URL` includes connection pooling parameters
   - The `DIRECT_URL` is used for Prisma migrations

4. **Deploy**
   - Click "Deploy"
   - Wait for the build and deployment to complete

## Step 3: Verify Deployment

1. **Check Database Connection**
   - Visit your deployed site
   - Test functionality that uses the database
   - Check Vercel logs for any database connection issues

2. **Monitor Performance**
   - Keep an eye on the Neon dashboard for database performance
   - Watch Vercel logs for any timeout or connection issues

## Troubleshooting

**Connection Issues**
- Check Neon dashboard to ensure your database is online
- Verify the connection strings in your environment variables
- Check that you've set both `DATABASE_URL` and `DIRECT_URL`

**Build Failures**
- Review build logs for specific error messages
- Ensure Prisma Client is being generated during build (`npx prisma generate`)

**Slow Performance**
- Consider adding indexes to frequently queried columns
- Optimize database queries in your code

## Maintenance Tips

1. **Regular Backups**
   - Set up regular backups of your Neon database
   - Neon offers point-in-time recovery on paid plans

2. **Resource Monitoring**
   - Monitor your database usage to stay within free tier limits
   - Consider upgrading if you exceed free limits

3. **Connection Pooling**
   - The connection string is configured for pooling to handle serverless functions
   - Monitor connection counts to prevent hitting limits
