import bcrypt from "bcrypt";

const HashedDetails = async function (next) {
  if (!this.isModified('password')) return next();

  const hashed = bcrypt.hashSync(this.password, 10);
  this.password = hashed;
  next();
};

export { HashedDetails };
