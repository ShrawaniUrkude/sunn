# MongoDB Setup Guide for SUN Donation Platform

## Option 1: MongoDB Atlas (Cloud - Recommended for Quick Start)

MongoDB Atlas is a free cloud database service - no local installation required!

### Steps:

1. **Sign up for MongoDB Atlas**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Create a free account

2. **Create a Free Cluster**
   - Choose the FREE tier (M0)
   - Select a cloud provider and region closest to you
   - Click "Create Cluster"

3. **Set up Database Access**
   - Go to "Database Access" in left menu
   - Click "Add New Database User"
   - Create username and password (remember these!)
   - Set permissions to "Read and write to any database"

4. **Set up Network Access**
   - Go to "Network Access" in left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0) for development
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in left menu
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like):
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```

6. **Update .env file**
   - Open `backend/.env`
   - Replace `<username>` and `<password>` with your credentials
   - Replace the MONGODB_URI line with:
     ```
     MONGODB_URI=mongodb+srv://youruser:yourpass@cluster0.xxxxx.mongodb.net/sun-donation?retryWrites=true&w=majority
     ```

---

## Option 2: Local MongoDB Installation

### Windows:

1. **Download MongoDB**
   - Go to: https://www.mongodb.com/try/download/community
   - Download the Windows MSI installer
   - Run the installer and follow the wizard

2. **Install as a Service**
   - During installation, select "Install MongoD as a Service"
   - Complete the installation

3. **Verify Installation**
   ```powershell
   mongod --version
   ```

4. **Start MongoDB Service** (if not auto-started)
   ```powershell
   net start MongoDB
   ```

5. **Your .env is already configured for local MongoDB**:
   ```
   MONGODB_URI=mongodb://localhost:27017/sun-donation
   ```

### macOS (using Homebrew):

```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify
mongod --version
```

### Linux (Ubuntu/Debian):

```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update and install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

---

## After Setup - Start Your Application

Once MongoDB is configured (either Atlas or local):

1. **Navigate to backend folder**
   ```powershell
   cd backend
   ```

2. **Start the backend server**
   ```powershell
   npm start
   ```

3. **In a new terminal, start the frontend**
   ```powershell
   cd ..
   npm start
   ```

4. **Check for success messages**
   - Backend should show: "✅ Connected to MongoDB"
   - Seed data will be initialized automatically
   - Frontend will open at http://localhost:3000

---

## Troubleshooting

### Connection Errors with Atlas:
- Double-check username/password in connection string
- Ensure IP address is whitelisted (0.0.0.0/0 for any IP)
- Check that database user has proper permissions

### Local MongoDB Won't Start:
- Windows: Check if MongoDB service is running in Services
- Check firewall settings
- Ensure port 27017 is not in use

### Need Help?
- MongoDB Atlas Docs: https://www.mongodb.com/docs/atlas/
- MongoDB Local Docs: https://www.mongodb.com/docs/manual/installation/
