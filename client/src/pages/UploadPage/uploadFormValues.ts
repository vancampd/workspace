export type UploadFormValues = {
    title: string;
    description: string;
    rentPeriod: string[];
    amenities: string[];
    price: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    email: string;
    image: FileList;
};

// Fields validated (via `trigger`) before moving past each step.
export const STEP_FIELDS: (keyof UploadFormValues)[][] = [
    ['title', 'description', 'rentPeriod', 'price'],
    ['streetAddress', 'city', 'state', 'zipCode'],
    ['phone', 'email'],
];
