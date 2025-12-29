# MongoDB Setup Instructions

## Option 1: Install MongoDB Community Server (Local)

1. Download MongoDB Community Server:
   - Go to: https://www.mongodb.com/try/download/community
   - Select Windows, MSI package
   - Download and install

2. During installation:
   - Choose "Complete" installation
   - Check "Install MongoDB as a Service"
   - Service name: MongoDB
   - Run service as: Network Service user

3. After installation, MongoDB will start automatically

4. Verify installation:
   ```powershell
   net start MongoDB
   ```

## Option 2: Use MongoDB Atlas (Cloud - Free)

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a free cluster (M0)
4. Get your connection string
5. Update `.env` file:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/socialblaze
   ```

## Option 3: Start MongoDB Manually (if already installed)

If MongoDB is installed but not as a service:

```powershell
# Find MongoDB installation
cd "C:\Program Files\MongoDB\Server\<version>\bin"

# Start MongoDB
.\mongod.exe --dbpath "C:\data\db"
```

Create the data directory first:
```powershell
mkdir C:\data\db
```

## Quick Check

After setup, test connection in MongoDB Compass:
- Connection string: `mongodb://localhost:27017`
- If it connects, your server is running!

