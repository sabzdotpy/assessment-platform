const generatePassword = (name, dob) => {
  const namePart = name.trim().slice(0, 4).toLowerCase();
  const dobPart = dob.replaceAll("-", ""); // e.g., "19990512"
  return `${namePart}${dobPart}`;
};
console.log(generatePassword("user1", "15-08-2006"));
export default generatePassword;
