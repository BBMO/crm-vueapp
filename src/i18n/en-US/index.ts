// This is just an example,
// so you can safely delete all default props below

export default {
  global: {
    welcome: 'Welcome',
    welcomeMessage: 'Please sign-in to your account and start',
    email: 'Email',
    password: 'Password',
    state: 'State',
    role: 'Role',
    finished: 'Finished',
    notFinished: 'Not Finished',
    all: 'All',
    actions: 'Actions',
    edit: 'Edit',
    save: 'Save',
    update: 'Update',
    back: 'Back',
    suspend: 'Suspend',
    cancel: 'Cancel',
    accept: 'Accept',
    search: 'Search',
    delete: 'Delete',
    searchFilters: 'Search filters',
    export: 'Export',
    filters: 'Filters',
    cleanFilters: 'Clear filters',
    details: 'Details',
    general: 'General',
    security: 'Security',
    noResults: 'No results found',
    deleteMessage: 'Are you sure you want to delete this item? This action is irreversible and will delete all related data.',
    noDataAvailable: 'No data available'
  },
  menu: {
    dashboard: 'Dashboard',
    calendar: 'Calendar',
    agent: 'Agents',
    contact: 'Contacts',
    properties: 'Properties',
    opportunities: 'Opportunities',
    settings: 'Settings',
  },
  validation: {
    requiredField: 'Required field',
  },
  stats: {
    contacts: 'Contacts',
    clients: 'Clients',
    leads: 'Leads',
    registers: 'Registers',
    totalContact: 'Total registered contacts',
    totalClients: 'Total registered clients',
    totalLeads: 'Total registered leads',
    totalRegisters: 'Total contacts registered in the last week',
    properties: 'Properties',
    available: 'Available',
    sale: 'Available for sale',
    rent: 'Available for Rent',
    totalProperties: 'Total properties',
    totalAvailable: 'Total properties available',
    totalSale: 'Total available properties for sale',
    totalRent: 'Total available properties for rent',
    finished: 'Finished',
    progress: 'In progress',
    amount: 'Amount',
    amountRent: 'Amount per rent',
    opportunityFinished: 'Opportunities completed in the last month',
    opportunityProgress: 'Opportunities in progress',
    amountTotal: 'Amount earned last month',
    amountTotalRent: 'Amount obtained last month for rent',
  },
  auth: {
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password'
  },
  agent: {
    addAgent: 'Add Agent',
    editAgent: 'Edit Agent',
    userList: 'User List',
    amountNegotiations: 'Amount Negotiations',
    numberProperties: 'Number Properties',
    numberAgent: 'Number Agent',
    identification: 'Identification',
    name: 'Name',
    form: {
      username: 'Username',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      password: 'Password',
    }
  },
  contact: {
    addContact: 'Add Contact',
    editContact: 'Edit Contact',
    contactList: 'Contact List',
    client: 'Client',
    lead: 'Lead',
    name: 'Name',
    propertiesRecommended: 'Recommended Properties',
    opportunities: 'Opportunities',
    form: {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      interests: 'Interests',
      type: 'Type',
      features: 'Features',
    }
  },
  calendar: {
    addEvent: 'Add Event',
    editEvent: 'Edit Event',
    deleteEvent: 'Delete Event',
    agents: 'Agents',
    filter: 'Category Filter',
    form: {
      title: 'Title',
      category: 'Category',
      startDate: 'Start Date',
      endDate: 'End Date',
      allDay: 'All Day',
      location: 'Location',
      description: 'Description',
      agent: 'Agent',
    },
    placeholder: {
      title: 'Meeting with Jane',
      category: 'Select a category',
      startDate: 'Select start date',
      endDate: 'Select end date',
      location: 'Meeting room, URL, etc.',
    }
  },
  property: {
    title: 'Property',
    propertiesList: 'Properties List',
    addProperty: 'Add Property',
    editProperty: 'Edit Property',
    messageProperty: 'Information on each property ',
    informationProperty: 'Property Information',
    imagesProperty: 'Property Images',
    addBrowserImage: 'Add browser image',
    noImagesAdded: 'No images have been added',
    browserImages: 'Browser Images',
    removeFile: 'Remove File',
    coordinates:'Coordinates',
    configuration: 'Configuration',
    attributes: 'Attributes',
    address: 'Address',
    sale: 'Sale',
    rental: 'Rental',
    featureRequired: 'You must choose at least one feature',
    available: 'Available',
    rented: 'Rented',
    sold: 'Sold',
    visible: 'Visible',
    notVisible: 'Not Visible',
    all: 'All',
    form: {
      name: 'Name',
      description: 'Description',
      price: 'Price',
      availableFor: 'Available For',
      bedrooms: 'Bedrooms',
      bathrooms: 'Bathrooms',
      garages: 'Garages',
      size: 'Size',
      address: 'Address',
      city: 'City',
      state: 'State',
      zip: 'Zip',
      latitude: 'Latitude',
      longitude: 'Longitude',
      status: 'Status',
      agent: 'Agent',
      type: 'Type',
      images: 'Images',
      features: 'Features',
      enabled: 'Enabled',
    }
  },
  opportunity: {
    addOpportunity: 'Add Opportunity',
    editOpportunity: 'Edit Opportunity',
    messageConfirmationFinished: 'Are you sure you want to finalize the opportunity? If you accept, it will not be possible to go back, edit or delete the opportunity.',
    form: {
      contact: 'Contact',
      agent: 'Agent',
      amount: 'Amount',
      property: 'Property',
      availableFor: 'Available For',
      state: 'State',
    }
  },
  setting: {
    opportunity: 'Opportunity',
    property: 'Property',
    states: 'States',
    types: 'Types',
    categories: 'Categories',
    features: 'Features',
    calendar: 'Calendar',
    addState: 'Add state',
    editState: 'Edit state',
    addType: 'Add type',
    editType: 'Edit type',
    addFeature: 'Add feature',
    editFeature: 'Edit feature',
    addCategory: 'Add category',
    editCategory: 'Edit category',
    quantity: 'Quantity',
    form: {
      name: 'Name',
      color: 'Color',
    }
  },
};
