import { NextRequest } from 'next/server'
import { POST } from '@/app/api/auth/register/route'

// Mock Prisma
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    $disconnect: jest.fn(),
  })),
}))

// Mock bcryptjs
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword123'),
}))

// Mock rate limiter
jest.mock('@/lib/rate-limit', () => ({
  rateLimit: () => ({
    check: jest.fn().mockResolvedValue(undefined),
  }),
}))

// Mock email service
jest.mock('@/lib/email', () => ({
  emailService: {
    sendWelcomeEmail: jest.fn().mockResolvedValue(true),
  },
}))

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const { emailService } = require('@/lib/email')

const mockPrisma = new PrismaClient()

describe('/api/auth/register', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('successfully registers a new user', async () => {
    const mockUser = {
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'USER',
      createdAt: new Date(),
    }

    mockPrisma.user.findUnique.mockResolvedValue(null) // User doesn't exist
    mockPrisma.user.create.mockResolvedValue(mockUser)

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'SecurePassword123!',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.user.email).toBe('test@example.com')
    expect(data.user.name).toBe('Test User')

    // Verify password was hashed
    expect(bcrypt.hash).toHaveBeenCalledWith('SecurePassword123!', 12)

    // Verify user was created
    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword123',
        role: 'USER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    // Verify welcome email was sent
    expect(emailService.sendWelcomeEmail).toHaveBeenCalledWith('test@example.com', 'Test User')
  })

  it('rejects registration with missing fields', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        // Missing name and password
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Name, email, and password are required')
  })

  it('rejects registration with invalid email', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'invalid-email',
        password: 'SecurePassword123!',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Please enter a valid email address')
  })

  it('rejects registration with weak password', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: '123', // Too short
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Password must be at least 8 characters long')
  })

  it('rejects registration with existing email', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'existing-user',
      email: 'test@example.com',
    })

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'SecurePassword123!',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(409)
    expect(data.error).toBe('An account with this email already exists')
  })

  it('handles database errors gracefully', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null)
    mockPrisma.user.create.mockRejectedValue(new Error('Database connection failed'))

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'SecurePassword123!',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Registration failed. Please try again.')
  })

  it('continues registration even if email sending fails', async () => {
    const mockUser = {
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'USER',
      createdAt: new Date(),
    }

    mockPrisma.user.findUnique.mockResolvedValue(null)
    mockPrisma.user.create.mockResolvedValue(mockUser)
    emailService.sendWelcomeEmail.mockRejectedValue(new Error('Email service down'))

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'SecurePassword123!',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    // Registration should still succeed
    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
  })

  it('normalizes email addresses', async () => {
    const mockUser = {
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'USER',
      createdAt: new Date(),
    }

    mockPrisma.user.findUnique.mockResolvedValue(null)
    mockPrisma.user.create.mockResolvedValue(mockUser)

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: '  Test User  ', // With whitespace
        email: 'TEST@EXAMPLE.COM', // Uppercase
        password: 'SecurePassword123!',
      }),
    })

    const response = await POST(request)

    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: {
        name: 'Test User', // Trimmed
        email: 'test@example.com', // Lowercase
        password: 'hashedPassword123',
        role: 'USER',
      },
      select: expect.any(Object),
    })
  })
})