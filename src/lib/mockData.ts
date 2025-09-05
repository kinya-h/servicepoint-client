
import type { User, EducationLevel, HomeRepairCategory } from '../lib/types';
import { BookOpen, Home, Wrench, Sparkles, GraduationCap, School, Feather, Palette, TestTube, Globe, Calculator, Briefcase, Atom, Film, Music, Languages, Code, Landmark, DraftingCompass, Server, Zap, PaintRoller, Hammer } from 'lucide-react';
import type { Service } from '../types/Service';

export const educationLevels: EducationLevel[] = [
  {
    name: "Pre-Kindergarten (Pre-K)",
    subjects: [
      { name: "Basic Math (counting, shapes)", icon: Calculator },
      { name: "Pre-Reading (letters, storytelling)", icon: Feather },
      { name: "Science (nature, weather)", icon: TestTube },
      { name: "Arts and Crafts", icon: Palette },
      { name: "Music and Movement", icon: Music },
    ],
    icon: School,
  },
  {
    name: "Kindergarten",
    subjects: [
      { name: "Reading and Phonics", icon: Feather },
      { name: "Basic Math (addition, subtraction)", icon: Calculator },
      { name: "Science (plants, animals)", icon: TestTube },
      { name: "Social Studies (family, community)", icon: Globe },
      { name: "Arts and Crafts", icon: Palette },
      { name: "Physical Education", icon: Briefcase },
    ],
    icon: School,
  },
  {
    name: "Elementary School (Grades 1-5/6)",
    subjects: [
      { name: "English Language Arts (reading, writing, vocabulary)", icon: Feather },
      { name: "Math (arithmetic, fractions, basic geometry)", icon: Calculator },
      { name: "Science (earth science, biology)", icon: TestTube },
      { name: "Social Studies (geography, U.S. history)", icon: Globe },
      { name: "Arts and Music", icon: Palette },
      { name: "Physical Education", icon: Briefcase },
    ],
    icon: School,
  },
  {
    name: "Middle School (Grades 6-8)",
    subjects: [
      { name: "English Language Arts (literature, essay writing)", icon: Feather },
      { name: "Math (algebra, pre-algebra, geometry)", icon: Calculator },
      { name: "Science (biology, chemistry, earth science)", icon: TestTube },
      { name: "Social Studies (world history, U.S. government)", icon: Globe },
      { name: "Physical Education", icon: Briefcase },
      { name: "Foreign Languages", icon: Languages },
      { name: "Art", icon: Palette },
      { name: "Computer Science", icon: Code },
    ],
    icon: GraduationCap,
  },
  {
    name: "High School (Grades 9-12)",
    subjects: [
      { name: "English (literature, creative writing)", icon: Feather },
      { name: "Math (algebra, trigonometry, calculus)", icon: Calculator },
      { name: "Science (biology, chemistry, physics)", icon: Atom },
      { name: "Social Studies (U.S. history, world history, civics)", icon: Landmark },
      { name: "Foreign Languages (Spanish, French, etc.)", icon: Languages },
      { name: "Arts (theater, music, painting)", icon: Palette },
      { name: "Computer Science", icon: Code },
      { name: "Business (entrepreneurship, accounting)", icon: Briefcase },
    ],
    icon: GraduationCap,
  },
  {
    name: "Undergraduate (Higher Education)",
    subjects: [
      { name: "General Education (English, Math, Science, Humanities)", icon: Feather },
      { name: "Major-Specific Subjects (e.g., Engineering, Psychology, Business)", icon: DraftingCompass },
      { name: "Advanced Computer Science", icon: Server},
      { name: "Film Studies", icon: Film},
    ],
    icon: GraduationCap,
  }
];

export const homeRepairCategories: HomeRepairCategory[] = [
  { value: "all", label: "All Home Repairs" },
  { value: "plumbing", label: "Plumbing", icon: Wrench },
  { value: "electrical", label: "Electrical", icon: Zap },
  { value: "painting", label: "Painting", icon: PaintRoller },
  { value: "handyman", label: "General Handyman", icon: Hammer },
];


export const mockProviders: (User & { services: Service[], shortBio?: string })[] = [
  {
    id: "1",
    name: "John's Plumbing",
    email: "john@plumbing.com",
    role: "provider",
    location: "Springfield, IL",
    latitude: 39.7817,
    longitude: -89.6501,
    profilePicture: "https://placehold.co/80x80.png",
    rating: 4.8,
    reviewCount: 152,
    specialties: ["Plumbing", "Drain Cleaning"],
    distanceMiles: 2,
    services: [
      { serviceId: 2, provider: {id:1, email:"test@gmail.com", username:"Home Repairs", role:"customer"}, category: "Home Repairs", name: "Plumbing Repairs", description: "Fixing leaks, clogs, etc.", price: 75, pricingType: "hourly", icon: "Wrench" },
      { serviceId: 1, provider: {id:2, email:"test@gmail.com", username:"Home Repairs", role:"customer"}, category: "Home Repairs", name: "Drain Cleaning", description: "Clearing blocked drains.", price: 90, pricingType: "per_work", icon: "Wrench" },
      { serviceId: 2, provider: {id:2, email:"test@gmail.com", username:"Home Repairs", role:"customer"}, category: "Home Repairs", name: "Fixture Installation", description: "Installing sinks, toilets.", price: 120, pricingType: "per_work", icon: "Wrench" }
    ],
    shortBio: "Expert plumbing services for Springfield. Quick, reliable, and affordable. 10+ years experience in all types of pipe work and fixture installations.",
  },
  {
    id: "2",
    name: "Alice Cleaning Co.",
    email: "alice@cleaning.com",
    role: "provider",
    location: "Shelbyville, IL",
    latitude: 39.4067,
    longitude: -88.7915,
    profilePicture: "https://placehold.co/80x80.png",
    rating: 4.5,
    reviewCount: 88,
    distanceMiles: 15, // Further away
    services: [
        {serviceId: 1, provider:{id:2, email:"test@gmail.com", username:"Home Repairs", role:"customer"}, category: "House Services", name: "Residential Cleaning", description: "Regular home cleaning.", price: 30, pricingType: "hourly", icon: "Sparkles" },
        {serviceId: 3, provider: {id:1, email:"test@gmail.com", username:"Home Repairs", role:"customer"},category: "House Services", name: "Deep Cleaning", description: "Intensive cleaning service.", price: 150, pricingType: "per_work", icon: "Sparkles" }
    ],
    shortBio: "Your go-to for sparkling clean homes in Shelbyville. Eco-friendly options available. We cover everything from routine upkeep to intensive deep cleans.",
  },
  {
    id: "3",
    name: "Bob's Tutoring Hub",
    email: "bob@tutoring.com",
    role: "provider",
    location: "Online", // No lat/lon for online
    profilePicture: "https://placehold.co/80x80.png",
    rating: 4.9,
    reviewCount: 210,
    services: [
      { serviceId: 1, provider:{id:3, email:"test3@gmail.com", username:"Home Repairs", role:"provider"}, category: "Tutoring", name: "Algebra Tutoring", level: "Middle School", subject: "Math (algebra, pre-algebra, geometry)", description: "Helping students master Algebra.", price: 45, pricingType: "hourly", icon: "BookOpen" },
      { serviceId:2, provider: {id:3, email:"test3@gmail.com", username:"Home Repairs", role:"provider"}, category: "Tutoring", name: "Calculus Tutoring", level: "High School", subject: "Math (algebra, trigonometry, calculus)", description: "Advanced calculus concepts.", price: 55, pricingType: "hourly", icon: "BookOpen" },
      { serviceId: 5, provider: {id:3, email:"test3@gmail.com", username:"Home Repairs", role:"provider"}, category: "Tutoring", name: "Physics Tutoring", level: "High School", subject: "Science (biology, chemistry, physics)", description: "High school physics made easy.", price: 50, pricingType: "hourly", icon: "BookOpen" }
    ],
    shortBio: "Experienced online tutor specializing in High School & College Math (Algebra, Calculus, Statistics) and Physics. Patient and results-oriented.",
  },
   {
    id: "4",
    name: "EcoShine Cleaners",
    email: "eco@shine.com",
    role: "provider",
    location: "Springfield, IL",
    latitude: 39.8020,
    longitude: -89.6350,
    profilePicture: "https://placehold.co/80x80.png",
    rating: 4.7,
    reviewCount: 95,
    distanceMiles: 3,
    services: [{serviceId: 2, provider: {id:4, email:"test4@gmail.com", username:"Home Repairs", role:"provider"}, category: "House Services", name: "Eco-Friendly Cleaning", description: "Green cleaning solutions.", price: 35, pricingType: "hourly", icon: "Sparkles" }],
    shortBio: "Green cleaning solutions for a healthier home in Springfield. Safe for pets and kids. We use only certified organic products.",
  },
  {
    id: "hRepair1",
    name: "Handy Harry",
    email: "harry@handy.com",
    role: "provider",
    location: "Springfield, IL",
    latitude: 39.7700,
    longitude: -89.6600,
    profilePicture: "https://placehold.co/80x80.png",
    rating: 4.6,
    reviewCount: 110,
    specialties: ["General Handyman", "Painting", "Furniture Assembly"],
    distanceMiles: 1,
    services: [
        { serviceId: 1, provider:{id:1, email:"test1@gmail.com", username:"Home Repairs", role:"provider"}, category: "Home Repairs", name: "General Handyman", description: "Small fixes around the house.", price: 40, pricingType: "hourly", icon: "Hammer" },
        { serviceId: 2, provider:{id:3, email:"test3@gmail.com", username:"Home Repairs", role:"provider"}, category: "Home Repairs", name: "Interior Painting", description: "Interior painting.", price: 200, pricingType: "per_work", icon: "PaintRoller" },
        { serviceId:3, provider: {id:3, email:"test3@gmail.com", username:"Home Repairs", role:"provider"}, category: "Home Repairs", name: "Furniture Assembly", description: "Assembling flat-pack furniture.", price: 60, pricingType: "per_work", icon: "Wrench" }
    ],
    shortBio: "Your reliable handyman for all small home repairs and improvements in Springfield. No job too small! Over 15 years experience.",
  },
  {
    id: "hRepair2",
    name: "FixIt Felix",
    email: "felix@fixit.com",
    role: "provider",
    location: "Springfield, IL",
    latitude: 39.7900,
    longitude: -89.6400,
    profilePicture: "https://placehold.co/80x80.png",
    rating: 4.3,
    reviewCount: 75,
    specialties: ["Electrical", "Appliance Installation"],
    distanceMiles: 4,
    services: [
        { serviceId: 3, provider: {id:3, email:"test3@gmail.com", username:"Home Repairs", role:"provider"}, category: "Home Repairs", name: "Electrical Repairs", description: "Minor electrical fixes.", price: 65, pricingType: "hourly", icon: "Zap" },
        { serviceId: 4, provider: {id:3, email:"test3@gmail.com", username:"Home Repairs", role:"provider"}, category: "Home Repairs", name: "Appliance Installation", description: "Installing new appliances.", price: 100, pricingType: "per_work", icon: "Wrench" }
    ],
    shortBio: "Certified electrician for minor electrical repairs and appliance installations in Springfield. Safety first!",
  },
  {
    id: "tutor1",
    name: "Sarah Adams - English Tutor",
    email: "sarah@tutoring.com",
    role: "provider",
    location: "Online",
    profilePicture: "https://placehold.co/80x80.png",
    rating: 4.8,
    reviewCount: 180,
    services: [
        { serviceId: 1, provider: {id:5, email:"test5@gmail.com", username:"john", role:"provider"}, category: "Tutoring", name: "English Literature", level: "High School", subject: "English (literature, creative writing)", description: "High school English lit.", price: 50, pricingType: "hourly", icon: "BookOpen" },
        { serviceId: 4, provider: {id:3, email:"test3@gmail.com", username:"", role:"provider"}, category: "Tutoring", name: "Essay Writing", level: "High School", subject: "English (literature, creative writing)", description: "Help with academic essays.", price: 45, pricingType: "hourly", icon: "BookOpen" },
        { serviceId: 5, provider: {id:3, email:"test3@gmail.com", username:"", role:"provider"}, category: "Tutoring", name: "SAT Prep (Verbal)", level: "High School", subject: "English (literature, creative writing)", description: "Verbal section SAT prep.", price: 60, pricingType: "hourly", icon: "BookOpen" },
        { serviceId: 4, provider:{id:3, email:"test3@gmail.com", username:"", role:"provider"} , category: "Tutoring", name: "Basic Reading (Elementary)", level: "Elementary School (Grades 1-5/6)", subject: "English Language Arts (reading, writing, vocabulary)", description: "Elementary reading skills.", price: 40, pricingType: "hourly", icon: "BookOpen" },
    ],
    shortBio: "MA in English Literature. Helping students excel in reading, writing, and critical analysis. All ages. Online sessions.",
  },
  {
    id: "tutor2",
    name: "Chem Whiz Clara",
    email: "clara@chem.com",
    role: "provider",
    location: "Online",
    profilePicture: "https://placehold.co/80x80.png",
    rating: 4.7,
    reviewCount: 130,
    services: [
        { serviceId: 3, provider: {id:3, email:"test3@gmail.com", username:"", role:"provider"}, category: "Tutoring", name: "General Chemistry", level: "High School", subject: "Science (biology, chemistry, physics)", description: "High school chemistry.", price: 55, pricingType: "hourly", icon: "BookOpen" },
        { serviceId: 4, provider:{id:12, email:"test12@gmail.com", username:"", role:"provider"}, category: "Tutoring", name: "Organic Chemistry", level: "Undergraduate (Higher Education)", subject: "Major-Specific Subjects (e.g., Engineering, Psychology, Business)", description: "College-level O-Chem.", price: 60, pricingType: "hourly", icon: "BookOpen" },
        { serviceId: 4, provider: {id:33, email:"test33@gmail.com", username:"", role:"provider"}, category: "Tutoring", name: "Biology (Middle School)", level: "Middle School", subject: "Science (biology, chemistry, earth science)", description: "Middle school biology concepts.", price: 45, pricingType: "hourly", icon: "BookOpen" },
    ],
    shortBio: "PhD in Chemistry. Making complex science topics easy to understand. Specializing in high school and undergraduate chemistry & biology. Online.",
  },
  {
    id: "tutor3",
    name: "History Buff Tom",
    email: "tom@history.com",
    role: "provider",
    location: "Online",
    profilePicture: "https://placehold.co/80x80.png",
    rating: 4.2,
    reviewCount: 65,
    services: [
        { serviceId: 3, provider: {id:3, email:"test3@gmail.com", username:"", role:"provider"}, category: "Tutoring", name: "World History", level: "High School", subject: "Social Studies (U.S. history, world history, civics)", description: "High school world history.", price: 40, pricingType: "hourly", icon: "BookOpen" },
        { serviceId: 3, provider:{id:4, email:"test4@gmail.com", username:"", role:"provider"}, category: "Tutoring", name: "US History (Middle School)", level: "Middle School", subject: "Social Studies (world history, U.S. government)", description: "Middle school US history.", price: 40, pricingType: "hourly", icon: "BookOpen" }
    ],
    shortBio: "Passionate history graduate making learning history engaging and fun for all levels. Online tutoring available.",
  }
];

export const serviceCategories = [
  { name: "Tutoring", icon: BookOpen, description: "Personalized online tutoring to achieve academic goals.", hint: "education books" },
  { name: "Home Repairs", icon: Wrench, description: "General home repair and handyman services.", hint: "home tools" },
];

mockProviders.forEach(provider => {
  provider.services.forEach((service, index) => {
    if (service && !service.serviceId) service.serviceId = index + Number(provider.id);
    if (service && !service.provider.id) service.provider.id = Number(provider.id);
    if (service && !service.category) throw new Error(`Service ${service.name} for provider ${provider.name} is missing category`);
    if (service && !service.name) throw new Error(`Service at index ${index} for provider ${provider.name} is missing name`);
    if (service && !service.description) service.description = `Description for ${service.name}`;
    if (service && service.price === undefined) service.price = 50;
    if (service && !service.pricingType) service.pricingType = "hourly";
  });
});
