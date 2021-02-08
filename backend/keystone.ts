import { ProductImage } from './schemas/ProductImage';
import { createAuth } from "@keystone-next/auth"
import { config, createSchema } from "@keystone-next/keystone/schema";
import "dotenv/config";
import {withItemData,
statelessSessions} from "@keystone-next/keystone/session"
import { User } from "./schemas/User"
import { Product } from "./schemas/Product"
import { insertSeedData } from './seed-data';
import { sendError } from 'next/dist/next-server/server/api-utils';

const databaseURL =
  process.env.DATABASE_URL || "mongodb://localhost/keystone-sick-fits-tutorial";

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 360, // How long user should stay signed in?
  secret: process.env.COOKIE_SECRET,
};

const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
    // TODO: Add initial roles here
  }
})

export default withAuth(config({
  server: {
    cors: {
      origin: [process.env.FRONTEND_URL],
      credentials: true,
    },
  },
  db: {
    adapter: 'mongoose',
    url: databaseURL,
    async onConnect(keystone) {
      if (process.argv.includes("--seed-data")) {
        await insertSeedData(keystone);
      }
    }
  },
  lists: createSchema({
    // Schema items go in here
    User,
    Product,
    ProductImage,
  }),
  ui: {
    // Show the UI only for people who pass this test
    isAccessAllowed: ({ session }) => {
      console.log(session);
      return !!session?.data;
    }
  },
  session: withItemData(statelessSessions(sessionConfig), {
    User: `id`
  })
}));
