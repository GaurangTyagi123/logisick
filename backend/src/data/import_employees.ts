import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Employees from '../models/employee.model';
dotenv.config({ path: '../../config.env' });

// update owner ids after importing new users
const Employee_data = [
    {
        userid: '671c1f01a1b2c10000000101',
        orgid: '671c1f01a1b2c10000000201',
        role: 'Owner',
    },
    {
        userid: '671c1f01a1b2c10000000102',
        orgid: '671c1f01a1b2c10000000201',
        role: 'Admin',
        manager: '671c1f01a1b2c10000000101',
    },
    {
        userid: '671c1f01a1b2c10000000103',
        orgid: '671c1f01a1b2c10000000202',
        role: 'Owner',
    },
    {
        userid: '671c1f01a1b2c10000000104',
        orgid: '671c1f01a1b2c10000000202',
        role: 'Manager',
        manager: '671c1f01a1b2c10000000103',
    },
    {
        userid: '671c1f01a1b2c10000000105',
        orgid: '671c1f01a1b2c10000000203',
        role: 'Owner',
    },
    {
        userid: '671c1f01a1b2c10000000106',
        orgid: '671c1f01a1b2c10000000203',
        role: 'Staff',
        manager: '671c1f01a1b2c10000000105',
    },
    {
        userid: '671c1f01a1b2c10000000107',
        orgid: '671c1f01a1b2c10000000204',
        role: 'Owner',
    },
    {
        userid: '671c1f01a1b2c10000000108',
        orgid: '671c1f01a1b2c10000000204',
        role: 'Admin',
        manager: '671c1f01a1b2c10000000107',
    },
    {
        userid: '671c1f01a1b2c10000000109',
        orgid: '671c1f01a1b2c10000000205',
        role: 'Owner',
    },
    {
        userid: '671c1f01a1b2c10000000110',
        orgid: '671c1f01a1b2c10000000205',
        role: 'Manager',
        manager: '671c1f01a1b2c10000000109',
    },
];

mongoose.connect('mongodb://0.0.0.0:27017/LogiSick');
export const import_employees = async () => {
    console.log('IMPORTING EMPS...');
    for (const data of Employee_data) {
        await Employees.create(data);
    }
    process.exit();
};
export const delete_employees = async () => {
    console.log('DELETING EMPS...');
    await Employees.deleteMany({});
    process.exit();
};
const flag = process.argv[2];

if (flag == '--import') {
    import_employees();
}
if (flag == '--delete') {
    delete_employees();
}
