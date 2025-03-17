import { z } from 'zod';

export const createOrganizationSchema = z.object({
  title: z.string().min(1, { message: 'Required Title: No title? That’s like a book without a name! Please add one!' }),
  type: z.number().min(1, { message: 'Org. Type is missing. Are we playing guess-the-field?' }),
  address: z.string().min(1, { message: 'No address? How will we send you postcards?' }),
  countryName: z.string().min(1, { message: 'Country name is required. The world map isn’t THAT big!' }),
  countryId: z.number().min(1, { message: 'Country ID is missing. Are we playing hide and seek?' }),
  stateName: z.string().min(1, { message: 'State name missing. Please tell us your coordinates!' }),
  stateId: z.number().min(1, { message: 'State ID is missing. Are we playing hide and seek?' }),
  districtName: z
    .string()
    .min(1, { message: 'District or City name is required. Don’t make us play geography games!' }),
  districtId: z.number().min(1, { message: 'District or City ID is missing. Are we playing hide and seek?' }),
  email: z.string().email({ message: 'No email? How will we send you memes?' }),
  phone: z.string().min(1, { message: 'Phone number needed. We can’t shout across the internet!' }),
  website: z.string().optional(),
  foundedYear: z.number().optional().nullable(),
});

export type CreateOrganizationFormType = z.infer<typeof createOrganizationSchema> & {
  stateId: number;
  countryId: number;
  districtId: number;
};
