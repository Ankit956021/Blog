# Appwrite Permissions Setup Guide

## 🔐 Appwrite Permissions कैसे Setup करें

### Step-by-Step Permission Setup Process

## 1. Database Level Permissions

### Appwrite Console में जाएं:
1. अपने project में Database section खोलें
2. अपना database select करें (blogspot_db)
3. हर collection के लिए permissions set करें

## 2. Collection-wise Permissions

### A. Categories Collection Permissions

**Settings → Permissions Tab में जाकर:**

**Read Permissions:** (कौन data read कर सकता है)
```
role:all
```
*यह सभी users (logged in और guest दोनों) को categories देखने की permission देता है*

**Create Permissions:** (कौन नया data create कर सकता है)
```
role:admin
```
*केवल admin users नई categories बना सकते हैं*

**Update Permissions:** (कौन existing data update कर सकता है)
```
role:admin
```

**Delete Permissions:** (कौन data delete कर सकता है)
```
role:admin
```

### B. Blogs Collection Permissions

**Read Permissions:**
```
role:all
```
*सभी users blogs पढ़ सकते हैं*

**Create Permissions:**
```
role:admin
role:author
```
*Admin और Author दोनों blogs create कर सकते हैं*

**Update Permissions:**
```
role:admin
users:self
```
*Admin सभी blogs update कर सकते हैं, authors अपने blogs update कर सकते हैं*

**Delete Permissions:**
```
role:admin
```

### C. Comments Collection Permissions

**Read Permissions:**
```
role:all
```
*सभी approved comments सबको दिखें*

**Create Permissions:**
```
role:all
```
*कोई भी comment कर सकता है (guest users भी)*

**Update Permissions:**
```
role:admin
```
*केवल admin comments को approve/reject कर सकते हैं*

**Delete Permissions:**
```
role:admin
```

### D. Support Collection Permissions

**Read Permissions:**
```
role:admin
users:self
```
*Admin सभी tickets देख सकते हैं, users अपने tickets देख सकते हैं*

**Create Permissions:**
```
role:all
```
*कोई भी support ticket बना सकता है*

**Update Permissions:**
```
role:admin
```
*केवल admin ticket status update कर सकते हैं*

**Delete Permissions:**
```
role:admin
```

### E. Careers Collection Permissions

**Read Permissions:**
```
role:admin
users:self
```

**Create Permissions:**
```
role:all
```
*कोई भी job application submit कर सकता है*

**Update Permissions:**
```
role:admin
```

**Delete Permissions:**
```
role:admin
```

## 3. Storage Bucket Permissions

### Blog Images Bucket Setup:

**Appwrite Console → Storage → Create Bucket**

**Bucket Settings:**
- Bucket ID: `blog_images`
- Maximum File Size: `10485760` (10MB in bytes)
- Allowed File Extensions: `jpg,jpeg,png,gif,webp,svg`
- Compression: `gzip`
- Encryption: `true`
- Antivirus: `true` (if available)

**Bucket Permissions:**

**Read Permissions:**
```
role:all
```
*सभी images publicly accessible होंगी*

**Create Permissions:**
```
role:admin
role:author
```
*केवल admin और authors images upload कर सकते हैं*

**Update Permissions:**
```
role:admin
```

**Delete Permissions:**
```
role:admin
```

## 4. Authentication Setup

### User Roles बनाने के लिए:

**Teams Section में जाकर:**

1. **Admin Team बनाएं:**
   - Team Name: `admins`
   - Team ID: `admin`

2. **Author Team बनाएं:**
   - Team Name: `authors` 
   - Team ID: `author`

### Default User Registration:
**Auth → Settings में:**
- Enable Email/Password
- Enable Anonymous Sessions (for guest comments)
- Set Session Length: 365 days

## 5. Permission Rules Explained

### Permission Formats:

**Public Access:**
```
role:all        // सभी users (logged in + guests)
role:member     // केवल logged in users
role:guest      // केवल guest users
```

**Role-based Access:**
```
role:admin      // केवल admin role वाले users
role:author     // केवल author role वाले users
```

**User-specific Access:**
```
users:self      // केवल data का owner
user:USER_ID    // specific user ID
```

**Team-based Access:**
```
team:TEAM_ID          // specific team के members
team:TEAM_ID/owner    // team के owners
```

## 6. Security Best Practices

### ✅ Do's:
- हमेशा least privilege principle follow करें
- Production में guest users को limited access दें
- Sensitive data (emails, personal info) को protect करें
- Regular audit करें permissions की

### ❌ Don'ts:
- सभी collections को `role:all` create permission न दें
- Admin data को public readable न बनाएं
- File uploads को unrestricted न छोड़ें

## 7. Testing Permissions

### Permission Test करने के लिए:

1. **Appwrite Console → Database → Collection**
2. **Try to create/read/update/delete documents**
3. **Different user roles से test करें**

## 8. Code में Permission Handling

### Frontend में user role check:
```javascript
// Check if user is admin
const user = await appwriteService.getCurrentUser();
const isAdmin = user?.labels?.includes('admin');

if (isAdmin) {
    // Show admin features
}
```

### Backend में permission validation:
```javascript
// In your route handlers
const checkAdminRole = (req, res, next) => {
    // Validate user role from JWT or session
    if (userRole !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};
```

## 9. Quick Setup Checklist

### ✅ Permissions Checklist:
- [ ] Categories: Read=all, Create/Update/Delete=admin
- [ ] Blogs: Read=all, Create=admin+author, Update=admin+self, Delete=admin
- [ ] Comments: Read=all, Create=all, Update/Delete=admin
- [ ] Support: Read=admin+self, Create=all, Update/Delete=admin
- [ ] Careers: Read=admin+self, Create=all, Update/Delete=admin
- [ ] Storage: Read=all, Create=admin+author, Update/Delete=admin

### ✅ Authentication Setup:
- [ ] Email/Password enabled
- [ ] Admin team created
- [ ] Author team created (optional)
- [ ] Session length configured

यह setup करने के बाद आपका BlogSpot application secure और properly configured होगा! 🔒