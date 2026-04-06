const EmployeeModel = require("./models/Employee");

const employeeResolvers = {
    Query: {
        getAllEmployees: async () => {
            return EmployeeModel.find().sort({ created_at: -1 });
        },

        searchEmployeeByEid: async (_, { eid }) => {
            const emp = await EmployeeModel.findById(eid);
            if (!emp) throw new Error("Employee not found");
            return emp;
        },

        // ✅ #8: search by designation OR department
        searchEmployeeByDesignationOrDepartment: async (_, { designation, department }) => {
            if (!designation && !department) {
                throw new Error("Provide designation or department");
            }

            const query = {};
            if (designation) query.designation = designation;
            if (department) query.department = department;

            return EmployeeModel.find(query).sort({ first_name: 1 });
        },
    },

    Mutation: {
        addNewEmployee: async (_, { input }) => {
            const required = ["first_name","last_name","email","gender","designation","salary","date_of_joining","department"];
            for (const f of required) {
                if (input[f] === undefined || input[f] === null || String(input[f]).trim() === "") {
                    throw new Error(`${f} is required`);
                }
            }
            if (Number(input.salary) < 1000) throw new Error("salary must be >= 1000");

            const exists = await EmployeeModel.findOne({ email: input.email });
            if (exists) throw new Error("Employee email already exists");

            const emp = await EmployeeModel.create(input);
            return emp;
        },

        updateEmployeeByEid: async (_, { eid, input }) => {
            if (input.salary !== undefined && Number(input.salary) < 1000) {
                throw new Error("salary must be >= 1000");
            }

            const emp = await EmployeeModel.findById(eid);
            if (!emp) throw new Error("Employee not found");

            if (input.email && input.email !== emp.email) {
                const exists = await EmployeeModel.findOne({ email: input.email });
                if (exists) throw new Error("Employee email already exists");
            }

            Object.assign(emp, input);
            await emp.save();
            return emp;
        },

        deleteEmployeeByEid: async (_, { eid }) => {
            const emp = await EmployeeModel.findById(eid);
            if (!emp) throw new Error("Employee not found");

            await EmployeeModel.deleteOne({ _id: eid });
            return { success: true, message: "Employee deleted successfully" };
        },
    },
};

module.exports = employeeResolvers;
