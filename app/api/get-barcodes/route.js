import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = process.env.MONGODB_URI;

export async function GET(req, res) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('seohan');
    const collection = database.collection('barcodes');
    const barcodes = await collection.find().sort({ _id: -1 }).toArray();
    return NextResponse.json({ barcodes });
  } catch (error) {
    console.error('Error fetching barcodes:', error);
    return NextResponse.json({ message: 'Error fetching barcodes' }, { status: 500 });
  } finally {
    await client.close();
  }
}
