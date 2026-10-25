import { z } from "zod";
import type { FieldErrors, Resolver } from "react-hook-form";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// This form has exactly two flat fields. Keep its existing first-error behavior
// while consuming the patched validator's public issues API.
export const loginResolver: Resolver<LoginFormValues> = async (values, _context, options) => {
  const result = loginSchema.safeParse(values);
  if (result.success) return { values: result.data, errors: {} };

  const errors: FieldErrors<LoginFormValues> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if ((field === "email" || field === "password") && !errors[field]) {
      errors[field] = { type: issue.code, message: issue.message, ref: options.fields[field]?.ref };
    }
  }
  return { values: {}, errors };
};
