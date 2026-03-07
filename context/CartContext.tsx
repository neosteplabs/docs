"use client";

import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  setDoc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { useAuth } from "./AuthContext";

type CartItem = {
  id: string;
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  totalQty: number;
  totalPrice: number;
  addToCart: (item: {
    productId: string;
    name: string;
    sku: string;
    price: number;
    quantity: number;
  }) => Promise<void>;
  increaseQty: (id: string) => Promise<void>;
  decreaseQty: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const [items, setItems] = useState<CartItem[]>([]);
  const [totalQty, setTotalQty] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (!user) return;

    const cartRef = collection(db, "users", user.uid, "cart");

    const unsubscribe = onSnapshot(cartRef, (snapshot) => {
      const newItems: CartItem[] = [];
      let qty = 0;
      let total = 0;

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();

        const item: CartItem = {
          id: docSnap.id,
          productId: data.productId,
          name: data.name,
          sku: data.sku,
          price: data.price,
          quantity: data.quantity,
        };

        qty += item.quantity;
        total += item.quantity * item.price;

        newItems.push(item);
      });

      setItems(newItems);
      setTotalQty(qty);
      setTotalPrice(total);
    });

    return () => unsubscribe();
  }, [user]);

  const addToCart = async (item: {
    productId: string;
    name: string;
    sku: string;
    price: number;
    quantity: number;
  }) => {
    if (!user) return;

    // 🔥 UNIQUE ID PER PRODUCT + SKU
    const cartId = `${item.productId}_${item.sku}`;

    const itemRef = doc(db, "users", user.uid, "cart", cartId);
    const existing = await getDoc(itemRef);

    if (existing.exists()) {
      await updateDoc(itemRef, {
        quantity: existing.data().quantity + item.quantity,
      });
    } else {
      await setDoc(itemRef, {
        ...item,
      });
    }
  };

  const increaseQty = async (id: string) => {
    if (!user) return;

    const ref = doc(db, "users", user.uid, "cart", id);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      await updateDoc(ref, {
        quantity: snap.data().quantity + 1,
      });
    }
  };

  const decreaseQty = async (id: string) => {
    if (!user) return;

    const ref = doc(db, "users", user.uid, "cart", id);
    const snap = await getDoc(ref);

    if (!snap.exists()) return;

    const qty = snap.data().quantity;

    if (qty > 1) {
      await updateDoc(ref, { quantity: qty - 1 });
    } else {
      await deleteDoc(ref);
    }
  };

  const clearCart = async () => {
    if (!user) return;

    const cartRef = collection(db, "users", user.uid, "cart");
    const snapshot = await getDocs(cartRef);

    await Promise.all(
      snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref))
    );
  };

  return (
    <CartContext.Provider
      value={{
        items,
        totalQty,
        totalPrice,
        addToCart,
        increaseQty,
        decreaseQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}