import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Organization from '../models/organization.model';
dotenv.config({ path: '../../config.env' });

// update owner ids after importing new users
const organization_data = [
    {
        _id: '671c1f01a1b2c10000000201',
        name: 'TechNova',
        description: 'A growing technology firm',
        type: 'Small-Cap',
        owner: '671c1f01a1b2c10000000101',
        admin: '671c1f01a1b2c10000000102',
        subscription: 'Basic',
    },
    {
        _id: '671c1f01a1b2c10000000202',
        name: 'GreenWorks',
        description: 'Eco-friendly product development company',
        type: 'Mid-Cap',
        owner: '671c1f01a1b2c10000000103',
        admin: '671c1f01a1b2c10000000104',
        subscription: 'Pro',
    },
    {
        _id: '671c1f01a1b2c10000000203',
        name: 'Skyline Builders',
        description: 'Construction and real estate experts',
        type: 'Basic',
        owner: '671c1f01a1b2c10000000105',
        admin: '671c1f01a1b2c10000000106',
        subscription: 'None',
    },
    {
        _id: '671c1f01a1b2c10000000204',
        name: 'MediCore',
        description: 'Healthcare and diagnostics provider',
        type: 'Large-Cap',
        owner: '671c1f01a1b2c10000000107',
        admin: '671c1f01a1b2c10000000108',
        subscription: 'Pro',
    },
    {
        _id: '671c1f01a1b2c10000000205',
        name: 'NextGen Retail',
        description: 'Retail chain management system',
        type: 'Mid-Cap',
        owner: '671c1f01a1b2c10000000109',
        admin: '671c1f01a1b2c10000000110',
        subscription: 'Basic',
    },
    {
        _id: '671c1f01a1b2c10000000206',
        name: 'FinEdge',
        description: 'Financial services and investment firm',
        type: 'Large-Cap',
        owner: '671c1f01a1b2c10000000101',
        admin: '671c1f01a1b2c10000000103',
        subscription: 'Pro',
    },
    {
        _id: '671c1f01a1b2c10000000207',
        name: 'EduSmart',
        description: 'Online learning platform',
        type: 'Small-Cap',
        owner: '671c1f01a1b2c10000000105',
        admin: '671c1f01a1b2c10000000109',
        subscription: 'Basic',
    },
    {
        _id: '671c1f01a1b2c10000000208',
        name: 'CloudNet',
        description: 'Cloud infrastructure provider',
        type: 'Large-Cap',
        owner: '671c1f01a1b2c10000000102',
        admin: '671c1f01a1b2c10000000107',
        subscription: 'Pro',
    },
    {
        _id: '671c1f01a1b2c10000000209',
        name: 'ByteSpace',
        description: 'Software solutions for startups',
        type: 'Basic',
        owner: '671c1f01a1b2c10000000104',
        admin: '671c1f01a1b2c10000000108',
        subscription: 'None',
    },
    {
        _id: '671c1f01a1b2c10000000210',
        name: 'AutoLink',
        description: 'IoT solutions for automotive industry',
        type: 'Mid-Cap',
        owner: '671c1f01a1b2c10000000106',
        admin: '671c1f01a1b2c10000000110',
        subscription: 'Basic',
    },
];

mongoose.connect('mongodb://0.0.0.0:27017/LogiSick');
export const import_orgs = async () => {
    console.log('IMPORTING ORGS...');
    await Organization.create(organization_data);
    process.exit();
};
export const delete_orgs = async () => {
    console.log('DELETING ORGS...');
    await Organization.deleteMany({});
    process.exit();
};
const flag = process.argv[2];

if (flag == '--import') {
    import_orgs();
}
if (flag == '--delete') {
    delete_orgs();
}
