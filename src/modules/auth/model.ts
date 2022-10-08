import { PrismaClient } from "@prisma/client";
import { genSalt, hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../database/prisma";

export enum roleName {
  admin = "admin",
  franchise = "franchise",
  cashier = "cashier",
}
type SignUpData = {
  name: string;
  email: string;
  password: string;
  ubication?: string;
  role: roleName;
};
type SignInData = {
  email: string;
  password: string;
};

type UserUniquesTypes = {
  id?: string;
  email?: string;
  name?: string;
};

type UpdateData = {
  id: string;
  data: {
    email?: string;
    name?: string;
    password: string;
    roleId?: string;
  };
};

/*class User {
  constructor(private readonly user: PrismaClient["user"]) {}

  async encriptPassword(password: string) {
    const salt = await genSalt(10);
    return await hash(password, salt);
  }
  async comparePassword(password: string, receivePassword: string) {
    return await compare(password, receivePassword as string);
  }

  async generateToken(id: string, email: string, password: string) {
    return jwt.sign(
      { id: id, email: email, password: password },
      `${process.env.SECRET_KEY_TOKEN}`
    );
  }
  async signup(signupData: SignUpData) {
    try {
      const { name, email, password, ubication, role } = signupData;
      const encryptedPassword = await this.encriptPassword(password);
      if (!role) throw new Error("Can't create user without role");
      const currentRole = await roleModel.assignRole(role);
      const user = await this.user.create({
        data: {
          name: name,
          email: email,
          password: encryptedPassword,
          ubication: ubication,
          roleId: currentRole.id,
        },
      });
      if (!user) return new Error("Can't create user");
      const token = await this.generateToken(
        user.id,
        user.email,
        user.password
      );
      return { ...user, token: token };
    } catch (error: any) {
      return new Error(error.message);
    }
  }
  async signin(signinData: SignInData) {
    try {
      const { email, password } = signinData;
      const user = await this.user.findUnique({
        where: {
         // email: email,
        },
      });
      if (!user) return new Error("User doesn't exist");

      const hasPasswordMatched = await this.comparePassword(
        //password,
        //user.password
      );
      if (!hasPasswordMatched) return new Error("Password doesn't match");
      const token = await this.generateToken(
       // user.id,
        //user.email,
        //user.password
      );
      return { ...user, token: token };
    } catch (error: any) {
      return new Error(error.message);
    }
  }
  async getUser(userData: UserUniquesTypes) {
    try {
      const user = await this.user.findUnique({
        where: {
          ...userData,
        },
      });
      if (!user) return null;
      return user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getUsers(offset: number, page: number) {
    try {
      const userList = await this.user.findMany({
        take: offset,
        skip: offset * page,
      });
      if (!userList) return null;
      return userList;
    } catch (error) {
      throw new Error("Something wrong");
    }
  }
  async updateUser({ data, id }: UpdateData) {
    try {
      const userUpdated = await this.user.update({
        where: {
          id: id,
        },
        data: {
          ...data,
        },
      });
      if (!userUpdated) throw new Error("Can't update user");
      return userUpdated;
    } catch (error) {
      throw error;
    }
  }
}

const userModel = new User(prisma.user);

export default userModel;
*/
