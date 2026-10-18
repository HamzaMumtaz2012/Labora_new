import { getCollection, apiError } from "../../../lib/mongodb";
import { cleanRecord, validateRequired } from "../../../lib/records";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const fields = [
  "serviceName",
  "category",
  "sampleType",
  "price",
  "turnaroundTime",
  "status",
  "description",
  "sku",
  "stock",
  "expiryDate",
];
export async function GET() {
  try {
    const c = await getCollection("services");
    const rows = await c.find({}).sort({ createdAt: -1 }).limit(200).toArray();
    return Response.json({
      success: true,
      data: rows.map((p) => ({ ...p, _id: String(p._id) })),
    });
  } catch (e) {
    return apiError(e);
  }
}
export async function POST(request) {
  try {
    const body = await request.json();
    const record = cleanRecord(body, fields);
    const issue = validateRequired(record, [
      "serviceName",
      "category",
      "price",
    ]);
    if (issue)
      return Response.json({ success: false, error: issue }, { status: 400 });
    const price = Number(record.price);
    if (!Number.isFinite(price) || price < 0)
      return Response.json(
        { success: false, error: "Price must be a valid non-negative number." },
        { status: 400 },
      );
    record.price = price;
    if (record.stock !== undefined) {
      const n = Number(record.stock);
      if (!Number.isInteger(n) || n < 0)
        return Response.json(
          {
            success: false,
            error: "Stock must be a non-negative whole number.",
          },
          { status: 400 },
        );
      record.stock = n;
    }
    record.createdAt = new Date();
    record.updatedAt = new Date();
    const c = await getCollection("services");
    const result = await c.insertOne(record);
    return Response.json(
      {
        success: true,
        message: "Service saved successfully.",
        data: {
          ...record,
          _id: String(result.insertedId),
          serviceId: `SRV-${String(result.insertedId).slice(-6).toUpperCase()}`,
        },
      },
      { status: 201 },
    );
  } catch (e) {
    if (e instanceof SyntaxError)
      return Response.json(
        { success: false, error: "Request body must be valid JSON." },
        { status: 400 },
      );
    return apiError(e);
  }
}
