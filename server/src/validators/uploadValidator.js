import { z } from 'zod';

export const validateUploadImage = z.object({
  folder: z.string().optional().default('bekfood'),
});
