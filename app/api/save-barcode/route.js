import { NextResponse } from 'next/server';
import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI;

export async function POST(request) {
  const client = new MongoClient(uri, { 
    serverApi: ServerApiVersion.v1
  });

  try {
    const { barcode } = await request.json();

    await client.connect();
    const database = client.db('seohan');
    const collection = database.collection('barcodes');
    await collection.insertOne({ barcode });

    return NextResponse.json({ message: `Saved barcode: ${barcode}` });
  } catch (error) {
    console.error('Error saving barcode:', error);
    return NextResponse.json({ message: 'Error saving barcode' }, { status: 500 });
  } finally {
    await client.close();
  }
}

export function GET() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}
