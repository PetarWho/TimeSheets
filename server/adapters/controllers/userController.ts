import userUpdateUseCase from "../../usecases/users/userUpdate";
import userDeleteUseCase from "../../usecases/users/userDelete";
import userDeactivateUseCase from "../../usecases/users/userDeactivate";
import userFetchByIdUseCase from "../../usecases/users/userFetchById";
import userFetchAllUseCase from "../../usecases/users/userFetchAll";
import { Request, Response } from "express";
import userSignInUseCase from "../../usecases/users/userSignIn";
import userSignUpUseCase from "../../usecases/users/userSignUp";
import userSignOutUseCase from "../../usecases/users/userSignOut";
import User from "../../entity/user";
import UserQueryParams from "../../ interfaces/userQueryParams";
import userSetRoleUseCase from "../../usecases/users/userSetRole";
import userFetchCountUseCase from "../../usecases/users/usersFetchCount";
import { fetchRoleByName } from "../../adapters/repositories/roleRepository";
import { CURRENT_UNIX } from "../../utils/datesHelper";
import { rolesEnum } from "../../enums/roles.enum";
import userGoogleLoginUseCase from "../../usecases/users/userGoogleLogin";
import { LoginTicket, OAuth2Client, TokenPayload } from "google-auth-library";
import dotenv from "dotenv";
import userFetchNonSpecificTeamMembersUseCase from "../../usecases/users/userFetchNonSpecificTeamMembers";
import { getUserFromToken } from "../../utils/reusableFunctions";

dotenv.config();

class UserController {
  private static client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  static async signIn(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const token: { token: string } = await userSignInUseCase(
        email as string,
        password as string
      );
      res.status(200).json(token);
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  static async signUp(req: Request, res: Response) {
    try {
      const userData = req.body;
      const token: { token: string } = await userSignUpUseCase(userData);
      res.status(201).json(token);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async signOut(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const message: { message: string } = await userSignOutUseCase(
        token as string
      );
      res.status(200).json(message);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userData = req.body;
      const result: { message: string } = await userUpdateUseCase(
        BigInt(id),
        userData
      );
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await userDeleteUseCase(BigInt(id));
      res.json({ message: `Successfully deleted user` });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deactivateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { deactivated } = req.body;
      const result: { message: string } = await userDeactivateUseCase(
        BigInt(id),
        deactivated
      );
      res.json({ result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async fetchUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user: User | null = await userFetchByIdUseCase(BigInt(id));
      if (!user) {
        res.status(404).json({ error: "User not found" });
      } else {
        const { password, ...userDataWithoutPassword } = user;
        res.json(userDataWithoutPassword);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async fetchAllUsers(req: Request, res: Response) {
    try {
      const params: UserQueryParams = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        pageSize: req.query.pageSize
          ? parseInt(req.query.pageSize as string, 10)
          : 5,
        status: req.query.status as "active" | "deactivated",
        search: req.query.search as string,
      };

      const users: User[] = await userFetchAllUseCase(params);
      const usersWithoutPassword = users.map((user: User) => {
        const { password, ...userDataWithoutPassword } = user;
        return userDataWithoutPassword;
      });

      res.json(usersWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async setUserRole(req: Request, res: Response) {
    try {
      const { id, roleId } = req.body;
      const userIdBigInt = BigInt(id);
      const roleIdBigInt = BigInt(roleId);
      const result = await userSetRoleUseCase(userIdBigInt, roleIdBigInt);
      res.json({ result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async fetchUsersCount(req: Request, res: Response) {
    try {
      const count: number = await userFetchCountUseCase();
      res.json(count);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async googleLoginUser(req: Request, res: Response) {
    const appToken = req.headers.authorization?.split(" ")[1];
    let user = await getUserFromToken(appToken as string);

    const { token } = req.body;

    try {
      const ticket: LoginTicket = await this.client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload: TokenPayload | undefined = ticket.getPayload();

      if (payload) {
        if (!user) {
          user = new User(
            BigInt(0),
            (await fetchRoleByName(rolesEnum.User)).id,
            payload.name as string,
            payload.email as string,
            CURRENT_UNIX,
            null,
            payload.sub,
            (payload.picture as string) || null,
            false,
            CURRENT_UNIX,
            CURRENT_UNIX
          );
        } else {
          user.avatar = payload.picture as string;
          user.google_id = payload.sub;
          user.email_verified_at = CURRENT_UNIX;
        }
        const response = await userGoogleLoginUseCase(user);
        res.json(response);
      } else {
        res.status(400).json({ message: "Google login failed" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error });
    }
  }

  static async fetchUsersThatAreNotMembersOfSpecificTeam(
    req: Request,
    res: Response
  ) {
    try {
      const { teamId } = req.params;

      const users: User[] = await userFetchNonSpecificTeamMembersUseCase(
        BigInt(teamId)
      );
      const usersWithoutPassword = users.map((user: User) => {
        const { password, ...userDataWithoutPassword } = user;
        return userDataWithoutPassword;
      });

      res.json(usersWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default UserController;
