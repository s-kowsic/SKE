require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const connectDB = require('./config/db');

const seedData = async () => {
  await connectDB();

  try {
    await User.deleteMany();
    await Product.deleteMany();

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@srikrishna.com',
      password: 'password123',
      role: 'Admin'
    });

    const customer = await User.create({
      name: 'Customer One',
      email: 'customer@srikrishna.com',
      password: 'password123',
      role: 'Customer'
    });

    const products = [
      {
        name: 'Heavy Duty Steel Flange',
        type: 'Flange',
        size: '12 inch',
        price: 150.00,
        imageUrl: 'https://images.unsplash.com/photo-1584988015099-0f04e0302b4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'High pressure steel flange suitable for industrial pipeline applications.'
      },
      {
        name: 'Brass Gate Valve',
        type: 'Valve',
        size: '4 inch',
        price: 85.50,
        imageUrl: 'https://images.unsplash.com/photo-1598587123984-7a9355150e68?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Durable brass gate valve for fluid control in demanding environments.'
      },
      {
        name: 'Industrial Pipe Connector',
        type: 'Connector',
        size: '6 inch',
        price: 45.00,
        imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Seamless connector fitting for high-temperature pipe joints.'
      },
      {
        name: 'Carbon Steel Bearing',
        type: 'Bearing',
        size: 'Medium',
        price: 210.00,
        imageUrl: 'https://images.unsplash.com/photo-1554906932-a5e0b679b37c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'High-load bearing component designed for heavy machinery.'
      }
    ];

    await Product.insertMany(products);

    console.log('Data Imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
