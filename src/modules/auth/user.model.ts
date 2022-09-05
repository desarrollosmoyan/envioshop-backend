import { User, PrismaClient, roleName } from "@prisma/client";
import { genSalt, hash, compare } from "bcrypt";
import { Response } from "express";
import jwt from "jsonwebtoken";

type ComparePass = {
  password: string;
  receivePassword?: string;
};

type Signup = {
  name: string;
  password: string;
  email: string;
};

type Signin = {
  email: string;
  password: string;
};

class Users {
  constructor(private readonly prismaUser: PrismaClient["user"]) {}
  async encryptPassword({ password }: ComparePass) {
    const salt = await genSalt(10);
    return await hash(password, salt);
  }
  async comparePassword({ password, receivePassword }: ComparePass) {
    return await compare(password, receivePassword as string);
  }
  async signup(data: Signup) {
    try {
      const { password } = data;
      const encryptedPassword = await this.encryptPassword({
        password: password,
      });
      data.password = encryptedPassword;
      const user = await this.prismaUser.create({ data });
      const token = this.generateToken({
        id: user.id,
        email: user.email,
        role: user.roleId as string,
      });
      return { ...user, token: token };
    } catch (error) {
      throw error;
    }
  }
  async signin(data: Signin) {
    try {
      const { email, password } = data;
      const user = await this.prismaUser.findUniqueOrThrow({
        where: {
          email: email,
        },
      });
      if (user) {
        const matchPassword = await this.comparePassword({
          password: password,
          receivePassword: user.password,
        });
        if (!matchPassword) {
          return null;
        }
        const token = this.generateToken({
          id: user.id,
          email: user.email,
          role: user.roleId as string,
        });
        const populatedUser = await this.populateRole(user);
        return { ...populatedUser, token: token };
      }
    } catch (error) {
      throw error;
    }
  }
  private generateToken({
    id,
    email,
    role,
  }: {
    id: string;
    email: string;
    role: string;
  }) {
    return jwt.sign(
      { id: id, email: email, role: role },
      `${process.env.SECRET_KEY_TOKEN}`
    );
  }
  private async populateRole(user: User) {
    const populatedUser = await this.prismaUser.findFirst({
      where: {
        id: user.id,
      },
      include: {
        Role: true,
      },
    });
    return populatedUser;
  }
}

export default Users;
