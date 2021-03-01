import { CartItemCreateInput } from './../.keystone/schema-types';
import { KeystoneContext } from "@keystone-next/types";
import { Session} from "../types"

export default async function addToCart(root: any,
  { productId }: { 
    productId: string
  }, context: KeystoneContext): Promise<CartItemCreateInput> {
    console.log(
      "ADDING TO CART"
    )

    // 1. Query the current user to see if they are signed in

    const session = context.session as Session;

    if (!session.itemId) {
      throw new Error('You must be logged in to do this!');
    }

    // 2. Query the current users cart

    const allCartItems = await context.lists.CartItem.findMany({
      where: {
        user: {
          id: session.itemId
        },
        product: {
          id: productId
        }
      },
      resolveFields: 'id, quantity'
    });

    const [existingCartItem] = allCartItems;
    
    // 3. See if the current Item is in the cart
    // 4. If it is, increment by 1
    if (existingCartItem) {
      console.log(existingCartItem)
      console.log(`There are already ${existingCartItem.quantity}, increment by 1`);
       
      
      return await context.lists.CartItem.updateOne({
        id: existingCartItem.id,
        data: {
          quantity: existingCartItem.quantity + 1
        }
      })
    } 


       
    // 4. If it isn't, create a new art item
    return await context.lists.CartItem.createOne({
      data: {
        product: {
          connect: {
            id: productId
          }
        },
        user: {
          connect: {
            id: session.itemId
          }
        }
      }
    })
}