# GitHub Pages Deployment Guide for Avril's Fairytale Website

This guide will help you deploy Avril's website to GitHub Pages using your existing GitHub account.

## Prerequisites

- A GitHub account
- Git installed on your computer (if deploying locally)

## Deployment Options

### Option 1: One-Click Deployment (Recommended)

1. **Create a new repository on GitHub**
   - Go to [GitHub](https://github.com) and sign in
   - Click the "+" icon in the top right and select "New repository"
   - Name your repository: `avril-fairytale-world`
   - Make it public (for GitHub Pages)
   - Click "Create repository"

2. **Upload the website files**
   - On your new repository page, click "uploading an existing file"
   - Drag and drop all the files from the `avril_website/avril_app/src/static` folder
   - Add a commit message like "Initial website upload"
   - Click "Commit changes"

3. **Enable GitHub Pages**
   - Go to your repository settings (click "Settings" tab)
   - Scroll down to "GitHub Pages" section
   - Under "Source", select "main" branch
   - Click "Save"
   - Wait a few minutes for your site to be published
   - GitHub will show you the URL where your site is published (typically https://yourusername.github.io/avril-fairytale-world/)

### Option 2: Local Deployment with Git

If you're comfortable with Git commands:

```bash
# Clone your new repository
git clone https://github.com/yourusername/avril-fairytale-world.git

# Copy all files from the static folder to your repository
cp -r /path/to/avril_website/avril_app/src/static/* avril-fairytale-world/

# Navigate to your repository
cd avril-fairytale-world

# Add all files to git
git add .

# Commit the changes
git commit -m "Initial website upload"

# Push to GitHub
git push origin main
```

Then follow step 3 from Option 1 to enable GitHub Pages.

## Custom Domain (Optional)

If you want to use a custom domain instead of the default github.io domain:

1. Purchase a domain from a domain registrar
2. In your repository settings, under GitHub Pages, enter your custom domain
3. Update your domain's DNS settings to point to GitHub Pages (follow GitHub's instructions)

## Updating Content After Deployment

### Method 1: Using the Admin Panel

1. Access your website's admin panel by clicking "Parent Login" on the website
2. Log in with the default credentials:
   - Username: `parent`
   - Password: `avril2019`
3. Use the admin interface to add, edit, or delete content
4. **Important**: Change your password after first login in the Settings section

### Method 2: Updating Files Directly on GitHub

For more technical changes:

1. Go to your repository on GitHub
2. Navigate to the file you want to edit
3. Click the pencil icon to edit
4. Make your changes
5. Commit the changes

## Backup and Maintenance

- Regularly backup your content by downloading a copy of your repository
- Keep your admin password secure
- Consider setting up automatic backups using GitHub Actions

## Troubleshooting

- If your site doesn't appear after deployment, check that the repository is public
- If images don't load, verify the file paths are correct
- For any issues, check GitHub Pages documentation or contact support

## Need Help?

If you need assistance with deployment or have questions about managing the website, please reach out for support.
