import bcrypt from "bcrypt";

const Hash = function (next) {
  const hashed = bcrypt.hashSync(this.password, 10);
  this.password = hashed
  next();
};

export { Hash };
