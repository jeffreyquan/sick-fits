import { rules } from './../access';
import { integer, relationship, select, text } from "@keystone-next/fields";
import { list } from "@keystone-next/keystone/schema";
import { isSignedIn } from "../access";

export const CartItem = list({
  access: {
    create: isSignedIn,
    read: rules.canOrder,
    update: rules.canOrder,
    delete: rules.canOrder
  },
  ui: {
    listView: {
      initialColumns: ["product", "quantity", "user"]
    }
  },
  fields: {
    // TODO: custom label in here
    quantity: integer({
      defaultValue: 1,
      isRequired: true
    }),
    product: relationship({ ref: 'Product' }),
    user: relationship({ ref: 'User.cart' }),
  }
});