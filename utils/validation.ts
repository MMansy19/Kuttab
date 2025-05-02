import { type NextRequest } from 'next/dist/server/web/spec-extension/request';
import { NextResponse } from 'next/dist/server/web/spec-extension/response';
import { ZodSchema } from 'zod';

/**
 * Validates a request against a Zod schema
 * @param schema Zod schema to validate against
 * @param handler Request handler function
 * @returns A function that can be used as middleware
 */
export function validateRequest<T>(
  schema: ZodSchema<T>,
  handler: (req: NextRequest, data: T) => Promise<Response> | Response
) {
  return async function validationMiddleware(req: NextRequest) {
    try {
      let data: any;
      const contentType = req.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        data = await req.json();
      } else if (contentType?.includes('application/x-www-form-urlencoded')) {
        const formData = await req.formData();
        data = Object.fromEntries(formData.entries());
      } else if (req.method === 'GET') {
        const url = new URL(req.url);
        const queryParams: Record<string, string> = {};
        
        url.searchParams.forEach((value, key) => {
          queryParams[key] = value;
        });
        
        data = queryParams;
      } else {
        throw new Error('نوع المحتوى غير مدعوم');
      }

      const validatedData = schema.parse(data);
      return handler(req, validatedData);
    } catch (error: any) {
      // Zod errors have a format method
      const formattedErrors = error.format?.() 
        ? error.format() 
        : { message: error.message || 'خطأ في التحقق من البيانات' };

      return NextResponse.json(
        { error: 'خطأ في التحقق من صحة البيانات', details: formattedErrors },
        { status: 400 }
      );
    }
  };
}