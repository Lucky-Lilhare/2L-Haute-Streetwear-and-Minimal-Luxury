import User from './user.js';
import Product from './product.js';
import Cart from './cart.js';
import Wishlist from './wishlist.js';
import Order from './order.js';
import Issue from './issue.js';

// Named exports (both PascalCase and lowercase for maximum flexibility)
export {
  User,
  Product,
  Cart,
  Wishlist,
  Order,
  Issue,
  User as user,
  Product as product,
  Cart as cart,
  Wishlist as wishlist,
  Order as order,
  Issue as issue,
};

// Default export
export default {
  User,
  Product,
  Cart,
  Wishlist,
  Order,
  Issue,
  user: User,
  product: Product,
  cart: Cart,
  wishlist: Wishlist,
  order: Order,
  issue: Issue,
};
