const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const JwtService = require("../services/JwtService")

const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, password, phone, isAdmin, address , avatar, city} = newUser;
    try {
      const checkUser = await User.findOne({
        email: email,
      });
      if (checkUser !== null) {
        resolve({
          status: "OK",
          message: "The email is already existed",
        });
      }
      const hash = bcrypt.hashSync(password, 10);

      const createUser = await User.create({ name, email, password: hash, phone, isAdmin, address , avatar, city });
      if (createUser) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: createUser,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const signIn = (user) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = user;
    try {
      const userInfo = await User.findOne({ email });
      if (!userInfo) {
        resolve({
          status: "ERR",
          message: "This email was not existed",
        });
      }

      const comparPassword = bcrypt.compareSync(password, userInfo.password);
      if (!comparPassword) {
        resolve({
          status: "ERR",
          message: "The password is incorrect",
        });
      }
      const access_token = await JwtService.generalAccessToken({
        id: userInfo.id,
        isAdmin: userInfo.isAdmin
      })

      const refresh_token = await JwtService.generalRefreshToken({
        id: userInfo.id,
        isAdmin: userInfo.isAdmin
      })

      resolve({
        status: "OK",
        message: "Login successfull",
        access_token,
        refresh_token
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getAllUsers = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const users = await User.find({});
      resolve({
        status: "OK",
        data: users,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const userInfo = await User.findOne({ _id: id });
      if (!userInfo) {
        resolve({
          status: "ERR",
          message: "The user is not definded",
        });
      }

      // await User.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Delete user success",
      });
    } catch (error) {
      reject(error);
    }
  });
};

const deleteManyUsers = (userIds) => {
  return new Promise(async (resolve, reject) => {
    try {
      await User.deleteMany({ _id: userIds });
      resolve({
        status: "OK",
        message: "Delete many users success",
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getDetailsUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const userInfo = await User.findOne({ _id: userId });
      if (!userInfo) {
        resolve({
          status: "ERR",
          message: "The user does not exists",
        });
      }
      resolve({
        status: "OK",
        data: userInfo,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const updateUser = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const userInfo = await User.findOne({ _id: id });
      if (!userInfo) {
        resolve({
          status: "ERR",
          message: "The user does not exists",
        });
      }
      if(data.password) {
        const data = { ...data, password: bcrypt.hashSync(data.password, 10) };
      }
      const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });

      resolve({
        status: "OK",
        message: "Update is successed",
        data: updatedUser,
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createUser,
  signIn,
  getAllUsers,
  deleteUser,
  deleteManyUsers,
  getDetailsUser,
  updateUser,
};
