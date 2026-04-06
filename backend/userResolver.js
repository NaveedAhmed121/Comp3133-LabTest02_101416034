const UserModel = require("./models/Users");
const bcrypt = require("bcrypt");

const userResolvers = {
    Mutation: {
        signup: async (_, { input }) => {
            const { username, email, password } = input;

            const existingUser = await UserModel.findOne({ $or: [{ username }, { email }] });
            if (existingUser) throw new Error("Username or email already exists.");

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await UserModel.create({ username, email, password: hashedPassword });

            return {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                created_at: newUser.created_at,
                updated_at: newUser.updated_at,
            };
        },
    },

    Query: {
        login: async (_, { input }) => {
            const { usernameOrEmail, password } = input;

            const user = await UserModel.findOne({
                $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
            });

            if (!user) throw new Error("User not found.");

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) throw new Error("Invalid password.");

            return {
                _id: user._id,
                username: user.username,
                email: user.email,
                created_at: user.created_at,
                updated_at: user.updated_at,
            };
        },
    },
};

module.exports = userResolvers;
