import tests from "../../patients/tests.json";
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
  "testCode",
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
      "testCode",
    ]);
    if (issue)
      return Response.json({ success: false, error: issue }, { status: 400 });
    const selectedTest = tests.find((test) => test.testCode === record.testCode);
    if (!selectedTest)
      return Response.json(
        { success: false, error: "Please select a valid test." },
        { status: 400 },
      );
    record.service = selectedTest.testName;
    record.price = selectedTest.price;
    record.doctor = selectedTest.doctorName;
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
