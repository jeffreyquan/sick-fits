import { Role } from './schemas/Role';
import "dotenv/config";
import { OrderItem } from './schemas/OrderItem';
import { Order } from './schemas/Order';
import { extendGraphqlSchema } from './mutations/index';
import { CartItem } from './schemas/Cart';
import { ProductImage } from './schemas/ProductImage';
import { createAuth } from "@keystone-next/auth"
import { config, createSchema } from "@keystone-next/keystone/schema";
import {withItemData,
statelessSessions} from "@keystone-next/keystone/session"
import { User } from "./schemas/User"
import { Product } from "./schemas/Product"
import { insertSeedData } from './seed-data';
import { sendPasswordResetEmail } from './lib/mail';
import { permissionsList } from './schemas/fields';

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
  },
  passwordResetLink: {
    async sendToken(args) {
      console.log(args)
      await sendPasswordResetEmail(args.token, args.identity);
    }
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
    CartItem,
    OrderItem,
    Order,
    Role
  }),
  extendGraphqlSchema,
  ui: {
    // Show the UI only for people who pass this test
    isAccessAllowed: ({ session }) => {
      return !!session?.data;
    }
  },
  session: withItemData(statelessSessions(sessionConfig), {
    User: `id name email role { ${permissionsList.join(' ')} }`
  })
}));
