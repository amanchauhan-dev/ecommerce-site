// src/types/databaseTypes.ts

// Users Table Interface
export interface User {
    id: number;
    role: 'customer' | 'employee' | 'admin';
    fname: string;
    lname?: string;
    avatar?: string;
    email: string;
    password: string;
    phone_number?: string;
    is_email_verified: boolean;
    email_verify_token?: string;
    email_verify_token_exp_date?: Date;
    status: 'active' | 'inactive' 
    created_at: Date;
    updated_at: Date;
}

// Categories Table Interface
export interface Category {
    id: number;
    category_name: string;
    url_slug: string;
    parent_cat_id?: number | null;
    status: 'active' | 'inactive';
    created_at: Date;
    updated_at: Date;
}

// Products Table Interface
export interface Product {
    id: number;
    product_name: string;
    url_slug: string;
    product_image: string;
    category_id: number;
    description?: string;
    price: number;
    stock_quantity?: number;
    status?: 'active' | 'inactive';
    created_at?: Date;
    updated_at?: Date;
}

// Product Variants Table Interface
export interface ProductVariant {
    id: number;
    product_id: number;
    color?: string;
    size?: string;
    price: number;
    stock_quantity: number;
    created_at: Date;
    updated_at: Date;
}

// Images Table Interface
export interface Image {
    id: number;
    product_id: number;
    url: string;
}

// Carts Table Interface
export interface Cart {
    id: number;
    user_id: number;
    product_id?: number | null;
    product_variant_id?: number | null;
    quantity: number;
    created_at: Date;
    updated_at: Date;
}

// Addresses Table Interface
export interface Address {
    id: number;
    user_id: number;
    full_address: string;
    state: string;
    city: string;
    zip_code: string;
    created_at: Date;
    updated_at: Date;
}

// Orders Table Interface
export interface Order {
    id: number;
    order_number: string;
    user_id: number;
    total_amount: number;
    discount_amount: number;
    gross_amount: number;
    shipping_amount: number;
    net_amount: number;
    status: 'placed' | 'processing' | 'shipping' | 'delivered';
    payment_status: 'paid' | 'not-paid';
    payment_type: 'net-banking' | 'upi' | 'cod';
    payment_transaction_id?: string;
    created_at: Date;
    updated_at: Date;
}

// Order Items Table Interface
export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    product_variant_id: number;
    product_name: string;
    color?: string | null;
    size?: string | null;
    price: number;
    quantity: number;
    total_amount: number;
    created_at: Date;
    updated_at: Date;
}

// Order Shipping Addresses Table Interface
export interface OrderShippingAddress {
    id: number;
    order_id: number;
    full_address: string;
    state: string;
    city: string;
    zip_code: string;
    created_at: Date;
    updated_at: Date;
}

// Wishlist Table Interface
export interface Wishlist {
    id: number;
    user_id: number;
    product_id: number;
    product_variant_id: number;
    created_at: Date;
    updated_at: Date;
}

// Offers Table Interface
export interface Offer {
    id: number;
    coupon_code: string;
    discount_type: 'fixed' | 'rate';
    discount_value: number;
    start_date: Date;
    end_date: Date;
    description: string;
    status: 'active' | 'inactive';
    created_at: Date;
    updated_at: Date;
}
