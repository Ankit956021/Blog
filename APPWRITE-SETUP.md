# Appwrite Database Collections Setup

## Collections to Create in Appwrite Console

### 1. Categories Collection
**Collection ID:** `categories`

**Attributes:**
- `name` (String, 100 chars, Required)
- `description` (String, 500 chars, Optional)
- `slug` (String, 100 chars, Required, Unique)
- `created_at` (DateTime, Required)

**Indexes:**
- `slug_index` on `slug` (Unique)

### 2. Blogs Collection
**Collection ID:** `blogs`

**Attributes:**
- `title` (String, 200 chars, Required)
- `content` (String, 10000 chars, Required)
- `excerpt` (String, 500 chars, Optional)
- `author` (String, 100 chars, Required)
- `category` (String, 100 chars, Required)
- `tags` (String Array, Optional)
- `featured_image` (String, 500 chars, Optional)
- `status` (Enum: [published, draft], Default: published)
- `views` (Integer, Default: 0)
- `likes` (Integer, Default: 0)
- `created_at` (DateTime, Required)
- `updated_at` (DateTime, Required)

**Indexes:**
- `status_created_index` on `status`, `created_at` (DESC)
- `category_index` on `category`
- `author_index` on `author`

### 3. Comments Collection
**Collection ID:** `comments`

**Attributes:**
- `blog_id` (String, 100 chars, Required)
- `author_name` (String, 100 chars, Required)
- `author_email` (Email, Required)
- `content` (String, 1000 chars, Required)
- `status` (Enum: [pending, approved, rejected], Default: pending)
- `created_at` (DateTime, Required)

**Indexes:**
- `blog_status_index` on `blog_id`, `status`
- `created_date_index` on `created_at` (DESC)

### 4. Support Collection
**Collection ID:** `support`

**Attributes:**
- `name` (String, 100 chars, Required)
- `email` (Email, Required)
- `subject` (String, 200 chars, Required)
- `message` (String, 2000 chars, Required)
- `status` (Enum: [open, in_progress, closed], Default: open)
- `priority` (Enum: [low, medium, high], Default: medium)
- `created_at` (DateTime, Required)

**Indexes:**
- `status_priority_index` on `status`, `priority`
- `created_date_index` on `created_at` (DESC)

### 5. Careers Collection
**Collection ID:** `careers`

**Attributes:**
- `name` (String, 100 chars, Required)
- `email` (Email, Required)
- `phone` (String, 20 chars, Optional)
- `position` (String, 100 chars, Required)
- `experience` (String, 50 chars, Required)
- `skills` (String, 500 chars, Required)
- `cover_letter` (String, 2000 chars, Optional)
- `resume_url` (String, 500 chars, Optional)
- `status` (Enum: [pending, reviewing, interviewed, hired, rejected], Default: pending)
- `created_at` (DateTime, Required)

**Indexes:**
- `position_status_index` on `position`, `status`
- `created_date_index` on `created_at` (DESC)

### 6. Users Collection (Optional - for custom user data)
**Collection ID:** `users`

**Attributes:**
- `user_id` (String, 100 chars, Required, Unique)
- `name` (String, 100 chars, Required)
- `email` (Email, Required, Unique)
- `role` (Enum: [admin, author, user], Default: user)
- `profile_image` (String, 500 chars, Optional)
- `bio` (String, 500 chars, Optional)
- `created_at` (DateTime, Required)
- `updated_at` (DateTime, Required)

**Indexes:**
- `user_id_index` on `user_id` (Unique)
- `email_index` on `email` (Unique)
- `role_index` on `role`

## Storage Bucket Setup

### Blog Images Bucket
**Bucket ID:** `blog_images`

**Settings:**
- File Size Limit: 10MB
- Allowed File Extensions: jpg, jpeg, png, gif, webp
- Compression: Enabled
- Encryption: Enabled

**Permissions:**
- Read: `role:all`
- Create: `role:admin`, `role:author`
- Update: `role:admin`, `role:author`
- Delete: `role:admin`

## Permissions Setup

### Database Permissions
For each collection, set appropriate permissions:

**Read Permissions:**
- `role:all` (for public content like blogs, categories)
- `role:admin` (for admin-only content like support tickets)

**Create Permissions:**
- `role:all` (for comments, support tickets, career applications)
- `role:admin` (for blogs, categories)
- `role:author` (for blogs if you have author role)

**Update Permissions:**
- `role:admin` (for all collections)
- `role:author` (for blogs they created)

**Delete Permissions:**
- `role:admin` (for all collections)

## Quick Setup Commands

Copy these IDs to your `.env` file:
```env
APPWRITE_DATABASE_ID=blogspot_db
APPWRITE_COLLECTION_BLOGS=blogs
APPWRITE_COLLECTION_COMMENTS=comments
APPWRITE_COLLECTION_CATEGORIES=categories
APPWRITE_COLLECTION_USERS=users
APPWRITE_COLLECTION_SUPPORT=support
APPWRITE_COLLECTION_CAREERS=careers
APPWRITE_BUCKET_ID=blog_images
```

## Sample Data
After creating collections, you can add some sample categories:

1. **Technology**
   - Name: Technology
   - Description: Latest tech news and tutorials
   - Slug: technology

2. **Lifestyle**
   - Name: Lifestyle
   - Description: Life tips and personal experiences
   - Slug: lifestyle

3. **Business**
   - Name: Business
   - Description: Business strategies and entrepreneurship
   - Slug: business

4. **Health**
   - Name: Health
   - Description: Health and wellness tips
   - Slug: health