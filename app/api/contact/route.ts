import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(7).max(30),
  message: z.string().trim().min(3).max(2000)
});

export async function POST(request: Request) {
  const form = await request.formData();
  const parsed = schema.safeParse({
    name: form.get("name"),
    phone: form.get("phone"),
    message: form.get("message")
  });
  if (!parsed.success) return NextResponse.json({ error: "اطلاعات واردشده معتبر نیست." }, { status: 400 });
  await prisma.contactMessage.create({ data: parsed.data });
  return new Response(null, { status: 303, headers: { Location: "/?message=sent#contact" } });
}
