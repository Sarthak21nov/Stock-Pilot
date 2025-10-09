export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

export const calculateNetCost = (totalCost, discountPercentage) => {
  return totalCost - (totalCost * discountPercentage / 100);
};

export const isLicenseExpiringSoon = (validityDate, days = 30) => {
  const today = new Date();
  const validity = new Date(validityDate);
  const diffTime = validity - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= days && diffDays > 0;
};

export const isLicenseExpired = (validityDate) => {
  return new Date(validityDate) < new Date();
};
