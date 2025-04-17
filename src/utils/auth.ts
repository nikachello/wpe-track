import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient, User, UserType } from "@prisma/client";
import { createDispatcherFromUser } from "@/actions/userActions";

const prisma = new PrismaClient();
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      userType: {
        type: "string",
        required: false,
        defaultValue: UserType.DISPATCHER,
        input: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await createDispatcherFromUser(user as User);
        },
      },
    },
  },
});
