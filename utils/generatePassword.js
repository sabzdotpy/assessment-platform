const generatePassword = (name, dob) => {
  const namePart = name.trim().slice(0, 4).toLowerCase();
  const dobPart = dob.replaceAll("-", ""); // e.g., "19990512"
  return `${namePart}${dobPart}`;
};
export default generatePassword;
