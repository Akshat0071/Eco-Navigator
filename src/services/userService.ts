
import bcrypt from 'bcryptjs';
import { connectToDatabase } from './mongodb';

export type User = {
  _id?: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export async function createUser(userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>): Promise<User> {
  const { db } = await connectToDatabase();
  const collection = db.collection<User>('users');
  
  // Check if user already exists
  const existingUser = await collection.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }
  
  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);
  
  const now = new Date();
  const newUser: User = {
    ...userData,
    password: hashedPassword,
    createdAt: now,
    updatedAt: now
  };
  
  const result = await collection.insertOne(newUser as any);
  
  return {
    ...newUser,
    _id: result.insertedId.toString()
  };
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const { db } = await connectToDatabase();
  const collection = db.collection<User>('users');
  
  return collection.findOne({ email });
}

export async function validateUser(email: string, password: string): Promise<User | null> {
  const user = await getUserByEmail(email);
  
  if (!user) {
    return null;
  }
  
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    return null;
  }
  
  return user;
}
