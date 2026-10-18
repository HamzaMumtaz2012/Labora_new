import { getCollection, apiError } from "../../../lib/mongodb";
import { cleanRecord, validateRequired } from "../../../lib/records";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const fields = [
  "employeeName",
  "phone",
  "email",
  "jobTitle",
  "department",
  "joiningDate",
  "salary",
  "employmentStatus",
  "address",
];
export async function GET() {
  try {
    const c = await getCollection("employees");
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
      "employeeName",
      "phone",
      "jobTitle",
      "department",
      "joiningDate",
    ]);
    if (issue)
      return Response.json({ success: false, error: issue }, { status: 400 });
    if (record.salary !== undefined) {
      const n = Number(record.salary);
      if (!Number.isFinite(n) || n < 0)
        return Response.json(
          {
            success: false,
            error: "Salary must be a valid non-negative number.",
          },
          { status: 400 },
        );
      record.salary = n;
    }
    record.createdAt = new Date();
    record.updatedAt = new Date();
    const c = await getCollection("employees");
    const result = await c.insertOne(record);
    return Response.json(
      {
        success: true,
        message: "Employee saved successfully.",
        data: {
          ...record,
          _id: String(result.insertedId),
          employeeId: `EMP-${String(result.insertedId).slice(-6).toUpperCase()}`,
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
