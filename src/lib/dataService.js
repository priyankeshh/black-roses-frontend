/**
 * Data service for handling database operations
 * This will be replaced with MongoDB implementation later
 */

// Mock data for development
const mockEvents = [
  {
    id: '1',
    title: 'Operation Black Forest',
    description: 'A tactical woodland operation with multiple objectives and team-based gameplay.',
    date: '2023-12-15',
    time: '09:00 - 17:00',
    location: 'Brasschaat Military Domain'
  },
  {
    id: '2',
    title: 'Urban Assault',
    description: 'CQB training in an abandoned factory complex. Focus on room clearing and building security.',
    date: '2024-01-20',
    time: '10:00 - 16:00',
    location: 'Antwerp Urban Training Facility'
  },
  {
    id: '3',
    title: 'Night Operations',
    description: 'Special night operation with limited visibility. NVG and tactical lights recommended.',
    date: '2024-02-10',
    time: '18:00 - 00:00',
    location: 'Ghent Tactical Zone'
  }
];

const mockProducts = [
  {
    id: '1',
    name: 'Black Roses Team Patch',
    description: 'Official team patch with velcro backing',
    price: 12.99,
    image_url: 'https://images.pexels.com/photos/1337247/pexels-photo-1337247.jpeg'
  },
  {
    id: '2',
    name: 'Tactical Team T-Shirt',
    description: 'Moisture-wicking performance shirt with team logo',
    price: 24.99,
    image_url: 'https://images.pexels.com/photos/6766262/pexels-photo-6766262.jpeg'
  },
  {
    id: '3',
    name: 'Black Roses Hoodie',
    description: 'Warm team hoodie for cold weather operations',
    price: 49.99,
    image_url: 'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg'
  },
  {
    id: '4',
    name: 'Team Cap',
    description: 'Adjustable tactical cap with team logo',
    price: 19.99,
    image_url: 'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg'
  }
];

// Event functions
export const getEvents = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockEvents;
};

export const getEventById = async (id) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockEvents.find(event => event.id === id) || null;
};

export const createEvent = async (eventData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // In a real implementation, this would add to the database
  console.log('Creating event:', eventData);
  return { success: true };
};

export const registerForEvent = async (eventId, registrationData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // In a real implementation, this would add to the database
  console.log('Registering for event:', eventId, registrationData);
  return { success: true };
};

// Product functions
export const getProducts = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockProducts;
};

export const getProductById = async (id) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockProducts.find(product => product.id === id) || null;
};

// Contact functions
export const submitContactForm = async (contactData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // In a real implementation, this would add to the database
  console.log('Submitting contact form:', contactData);
  return { success: true };
};
