
// This is a mock implementation for client-side use only
// In a real app, these operations would be performed on a server

export type User = {
  _id?: string;
  name: string;
  email: string;
  password: string; // This would normally be hashed
  createdAt: Date;
  updatedAt: Date;
};

// Mock user storage (this is only for demonstration purposes)
const users: User[] = [];

export async function createUser(userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>): Promise<User> {
  // Check if user already exists
  const existingUser = users.find(user => user.email === userData.email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }
  
  // In a real app, we would hash the password here
  // For demo purposes, we're just storing it as plain text
  
  const now = new Date();
  const newUser: User = {
    ...userData,
    _id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now
  };
  
  // Add to our mock storage
  users.push(newUser);
  
  console.log('Created mock user:', newUser);
  
  return newUser;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return users.find(user => user.email === email) || null;
}

export async function validateUser(email: string, password: string): Promise<User | null> {
  const user = await getUserByEmail(email);
  
  if (!user) {
    return null;
  }
  
  // In a real app, we would compare hashed passwords
  // For demo purposes, we're just comparing plain text
  const isPasswordValid = user.password === password;
  
  if (!isPasswordValid) {
    return null;
  }
  
  return user;
}
