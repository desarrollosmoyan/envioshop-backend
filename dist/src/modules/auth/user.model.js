"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
type Update = {
  id: string;
  data: {
    email?: string;
    name?: string;
    ubication?: string;
  };
};
type SignupFranchise = {
  name: string;
  password: string;
  email: string;
  cashiers: Cashier[] | undefined;
  salesList: Sales[] | undefined;
  ubication: string;
};
type SignupCashier = {
  name: string;
  password: string;
  email: string;
  franchise: Franchise;
  franchiseId: undefined;
};
type SigninAndSingupFunction = {
  name: string;
  password: string;
  email: string;
  token: string;
  cashiers?: Cashier[] | null;
  salesList?: Sales[] | null;
  franchise?: Franchise;
  franchiseId?: string;
};

type UserType =
  | PrismaClient["admin"]
  | PrismaClient["franchise"]
  | PrismaClient["cashier"];

abstract class Users {
  constructor(private readonly prismaUser: UserType) {}
  async encryptPassword({ password }: ComparePass) {
    const salt = await genSalt(10);
    return await hash(password, salt);
  }
  async comparePassword({ password, receivePassword }: ComparePass) {
    return await compare(password, receivePassword as string);
  }
  protected generateToken({
    id,
    email,
    type,
  }: {
    id: string;
    email: string;
    type: string;
  }) {
    return jwt.sign(
      { id: id, email: email, type: type },
      `${process.env.SECRET_KEY_TOKEN}`
    );
  }
  protected abstract populateUser(
    user: Admin | Cashier | Franchise
  ): Promise<void>;
  abstract signup(
    data: Signup | SignupFranchise | SignupCashier
  ): Promise<SigninAndSingupFunction | Error>;
  abstract signin(data: Signin): Promise<SigninAndSingupFunction | Error>;
  abstract updateUser(
    data: Update
  ): Promise<Error | Admin | Cashier | Franchise>;
  abstract getUser({
    id,
    name,
    email,
  }: {
    id?: string;
    name?: string;
    email?: string;
  }): Promise<Admin | Cashier | Franchise | null>;
}
export class Admins extends Users {
  constructor(private readonly model: PrismaClient["admin"]) {
    super(model);
  }
  protected async populateUser(
    user: Admin | Cashier | Franchise
  ): Promise<void> {}
  async signup(data: Signup) {
    {
      try {
        const { password } = data;
        const encryptedPassword = await this.encryptPassword({
          password: password,
        });
        data.password = encryptedPassword;
        const user = await this.model.create({ data });
        const token = this.generateToken({
          id: user.id,
          email: user.email,
          type: "admin",
        });
        return { ...user, token: token };
      } catch (error) {
        throw error;
      }
    }
  }
  async signin(data: Signin) {
    try {
      const { email, password } = data;
      const user = await this.model.findUniqueOrThrow({
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
          return new Error("Password doesn't match");
        }
        const token = this.generateToken({
          id: user.id,
          email: user.email,
          type: "admin",
        });
        return { ...user, token: token };
      }
      return new Error("Can't find user");
    } catch (error: any) {
      return error;
    }
  }
  async updateUser(data: Update): Promise<Error | Admin> {
    try {
      const { id } = data;
      const user = await this.model.update({
        where: {
          id: id,
        },
        data: data.data,
      });
      if (!user) return new Error("Can't find user");
      return { ...user };
    } catch (error: any) {
      return error;
    }
  }
  async getUser({
    id,
    name,
    email,
  }: {
    id?: string;
    name?: string;
    email?: string;
  }): Promise<Admin | null> {
    try {
      const user = await this.model.findUnique({
        where: {
          id: id ? id : undefined,
          name: name ? name : undefined,
          email: email ? email : undefined,
        },
      });
      if (!user) return null;
      return user;
    } catch (error: any) {
      return error;
    }
  }
}

export class Franchises extends Users {
  constructor(private readonly model: PrismaClient["franchise"]) {
    super(model);
  }
  protected async populateUser(
    user: Admin | Cashier | Franchise
  ): Promise<void> {}
  async signup(
    data: SignupFranchise
  ): Promise<SigninAndSingupFunction | Error> {
    try {
      const { password } = data;
      const encryptedPassword = await this.encryptPassword({
        password: password,
      });
      data.password = encryptedPassword;
      const user = await this.model.create({ data });
      const token = this.generateToken({
        id: user.id,
        email: user.email,
        type: "franchise",
      });
      return { ...user, token: token };
    } catch (error) {
      throw error;
    }
  }
  async signin(data: Signin): Promise<SigninAndSingupFunction | Error> {
    try {
      const { email, password } = data;
      const user = await this.model.findUniqueOrThrow({
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
          return new Error("Password doesn't match");
        }
        const token = this.generateToken({
          id: user.id,
          email: user.email,
          type: "franchise",
        });
        return { ...user, token: token };
      }
      return new Error("Cant found user");
    } catch (error: any) {
      return error;
    }
  }
  async updateUser(data: Update): Promise<Error | Franchise> {
    try {
      const { id } = data;
      const user = await this.model.update({
        where: {
          id: id,
        },
        data: data.data,
      });
      if (!user) return new Error("Can't find user");
      return { ...user };
    } catch (error: any) {
      return error;
    }
  }
  async getUser({
    id,
    name,
    email,
  }: {
    id?: string;
    name?: string;
    email?: string;
  }): Promise<Franchise | null> {
    try {
      const user = await this.model.findUnique({
        where: {
          id: id ? id : undefined,
          name: name ? name : undefined,
          email: email ? email : undefined,
        },
      });
      if (!user) return null;
      return user;
    } catch (error: any) {
      return error;
    }
  }
}

export class Cashiers extends Users {
  constructor(private readonly model: PrismaClient["cashier"]) {
    super(model);
  }
  protected async populateUser(
    user: Admin | Cashier | Franchise
  ): Promise<void> {}

  async signup(data: SignupCashier): Promise<SigninAndSingupFunction | Error> {
    try {
      const { password } = data;
      const encryptedPassword = await this.encryptPassword({
        password: password,
      });
      data.password = encryptedPassword;
      const user = await this.model.create({ data });
      const token = this.generateToken({
        id: user.id,
        email: user.email,
        type: "cashier",
      });
      if (!user.franchiseId) {
        return { ...user, franchiseId: undefined, token: token };
      }
      return { ...user, franchiseId: user.franchiseId as string, token: token };
    } catch (error: any) {
      return error;
    }
  }
  async signin(data: Signin): Promise<SigninAndSingupFunction | Error> {
    try {
      const { email, password } = data;
      const user = await this.model.findUniqueOrThrow({
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
          return new Error("Password doesn't match");
        }
        const token = this.generateToken({
          id: user.id,
          email: user.email,
          type: "cashier",
        });
        if (!user.franchiseId) {
          return { ...user, franchiseId: undefined, token: token };
        }
        return {
          ...user,
          franchiseId: user.franchiseId as string,
          token: token,
        };
      }
      return new Error("Cant found user");
    } catch (error: any) {
      return error;
    }
  }
  async updateUser(data: Update): Promise<Error | Cashier> {
    try {
      const { id } = data;
      const user = await this.model.update({
        where: {
          id: id,
        },
        data: data.data,
      });
      if (!user) return new Error("Can't find user");
      return { ...user };
    } catch (error: any) {
      return error;
    }
  }
  async getUser({
    id,
    name,
    email,
  }: {
    id?: string;
    name?: string;
    email?: string;
  }): Promise<Cashier | null> {
    try {
      const user = await this.model.findUnique({
        where: {
          id: id ? id : undefined,
          name: name ? name : undefined,
          email: email ? email : undefined,
        },
      });
      if (!user) return null;
      return user;
    } catch (error: any) {
      return error;
    }
  }
}

export const cashierModel = new Cashiers(prisma.cashier);
export const adminModel = new Admins(prisma.admin);
export const franchiseModel = new Franchises(prisma.franchise);
*/
