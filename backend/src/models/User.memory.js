import bcrypt from "bcryptjs";

// In-memory storage
let users = [];
let userIdCounter = 1;

export class UserMemory {
  constructor(userData) {
    this.id = userIdCounter++;
    this.email = userData.email.toLowerCase();
    this.password = userData.password;
    this.name = userData.name || '';
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Hash password before saving
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  // Compare password
  async comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  }

  // Save user to memory
  async save() {
    await this.hashPassword();
    users.push(this);
    return this;
  }

  // Static methods
  static async findOne(query) {
    if (query.email) {
      return users.find(user => user.email === query.email.toLowerCase());
    }
    if (query.id) {
      return users.find(user => user.id === parseInt(query.id));
    }
    return null;
  }

  static async findById(id) {
    return users.find(user => user.id === parseInt(id));
  }

  static async create(userData) {
    // Check if user already exists
    const existing = await UserMemory.findOne({ email: userData.email });
    if (existing) {
      throw new Error('Email already exists');
    }

    const user = new UserMemory(userData);
    await user.save();
    return user;
  }

  // Get all users (for debugging)
  static getAll() {
    return users;
  }

  // Clear all users (for testing)
  static clear() {
    users = [];
    userIdCounter = 1;
  }

  // Seed initial users
  static async seed() {
    try {
      // Clear existing users
      UserMemory.clear();

      // Create admin user
      const admin = await UserMemory.create({
        email: 'admin@swachsanket.com',
        password: 'admin123',
        name: 'Admin User'
      });

      // Create test user
      const testUser = await UserMemory.create({
        email: 'test@swachsanket.com', 
        password: 'test123',
        name: 'Test User'
      });

      console.log('✅ In-memory users seeded successfully:');
      console.log(`Admin - Email: ${admin.email}, Password: admin123`);
      console.log(`Test - Email: ${testUser.email}, Password: test123`);

      return { admin, testUser };
    } catch (error) {
      console.error('❌ Error seeding users:', error.message);
      throw error;
    }
  }
}
