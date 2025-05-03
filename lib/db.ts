// This is a mock database implementation
// In a real application, you would use a real database like PostgreSQL, MySQL, or MongoDB

interface User {
  id: string
  name: string
  email: string
  password: string
  createdAt: Date
}

interface CV {
  id: string
  userId: string
  title: string
  content: string
  createdAt: Date
}

class Database {
  private users: User[] = [
    {
      id: "1",
      name: "Demo User",
      email: "user@example.com",
      password: "$2b$10$8r0qPVaJIIiXxEW9WI.G7.X.TnSEAVLGN8YQrZqF7fNQ7G3kIvSHa", // hashed "password123"
      createdAt: new Date(),
    },
  ]

  private cvs: CV[] = [
    {
      id: "1",
      userId: "1",
      title: "Professional CV",
      content: "Sample CV content",
      createdAt: new Date(),
    },
  ]

  // User methods
  async findUserByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null
  }

  async createUser(data: Omit<User, "id" | "createdAt">): Promise<User> {
    const newUser = {
      id: String(this.users.length + 1),
      ...data,
      createdAt: new Date(),
    }
    this.users.push(newUser)
    return newUser
  }

  // CV methods
  async findCVsByUserId(userId: string): Promise<CV[]> {
    return this.cvs.filter((cv) => cv.userId === userId)
  }

  async createCV(data: Omit<CV, "id" | "createdAt">): Promise<CV> {
    const newCV = {
      id: String(this.cvs.length + 1),
      ...data,
      createdAt: new Date(),
    }
    this.cvs.push(newCV)
    return newCV
  }
}

export const db = new Database()
