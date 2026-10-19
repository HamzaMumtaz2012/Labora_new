import { ObjectId } from "mongodb";
import { getCollection, apiError } from "../../../lib/mongodb";
import { cleanRecord, validateRequired } from "../../../lib/records";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const fields = [
  "patientName",
  "dateOfBirth",
  "gender",
  "phone",
  "email",
  "address",
  "registrationDate",
  "serviceId",
  "doctor",
  "service",
  "price",
  "status",
];
export async function GET() {
  try {
    const c = await getCollection("patients");
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
      "patientName",
      "gender",
      "phone",
      "registrationDate",
    ]);
    if (issue)
      return Response.json({ success: false, error: issue }, { status: 400 });
    if (record.serviceId) {
      if (!ObjectId.isValid(record.serviceId))
        return Response.json(
          { success: false, error: "Please select a valid test." },
          { status: 400 },
        );
      const services = await getCollection("services");
      const service = await services.findOne({
        _id: new ObjectId(record.serviceId),
      });
      if (!service)
        return Response.json(
          {
            success: false,
            error: "The selected test no longer exists. Refresh the page and select another test.",
          },
          { status: 404 },
        );
      if (service.status && service.status !== "Available")
        return Response.json(
          { success: false, error: "The selected test is not available." },
          { status: 400 },
        );
      if (!service.doctor)
        return Response.json(
          {
            success: false,
            error: "This test has no assigned doctor. Add its doctor in Products & Services first.",
          },
          { status: 400 },
        );
      const servicePrice = Number(service.price);
      if (!Number.isFinite(servicePrice) || servicePrice < 0)
        return Response.json(
          {
            success: false,
            error: "The selected test has an invalid price. Correct its price in Products & Services first.",
          },
          { status: 400 },
        );
      record.service = service.serviceName;
      record.price = servicePrice;
      record.doctor = service.doctor;
    } else if (record.price !== undefined) {
      const price = Number(record.price);
      if (!Number.isFinite(price) || price < 0)
        return Response.json(
          { success: false, error: "Price must be a valid non-negative number." },
          { status: 400 },
        );
      record.price = price;
    }
    record.createdAt = new Date();
    record.updatedAt = new Date();
    const c = await getCollection("patients");
    const result = await c.insertOne(record);
    return Response.json(
      {
        success: true,
        message: "Patient saved successfully.",
        data: {
          ...record,
          _id: String(result.insertedId),
          serviceId: record.serviceId,
          patientId: `PAT-${String(result.insertedId).slice(-6).toUpperCase()}`,
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
